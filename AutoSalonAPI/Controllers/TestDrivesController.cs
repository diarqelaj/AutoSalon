using System.Security.Claims;
using AutoSalonAPI.Data;
using AutoSalonAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoSalonAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestDrivesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public TestDrivesController(AppDbContext db) => _db = db;

        // ---------- DTOs ----------
        public record CreateDto(
            string FullName,
            string Phone,
            string? Email,
            string VehicleName,
            int? VehicleId,
            DateTime PreferredAt,     
            string? Notes,
            ContactChannel PreferredChannel = ContactChannel.Unspecified
        );

        public record UpdateDto(
            string? FullName,
            string? Phone,
            string? Email,
            string? VehicleName,
            int? VehicleId,
            DateTime? PreferredAt,
            string? Notes,
            ContactChannel? PreferredChannel,
            TestDriveStatus? Status,
            string? AssignedTo
        );

        public record ReadDto(
            int Id,
            int? UserId,
            string FullName,
            string Phone,
            string? Email,
            string VehicleName,
            int? VehicleId,
            DateTime PreferredAt,
            string? Notes,
            ContactChannel PreferredChannel,
            TestDriveStatus Status,
            string? AssignedTo,
            DateTime CreatedAt,
            DateTime? UpdatedAt
        );

        private static ReadDto ToDto(TestDrive t) =>
            new(t.Id, t.UserId, t.FullName, t.Phone, t.Email, t.VehicleName, t.VehicleId,
                t.PreferredAt, t.Notes, t.PreferredChannel, t.Status, t.AssignedTo, t.CreatedAt, t.UpdatedAt);

      
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<ReadDto>> Create([FromBody] CreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName) ||
                string.IsNullOrWhiteSpace(dto.Phone) ||
                string.IsNullOrWhiteSpace(dto.VehicleName))
            {
                return BadRequest("FullName, Phone and VehicleName are required.");
            }

            int? userId = null;
            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid))
                userId = uid;

            var t = new TestDrive
            {
                UserId = userId,
                FullName = dto.FullName.Trim(),
                Phone = dto.Phone.Trim(),
                Email = string.IsNullOrWhiteSpace(dto.Email) ? null : dto.Email.Trim(),
                VehicleName = dto.VehicleName.Trim(),
                VehicleId = dto.VehicleId,
                PreferredAt = DateTime.SpecifyKind(dto.PreferredAt, DateTimeKind.Utc),
                Notes = string.IsNullOrWhiteSpace(dto.Notes) ? null : dto.Notes.Trim(),
                PreferredChannel = dto.PreferredChannel,
                Status = TestDriveStatus.Pending
            };

            _db.TestDrives.Add(t);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOneAdmin), new { id = t.Id }, ToDto(t));
        }

      
        [HttpGet("my")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ReadDto>>> MyRequests()
        {
            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "", out var userId))
                return Unauthorized();

            var list = await _db.TestDrives
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return list.Select(ToDto).ToList();
        }

    
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminList(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? q = null,
            [FromQuery] TestDriveStatus? status = null,
            [FromQuery] DateTime? from = null,
            [FromQuery] DateTime? to = null
        )
        {
            page = page <= 0 ? 1 : page;
            pageSize = pageSize is < 1 or > 200 ? 20 : pageSize;

            var query = _db.TestDrives.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
            {
                var term = q.Trim().ToLower();
                query = query.Where(t =>
                    t.FullName.ToLower().Contains(term) ||
                    (t.Phone.ToLower().Contains(term)) ||
                    (t.Email != null && t.Email.ToLower().Contains(term)) ||
                    t.VehicleName.ToLower().Contains(term) ||
                    (t.AssignedTo != null && t.AssignedTo.ToLower().Contains(term)));
            }

            if (status.HasValue) query = query.Where(t => t.Status == status);

            if (from.HasValue) query = query.Where(t => t.CreatedAt >= from.Value);
            if (to.HasValue) query = query.Where(t => t.CreatedAt <= to.Value);

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(t => t.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                page,
                pageSize,
                total,
                items = items.Select(ToDto)
            });
        }

        
        [HttpGet("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ReadDto>> GetOneAdmin(int id)
        {
            var t = await _db.TestDrives.FindAsync(id);
            return t is null ? NotFound() : ToDto(t);
        }

     
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ReadDto>> UpdateAdmin(int id, [FromBody] UpdateDto dto)
        {
            var t = await _db.TestDrives.FindAsync(id);
            if (t is null) return NotFound();

            if (!string.IsNullOrWhiteSpace(dto.FullName)) t.FullName = dto.FullName.Trim();
            if (!string.IsNullOrWhiteSpace(dto.Phone)) t.Phone = dto.Phone.Trim();
            if (!string.IsNullOrWhiteSpace(dto.Email)) t.Email = dto.Email.Trim();
            if (!string.IsNullOrWhiteSpace(dto.VehicleName)) t.VehicleName = dto.VehicleName.Trim();
            if (dto.VehicleId.HasValue) t.VehicleId = dto.VehicleId.Value;
            if (dto.PreferredAt.HasValue) t.PreferredAt = DateTime.SpecifyKind(dto.PreferredAt.Value, DateTimeKind.Utc);
            if (!string.IsNullOrWhiteSpace(dto.Notes)) t.Notes = dto.Notes.Trim();
            if (dto.PreferredChannel.HasValue) t.PreferredChannel = dto.PreferredChannel.Value;
            if (dto.Status.HasValue) t.Status = dto.Status.Value;
            if (!string.IsNullOrWhiteSpace(dto.AssignedTo)) t.AssignedTo = dto.AssignedTo.Trim();

            t.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return ToDto(t);
        }

   
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAdmin(int id)
        {
            var t = await _db.TestDrives.FindAsync(id);
            if (t is null) return NotFound();
            _db.TestDrives.Remove(t);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
