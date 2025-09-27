// /Data/AppDbContext.cs
using AutoSalonAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoSalonAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<Brand> Brands => Set<Brand>();
        public DbSet<Model> Models => Set<Model>();
        public DbSet<Vehicle> Vehicles => Set<Vehicle>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Employee> Employees => Set<Employee>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<TestDrive> TestDrives => Set<TestDrive>();
        public DbSet<SalesOrder> SalesOrders => Set<SalesOrder>();
        public DbSet<Invoice> Invoices => Set<Invoice>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<Feedback> Feedbacks => Set<Feedback>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            // Brendt -> Modeli (1...shume)
            b.Entity<Model>()
                .HasOne(m => m.Brand)
                .WithMany(br => br.Models)
                .HasForeignKey(m => m.BrandID)
                .OnDelete(DeleteBehavior.Restrict);

            // Modeli -> Vetura (1..shume)
            b.Entity<Vehicle>()
                .HasOne(v => v.Model)
                .WithMany(m => m.Vehicles)
                .HasForeignKey(v => v.ModelID)
                .OnDelete(DeleteBehavior.Restrict);

            // Klienti -> Vleresimi (1..shume) & Vetura -> Vleresimi (1..shume)
            b.Entity<Review>()
                .HasOne(r => r.Customer)
                .WithMany(c => c.Reviews)
                .HasForeignKey(r => r.CustomerID)
                .OnDelete(DeleteBehavior.Restrict);

            b.Entity<Review>()
                .HasOne(r => r.Vehicle)
                .WithMany(v => v.Reviews)
                .HasForeignKey(r => r.VehicleID)
                .OnDelete(DeleteBehavior.Restrict);

            // TestDrive FKs
            b.Entity<TestDrive>()
                .HasOne(t => t.Customer)
                .WithMany(c => c.TestDrives)
                .HasForeignKey(t => t.CustomerID)
                .OnDelete(DeleteBehavior.Restrict);

            b.Entity<TestDrive>()
                .HasOne(t => t.Vehicle)
                .WithMany(v => v.TestDrives)
                .HasForeignKey(t => t.VehicleID)
                .OnDelete(DeleteBehavior.Restrict);

            b.Entity<TestDrive>()
                .HasOne(t => t.Employee)
                .WithMany(e => e.TestDrives)
                .HasForeignKey(t => t.EmployeeID)
                .OnDelete(DeleteBehavior.Restrict);

            // SalesOrder FKs
            b.Entity<SalesOrder>()
                .HasOne(so => so.Customer)
                .WithMany(c => c.SalesOrders)
                .HasForeignKey(so => so.CustomerID)
                .OnDelete(DeleteBehavior.Restrict);

            b.Entity<SalesOrder>()
                .HasOne(so => so.Vehicle)
                .WithMany(v => v.SalesOrders)
                .HasForeignKey(so => so.VehicleID)
                .OnDelete(DeleteBehavior.Restrict);

            b.Entity<SalesOrder>()
                .HasOne(so => so.Employee)
                .WithMany(e => e.SalesOrders)
                .HasForeignKey(so => so.EmployeeID)
                .OnDelete(DeleteBehavior.Restrict);

            // Invoice -> SalesOrder (many..1)
            b.Entity<Invoice>()
                .HasOne(i => i.SalesOrder)
                .WithMany(so => so.Invoices)
                .HasForeignKey(i => i.SalesOrderID)
                .OnDelete(DeleteBehavior.Restrict);

            // Payment -> Invoice (many..1) and Payment -> Employee (ReceivedBy)
            b.Entity<Payment>()
                .HasOne(p => p.Invoice)
                .WithMany(i => i.Payments)
                .HasForeignKey(p => p.InvoiceID)
                .OnDelete(DeleteBehavior.Restrict);

            b.Entity<Payment>()
                .HasOne(p => p.Employee)
                .WithMany(e => e.PaymentsReceived)
                .HasForeignKey(p => p.ReceivedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // Feedback -> Customer
            b.Entity<Feedback>()
                .HasOne(fb => fb.Customer)
                .WithMany(c => c.Feedbacks)
                .HasForeignKey(fb => fb.CustomerID)
                .OnDelete(DeleteBehavior.Restrict);

            // Common indexes
            b.Entity<Vehicle>().HasIndex(v => v.VIN).IsUnique();
            b.Entity<Invoice>().HasIndex(i => i.InvoiceNumber).IsUnique();
            b.Entity<Customer>().HasIndex(c => c.Email);
            b.Entity<Employee>().HasIndex(e => e.Email);
        }
    }
}
