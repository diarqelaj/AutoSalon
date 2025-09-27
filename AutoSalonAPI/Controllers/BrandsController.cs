using AutoSalonAPI.Data;
using AutoSalonAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoSalonAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BrandsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public BrandsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Brand>>> GetAll() =>
            await _db.Brands.AsNoTracking().ToListAsync();

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Brand>> Get(int id)
        {
            var x = await _db.Brands.FindAsync(id);
            return x is null ? NotFound() : x;
        }

        [HttpPost]
        public async Task<ActionResult<Brand>> Create(Brand item)
        {
            _db.Brands.Add(item);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.BrandID }, item);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Brand item)
        {
            if (id != item.BrandID) return BadRequest();
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var x = await _db.Brands.FindAsync(id);
            if (x is null) return NotFound();
            _db.Brands.Remove(x);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
