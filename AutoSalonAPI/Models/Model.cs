namespace AutoSalonAPI.Models
{
    public class Model
{
    public int ModelID { get; set; }
    public int BrandID { get; set; }
    public string Name { get; set; } = "";
    public string? BodyType { get; set; }
    public int? ProductionStart { get; set; }
    public int? ProductionEnd { get; set; }
    public string? ModelPageUrl { get; set; }    // official manufacturer page
    public Brand? Brand { get; set; }
    public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}
}
