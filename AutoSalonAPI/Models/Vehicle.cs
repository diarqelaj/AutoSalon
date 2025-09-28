namespace AutoSalonAPI.Models
{
    public class Vehicle
    {
        public int VehicleID { get; set; }
        public int ModelID { get; set; }
        public string VIN { get; set; } = "";
        public int Year { get; set; }
        public string? Color { get; set; }
        public string? Transmission { get; set; }
        public string? FuelType { get; set; }
        public int? MileageKm { get; set; }
        public decimal BasePrice { get; set; }
        public string? Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public decimal? DailyRate { get; set; }
        public string? ImageUrl { get; set; }
        public Model? Model { get; set; }
        public string? Description { get; set; }

      
        public string? PaintId { get; set; }

        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<TestDrive> TestDrives { get; set; } = new List<TestDrive>();
        public ICollection<SalesOrder> SalesOrders { get; set; } = new List<SalesOrder>();
    }
}
