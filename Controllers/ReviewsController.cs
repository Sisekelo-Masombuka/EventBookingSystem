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
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : null;
        }

        // Public: list reviews for an event
        [HttpGet("event/{eventId}")]
        public async Task<IActionResult> GetEventReviews(Guid eventId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.EventId == eventId)
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new {
                    id = r.Id,
                    user = new { id = r.UserId, name = r.User!.FirstName + " " + r.User!.LastName },
                    rating = r.Rating,
                    comment = r.Comment,
                    createdAt = r.CreatedAt
                })
                .ToListAsync();

            var avg = reviews.Count > 0 ? reviews.Average(r => (double)r.rating) : 0.0;
            return Ok(new { averageRating = avg, count = reviews.Count, reviews });
        }

        // Auth: add/update review (upsert per user/event)
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UpsertReview([FromBody] CreateReviewRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "User not authenticated" });

            // Ensure event exists
            var ev = await _context.Events.FindAsync(request.EventId);
            if (ev == null) return NotFound(new { message = "Event not found" });

            var existing = await _context.Reviews.FirstOrDefaultAsync(r => r.UserId == userId && r.EventId == request.EventId);
            if (existing == null)
            {
                var review = new Review
                {
                    UserId = userId.Value,
                    EventId = request.EventId,
                    Rating = request.Rating,
                    Comment = request.Comment
                };
                _context.Reviews.Add(review);
            }
            else
            {
                existing.Rating = request.Rating;
                existing.Comment = request.Comment;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Review saved" });
        }

        // Auth: delete own review
        [HttpDelete("{reviewId}")]
        [Authorize]
        public async Task<IActionResult> DeleteReview(Guid reviewId)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "User not authenticated" });

            var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId && r.UserId == userId);
            if (review == null) return NotFound(new { message = "Review not found" });

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Review deleted" });
        }
    }

    public class CreateReviewRequest
    {
        public Guid EventId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
