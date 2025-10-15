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
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview()
        {
            try
            {
                var totalEvents = await _context.Events.CountAsync();
                var totalBookings = await _context.Bookings.CountAsync();
                var totalUsers = await _context.Users.CountAsync(u => u.Role == "User");
                var totalRevenue = await _context.Payments
                    .Where(p => p.Status == "Completed")
                    .SumAsync(p => p.Amount);

                var recentBookings = await _context.Bookings
                    .Include(b => b.User)
                    .Include(b => b.BookingItems)
                        .ThenInclude(bi => bi.TicketType)
                            .ThenInclude(tt => tt.Event)
                    .OrderByDescending(b => b.BookingDate)
                    .Take(10)
                    .Select(b => new
                    {
                        id = b.Id,
                        userName = $"{b.User.FirstName} {b.User.LastName}",
                        eventTitle = b.BookingItems.First().TicketType.Event.Title,
                        totalAmount = b.TotalAmount,
                        status = b.Status,
                        bookingDate = b.BookingDate
                    })
                    .ToListAsync();

                var eventStats = await _context.Events
                    .Include(e => e.TicketTypes)
                    .Select(e => new
                    {
                        id = e.Id,
                        title = e.Title,
                        totalTickets = e.TicketTypes.Sum(t => t.QuantityAvailable),
                        soldTickets = e.TicketTypes.Sum(t => t.QuantitySold),
                        revenue = e.TicketTypes.Sum(t => t.QuantitySold * t.Price)
                    })
                    .ToListAsync();

                return Ok(new
                {
                    summary = new
                    {
                        totalEvents,
                        totalBookings,
                        totalUsers,
                        totalRevenue
                    },
                    recentBookings,
                    eventStats
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching overview", error = ex.Message });
            }
        }

        [HttpGet("bookings")]
        public async Task<IActionResult> GetAllBookings(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? status = null)
        {
            try
            {
                var query = _context.Bookings
                    .Include(b => b.User)
                    .Include(b => b.BookingItems)
                        .ThenInclude(bi => bi.TicketType)
                            .ThenInclude(tt => tt.Event)
                    .Include(b => b.Payment)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(b => b.Status == status);
                }

                var totalCount = await query.CountAsync();

                var bookings = await query
                    .OrderByDescending(b => b.BookingDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(b => new
                    {
                        id = b.Id,
                        user = new
                        {
                            id = b.User.Id,
                            name = $"{b.User.FirstName} {b.User.LastName}",
                            email = b.User.Email
                        },
                        totalAmount = b.TotalAmount,
                        status = b.Status,
                        bookingDate = b.BookingDate,
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

                return Ok(new
                {
                    bookings,
                    pagination = new
                    {
                        currentPage = page,
                        pageSize,
                        totalCount,
                        totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching bookings", error = ex.Message });
            }
        }

        [HttpPut("change-password")]
        public async Task<IActionResult> ChangeAdminPassword([FromBody] ChangeAdminPasswordRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { message = "Admin not authenticated" });
                }

                var admin = await _context.Users.FindAsync(userId);
                if (admin == null || admin.Role != "Admin")
                {
                    return NotFound(new { message = "Admin not found" });
                }

                // Verify current password
                if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, admin.PasswordHash))
                {
                    return BadRequest(new { message = "Current password is incorrect" });
                }

                // Update password
                admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Admin password changed successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while changing password", error = ex.Message });
            }
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateAdminProfile([FromBody] UpdateAdminProfileRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { message = "Admin not authenticated" });
                }

                var admin = await _context.Users.FindAsync(userId);
                if (admin == null || admin.Role != "Admin")
                {
                    return NotFound(new { message = "Admin not found" });
                }

                // Update admin profile
                admin.FirstName = request.FirstName;
                admin.LastName = request.LastName;
                admin.Email = request.Email;
                admin.PhoneNumber = request.PhoneNumber;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Admin profile updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating profile", error = ex.Message });
            }
        }

        [HttpPost("bookings/{bookingId}/cancel")]
        public async Task<IActionResult> CancelBooking(Guid bookingId)
        {
            try
            {
                var booking = await _context.Bookings
                    .Include(b => b.BookingItems)
                        .ThenInclude(bi => bi.TicketType)
                    .Include(b => b.Payment)
                    .FirstOrDefaultAsync(b => b.Id == bookingId);

                if (booking == null)
                {
                    return NotFound(new { message = "Booking not found" });
                }

                if (booking.Status == "Cancelled")
                {
                    return BadRequest(new { message = "Booking is already cancelled" });
                }

                // Cancel booking
                booking.Status = "Cancelled";

                // Refund tickets
                foreach (var item in booking.BookingItems)
                {
                    var ticketType = await _context.TicketTypes.FindAsync(item.TicketTypeId);
                    if (ticketType != null)
                    {
                        ticketType.QuantitySold -= item.Quantity;
                    }
                }

                // Update payment status if exists
                if (booking.Payment != null)
                {
                    booking.Payment.Status = "Failed";
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Booking cancelled successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while cancelling booking", error = ex.Message });
            }
        }

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : null;
        }
    }

    public class ChangeAdminPasswordRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class UpdateAdminProfileRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
    }
}

