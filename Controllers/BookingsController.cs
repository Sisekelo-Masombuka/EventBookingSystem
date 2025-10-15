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
    public class BookingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("add-to-cart")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                // Check if ticket type exists and is available
                var ticketType = await _context.TicketTypes
                    .Include(t => t.Event)
                    .FirstOrDefaultAsync(t => t.Id == request.TicketTypeId && t.IsActive);

                if (ticketType == null)
                {
                    return NotFound(new { message = "Ticket type not found" });
                }

                if (ticketType.QuantityAvailable < ticketType.QuantitySold + request.Quantity)
                {
                    return BadRequest(new { message = "Not enough tickets available" });
                }

                // Check if user has an existing pending booking for this event
                var existingBooking = await _context.Bookings
                    .Include(b => b.BookingItems)
                    .FirstOrDefaultAsync(b => b.UserId == userId && 
                                           b.Status == "Pending" && 
                                           b.BookingItems.Any(bi => bi.TicketType.EventId == ticketType.EventId));

                if (existingBooking != null)
                {
                    // Update existing booking
                    var existingItem = existingBooking.BookingItems
                        .FirstOrDefault(bi => bi.TicketTypeId == request.TicketTypeId);

                    if (existingItem != null)
                    {
                        existingItem.Quantity += request.Quantity;
                    }
                    else
                    {
                        var newItem = new BookingItem
                        {
                            BookingId = existingBooking.Id,
                            TicketTypeId = request.TicketTypeId,
                            Quantity = request.Quantity,
                            UnitPrice = ticketType.Price
                        };
                        existingBooking.BookingItems.Add(newItem);
                    }

                    // Update total amount
                    existingBooking.TotalAmount = existingBooking.BookingItems.Sum(bi => bi.Quantity * bi.UnitPrice);
                    existingBooking.ExpiresAt = DateTime.UtcNow.AddHours(1); // Reset expiry
                }
                else
                {
                    // Create new booking
                    var booking = new Booking
                    {
                        UserId = userId.Value,
                        TotalAmount = request.Quantity * ticketType.Price,
                        Status = "Pending",
                        ExpiresAt = DateTime.UtcNow.AddHours(1)
                    };

                    _context.Bookings.Add(booking);
                    await _context.SaveChangesAsync();

                    var bookingItem = new BookingItem
                    {
                        BookingId = booking.Id,
                        TicketTypeId = request.TicketTypeId,
                        Quantity = request.Quantity,
                        UnitPrice = ticketType.Price
                    };

                    _context.BookingItems.Add(bookingItem);
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Tickets added to cart successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding to cart", error = ex.Message });
            }
        }

        [HttpGet("cart")]
        public async Task<IActionResult> GetCart()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var cart = await _context.Bookings
                    .Include(b => b.BookingItems)
                        .ThenInclude(bi => bi.TicketType)
                            .ThenInclude(tt => tt.Event)
                    .Where(b => b.UserId == userId && b.Status == "Pending")
                    .Select(b => new
                    {
                        bookingId = b.Id,
                        totalAmount = b.TotalAmount,
                        expiresAt = b.ExpiresAt,
                        items = b.BookingItems.Select(bi => new
                        {
                            id = bi.Id,
                            eventTitle = bi.TicketType.Event.Title,
                            ticketTypeName = bi.TicketType.Name,
                            quantity = bi.Quantity,
                            unitPrice = bi.UnitPrice,
                            totalPrice = bi.Quantity * bi.UnitPrice
                        })
                    })
                    .FirstOrDefaultAsync();

                if (cart == null)
                {
                    return Ok(new { message = "Cart is empty", cart = (object?)null });
                }

                return Ok(cart);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching cart", error = ex.Message });
            }
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var booking = await _context.Bookings
                    .Include(b => b.BookingItems)
                        .ThenInclude(bi => bi.TicketType)
                    .FirstOrDefaultAsync(b => b.Id == request.BookingId && b.UserId == userId);

                if (booking == null)
                {
                    return NotFound(new { message = "Booking not found" });
                }

                if (booking.Status != "Pending")
                {
                    return BadRequest(new { message = "Booking is not pending" });
                }

                if (booking.ExpiresAt < DateTime.UtcNow)
                {
                    booking.Status = "Expired";
                    await _context.SaveChangesAsync();
                    return BadRequest(new { message = "Booking has expired" });
                }

                // Create payment record
                var payment = new Payment
                {
                    BookingId = booking.Id,
                    PaymentMethod = request.PaymentMethod,
                    Amount = booking.TotalAmount,
                    Status = "Pending"
                };

                if (request.PaymentMethod == "MoneyMarket")
                {
                    payment.ReferenceCode = GenerateReferenceCode();
                }

                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Checkout initiated successfully",
                    paymentId = payment.Id,
                    referenceCode = payment.ReferenceCode,
                    amount = payment.Amount,
                    paymentMethod = payment.PaymentMethod
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during checkout", error = ex.Message });
            }
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUserBookings()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var bookings = await _context.Bookings
                    .Include(b => b.BookingItems)
                        .ThenInclude(bi => bi.TicketType)
                            .ThenInclude(tt => tt.Event)
                    .Include(b => b.Payment)
                    .Where(b => b.UserId == userId)
                    .OrderByDescending(b => b.BookingDate)
                    .Select(b => new
                    {
                        id = b.Id,
                        bookingDate = b.BookingDate,
                        totalAmount = b.TotalAmount,
                        status = b.Status,
                        expiresAt = b.ExpiresAt,
                        payment = b.Payment != null ? new
                        {
                            id = b.Payment.Id,
                            method = b.Payment.PaymentMethod,
                            status = b.Payment.Status,
                            referenceCode = b.Payment.ReferenceCode,
                            paidAt = b.Payment.PaidAt
                        } : null,
                        items = b.BookingItems.Select(bi => new
                        {
                            eventTitle = bi.TicketType.Event.Title,
                            eventDate = bi.TicketType.Event.StartDateTime,
                            ticketTypeName = bi.TicketType.Name,
                            quantity = bi.Quantity,
                            unitPrice = bi.UnitPrice,
                            totalPrice = bi.Quantity * bi.UnitPrice
                        })
                    })
                    .ToListAsync();

                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching bookings", error = ex.Message });
            }
        }

        [HttpDelete("cart/{bookingId}")]
        public async Task<IActionResult> RemoveFromCart(Guid bookingId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var booking = await _context.Bookings
                    .FirstOrDefaultAsync(b => b.Id == bookingId && b.UserId == userId && b.Status == "Pending");

                if (booking == null)
                {
                    return NotFound(new { message = "Booking not found" });
                }

                _context.Bookings.Remove(booking);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cart cleared successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while clearing cart", error = ex.Message });
            }
        }

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : null;
        }

        private string GenerateReferenceCode()
        {
            return $"MMH{DateTime.UtcNow:yyyyMMdd}{Random.Shared.Next(1000, 9999)}";
        }
    }

    public class AddToCartRequest
    {
        public Guid TicketTypeId { get; set; }
        public int Quantity { get; set; }
    }

    public class CheckoutRequest
    {
        public Guid BookingId { get; set; }
        public string PaymentMethod { get; set; } = string.Empty; // Card, MoneyMarket
    }
}

