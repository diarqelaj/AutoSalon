namespace AutoSalonAPI.Models
{
    public class TestDrive
    {
        public int TestDriveID { get; set; }
        public int CustomerID { get; set; }
        public int VehicleID { get; set; }
        public int? EmployeeID { get; set; }
        public DateTime ScheduledAt { get; set; }
        public int? DurationMin { get; set; }
        public string? Status { get; set; } 
        public string? Notes { get; set; }

        public Customer? Customer { get; set; }
        public Vehicle? Vehicle { get; set; }
        public Employee? Employee { get; set; }
    }
}
