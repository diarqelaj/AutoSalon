using AutoSalonAPI.Data;
using AutoSalonAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoSalonAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ModelsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ModelsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Model>>> GetAll() =>
            await _db.Models.AsNoTracking().ToListAsync();

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Model>> Get(int id)
        {
            var x = await _db.Models.FindAsync(id);
            return x is null ? NotFound() : x;
        }
        [HttpGet("bodytypes")]
        public async Task<ActionResult<IEnumerable<string>>> GetBodyTypes()
        {
            var types = await _db.Models
                .AsNoTracking()
                .Select(m => m.BodyType!)
                .Where(bt => bt != null && bt.Trim() != "")
                .Distinct()
                .OrderBy(bt => bt)
                .ToListAsync();

            return types;
        }


        [HttpPost]
        public async Task<ActionResult<Model>> Create(Model item)
        {
            _db.Models.Add(item);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.ModelID }, item);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Model item)
        {
            if (id != item.ModelID) return BadRequest();
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var x = await _db.Models.FindAsync(id);
            if (x is null) return NotFound();
            _db.Models.Remove(x);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
