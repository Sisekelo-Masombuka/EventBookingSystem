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
    public class FavoritesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FavoritesController(ApplicationDbContext context)
        {
            _context = context;
        }

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : null;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyFavorites()
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "User not authenticated" });

            var favorites = await _context.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Event)
                .Select(f => new {
                    id = f.Id,
                    eventId = f.EventId,
                    createdAt = f.CreatedAt,
                    eventTitle = f.Event!.Title,
                    category = f.Event.Category,
                    city = f.Event.LocationCity,
                    startDateTime = f.Event.StartDateTime,
                    posterUrl = f.Event.PosterUrl
                })
                .ToListAsync();

            return Ok(favorites);
        }

        [HttpPost("{eventId}")]
        public async Task<IActionResult> AddFavorite(Guid eventId)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "User not authenticated" });

            var exists = await _context.Favorites.AnyAsync(f => f.UserId == userId && f.EventId == eventId);
            if (exists) return BadRequest(new { message = "Event already in favorites" });

            var ev = await _context.Events.FindAsync(eventId);
            if (ev == null) return NotFound(new { message = "Event not found" });

            _context.Favorites.Add(new Favorite { UserId = userId.Value, EventId = eventId });
            await _context.SaveChangesAsync();
            return Ok(new { message = "Added to favorites" });
        }

        [HttpDelete("{eventId}")]
        public async Task<IActionResult> RemoveFavorite(Guid eventId)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { message = "User not authenticated" });

            var fav = await _context.Favorites.FirstOrDefaultAsync(f => f.UserId == userId && f.EventId == eventId);
            if (fav == null) return NotFound(new { message = "Favorite not found" });

            _context.Favorites.Remove(fav);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Removed from favorites" });
        }
    }
}
