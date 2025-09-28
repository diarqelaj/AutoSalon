using System.ComponentModel.DataAnnotations;

namespace AutoSalonAPI.Models
{
    public class Model
    {
        public int ModelID { get; set; }
        public int BrandID { get; set; }

        [Required, MaxLength(120)]
        public string Name { get; set; } = string.Empty;

        public Brand? Brand { get; set; }

        [MaxLength(60)]
        public string? BodyType { get; set; }

        [MaxLength(300)]
        public string? ModelPageUrl { get; set; }
        [Range(1, 9)]
        public int? Seats { get; set; }

    
        [Range(0, 10)]
        public int? Bags { get; set; }

    
        [Range(0, 5)]
        public decimal? Rating { get; set; }

    
        [MaxLength(600)]
        public string? FeaturesCsv { get; set; }
       
        [MaxLength(120)] public string? ImaginModelFamily { get; set; }
        [MaxLength(60)]  public string? ImaginTrim { get; set; }
        [MaxLength(40)]  public string? ImaginBodySize { get; set; }
        [MaxLength(40)]  public string? ImaginPowerTrain { get; set; }
        [MaxLength(64)]  public string? DefaultPaintId { get; set; }

        public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
    }
}
