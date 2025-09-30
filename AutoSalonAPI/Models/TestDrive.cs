using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoSalonAPI.Models
{
    public enum TestDriveStatus
    {
        Pending = 0,
        Confirmed = 1,
        Completed = 2,
        Cancelled = 3,
        NoShow = 4
    }

    public enum ContactChannel
    {
        Unspecified = 0,
        SMS = 1,
        WhatsApp = 2,
        PhoneCall = 3,
        Email = 4
    }

   public class TestDrive
{
    public int Id { get; set; }

    public int? UserId { get; set; }
    public User? User { get; set; }

    [Required, MaxLength(120)] public string FullName { get; set; } = default!;
    [Required, MaxLength(40)]  public string Phone { get; set; } = default!;
    [MaxLength(120)]           public string? Email { get; set; }

    [Required, MaxLength(160)] public string VehicleName { get; set; } = default!;
    public int? VehicleId { get; set; } // note: VehicleId (lowercase d)

    [Required]                 public DateTime PreferredAt { get; set; }

    [MaxLength(1000)]          public string? Notes { get; set; }
    public ContactChannel      PreferredChannel { get; set; } = ContactChannel.Unspecified;
    public TestDriveStatus     Status { get; set; } = TestDriveStatus.Pending;

    [MaxLength(120)]           public string? AssignedTo { get; set; }
    public DateTime            CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime?           UpdatedAt { get; set; }
}

}
