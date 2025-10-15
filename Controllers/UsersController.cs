using EventBookingSystem.Data;
using EventBookingSystem.Models;
using EventBookingSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EventBookingSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITicketPdfService _pdfService;

        public UsersController(ApplicationDbContext context, ITicketPdfService pdfService)
        {
            _context = context;
            _pdfService = pdfService;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var userProfile = new
                {
                    id = user.Id,
                    firstName = user.FirstName,
                    middleName = user.MiddleName,
                    lastName = user.LastName,
                    email = user.Email,
                    phoneNumber = user.PhoneNumber,
                    gender = user.Gender,
                    streetAddress = user.StreetAddress,
                    city = user.City,
                    postalCode = user.PostalCode,
                    country = user.Country,
                    role = user.Role,
                    createdAt = user.CreatedAt
                };

                return Ok(userProfile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching user profile", error = ex.Message });
            }
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                user.FirstName = request.FirstName;
                user.MiddleName = request.MiddleName;
                user.LastName = request.LastName;
                user.PhoneNumber = request.PhoneNumber;
                user.Gender = request.Gender;
                user.StreetAddress = request.StreetAddress;
                user.City = request.City;
                user.PostalCode = request.PostalCode;
                user.Country = request.Country;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Profile updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating profile", error = ex.Message });
            }
        }

        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
                {
                    return BadRequest(new { message = "Current password is incorrect" });
                }

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Password changed successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while changing password", error = ex.Message });
            }
        }

        [HttpGet("bookings")]
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
                            eventLocation = bi.TicketType.Event.LocationCity,
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

        [HttpGet("bookings/{bookingId}/ticket")]
        public async Task<IActionResult> DownloadTicket(Guid bookingId)
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
                            .ThenInclude(tt => tt.Event)
                    .Include(b => b.Payment)
                    .FirstOrDefaultAsync(b => b.Id == bookingId && b.UserId == userId);

                if (booking == null)
                {
                    return NotFound(new { message = "Booking not found" });
                }

                if (booking.Status != "Confirmed")
                {
                    return BadRequest(new { message = "Ticket can only be downloaded for confirmed bookings" });
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var eventDetails = booking.BookingItems.FirstOrDefault()?.TicketType?.Event;
                if (eventDetails == null)
                {
                    return BadRequest(new { message = "Event details not found" });
                }

                var pdfBytes = _pdfService.GenerateTicketPdf(booking, user, eventDetails, booking.BookingItems.ToList());

                var fileName = $"Ticket_{eventDetails.Title.Replace(" ", "_")}_{booking.Id}.pdf";
                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while generating ticket", error = ex.Message });
            }
        }

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : null;
        }
    }

    public class UpdateProfileRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string? MiddleName { get; set; }
        public string LastName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string StreetAddress { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}

