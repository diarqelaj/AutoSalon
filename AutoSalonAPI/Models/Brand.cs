namespace AutoSalonAPI.Models
{
    public class Brand
    {
        public int BrandID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Country { get; set; }
        public int? FoundedYear { get; set; }

        public ICollection<Model> Models { get; set; } = new List<Model>();
    }
}
