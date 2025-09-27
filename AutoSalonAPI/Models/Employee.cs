namespace AutoSalonAPI.Models
{
    public class Employee
    {
        public int EmployeeID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName  { get; set; } = string.Empty;
        public string Email     { get; set; } = string.Empty;
        public string? Phone    { get; set; }
        public string? Role     { get; set; } 

        public ICollection<TestDrive> TestDrives { get; set; } = new List<TestDrive>();
        public ICollection<SalesOrder> SalesOrders { get; set; } = new List<SalesOrder>();
        public ICollection<Payment> PaymentsReceived { get; set; } = new List<Payment>(); // ReceivedBy
    }
}
