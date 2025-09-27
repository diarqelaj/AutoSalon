using AutoSalonAPI.Data;
using AutoSalonAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoSalonAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbacksController : ControllerBase
    {
        private readonly AppDbContext _db;
        public FeedbacksController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetAll() =>
            await _db.Feedbacks.AsNoTracking().ToListAsync();

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Feedback>> Get(int id)
        {
            var x = await _db.Feedbacks.FindAsync(id);
            return x is null ? NotFound() : x;
        }

        [HttpPost]
        public async Task<ActionResult<Feedback>> Create(Feedback item)
        {
            _db.Feedbacks.Add(item);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.FeedbackID }, item);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Feedback item)
        {
            if (id != item.FeedbackID) return BadRequest();
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var x = await _db.Feedbacks.FindAsync(id);
            if (x is null) return NotFound();
            _db.Feedbacks.Remove(x);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
