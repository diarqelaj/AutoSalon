using AutoSalonAPI.Data;
using AutoSalonAPI.DTOs;
using AutoSalonAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

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

        [HttpGet("{id:int}/config")]
        public async Task<ActionResult<VehicleDto>> GetConfig(int id)
        {
            var v = await _db.Vehicles
                .Include(x => x.Model)
                .ThenInclude(m => m!.Brand) // null-forgiving to keep analyzer quiet
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.VehicleID == id);

            if (v is null || v.Model is null || v.Model.Brand is null)
                return NotFound();

            var dto = new VehicleDto
            {
                Id = v.VehicleID,
                Name = $"{v.Model.Brand.Name} {v.Model.Name}",
                Make = v.Model.Brand.ImaginMake ?? SlugMake(v.Model.Brand.Name),
                ModelFamily = v.Model.ImaginModelFamily ?? SlugModelFamily(v.Model.Name),
                ModelYear = v.Year,
                BodySize = v.Model.ImaginBodySize,
                Trim = v.Model.ImaginTrim,
                PowerTrain = v.Model.ImaginPowerTrain,
                PricePerDay = v.DailyRate ?? v.BasePrice,
                DefaultPaintId = v.PaintId ?? v.Model.DefaultPaintId,

                // Vehicle description (you added this column earlier)
                Description = v.Description,

                // NEW: surface Model-level meta to UI
                Seats = v.Model.Seats,
                Bags  = v.Model.Bags,
                Transmission = v.Transmission,       // per-vehicle
                Fuel = v.FuelType,                   // per-vehicle
                Rating = v.Model.Rating.HasValue ? (double?)v.Model.Rating.Value : null,
                Features = SplitFeaturesCsv(v.Model.FeaturesCsv),
                ModelPageUrl = v.Model.ModelPageUrl
            };

            return Ok(dto);
        }

        [HttpGet("fleet")]
        public async Task<ActionResult<IEnumerable<FleetItemDto>>> GetFleet()
        {
            var items = await _db.Vehicles
                .AsNoTracking()
                .Include(v => v.Model)
                .ThenInclude(m => m!.Brand)
                .Select(v => new FleetItemDto
                {
                    Id = v.VehicleID,
                    Name = (v.Model != null && v.Model.Brand != null)
                        ? v.Model.Brand.Name + " " + v.Model.Name
                        : $"Vehicle {v.VehicleID}",
                    Category = (v.Model != null && !string.IsNullOrWhiteSpace(v.Model.BodyType))
                        ? v.Model.BodyType!
                        : "Luxury",
                    PricePerDay = v.DailyRate ?? (v.BasePrice > 0 ? Math.Round(v.BasePrice / 50m, 0) : 199m),
                    Transmission = v.Transmission ?? "Automatic",
                    Fuel = v.FuelType ?? "Petrol",
                    Available = !string.Equals(v.Status, "Sold", StringComparison.OrdinalIgnoreCase)
                                && !string.Equals(v.Status, "Reserved", StringComparison.OrdinalIgnoreCase),
                    ImageUrl = v.ImageUrl ?? (
                        v.Model != null && v.Model.Brand != null
                            ? $"https://cdn.imagin.studio/getimage?customer=img&make={Uri.EscapeDataString(SlugMake(v.Model.Brand.Name))}&modelFamily={Uri.EscapeDataString(SlugModelFamily(v.Model.Name))}&angle=23&zoomType=fullscreen"
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

        // --- helpers ---
        private static string SlugMake(string brandName)
        {
            var s = brandName.Trim().ToLowerInvariant();
            return s switch
            {
                "mercedes-benz" => "mercedes",
                "mercedes benz" => "mercedes",
                "land rover"    => "landrover",
                _               => s.Replace(" ", "").Replace(".", "")
            };
        }

        private static string SlugModelFamily(string modelName)
        {
            var s = modelName.Trim().ToLowerInvariant();
            return s.Replace(" ", "-");
        }

        private static IEnumerable<string>? SplitFeaturesCsv(string? csv)
        {
            if (string.IsNullOrWhiteSpace(csv)) return null;
            // Split on commas, trim each item, drop empties
            return csv
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .Where(s => s.Length > 0)
                .ToArray();
        }
    }
}
