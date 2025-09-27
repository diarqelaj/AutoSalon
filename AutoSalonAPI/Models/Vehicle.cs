namespace AutoSalonAPI.Models
{
    public class Vehicle
    {
        public int VehicleID { get; set; }
        public int ModelID { get; set; }
        public string VIN { get; set; } = string.Empty;
        public int Year { get; set; }
        public string? Color { get; set; }
        public string? Transmission { get; set; }
        public string? FuelType { get; set; }
        public int? MileageKm { get; set; }
        public decimal BasePrice { get; set; }
        public string? Status { get; set; } 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public Model? Model { get; set; }
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<TestDrive> TestDrives { get; set; } = new List<TestDrive>();
        public ICollection<SalesOrder> SalesOrders { get; set; } = new List<SalesOrder>();
    }
}
