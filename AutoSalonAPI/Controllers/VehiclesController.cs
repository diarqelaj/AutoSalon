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
