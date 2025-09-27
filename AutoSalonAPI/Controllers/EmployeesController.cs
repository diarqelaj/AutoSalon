using AutoSalonAPI.Data;
using AutoSalonAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoSalonAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _db;
        public EmployeesController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetAll() =>
            await _db.Employees.AsNoTracking().ToListAsync();

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Employee>> Get(int id)
        {
            var x = await _db.Employees.FindAsync(id);
            return x is null ? NotFound() : x;
        }

        [HttpPost]
        public async Task<ActionResult<Employee>> Create(Employee item)
        {
            _db.Employees.Add(item);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.EmployeeID }, item);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Employee item)
        {
            if (id != item.EmployeeID) return BadRequest();
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var x = await _db.Employees.FindAsync(id);
            if (x is null) return NotFound();
            _db.Employees.Remove(x);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
