namespace AutoSalonAPI.Models
{
    public class Invoice
    {
        public int InvoiceID { get; set; }
        public int SalesOrderID { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime IssuedOnDate { get; set; } = DateTime.UtcNow;
        public DateTime? DueDate { get; set; }
        public decimal Subtotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Status { get; set; } 

        public SalesOrder? SalesOrder { get; set; }
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
