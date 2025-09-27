namespace AutoSalonAPI.Models
{
    public class Review
    {
        public int ReviewID { get; set; }
        public int CustomerID { get; set; }
        public int VehicleID { get; set; }
        public int Rating { get; set; } 
        public string? Title { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Customer? Customer { get; set; }
        public Vehicle? Vehicle { get; set; }
    }
}
