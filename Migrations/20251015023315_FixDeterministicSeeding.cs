using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EventBookingSystem.Migrations
{
    /// <inheritdoc />
    public partial class FixDeterministicSeeding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TicketTypes",
                keyColumn: "Id",
                keyValue: new Guid("101875ba-fa97-4aeb-9757-2f78763b76a1"));

            migrationBuilder.DeleteData(
                table: "TicketTypes",
                keyColumn: "Id",
                keyValue: new Guid("143cd52e-2ba2-47a5-b9da-9b665eecfce8"));

            migrationBuilder.DeleteData(
                table: "TicketTypes",
                keyColumn: "Id",
                keyValue: new Guid("23d499a5-ba3d-421f-9240-2fc502ccffeb"));

            migrationBuilder.DeleteData(
                table: "TicketTypes",
                keyColumn: "Id",
                keyValue: new Guid("97256b92-8b71-40ba-954a-dfc5520d1d20"));

            migrationBuilder.DeleteData(
                table: "TicketTypes",
                keyColumn: "Id",
                keyValue: new Guid("acb0e469-ef0b-4cff-9ce0-8c03509051fe"));

            migrationBuilder.DeleteData(
                table: "TicketTypes",
                keyColumn: "Id",
                keyValue: new Guid("c3a1a273-91cc-48f8-b385-552cfc0e9327"));

            migrationBuilder.DeleteData(
                table: "TicketTypes",
                keyColumn: "Id",
                keyValue: new Guid("dbb12bb3-e571-4212-a700-1045a7de6f46"));

            migrationBuilder.DeleteData(
                table: "TicketTypes",
                keyColumn: "Id",
                keyValue: new Guid("e27bb41f-f743-479c-ad9c-a3149b454c86"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("1f23390d-a5bb-4020-9577-97a4c8ddc6fb"));

            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("4fcd48cb-eb97-42fb-98c9-a2b7d7007ac1"));

            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("dfcac1f4-f6ff-484c-bdc4-5aa7ca5f0602"));

            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("fe85c258-67a8-489b-8772-76af1b39534c"));

            migrationBuilder.InsertData(
                table: "Events",
                columns: new[] { "Id", "Capacity", "Category", "CreatedAt", "Description", "EndDateTime", "LocationCity", "PosterUrl", "StartDateTime", "Title", "Venue" },
                values: new object[,]
                {
                    { new Guid("22222222-2222-2222-2222-222222222222"), 5000, "Music", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Join us for the biggest jazz festival in South Africa featuring international and local artists.", new DateTime(2025, 3, 17, 23, 0, 0, 0, DateTimeKind.Utc), "Cape Town", "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500", new DateTime(2025, 3, 15, 18, 0, 0, 0, DateTimeKind.Utc), "Cape Town Jazz Festival 2025", "Green Point Stadium" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), 2000, "Tech", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "The premier technology conference featuring AI, blockchain, and cloud computing experts.", new DateTime(2025, 4, 12, 17, 0, 0, 0, DateTimeKind.Utc), "Johannesburg", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500", new DateTime(2025, 4, 10, 9, 0, 0, 0, DateTimeKind.Utc), "Tech Conference SA 2025", "Sandton Convention Centre" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), 55000, "Sport", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Watch the Springboks take on their rivals in this thrilling rugby match.", new DateTime(2025, 5, 20, 18, 0, 0, 0, DateTimeKind.Utc), "Durban", "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500", new DateTime(2025, 5, 20, 15, 0, 0, 0, DateTimeKind.Utc), "Springbok Rugby Match", "Moses Mabhida Stadium" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "City", "Country", "CreatedAt", "Email", "FirstName", "Gender", "LastName", "MiddleName", "PasswordHash", "PhoneNumber", "PostalCode", "Role", "StreetAddress" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), "Kimberley", "South Africa", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@mzansimomentshub.com", "Admin", "Other", "User", null, "$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", "+27123456789", "8300", "Admin", "123 Admin Street" });

            migrationBuilder.InsertData(
                table: "TicketTypes",
                columns: new[] { "Id", "EventId", "IsActive", "Name", "Price", "QuantityAvailable", "QuantitySold" },
                values: new object[,]
                {
                    { new Guid("55555555-5555-5555-5555-555555555551"), new Guid("22222222-2222-2222-2222-222222222222"), true, "General Admission", 250.00m, 3000, 0 },
                    { new Guid("55555555-5555-5555-5555-555555555552"), new Guid("22222222-2222-2222-2222-222222222222"), true, "VIP", 750.00m, 500, 0 },
                    { new Guid("55555555-5555-5555-5555-555555555553"), new Guid("22222222-2222-2222-2222-222222222222"), true, "Early Bird", 200.00m, 1000, 0 },
                    { new Guid("66666666-6666-6666-6666-666666666661"), new Guid("33333333-3333-3333-3333-333333333333"), true, "Standard", 1200.00m, 1500, 0 },
                    { new Guid("66666666-6666-6666-6666-666666666662"), new Guid("33333333-3333-3333-3333-333333333333"), true, "Student", 600.00m, 300, 0 },
                    { new Guid("77777777-7777-7777-7777-777777777771"), new Guid("44444444-4444-4444-4444-444444444444"), true, "North Stand", 150.00m, 20000, 0 },
                    { new Guid("77777777-7777-7777-7777-777777777772"), new Guid("44444444-4444-4444-4444-444444444444"), true, "South Stand", 150.00m, 20000, 0 },
                    { new Guid("77777777-7777-7777-7777-777777777773"), new Guid("44444444-4444-4444-4444-444444444444"), true, "VIP Box", 500.00m, 100, 0 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TicketTypes",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555551"));

            migrationBuilder.DeleteData(
                table: "TicketTypes",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555552"));

            migrationBuilder.DeleteData(
                table: "TicketTypes",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555553"));

            migrationBuilder.DeleteData(
                table: "TicketTypes",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666661"));

            migrationBuilder.DeleteData(
                table: "TicketTypes",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666662"));

            migrationBuilder.DeleteData(
                table: "TicketTypes",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777771"));

            migrationBuilder.DeleteData(
                table: "TicketTypes",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777772"));

            migrationBuilder.DeleteData(
                table: "TicketTypes",
                keyColumn: "Id",
                keyValue: new Guid("77777777-7777-7777-7777-777777777773"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

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
        }
    }
}
