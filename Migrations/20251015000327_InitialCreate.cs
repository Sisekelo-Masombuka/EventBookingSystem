using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EventBookingSystem.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LocationCity = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Venue = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    StartDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PosterUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MiddleName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    StreetAddress = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PostalCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Country = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TicketTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EventId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    QuantityAvailable = table.Column<int>(type: "int", nullable: false),
                    QuantitySold = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TicketTypes_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BookingDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bookings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BookingItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BookingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TicketTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookingItems_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookingItems_TicketTypes_TicketTypeId",
                        column: x => x.TicketTypeId,
                        principalTable: "TicketTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BookingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ReferenceCode = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    PaidAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payments_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Events",
                columns: new[] { "Id", "Capacity", "Category", "CreatedAt", "Description", "EndDateTime", "LocationCity", "PosterUrl", "StartDateTime", "Title", "Venue" },
                values: new object[,]
                {
                    { new Guid("4fcd48cb-eb97-42fb-98c9-a2b7d7007ac1"), 5000, "Music", new DateTime(2025, 10, 15, 0, 3, 26, 134, DateTimeKind.Utc).AddTicks(6942), "Join us for the biggest jazz festival in South Africa featuring international and local artists.", new DateTime(2025, 11, 16, 0, 3, 26, 134, DateTimeKind.Utc).AddTicks(6939), "Cape Town", "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500", new DateTime(2025, 11, 14, 0, 3, 26, 134, DateTimeKind.Utc).AddTicks(6929), "Cape Town Jazz Festival 2025", "Green Point Stadium" },
                    { new Guid("dfcac1f4-f6ff-484c-bdc4-5aa7ca5f0602"), 55000, "Sport", new DateTime(2025, 10, 15, 0, 3, 26, 134, DateTimeKind.Utc).AddTicks(7008), "Watch the Springboks take on their rivals in this thrilling rugby match.", new DateTime(2025, 12, 14, 3, 3, 26, 134, DateTimeKind.Utc).AddTicks(6988), "Durban", "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500", new DateTime(2025, 12, 14, 0, 3, 26, 134, DateTimeKind.Utc).AddTicks(6987), "Springbok Rugby Match", "Moses Mabhida Stadium" },
                    { new Guid("fe85c258-67a8-489b-8772-76af1b39534c"), 2000, "Tech", new DateTime(2025, 10, 15, 0, 3, 26, 134, DateTimeKind.Utc).AddTicks(6980), "The premier technology conference featuring AI, blockchain, and cloud computing experts.", new DateTime(2025, 12, 1, 0, 3, 26, 134, DateTimeKind.Utc).AddTicks(6978), "Johannesburg", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500", new DateTime(2025, 11, 29, 0, 3, 26, 134, DateTimeKind.Utc).AddTicks(6976), "Tech Conference SA 2025", "Sandton Convention Centre" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "City", "Country", "CreatedAt", "Email", "FirstName", "Gender", "LastName", "MiddleName", "PasswordHash", "PhoneNumber", "PostalCode", "Role", "StreetAddress" },
                values: new object[] { new Guid("1f23390d-a5bb-4020-9577-97a4c8ddc6fb"), "Kimberley", "South Africa", new DateTime(2025, 10, 15, 0, 3, 26, 134, DateTimeKind.Utc).AddTicks(5418), "admin@mzansimomentshub.com", "Admin", "Other", "User", null, "$2a$11$xl5YAeNC7Fyc2.3Gn/dUBu/TaaS.agA42qFrQFPBZOCQS.MN0UvtW", "+27123456789", "8300", "Admin", "123 Admin Street" });

            migrationBuilder.InsertData(
                table: "TicketTypes",
                columns: new[] { "Id", "EventId", "IsActive", "Name", "Price", "QuantityAvailable", "QuantitySold" },
                values: new object[,]
                {
                    { new Guid("101875ba-fa97-4aeb-9757-2f78763b76a1"), new Guid("dfcac1f4-f6ff-484c-bdc4-5aa7ca5f0602"), true, "VIP Box", 500.00m, 100, 0 },
                    { new Guid("143cd52e-2ba2-47a5-b9da-9b665eecfce8"), new Guid("dfcac1f4-f6ff-484c-bdc4-5aa7ca5f0602"), true, "North Stand", 150.00m, 20000, 0 },
                    { new Guid("23d499a5-ba3d-421f-9240-2fc502ccffeb"), new Guid("4fcd48cb-eb97-42fb-98c9-a2b7d7007ac1"), true, "Early Bird", 200.00m, 1000, 0 },
                    { new Guid("97256b92-8b71-40ba-954a-dfc5520d1d20"), new Guid("fe85c258-67a8-489b-8772-76af1b39534c"), true, "Student", 600.00m, 300, 0 },
                    { new Guid("acb0e469-ef0b-4cff-9ce0-8c03509051fe"), new Guid("4fcd48cb-eb97-42fb-98c9-a2b7d7007ac1"), true, "VIP", 750.00m, 500, 0 },
                    { new Guid("c3a1a273-91cc-48f8-b385-552cfc0e9327"), new Guid("4fcd48cb-eb97-42fb-98c9-a2b7d7007ac1"), true, "General Admission", 250.00m, 3000, 0 },
                    { new Guid("dbb12bb3-e571-4212-a700-1045a7de6f46"), new Guid("dfcac1f4-f6ff-484c-bdc4-5aa7ca5f0602"), true, "South Stand", 150.00m, 20000, 0 },
                    { new Guid("e27bb41f-f743-479c-ad9c-a3149b454c86"), new Guid("fe85c258-67a8-489b-8772-76af1b39534c"), true, "Standard", 1200.00m, 1500, 0 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookingItems_BookingId",
                table: "BookingItems",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingItems_TicketTypeId",
                table: "BookingItems",
                column: "TicketTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserId",
                table: "Bookings",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_BookingId",
                table: "Payments",
                column: "BookingId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TicketTypes_EventId",
                table: "TicketTypes",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookingItems");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "TicketTypes");

            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "Events");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
