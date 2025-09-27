using AutoSalonAPI.Data;
using AutoSalonAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoSalonAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestDrivesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public TestDrivesController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestDrive>>> GetAll() =>
            await _db.TestDrives.AsNoTracking().ToListAsync();

        [HttpGet("{id:int}")]
        public async Task<ActionResult<TestDrive>> Get(int id)
        {
            var x = await _db.TestDrives.FindAsync(id);
            return x is null ? NotFound() : x;
        }

        [HttpPost]
        public async Task<ActionResult<TestDrive>> Create(TestDrive item)
        {
            _db.TestDrives.Add(item);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.TestDriveID }, item);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, TestDrive item)
        {
            if (id != item.TestDriveID) return BadRequest();
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var x = await _db.TestDrives.FindAsync(id);
            if (x is null) return NotFound();
            _db.TestDrives.Remove(x);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
