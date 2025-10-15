using EventBookingSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EventBookingSystem.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<TicketType> TicketTypes { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BookingItem> BookingItems { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired();
                entity.Property(e => e.PasswordHash).IsRequired();
            });

            // Configure Event entity
            modelBuilder.Entity<Event>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired();
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.Category).IsRequired();
                entity.Property(e => e.LocationCity).IsRequired();
                entity.Property(e => e.Venue).IsRequired();
            });

            // Configure TicketType entity
            modelBuilder.Entity<TicketType>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.HasOne(e => e.Event)
                    .WithMany(e => e.TicketTypes)
                    .HasForeignKey(e => e.EventId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Booking entity
            modelBuilder.Entity<Booking>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
                entity.HasOne(e => e.User)
                    .WithMany(e => e.Bookings)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure BookingItem entity
            modelBuilder.Entity<BookingItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UnitPrice).HasColumnType("decimal(18,2)");
                entity.HasOne(e => e.Booking)
                    .WithMany(e => e.BookingItems)
                    .HasForeignKey(e => e.BookingId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.TicketType)
                    .WithMany(e => e.BookingItems)
                    .HasForeignKey(e => e.TicketTypeId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Payment entity
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.HasOne(e => e.Booking)
                    .WithOne(e => e.Payment)
                    .HasForeignKey<Payment>(e => e.BookingId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Favorite entity
            modelBuilder.Entity<Favorite>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.UserId, e.EventId }).IsUnique();
                entity.HasOne(e => e.User)
                    .WithMany(u => u.Favorites)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Event)
                    .WithMany()
                    .HasForeignKey(e => e.EventId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Review entity
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.UserId, e.EventId }).IsUnique();
                entity.Property(e => e.Rating).IsRequired();
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Event)
                    .WithMany()
                    .HasForeignKey(e => e.EventId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Seed data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Create default admin user with fixed GUID and deterministic values
            var adminId = new Guid("11111111-1111-1111-1111-111111111111");
            // BCrypt hash for password "admin123" - pre-computed for deterministic seeding
            // Login with: admin@mzansimomentshub.com / admin123
            var adminPasswordHash = "$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
            
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = adminId,
                FirstName = "Admin",
                LastName = "User",
                Email = "admin@mzansimomentshub.com",
                PhoneNumber = "+27123456789",
                Gender = "Other",
                StreetAddress = "123 Admin Street",
                City = "Kimberley",
                PostalCode = "8300",
                Country = "South Africa",
                PasswordHash = adminPasswordHash,
                Role = "Admin",
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            });

            // Create sample events with fixed GUIDs for deterministic seeding
            var event1Id = new Guid("22222222-2222-2222-2222-222222222222");
            var event2Id = new Guid("33333333-3333-3333-3333-333333333333");
            var event3Id = new Guid("44444444-4444-4444-4444-444444444444");

            modelBuilder.Entity<Event>().HasData(
                new Event
                {
                    Id = event1Id,
                    Title = "Cape Town Jazz Festival 2025",
                    Description = "Join us for the biggest jazz festival in South Africa featuring international and local artists.",
                    Category = "Music",
                    LocationCity = "Cape Town",
                    Venue = "Green Point Stadium",
                    StartDateTime = new DateTime(2025, 3, 15, 18, 0, 0, DateTimeKind.Utc),
                    EndDateTime = new DateTime(2025, 3, 17, 23, 0, 0, DateTimeKind.Utc),
                    PosterUrl = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
                    Capacity = 5000,
                    CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Event
                {
                    Id = event2Id,
                    Title = "Tech Conference SA 2025",
                    Description = "The premier technology conference featuring AI, blockchain, and cloud computing experts.",
                    Category = "Tech",
                    LocationCity = "Johannesburg",
                    Venue = "Sandton Convention Centre",
                    StartDateTime = new DateTime(2025, 4, 10, 9, 0, 0, DateTimeKind.Utc),
                    EndDateTime = new DateTime(2025, 4, 12, 17, 0, 0, DateTimeKind.Utc),
                    PosterUrl = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500",
                    Capacity = 2000,
                    CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Event
                {
                    Id = event3Id,
                    Title = "Springbok Rugby Match",
                    Description = "Watch the Springboks take on their rivals in this thrilling rugby match.",
                    Category = "Sport",
                    LocationCity = "Durban",
                    Venue = "Moses Mabhida Stadium",
                    StartDateTime = new DateTime(2025, 5, 20, 15, 0, 0, DateTimeKind.Utc),
                    EndDateTime = new DateTime(2025, 5, 20, 18, 0, 0, DateTimeKind.Utc),
                    PosterUrl = "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
                    Capacity = 55000,
                    CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // Create sample ticket types with fixed GUIDs
            modelBuilder.Entity<TicketType>().HasData(
                // Cape Town Jazz Festival tickets
                new TicketType
                {
                    Id = new Guid("55555555-5555-5555-5555-555555555551"),
                    EventId = event1Id,
                    Name = "General Admission",
                    Price = 250.00m,
                    QuantityAvailable = 3000,
                    QuantitySold = 0,
                    IsActive = true
                },
                new TicketType
                {
                    Id = new Guid("55555555-5555-5555-5555-555555555552"),
                    EventId = event1Id,
                    Name = "VIP",
                    Price = 750.00m,
                    QuantityAvailable = 500,
                    QuantitySold = 0,
                    IsActive = true
                },
                new TicketType
                {
                    Id = new Guid("55555555-5555-5555-5555-555555555553"),
                    EventId = event1Id,
                    Name = "Early Bird",
                    Price = 200.00m,
                    QuantityAvailable = 1000,
                    QuantitySold = 0,
                    IsActive = true
                },
                // Tech Conference tickets
                new TicketType
                {
                    Id = new Guid("66666666-6666-6666-6666-666666666661"),
                    EventId = event2Id,
                    Name = "Standard",
                    Price = 1200.00m,
                    QuantityAvailable = 1500,
                    QuantitySold = 0,
                    IsActive = true
                },
                new TicketType
                {
                    Id = new Guid("66666666-6666-6666-6666-666666666662"),
                    EventId = event2Id,
                    Name = "Student",
                    Price = 600.00m,
                    QuantityAvailable = 300,
                    QuantitySold = 0,
                    IsActive = true
                },
                // Rugby Match tickets
                new TicketType
                {
                    Id = new Guid("77777777-7777-7777-7777-777777777771"),
                    EventId = event3Id,
                    Name = "North Stand",
                    Price = 150.00m,
                    QuantityAvailable = 20000,
                    QuantitySold = 0,
                    IsActive = true
                },
                new TicketType
                {
                    Id = new Guid("77777777-7777-7777-7777-777777777772"),
                    EventId = event3Id,
                    Name = "South Stand",
                    Price = 150.00m,
                    QuantityAvailable = 20000,
                    QuantitySold = 0,
                    IsActive = true
                },
                new TicketType
                {
                    Id = new Guid("77777777-7777-7777-7777-777777777773"),
                    EventId = event3Id,
                    Name = "VIP Box",
                    Price = 500.00m,
                    QuantityAvailable = 100,
                    QuantitySold = 0,
                    IsActive = true
                }
            );
        }
    }
}

