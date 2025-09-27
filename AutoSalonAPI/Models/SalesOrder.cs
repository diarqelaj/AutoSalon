namespace AutoSalonAPI.Models
{
    public class SalesOrder
    {
        public int SalesOrderID { get; set; }
        public int CustomerID { get; set; }
        public int VehicleID { get; set; }
        public int? EmployeeID { get; set; } 
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public string? Status { get; set; } 
        public decimal AgreedPrice { get; set; }
        public string? Notes { get; set; }

        public Customer? Customer { get; set; }
        public Vehicle? Vehicle { get; set; }
        public Employee? Employee { get; set; }
        public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    }
}
