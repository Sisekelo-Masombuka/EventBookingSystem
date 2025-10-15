using EventBookingSystem.Data;
using EventBookingSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EventBookingSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PaymentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("card")]
        public async Task<IActionResult> ProcessCardPayment([FromBody] CardPaymentRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var payment = await _context.Payments
                    .Include(p => p.Booking)
                        .ThenInclude(b => b.BookingItems)
                            .ThenInclude(bi => bi.TicketType)
                    .FirstOrDefaultAsync(p => p.Id == request.PaymentId && p.Booking.UserId == userId);

                if (payment == null)
                {
                    return NotFound(new { message = "Payment not found" });
                }

                if (payment.Status != "Pending")
                {
                    return BadRequest(new { message = "Payment is not pending" });
                }

                // Simulate card payment processing
                // In a real application, you would integrate with a payment gateway like Stripe, PayPal, etc.
                var isPaymentSuccessful = SimulateCardPayment(request);

                if (isPaymentSuccessful)
                {
                    // Validate booking not expired
                    if (payment.Booking.ExpiresAt < DateTime.UtcNow)
                    {
                        return BadRequest(new { message = "Booking has expired" });
                    }

                    // Transaction: re-check availability and atomically update
                    await using var tx = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);

                    // Reload latest booking with items and ticket types within the transaction
                    var booking = await _context.Bookings
                        .Include(b => b.BookingItems)
                            .ThenInclude(bi => bi.TicketType)
                        .FirstOrDefaultAsync(b => b.Id == payment.BookingId);

                    if (booking == null)
                    {
                        return NotFound(new { message = "Booking not found" });
                    }

                    // Re-check stock
                    foreach (var item in booking.BookingItems)
                    {
                        var tt = await _context.TicketTypes.FirstOrDefaultAsync(t => t.Id == item.TicketTypeId);
                        if (tt == null)
                        {
                            await tx.RollbackAsync();
                            return NotFound(new { message = "Ticket type not found" });
                        }
                        var available = tt.QuantityAvailable - tt.QuantitySold;
                        if (item.Quantity > available)
                        {
                            await tx.RollbackAsync();
                            return BadRequest(new { message = $"Not enough '{tt.Name}' tickets available" });
                        }
                    }

                    // Apply updates
                    payment.Status = "Completed";
                    payment.PaidAt = DateTime.UtcNow;
                    booking.Status = "Confirmed";

                    foreach (var item in booking.BookingItems)
                    {
                        var tt = await _context.TicketTypes.FirstAsync(t => t.Id == item.TicketTypeId);
                        tt.QuantitySold += item.Quantity;
                    }

                    await _context.SaveChangesAsync();
                    await tx.CommitAsync();

                    return Ok(new
                    {
                        message = "Payment processed successfully",
                        paymentId = payment.Id,
                        status = payment.Status,
                        paidAt = payment.PaidAt,
                        bookingId = payment.BookingId
                    });
                }
                else
                {
                    payment.Status = "Failed";
                    await _context.SaveChangesAsync();

                    return BadRequest(new { message = "Payment failed. Please try again." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing payment", error = ex.Message });
            }
        }

        [HttpPost("money")]
        public async Task<IActionResult> GenerateMoneyMarketPayment([FromBody] MoneyMarketPaymentRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var payment = await _context.Payments
                    .Include(p => p.Booking)
                    .FirstOrDefaultAsync(p => p.Id == request.PaymentId && p.Booking.UserId == userId);

                if (payment == null)
                {
                    return NotFound(new { message = "Payment not found" });
                }

                if (payment.Status != "Pending")
                {
                    return BadRequest(new { message = "Payment is not pending" });
                }

                // Generate QR code data
                var qrData = GenerateQRCodeData(payment.ReferenceCode!, payment.Amount);

                return Ok(new
                {
                    message = "Money Market payment details generated",
                    paymentId = payment.Id,
                    referenceCode = payment.ReferenceCode,
                    amount = payment.Amount,
                    qrCodeData = qrData,
                    expiresAt = DateTime.UtcNow.AddHours(24),
                    instructions = "Take this reference code to any participating Money Market outlet to complete your payment. You have 24 hours to pay."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while generating payment details", error = ex.Message });
            }
        }

        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmPaymentRequest request)
        {
            try
            {
                var payment = await _context.Payments
                    .Include(p => p.Booking)
                        .ThenInclude(b => b.BookingItems)
                            .ThenInclude(bi => bi.TicketType)
                    .FirstOrDefaultAsync(p => p.ReferenceCode == request.ReferenceCode);

                if (payment == null)
                {
                    return NotFound(new { message = "Payment not found" });
                }

                if (payment.Status != "Pending")
                {
                    return BadRequest(new { message = "Payment is not pending" });
                }

                // Check if payment is still within expiry time (using booking expiry for now)
                if (payment.Booking.ExpiresAt < DateTime.UtcNow)
                {
                    payment.Status = "Failed";
                    payment.Booking.Status = "Expired";
                    await _context.SaveChangesAsync();
                    return BadRequest(new { message = "Payment has expired" });
                }

                // Transaction: re-check availability and atomically mark completed
                await using var tx = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);

                var booking = await _context.Bookings
                    .Include(b => b.BookingItems)
                        .ThenInclude(bi => bi.TicketType)
                    .FirstOrDefaultAsync(b => b.Id == payment.BookingId);

                if (booking == null)
                {
                    await tx.RollbackAsync();
                    return NotFound(new { message = "Booking not found" });
                }

                foreach (var item in booking.BookingItems)
                {
                    var tt = await _context.TicketTypes.FirstOrDefaultAsync(t => t.Id == item.TicketTypeId);
                    if (tt == null)
                    {
                        await tx.RollbackAsync();
                        return NotFound(new { message = "Ticket type not found" });
                    }
                    var available = tt.QuantityAvailable - tt.QuantitySold;
                    if (item.Quantity > available)
                    {
                        await tx.RollbackAsync();
                        return BadRequest(new { message = $"Not enough '{tt.Name}' tickets available" });
                    }
                }

                payment.Status = "Completed";
                payment.PaidAt = DateTime.UtcNow;
                booking.Status = "Confirmed";

                foreach (var item in booking.BookingItems)
                {
                    var tt = await _context.TicketTypes.FirstAsync(t => t.Id == item.TicketTypeId);
                    tt.QuantitySold += item.Quantity;
                }

                await _context.SaveChangesAsync();
                await tx.CommitAsync();

                return Ok(new
                {
                    message = "Payment confirmed successfully",
                    paymentId = payment.Id,
                    status = payment.Status,
                    paidAt = payment.PaidAt,
                    bookingId = payment.BookingId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while confirming payment", error = ex.Message });
            }
        }

        [HttpGet("status/{paymentId}")]
        public async Task<IActionResult> GetPaymentStatus(Guid paymentId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var payment = await _context.Payments
                    .Include(p => p.Booking)
                    .FirstOrDefaultAsync(p => p.Id == paymentId && p.Booking.UserId == userId);

                if (payment == null)
                {
                    return NotFound(new { message = "Payment not found" });
                }

                return Ok(new
                {
                    paymentId = payment.Id,
                    status = payment.Status,
                    amount = payment.Amount,
                    method = payment.PaymentMethod,
                    referenceCode = payment.ReferenceCode,
                    paidAt = payment.PaidAt,
                    bookingId = payment.BookingId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching payment status", error = ex.Message });
            }
        }

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : null;
        }

        private bool SimulateCardPayment(CardPaymentRequest request)
        {
            // Simulate card payment validation
            // In a real application, this would call a payment gateway API
            return !string.IsNullOrEmpty(request.CardNumber) && 
                   !string.IsNullOrEmpty(request.CardholderName) &&
                   !string.IsNullOrEmpty(request.ExpiryDate) &&
                   !string.IsNullOrEmpty(request.CVV);
        }

        private string GenerateQRCodeData(string referenceCode, decimal amount)
        {
            // Generate QR code data for Money Market payment
            // In a real application, this would generate a proper QR code
            return $"MMH|{referenceCode}|{amount:F2}|{DateTime.UtcNow:yyyyMMddHHmmss}";
        }
    }

    public class CardPaymentRequest
    {
        public Guid PaymentId { get; set; }
        public string CardholderName { get; set; } = string.Empty;
        public string CardNumber { get; set; } = string.Empty;
        public string ExpiryDate { get; set; } = string.Empty;
        public string CVV { get; set; } = string.Empty;
    }

    public class MoneyMarketPaymentRequest
    {
        public Guid PaymentId { get; set; }
    }

    public class ConfirmPaymentRequest
    {
        public string ReferenceCode { get; set; } = string.Empty;
    }
}
