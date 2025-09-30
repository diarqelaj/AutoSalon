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
        public DbSet<Sale> Sales => Set<Sale>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Employee> Employees => Set<Employee>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<TestDrive> TestDrives => Set<TestDrive>();
        public DbSet<SalesOrder> SalesOrders => Set<SalesOrder>();
        public DbSet<Invoice> Invoices => Set<Invoice>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<Feedback> Feedbacks => Set<Feedback>();
        public DbSet<User> Users => Set<User>();

        // Exam module
        public DbSet<Lecturer> Lecturers => Set<Lecturer>();
        public DbSet<Lecture> Lectures => Set<Lecture>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            // Brand -> Model (1..many)
            b.Entity<Model>()
                .HasOne(m => m.Brand)
                .WithMany(br => br.Models)
                .HasForeignKey(m => m.BrandID)
                .OnDelete(DeleteBehavior.Restrict);

            // Model -> Vehicle (1..many)
            b.Entity<Vehicle>()
                .HasOne(v => v.Model)
                .WithMany(m => m.Vehicles)
                .HasForeignKey(v => v.ModelID)
                .OnDelete(DeleteBehavior.Restrict);

            // Review relations
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

            // Useful indexes
            b.Entity<Brand>().HasIndex(x => x.ImaginMake);
            b.Entity<Model>().HasIndex(x => x.ImaginModelFamily);
            b.Entity<Vehicle>().HasIndex(v => v.VIN).IsUnique();
            b.Entity<Invoice>().HasIndex(i => i.InvoiceNumber).IsUnique();
            b.Entity<Customer>().HasIndex(c => c.Email);
            b.Entity<Employee>().HasIndex(e => e.Email);

            b.Entity<User>().HasIndex(u => u.Email).IsUnique();
            b.Entity<User>().HasIndex(u => u.Username).IsUnique();

            // SalesOrder relations
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

            // Invoice relations
            b.Entity<Invoice>()
                .HasOne(i => i.SalesOrder)
                .WithMany(so => so.Invoices)
                .HasForeignKey(i => i.SalesOrderID)
                .OnDelete(DeleteBehavior.Restrict);

            // Payment relations
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

            // Feedback relation
            b.Entity<Feedback>()
                .HasOne(fb => fb.Customer)
                .WithMany(c => c.Feedbacks)
                .HasForeignKey(fb => fb.CustomerID)
                .OnDelete(DeleteBehavior.Restrict);

            // Sale mapping
            b.Entity<Sale>(e =>
            {
                e.HasKey(x => x.SaleID);
                e.Property(x => x.Price).HasColumnType("decimal(18,2)");
                e.Property(x => x.BuyerName).HasMaxLength(150).IsRequired();
                e.Property(x => x.BuyerEmail).HasMaxLength(200).IsRequired();
                e.Property(x => x.BuyerPhone).HasMaxLength(50);
                e.Property(x => x.PaintDescription).HasMaxLength(100);
                e.Property(x => x.Angle).HasMaxLength(10);

                e.HasOne<Vehicle>()
                 .WithMany()
                 .HasForeignKey(x => x.VehicleID)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // TestDrive mapping — single authoritative block
            b.Entity<TestDrive>(e =>
            {
                e.ToTable("TestDrives");

                // PK: entity Id -> DB TestDriveID
                e.HasKey(t => t.Id);
                e.Property(t => t.Id).HasColumnName("TestDriveID");

                // Scalars
                e.Property(t => t.FullName).IsRequired().HasMaxLength(120);
                e.Property(t => t.Phone).IsRequired().HasMaxLength(40);
                e.Property(t => t.Email).HasMaxLength(120);
                e.Property(t => t.VehicleName).IsRequired().HasMaxLength(160);
                e.Property(t => t.Notes).HasMaxLength(1000);
                e.Property(t => t.AssignedTo).HasMaxLength(120);
                e.Property(t => t.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");

                // Legacy column names
                e.Property(t => t.VehicleId).HasColumnName("VehicleID");
                e.Property(t => t.PreferredAt).HasColumnName("ScheduledAt").IsRequired();

                // Enums
                e.Property(t => t.Status)
                 .HasConversion<string>()   // DB has NVARCHAR(40)
                 .HasMaxLength(40);

                // FKs
                e.HasOne(t => t.User)
                 .WithMany()
                 .HasForeignKey(t => t.UserId)
                 .OnDelete(DeleteBehavior.SetNull);

                // IMPORTANT: tie to the actual Vehicle nav to avoid a shadow relation (VehicleID1)
                // If your Vehicle class HAS a collection: public ICollection<TestDrive> TestDrives { get; set; }
                e.HasOne<Vehicle>()
                 .WithMany()   // ← use the real nav if it exists
                 .HasForeignKey(t => t.VehicleId)
                 .OnDelete(DeleteBehavior.Restrict);

                // If your Vehicle class DOES NOT have TestDrives, use this instead:
                // e.HasOne<Vehicle>()
                //  .WithMany()
                //  .HasForeignKey(t => t.VehicleId)
                //  .OnDelete(DeleteBehavior.Restrict);
            });

            // Lecturers / Lectures
            b.Entity<Lecturer>(e =>
            {
                e.ToTable("Lecturers");
                e.HasKey(x => x.LecturerID);
                e.Property(x => x.LecturerName).IsRequired().HasMaxLength(100);
                e.Property(x => x.Department).IsRequired().HasMaxLength(100);
                e.Property(x => x.Email).IsRequired().HasMaxLength(256);

                e.HasMany(x => x.Lectures)
                 .WithOne(x => x.Lecturer!)
                 .HasForeignKey(x => x.LecturerID)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            b.Entity<Lecture>(e =>
            {
                e.ToTable("Lectures");
                e.HasKey(x => x.LectureID);
                e.Property(x => x.LectureName).IsRequired().HasMaxLength(200);
            });
        }
    }
}
