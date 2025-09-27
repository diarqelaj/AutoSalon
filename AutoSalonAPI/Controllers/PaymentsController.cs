using AutoSalonAPI.Data;
using AutoSalonAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoSalonAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public PaymentsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetAll() =>
            await _db.Payments.AsNoTracking().ToListAsync();

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Payment>> Get(int id)
        {
            var x = await _db.Payments.FindAsync(id);
            return x is null ? NotFound() : x;
        }

        [HttpPost]
        public async Task<ActionResult<Payment>> Create(Payment item)
        {
            _db.Payments.Add(item);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.PaymentID }, item);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Payment item)
        {
            if (id != item.PaymentID) return BadRequest();
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var x = await _db.Payments.FindAsync(id);
            if (x is null) return NotFound();
            _db.Payments.Remove(x);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
