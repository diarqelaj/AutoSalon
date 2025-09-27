using AutoSalonAPI.Data;
using AutoSalonAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoSalonAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ReviewsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetAll() =>
            await _db.Reviews.AsNoTracking().ToListAsync();

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Review>> Get(int id)
        {
            var x = await _db.Reviews.FindAsync(id);
            return x is null ? NotFound() : x;
        }

        [HttpPost]
        public async Task<ActionResult<Review>> Create(Review item)
        {
            _db.Reviews.Add(item);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.ReviewID }, item);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Review item)
        {
            if (id != item.ReviewID) return BadRequest();
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var x = await _db.Reviews.FindAsync(id);
            if (x is null) return NotFound();
            _db.Reviews.Remove(x);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
