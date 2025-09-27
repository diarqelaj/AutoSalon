using AutoSalonAPI.Data;
using AutoSalonAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoSalonAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalesOrdersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public SalesOrdersController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalesOrder>>> GetAll() =>
            await _db.SalesOrders.AsNoTracking().ToListAsync();

        [HttpGet("{id:int}")]
        public async Task<ActionResult<SalesOrder>> Get(int id)
        {
            var x = await _db.SalesOrders.FindAsync(id);
            return x is null ? NotFound() : x;
        }

        [HttpPost]
        public async Task<ActionResult<SalesOrder>> Create(SalesOrder item)
        {
            _db.SalesOrders.Add(item);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.SalesOrderID }, item);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, SalesOrder item)
        {
            if (id != item.SalesOrderID) return BadRequest();
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var x = await _db.SalesOrders.FindAsync(id);
            if (x is null) return NotFound();
            _db.SalesOrders.Remove(x);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
