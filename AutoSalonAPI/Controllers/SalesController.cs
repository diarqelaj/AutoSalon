// File: Controllers/SalesController.cs
using System.Globalization;
using AutoSalonAPI.Data;
using AutoSalonAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoSalonAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly AppDbContext _db;
    public SalesController(AppDbContext db) => _db = db;

    // -------------------- DTOs --------------------

    public class SaleCreateDto
    {
        public int VehicleID { get; set; }
        public string BuyerName { get; set; } = string.Empty;
        public string BuyerEmail { get; set; } = string.Empty;
        public string? BuyerPhone { get; set; }
        public string? PaintDescription { get; set; }
        public string? Angle { get; set; }
    }

    public class SaleUpdateDto
    {
        public int? VehicleID { get; set; }
        public string? BuyerName { get; set; }
        public string? BuyerEmail { get; set; }
        public string? BuyerPhone { get; set; }
        public string? PaintDescription { get; set; }
        public string? Angle { get; set; }
        public decimal? Price { get; set; }
    }

    // Keep these fields so your existing front-end keeps working.
    // We'll map VIN to VehicleName, leave Make/ModelFamily blank, and map Year.
    public class SaleReadDto
    {
        public int SaleID { get; set; }
        public int VehicleID { get; set; }
        public string VehicleName { get; set; } = string.Empty;  // we'll set VIN here
        public string Make { get; set; } = string.Empty;          // not available
        public string ModelFamily { get; set; } = string.Empty;   // not available
        public int? ModelYear { get; set; }                       // from Vehicle.Year
        public decimal Price { get; set; }
        public string? PaintDescription { get; set; }
        public string? Angle { get; set; }
        public string BuyerName { get; set; } = string.Empty;
        public string BuyerEmail { get; set; } = string.Empty;
        public string? BuyerPhone { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public record PagedResult<T>(
        int Page, int PageSize, int TotalItems, int TotalPages, IEnumerable<T> Items
    );

    // -------------------- Helpers --------------------

    private static SaleReadDto MapToReadDto(Sale s, Vehicle v) => new()
    {
        SaleID = s.SaleID,
        VehicleID = s.VehicleID,
        VehicleName = v.VIN,         // Use VIN since there is no Name field
        Make = string.Empty,          // You can fill from a Brand table later if you add it
        ModelFamily = string.Empty,   // Same note as above
        ModelYear = v.Year,
        Price = s.Price,
        PaintDescription = s.PaintDescription,
        Angle = s.Angle,
        BuyerName = s.BuyerName,
        BuyerEmail = s.BuyerEmail,
        BuyerPhone = s.BuyerPhone,
        CreatedAt = s.CreatedAt
    };

    // -------------------- CREATE --------------------

    [HttpPost]
    public async Task<ActionResult<SaleReadDto>> Create([FromBody] SaleCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.BuyerName) || string.IsNullOrWhiteSpace(dto.BuyerEmail))
            return BadRequest("BuyerName and BuyerEmail are required.");

        var vehicle = await _db.Vehicles.FirstOrDefaultAsync(v => v.VehicleID == dto.VehicleID);
        if (vehicle == null) return NotFound($"Vehicle {dto.VehicleID} not found.");

        // BasePrice is decimal (non-nullable), DailyRate is decimal?
        // Use BasePrice if > 0, else fall back to DailyRate (or 0).
        var snapshotPrice = vehicle.BasePrice > 0 ? vehicle.BasePrice : (vehicle.DailyRate ?? 0m);
        if (snapshotPrice <= 0m)
            return BadRequest("This vehicle is not currently available for purchase.");

        var sale = new Sale
        {
            VehicleID = vehicle.VehicleID,
            Price = snapshotPrice,
            PaintDescription = dto.PaintDescription,
            Angle = dto.Angle,
            BuyerName = dto.BuyerName,
            BuyerEmail = dto.BuyerEmail,
            BuyerPhone = dto.BuyerPhone,
            CreatedAt = DateTime.UtcNow
        };

        _db.Sales.Add(sale);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = sale.SaleID }, MapToReadDto(sale, vehicle));
    }

    // -------------------- READ: by id --------------------

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SaleReadDto>> GetById(int id)
    {
        var sale = await _db.Sales.FirstOrDefaultAsync(s => s.SaleID == id);
        if (sale == null) return NotFound();

        var vehicle = await _db.Vehicles.FirstOrDefaultAsync(v => v.VehicleID == sale.VehicleID);
        if (vehicle == null) return NotFound("Vehicle for this sale no longer exists.");

        return Ok(MapToReadDto(sale, vehicle));
    }

    // -------------------- READ: list with filtering/pagination --------------------
    [HttpGet]
    public async Task<ActionResult<PagedResult<SaleReadDto>>> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] int? vehicleId = null,
        [FromQuery] string? dateFrom = null,
        [FromQuery] string? dateTo = null,
        [FromQuery] string? sort = "-createdAt"
    )
    {
        page = page <= 0 ? 1 : page;
        pageSize = (pageSize <= 0 || pageSize > 200) ? 20 : pageSize;

        var query =
            from s in _db.Sales
            join v in _db.Vehicles on s.VehicleID equals v.VehicleID
            select new { s, v };

        if (vehicleId.HasValue)
            query = query.Where(x => x.s.VehicleID == vehicleId.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(x =>
                x.s.BuyerName.ToLower().Contains(term) ||
                x.s.BuyerEmail.ToLower().Contains(term) ||
                x.v.VIN.ToLower().Contains(term)   // searchable by VIN
            );
        }

        if (DateTime.TryParse(dateFrom, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out var fromDt))
            query = query.Where(x => x.s.CreatedAt >= fromDt);

        if (DateTime.TryParse(dateTo, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out var toDt))
        {
            var inclusiveTo = toDt.Kind == DateTimeKind.Unspecified ? toDt.Date.AddDays(1) : toDt;
            query = query.Where(x => x.s.CreatedAt < inclusiveTo);
        }

        sort = (sort ?? "-createdAt").Trim().ToLowerInvariant();
        query = sort switch
        {
            "createdat" => query.OrderBy(x => x.s.CreatedAt),
            "-createdat" => query.OrderByDescending(x => x.s.CreatedAt),
            "price" => query.OrderBy(x => x.s.Price),
            "-price" => query.OrderByDescending(x => x.s.Price),
            _ => query.OrderByDescending(x => x.s.CreatedAt)
        };

        var total = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(total / (double)pageSize);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => MapToReadDto(x.s, x.v))
            .ToListAsync();

        return Ok(new PagedResult<SaleReadDto>(page, pageSize, total, totalPages, items));
    }

    // -------------------- UPDATE (PUT) --------------------
    [HttpPut("{id:int}")]
    public async Task<ActionResult<SaleReadDto>> Update(int id, [FromBody] SaleUpdateDto dto)
    {
        var sale = await _db.Sales.FirstOrDefaultAsync(s => s.SaleID == id);
        if (sale == null) return NotFound();

        var vehicle = await _db.Vehicles.FirstOrDefaultAsync(v => v.VehicleID == sale.VehicleID);
        if (vehicle == null) return NotFound("Vehicle for this sale no longer exists.");

        if (dto.VehicleID.HasValue && dto.VehicleID.Value != sale.VehicleID)
        {
            var newVehicle = await _db.Vehicles.FirstOrDefaultAsync(v => v.VehicleID == dto.VehicleID.Value);
            if (newVehicle == null) return NotFound($"Vehicle {dto.VehicleID.Value} not found.");
            sale.VehicleID = newVehicle.VehicleID;
            vehicle = newVehicle;
        }

        if (dto.BuyerName != null) sale.BuyerName = dto.BuyerName;
        if (dto.BuyerEmail != null) sale.BuyerEmail = dto.BuyerEmail;
        if (dto.BuyerPhone != null) sale.BuyerPhone = dto.BuyerPhone;
        if (dto.PaintDescription != null) sale.PaintDescription = dto.PaintDescription;
        if (dto.Angle != null) sale.Angle = dto.Angle;

        if (dto.Price.HasValue)
        {
            if (dto.Price.Value <= 0m) return BadRequest("Price must be greater than zero.");
            sale.Price = dto.Price.Value;
        }

        await _db.SaveChangesAsync();
        return Ok(MapToReadDto(sale, vehicle));
    }

    // -------------------- PATCH --------------------
    [HttpPatch("{id:int}")]
    public Task<ActionResult<SaleReadDto>> Patch(int id, [FromBody] SaleUpdateDto dto)
        => Update(id, dto);

    // -------------------- DELETE --------------------
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var sale = await _db.Sales.FirstOrDefaultAsync(s => s.SaleID == id);
        if (sale == null) return NotFound();

        _db.Sales.Remove(sale);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
