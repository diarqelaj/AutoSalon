using AutoSalonAPI.Data;
using AutoSalonAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoSalonAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiclesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public VehiclesController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetAll() =>
            await _db.Vehicles.AsNoTracking().ToListAsync();

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Vehicle>> Get(int id)
        {
            var x = await _db.Vehicles.FindAsync(id);
            return x is null ? NotFound() : x;
        }
        
       // using System.Web; // if you prefer HttpUtility.UrlEncode (or use Uri.EscapeDataString)
        [HttpGet("fleet")]
        public async Task<ActionResult<IEnumerable<FleetItemDto>>> GetFleet()
        {
            var items = await _db.Vehicles
                .AsNoTracking()
                .Include(v => v.Model)!.ThenInclude(m => m.Brand)
                .Select(v => new FleetItemDto
                {
                    Id = v.VehicleID,
                    Name = (v.Model != null && v.Model.Brand != null)
                        ? v.Model.Brand.Name + " " + v.Model.Name
                        : $"Vehicle {v.VehicleID}",
                    Category = v.Model != null && !string.IsNullOrWhiteSpace(v.Model.BodyType)
                        ? v.Model.BodyType!
                        : "Luxury",
                    PricePerDay = v.DailyRate ?? (v.BasePrice > 0 ? Math.Round(v.BasePrice / 50m, 0) : 199m),
                    Transmission = v.Transmission ?? "Automatic",
                    Fuel = v.FuelType ?? "Petrol",
                    Available = !string.Equals(v.Status, "Sold", StringComparison.OrdinalIgnoreCase)
                                && !string.Equals(v.Status, "Reserved", StringComparison.OrdinalIgnoreCase),

                    // ✅ Use DB value if set, otherwise construct a reliable URL
                    ImageUrl = v.ImageUrl ?? (
                        v.Model != null && v.Model.Brand != null
                            ? $"https://cdn.imagin.studio/getimage?customer=img&make={Uri.EscapeDataString(v.Model.Brand.Name)}&modelFamily={Uri.EscapeDataString(v.Model.Name)}&angle=23&zoomType=fullscreen"
                            : null
                    ),

                    ModelPageUrl = v.Model != null ? v.Model.ModelPageUrl : null
                })
                .ToListAsync();

            return items;
        }


        [HttpPost]
        public async Task<ActionResult<Vehicle>> Create(Vehicle item)
        {
            _db.Vehicles.Add(item);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.VehicleID }, item);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Vehicle item)
        {
            if (id != item.VehicleID) return BadRequest();
            _db.Entry(item).State = EntityState.Modified;
            item.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var x = await _db.Vehicles.FindAsync(id);
            if (x is null) return NotFound();
            _db.Vehicles.Remove(x);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
