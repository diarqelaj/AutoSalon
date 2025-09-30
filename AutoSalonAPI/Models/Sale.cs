// File: Models/Sale.cs
namespace AutoSalonAPI.Models;

public class Sale
{
    public int SaleID { get; set; }

   
    public int VehicleID { get; set; }

    public decimal Price { get; set; }
    public string? PaintDescription { get; set; }
    public string? Angle { get; set; }

    public string BuyerName { get; set; } = string.Empty;
    public string BuyerEmail { get; set; } = string.Empty;
    public string? BuyerPhone { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
