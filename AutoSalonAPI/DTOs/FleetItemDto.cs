namespace AutoSalonAPI.DTOs
{
    public class FleetItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Category { get; set; } = "Other";
        public decimal PricePerDay { get; set; }
        public string Transmission { get; set; } = "Automatic";
        public string Fuel { get; set; } = "Petrol";
        public bool Available { get; set; }
        public string? ImageUrl { get; set; }
        public string? ModelPageUrl { get; set; }
    }
}
