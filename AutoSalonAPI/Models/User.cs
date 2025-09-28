using System.ComponentModel.DataAnnotations;

namespace AutoSalonAPI.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required, MaxLength(120)]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        [MaxLength(60)]
        public string Role { get; set; } = "User";
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required, MaxLength(40)]
        public string Username { get; set; } = string.Empty;  
        [MaxLength(120)]
        public string? FullName { get; set; }                  
        public bool MarketingOptIn { get; set; } = false;      

        // Refresh token
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiresAt { get; set; }
    }
}
