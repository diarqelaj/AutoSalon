using System.ComponentModel.DataAnnotations;

namespace AutoSalonAPI.Models
{
    public class Brand
    {
        public int BrandID { get; set; }

        [Required, MaxLength(120)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(60)]
        public string? ImaginMake { get; set; }

        public ICollection<Model> Models { get; set; } = new List<Model>();
    }
}
