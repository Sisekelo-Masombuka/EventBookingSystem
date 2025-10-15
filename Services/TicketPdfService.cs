using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using EventBookingSystem.Models;
using QRCoder;
using System.Drawing;

namespace EventBookingSystem.Services
{
    public interface ITicketPdfService
    {
        byte[] GenerateTicketPdf(Booking booking, User user, Event eventDetails, List<BookingItem> bookingItems);
    }

    public class TicketPdfService : ITicketPdfService
    {
        public byte[] GenerateTicketPdf(Booking booking, User user, Event eventDetails, List<BookingItem> bookingItems)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12));

                    page.Header()
                        .Row(row =>
                        {
                            row.RelativeItem().Column(column =>
                            {
                                column.Item().Text("Mzansi Moments Hub")
                                    .FontSize(24)
                                    .SemiBold()
                                    .FontColor(Colors.Red.Medium);
                                
                                column.Item().Text("Event Ticket")
                                    .FontSize(16)
                                    .FontColor(Colors.Grey.Darken2);
                            });

                            row.ConstantItem(100).Height(50).Placeholder();
                        });

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Column(column =>
                        {
                            // Event Information
                            column.Item().PaddingBottom(20).Column(eventColumn =>
                            {
                                eventColumn.Item().Text("EVENT DETAILS")
                                    .FontSize(18)
                                    .SemiBold()
                                    .FontColor(Colors.Red.Medium);

                                eventColumn.Item().PaddingTop(10).Row(row =>
                                {
                                    row.RelativeItem().Column(col =>
                                    {
                                        col.Item().Text($"Event: {eventDetails.Title}")
                                            .FontSize(14)
                                            .SemiBold();
                                        col.Item().Text($"Category: {eventDetails.Category}")
                                            .FontSize(12)
                                            .FontColor(Colors.Grey.Darken1);
                                        col.Item().Text($"Venue: {eventDetails.Venue}")
                                            .FontSize(12);
                                        col.Item().Text($"Location: {eventDetails.LocationCity}")
                                            .FontSize(12);
                                    });

                                    row.RelativeItem().Column(col =>
                                    {
                                        col.Item().Text($"Date: {eventDetails.StartDateTime:dddd, MMMM dd, yyyy}")
                                            .FontSize(12);
                                        col.Item().Text($"Time: {eventDetails.StartDateTime:HH:mm}")
                                            .FontSize(12);
                                        col.Item().Text($"Capacity: {eventDetails.Capacity:N0} people")
                                            .FontSize(12);
                                    });
                                });
                            });

                            // Ticket Holder Information
                            column.Item().PaddingBottom(20).Column(holderColumn =>
                            {
                                holderColumn.Item().Text("TICKET HOLDER")
                                    .FontSize(18)
                                    .SemiBold()
                                    .FontColor(Colors.Red.Medium);

                                holderColumn.Item().PaddingTop(10).Row(row =>
                                {
                                    row.RelativeItem().Column(col =>
                                    {
                                        col.Item().Text($"Name: {user.FirstName} {user.MiddleName} {user.LastName}".Trim())
                                            .FontSize(14)
                                            .SemiBold();
                                        col.Item().Text($"Email: {user.Email}")
                                            .FontSize(12);
                                        col.Item().Text($"Phone: {user.PhoneNumber}")
                                            .FontSize(12);
                                    });

                                    row.RelativeItem().Column(col =>
                                    {
                                        col.Item().Text($"Booking ID: {booking.Id}")
                                            .FontSize(12)
                                            .SemiBold();
                                        col.Item().Text($"Booking Date: {booking.BookingDate:dd/MM/yyyy HH:mm}")
                                            .FontSize(12);
                                        col.Item().Text($"Status: {booking.Status}")
                                            .FontSize(12)
                                            .FontColor(booking.Status == "Confirmed" ? Colors.Green.Darken2 : Colors.Orange.Darken2);
                                    });
                                });
                            });

                            // Ticket Details
                            column.Item().PaddingBottom(20).Column(ticketColumn =>
                            {
                                ticketColumn.Item().Text("TICKET DETAILS")
                                    .FontSize(18)
                                    .SemiBold()
                                    .FontColor(Colors.Red.Medium);

                                ticketColumn.Item().PaddingTop(10).Table(table =>
                                {
                                    table.ColumnsDefinition(columns =>
                                    {
                                        columns.RelativeColumn(3);
                                        columns.RelativeColumn(2);
                                        columns.RelativeColumn(1);
                                        columns.RelativeColumn(2);
                                    });

                                    table.Header(header =>
                                    {
                                        header.Cell().Element(CellStyle).Text("Ticket Type").SemiBold();
                                        header.Cell().Element(CellStyle).Text("Unit Price").SemiBold();
                                        header.Cell().Element(CellStyle).Text("Qty").SemiBold();
                                        header.Cell().Element(CellStyle).Text("Total").SemiBold();
                                    });

                                    decimal totalAmount = 0;
                                    foreach (var item in bookingItems)
                                    {
                                        var itemTotal = item.Quantity * item.UnitPrice;
                                        totalAmount += itemTotal;

                                        table.Cell().Element(CellStyle).Text(item.TicketType?.Name ?? "General");
                                        table.Cell().Element(CellStyle).Text($"R{item.UnitPrice:F2}");
                                        table.Cell().Element(CellStyle).Text(item.Quantity.ToString());
                                        table.Cell().Element(CellStyle).Text($"R{itemTotal:F2}");
                                    }

                                    table.Cell().ColumnSpan(3).Element(CellStyle).Text("TOTAL AMOUNT").SemiBold();
                                    table.Cell().Element(CellStyle).Text($"R{totalAmount:F2}").SemiBold();
                                });
                            });

                            // QR Code Section
                            column.Item().PaddingBottom(20).Row(qrRow =>
                            {
                                qrRow.RelativeItem(2).Column(infoColumn =>
                                {
                                    infoColumn.Item().Text("IMPORTANT INFORMATION")
                                        .FontSize(18)
                                        .SemiBold()
                                        .FontColor(Colors.Red.Medium);

                                    infoColumn.Item().PaddingTop(10).Column(notes =>
                                    {
                                        notes.Item().Text("• Please arrive at least 30 minutes before the event starts")
                                            .FontSize(11);
                                        notes.Item().Text("• Bring a valid ID for verification")
                                            .FontSize(11);
                                        notes.Item().Text("• This ticket is non-transferable and non-refundable")
                                            .FontSize(11);
                                        notes.Item().Text("• In case of any issues, contact our support team")
                                            .FontSize(11);
                                        notes.Item().Text("• Keep this ticket safe - you will need it for entry")
                                            .FontSize(11);
                                    });
                                });

                                qrRow.RelativeItem(1).Column(qrColumn =>
                                {
                                    qrColumn.Item().Text("TICKET QR CODE")
                                        .FontSize(14)
                                        .SemiBold()
                                        .FontColor(Colors.Red.Medium)
                                        .AlignCenter();

                                    qrColumn.Item().PaddingTop(10).Height(120).Width(120)
                                        .AlignCenter()
                                        .Image(GenerateQrCodeImage(booking.Id.ToString()));

                                    qrColumn.Item().PaddingTop(5).Text($"ID: {booking.Id}")
                                        .FontSize(10)
                                        .FontColor(Colors.Grey.Darken1)
                                        .AlignCenter();
                                });
                            });
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text($"Generated on {DateTime.Now:dd/MM/yyyy HH:mm} by Mzansi Moments Hub")
                        .FontSize(10)
                        .FontColor(Colors.Grey.Medium);
                });
            });

            return document.GeneratePdf();
        }

        private static IContainer CellStyle(IContainer container)
        {
            return container
                .Border(1)
                .BorderColor(Colors.Grey.Lighten2)
                .Padding(8)
                .AlignCenter()
                .AlignMiddle();
        }

        private static byte[] GenerateQrCodeImage(string data)
        {
            var qrGenerator = new QRCodeGenerator();
            var qrCodeData = qrGenerator.CreateQrCode(data, QRCodeGenerator.ECCLevel.Q);
            var qrCode = new PngByteQRCode(qrCodeData);
            return qrCode.GetGraphic(20);
        }
    }
}