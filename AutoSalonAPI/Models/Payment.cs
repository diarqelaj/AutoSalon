namespace AutoSalonAPI.Models
{
    public class Payment
    {
        public int PaymentID { get; set; }
        public int InvoiceID { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public decimal Amount { get; set; }
        public string? ReferenceCode { get; set; }
        public int? ReceivedBy { get; set; } 

        public Invoice? Invoice { get; set; }
        public Employee? Employee { get; set; }
    }
}
