namespace AutoSalonAPI.DTOs
{
    public class VehicleDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Make { get; set; } = "";
        public string ModelFamily { get; set; } = "";
        public int? ModelYear { get; set; }
        public string? BodySize { get; set; }
        public string? Trim { get; set; }
        public string? PowerTrain { get; set; }
        public decimal PricePerDay { get; set; }
        public string? DefaultPaintId { get; set; }

        public string? Description { get; set; }

        public int? Seats { get; set; }
        public int? Bags { get; set; }
        public string? Transmission { get; set; }
        public string? Fuel { get; set; }
        public double? Rating { get; set; }
        public IEnumerable<string>? Features { get; set; }
        public string? ModelPageUrl { get; set; }
    }
}
