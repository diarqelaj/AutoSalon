using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoSalonAPI.Data;
using AutoSalonAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AutoSalonAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _cfg;

        public AuthController(AppDbContext db, IConfiguration cfg)
        {
            _db = db;
            _cfg = cfg;
        }

       
       // ---------- DTO-te ----------
        public record RegisterDto(string Email, string Password, string Username, string? FullName, bool? MarketingOptIn);
        public record LoginDto(string Email, string Password);
        public record RefreshDto(string RefreshToken);
        public record AuthResultDto(string AccessToken, DateTime ExpiresAt, string? RefreshToken, DateTime? RefreshTokenExpiresAt);
        public record MeDto(int Id, string Email, string Username, string? FullName, string Role, bool IsActive, bool MarketingOptIn, DateTime CreatedAt);

        // DTO per admina
        public record AdminCreateUserDto(string Email, string Password, string Username, string? FullName, bool MarketingOptIn = false, string Role = "User", bool IsActive = true);
        public record AdminUpdateUserDto(string? Email, string? Username, string? FullName, bool? MarketingOptIn, string? Role, bool? IsActive, string? NewPassword);

        // ---------- Endpoints e authentikimit ----------

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Email and password are required.");
            if (string.IsNullOrWhiteSpace(dto.Username))
                return BadRequest("Username is required.");

            var email = dto.Email.Trim().ToLowerInvariant();
            var username = dto.Username.Trim();

            var emailExists = await _db.Users.AnyAsync(u => u.Email == email);
            if (emailExists) return Conflict("Email already registered.");

            var usernameExists = await _db.Users.AnyAsync(u => u.Username == username);
            if (usernameExists) return Conflict("Username already taken.");

            var user = new User
            {
                Email = email,
                Username = username,
                FullName = string.IsNullOrWhiteSpace(dto.FullName) ? null : dto.FullName.Trim(),
                MarketingOptIn = dto.MarketingOptIn ?? false,
                PasswordHash = HashPassword(dto.Password),
                Role = "User",
                IsActive = true
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Created("", new { user.Id, user.Email, user.Username, user.FullName, user.Role, user.MarketingOptIn, user.CreatedAt });
        }


        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResultDto>> Login([FromBody] LoginDto dto)
        {
            var email = (dto.Email ?? "").Trim().ToLowerInvariant();
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
            if (user is null) return Unauthorized("Invalid credentials.");

            if (!VerifyPassword(user.PasswordHash, dto.Password ?? "")) return Unauthorized("Invalid credentials.");

            var (access, exp) = CreateAccessToken(user);
            var (refresh, refreshExp) = CreateRefreshToken();

            user.RefreshToken = refresh;
            user.RefreshTokenExpiresAt = refreshExp;
            await _db.SaveChangesAsync();

            return new AuthResultDto(access, exp, refresh, refreshExp);
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResultDto>> Refresh([FromBody] RefreshDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.RefreshToken))
                return BadRequest("Refresh token is required.");

            var user = await _db.Users.FirstOrDefaultAsync(u => u.RefreshToken == dto.RefreshToken);
            if (user is null || user.RefreshTokenExpiresAt is null || user.RefreshTokenExpiresAt < DateTime.UtcNow)
                return Unauthorized("Invalid or expired refresh token.");

            var (access, exp) = CreateAccessToken(user);

            // rotate refresh token
            var (newRefresh, newRefreshExp) = CreateRefreshToken();
            user.RefreshToken = newRefresh;
            user.RefreshTokenExpiresAt = newRefreshExp;
            await _db.SaveChangesAsync();

            return new AuthResultDto(access, exp, newRefresh, newRefreshExp);
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var idStr = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(idStr, out var userId)) return Unauthorized();

            var user = await _db.Users.FindAsync(userId);
            if (user is null) return NotFound();

            user.RefreshToken = null;
            user.RefreshTokenExpiresAt = null;
            await _db.SaveChangesAsync();

            return NoContent();
        }

       [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<MeDto>> Me()
        {
            var idStr = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(idStr, out var userId)) return Unauthorized();

            var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
            if (user is null) return NotFound();

            return new MeDto(user.Id, user.Email, user.Username, user.FullName, user.Role ?? "User", user.IsActive, user.MarketingOptIn, user.CreatedAt);
        }


        // ---------- Admin endpoints (CRUD) ----------

        // List users with optional paging & search by email/role
        [HttpGet("admin/users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminListUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? q = null)
        {
            page = page <= 0 ? 1 : page;
            pageSize = pageSize is < 1 or > 200 ? 20 : pageSize;

            var query = _db.Users.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
            {
                var term = q.Trim().ToLower();
                query = query.Where(u =>
                    u.Email.ToLower().Contains(term) ||
                    (u.Role != null && u.Role.ToLower().Contains(term)));
            }

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new { u.Id, u.Email, Role = u.Role ?? "User", u.IsActive, u.CreatedAt })
                .ToListAsync();

            return Ok(new { page, pageSize, total, items });
        }

        // Get one user
        [HttpGet("admin/users/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminGetUser(int id)
        {
            var u = await _db.Users.AsNoTracking()
                .Where(x => x.Id == id)
                .Select(x => new { x.Id, x.Email, Role = x.Role ?? "User", x.IsActive, x.CreatedAt })
                .FirstOrDefaultAsync();

            return u is null ? NotFound() : Ok(u);
        }

        [HttpPost("admin/users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminCreateUser([FromBody] AdminCreateUserDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password) || string.IsNullOrWhiteSpace(dto.Username))
                return BadRequest("Email, username and password are required.");

            var email = dto.Email.Trim().ToLowerInvariant();
            var username = dto.Username.Trim();

            if (await _db.Users.AnyAsync(u => u.Email == email)) return Conflict("Email already registered.");
            if (await _db.Users.AnyAsync(u => u.Username == username)) return Conflict("Username already taken.");

            var user = new User
            {
                Email = email,
                Username = username,
                FullName = string.IsNullOrWhiteSpace(dto.FullName) ? null : dto.FullName.Trim(),
                MarketingOptIn = dto.MarketingOptIn,
                PasswordHash = HashPassword(dto.Password),
                Role = string.IsNullOrWhiteSpace(dto.Role) ? "User" : dto.Role.Trim(),
                IsActive = dto.IsActive
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(AdminGetUser), new { id = user.Id },
                new { user.Id, user.Email, user.Username, user.FullName, Role = user.Role, user.IsActive, user.MarketingOptIn, user.CreatedAt });
        }


       [HttpPut("admin/users/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminUpdateUser(int id, [FromBody] AdminUpdateUserDto dto)
        {
            var user = await _db.Users.FindAsync(id);
            if (user is null) return NotFound();

            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                var newEmail = dto.Email.Trim().ToLowerInvariant();
                if (!newEmail.Equals(user.Email, StringComparison.OrdinalIgnoreCase))
                {
                    var exists = await _db.Users.AnyAsync(u => u.Email == newEmail && u.Id != id);
                    if (exists) return Conflict("Email already in use.");
                    user.Email = newEmail;
                }
            }

            if (!string.IsNullOrWhiteSpace(dto.Username))
            {
                var newUsername = dto.Username.Trim();
                if (!newUsername.Equals(user.Username, StringComparison.Ordinal))
                {
                    var exists = await _db.Users.AnyAsync(u => u.Username == newUsername && u.Id != id);
                    if (exists) return Conflict("Username already in use.");
                    user.Username = newUsername;
                }
            }

            if (!string.IsNullOrWhiteSpace(dto.FullName))
                user.FullName = dto.FullName.Trim();

            if (dto.MarketingOptIn.HasValue)
                user.MarketingOptIn = dto.MarketingOptIn.Value;

            if (!string.IsNullOrWhiteSpace(dto.Role))
                user.Role = dto.Role.Trim();

            if (dto.IsActive.HasValue)
            {
                user.IsActive = dto.IsActive.Value;
                if (!user.IsActive)
                {
                    user.RefreshToken = null;
                    user.RefreshTokenExpiresAt = null;
                }
            }

            if (!string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                user.PasswordHash = HashPassword(dto.NewPassword);
                user.RefreshToken = null;
                user.RefreshTokenExpiresAt = null;
            }

            await _db.SaveChangesAsync();

            return Ok(new { user.Id, user.Email, user.Username, user.FullName, Role = user.Role, user.IsActive, user.MarketingOptIn, user.CreatedAt });
        }


        // Delete a user (hard delete). You can choose to only deactivate instead.
        [HttpDelete("admin/users/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminDeleteUser(int id)
        {
            // Prevent an admin from deleting themselves
            var idStr = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(idStr, out var currentId) && currentId == id)
                return BadRequest("You cannot delete your own account.");

            var user = await _db.Users.FindAsync(id);
            if (user is null) return NotFound();

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // ---------- Token helpers ----------

        private (string token, DateTime expires) CreateAccessToken(User user)
        {
            // Read from env or appsettings (you already pushed env values into configuration in Program.cs)
            var issuer = _cfg["Jwt:Issuer"] ?? Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "AutoSalonAPI";
            var audience = _cfg["Jwt:Audience"] ?? Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "AutoSalonClient";
            var minutesStr = _cfg["Jwt:AccessTokenMinutes"] ?? Environment.GetEnvironmentVariable("JWT_ACCESS_MIN") ?? "30";
            _ = int.TryParse(minutesStr, out var minutes);
            minutes = minutes > 0 ? minutes : 30;

            // Key: prefer Base64 32 bytes; fall back to UTF8
            var keyRaw = Environment.GetEnvironmentVariable("JWT_KEY") ?? _cfg["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not set");
            SymmetricSecurityKey key;
            try
            {
                var bytes = Convert.FromBase64String(keyRaw);
                key = new SymmetricSecurityKey(bytes);
            }
            catch
            {
                key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyRaw));
            }

            var now = DateTime.UtcNow;
            var expires = now.AddMinutes(minutes);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new(JwtRegisteredClaimNames.Email, user.Email),
                new(ClaimTypes.Role, user.Role ?? "User"),
                // NEW:
                new(ClaimTypes.Name, user.FullName ?? user.Username),
                new("username", user.Username),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(JwtRegisteredClaimNames.Iat, new DateTimeOffset(now).ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var jwt = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                notBefore: now,
                expires: expires,
                signingCredentials: creds
            );

            var token = new JwtSecurityTokenHandler().WriteToken(jwt);
            return (token, expires);
        }

        private static (string token, DateTime expires) CreateRefreshToken()
        {
            var bytes = RandomNumberGenerator.GetBytes(64);
            var token = Convert.ToBase64String(bytes);
            return (token, DateTime.UtcNow.AddDays(7)); // can be read from config if you prefer
        }

        // ---------- Password hashing (PBKDF2) ----------

        private static string HashPassword(string password)
        {
            using var rng = RandomNumberGenerator.Create();
            var salt = new byte[16];
            rng.GetBytes(salt);

            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100_000, HashAlgorithmName.SHA256);
            var hash = pbkdf2.GetBytes(32);

            var combined = new byte[1 + salt.Length + hash.Length];
            combined[0] = 0x01; // version
            Buffer.BlockCopy(salt, 0, combined, 1, salt.Length);
            Buffer.BlockCopy(hash, 0, combined, 1 + salt.Length, hash.Length);
            return Convert.ToBase64String(combined);
        }

        private static bool VerifyPassword(string storedHash, string password)
        {
            byte[] bytes;
            try { bytes = Convert.FromBase64String(storedHash); }
            catch { return false; }

            if (bytes.Length < 1 + 16 + 32) return false;
            if (bytes[0] != 0x01) return false;

            var salt = new byte[16];
            Buffer.BlockCopy(bytes, 1, salt, 0, 16);
            var hash = new byte[32];
            Buffer.BlockCopy(bytes, 17, hash, 0, 32);

            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100_000, HashAlgorithmName.SHA256);
            var computed = pbkdf2.GetBytes(32);

            return CryptographicOperations.FixedTimeEquals(hash, computed);
        }
    }
}
