using AutoSalonAPI.Data;
using AutoSalonAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoSalonAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public CustomersController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetAll() =>
            await _db.Customers.AsNoTracking().ToListAsync();

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Customer>> Get(int id)
        {
            var x = await _db.Customers.FindAsync(id);
            return x is null ? NotFound() : x;
        }

        [HttpPost]
        public async Task<ActionResult<Customer>> Create(Customer item)
        {
            _db.Customers.Add(item);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.CustomerID }, item);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Customer item)
        {
            if (id != item.CustomerID) return BadRequest();
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var x = await _db.Customers.FindAsync(id);
            if (x is null) return NotFound();
            _db.Customers.Remove(x);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
