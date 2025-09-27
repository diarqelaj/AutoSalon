using AutoSalonAPI.Data;
using AutoSalonAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoSalonAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoicesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public InvoicesController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetAll() =>
            await _db.Invoices.AsNoTracking().ToListAsync();

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Invoice>> Get(int id)
        {
            var x = await _db.Invoices.FindAsync(id);
            return x is null ? NotFound() : x;
        }

        [HttpPost]
        public async Task<ActionResult<Invoice>> Create(Invoice item)
        {
            _db.Invoices.Add(item);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.InvoiceID }, item);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Invoice item)
        {
            if (id != item.InvoiceID) return BadRequest();
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var x = await _db.Invoices.FindAsync(id);
            if (x is null) return NotFound();
            _db.Invoices.Remove(x);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
