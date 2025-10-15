using EventBookingSystem.Data;
using EventBookingSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EventBookingSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EventsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetEvents(
            [FromQuery] string? city = null,
            [FromQuery] string? category = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] string? search = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.Events
                    .Include(e => e.TicketTypes.Where(t => t.IsActive))
                    .AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(city))
                {
                    query = query.Where(e => e.LocationCity.ToLower().Contains(city.ToLower()));
                }

                if (!string.IsNullOrEmpty(category))
                {
                    query = query.Where(e => e.Category.ToLower() == category.ToLower());
                }

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(e => e.Title.ToLower().Contains(search.ToLower()) ||
                                           e.Description.ToLower().Contains(search.ToLower()));
                }

                // Apply price filter
                if (minPrice.HasValue || maxPrice.HasValue)
                {
                    query = query.Where(e => e.TicketTypes.Any(t => t.IsActive && 
                        (!minPrice.HasValue || t.Price >= minPrice.Value) &&
                        (!maxPrice.HasValue || t.Price <= maxPrice.Value)));
                }

                // Get total count
                var totalCount = await query.CountAsync();

                // Apply pagination
                var events = await query
                    .OrderBy(e => e.StartDateTime)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(e => new
                    {
                        id = e.Id,
                        title = e.Title,
                        description = e.Description,
                        category = e.Category,
                        locationCity = e.LocationCity,
                        venue = e.Venue,
                        startDateTime = e.StartDateTime,
                        endDateTime = e.EndDateTime,
                        posterUrl = e.PosterUrl,
                        capacity = e.Capacity,
                        minPrice = e.TicketTypes.Where(t => t.IsActive).Min(t => t.Price),
                        maxPrice = e.TicketTypes.Where(t => t.IsActive).Max(t => t.Price),
                        ticketTypes = e.TicketTypes.Where(t => t.IsActive).Select(t => new
                        {
                            id = t.Id,
                            name = t.Name,
                            price = t.Price,
                            quantityAvailable = t.QuantityAvailable,
                            quantitySold = t.QuantitySold
                        })
                    })
                    .ToListAsync();

                return Ok(new
                {
                    events,
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
                return StatusCode(500, new { message = "An error occurred while fetching events", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEvent(Guid id)
        {
            try
            {
                var eventEntity = await _context.Events
                    .Include(e => e.TicketTypes.Where(t => t.IsActive))
                    .FirstOrDefaultAsync(e => e.Id == id);

                if (eventEntity == null)
                {
                    return NotFound(new { message = "Event not found" });
                }

                var eventDetails = new
                {
                    id = eventEntity.Id,
                    title = eventEntity.Title,
                    description = eventEntity.Description,
                    category = eventEntity.Category,
                    locationCity = eventEntity.LocationCity,
                    venue = eventEntity.Venue,
                    startDateTime = eventEntity.StartDateTime,
                    endDateTime = eventEntity.EndDateTime,
                    posterUrl = eventEntity.PosterUrl,
                    capacity = eventEntity.Capacity,
                    ticketTypes = eventEntity.TicketTypes.Select(t => new
                    {
                        id = t.Id,
                        name = t.Name,
                        price = t.Price,
                        quantityAvailable = t.QuantityAvailable,
                        quantitySold = t.QuantitySold,
                        isSoldOut = t.QuantityAvailable <= t.QuantitySold
                    })
                };

                return Ok(eventDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching event details", error = ex.Message });
            }
        }

        [HttpGet("cities")]
        public async Task<IActionResult> GetCities()
        {
            try
            {
                var cities = await _context.Events
                    .Select(e => e.LocationCity)
                    .Distinct()
                    .OrderBy(c => c)
                    .ToListAsync();

                return Ok(cities);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching cities", error = ex.Message });
            }
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categories = await _context.Events
                    .Select(e => e.Category)
                    .Distinct()
                    .OrderBy(c => c)
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching categories", error = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventRequest request)
        {
            try
            {
                var eventEntity = new Event
                {
                    Title = request.Title,
                    Description = request.Description,
                    Category = request.Category,
                    LocationCity = request.LocationCity,
                    Venue = request.Venue,
                    StartDateTime = request.StartDateTime,
                    EndDateTime = request.EndDateTime,
                    PosterUrl = request.PosterUrl,
                    Capacity = request.Capacity
                };

                _context.Events.Add(eventEntity);
                await _context.SaveChangesAsync();

                // Add ticket types
                foreach (var ticketType in request.TicketTypes)
                {
                    var newTicketType = new TicketType
                    {
                        EventId = eventEntity.Id,
                        Name = ticketType.Name,
                        Price = ticketType.Price,
                        QuantityAvailable = ticketType.QuantityAvailable,
                        IsActive = true
                    };
                    _context.TicketTypes.Add(newTicketType);
                }

                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetEvent), new { id = eventEntity.Id }, new
                {
                    message = "Event created successfully",
                    eventId = eventEntity.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating event", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEvent(Guid id, [FromBody] UpdateEventRequest request)
        {
            try
            {
                var eventEntity = await _context.Events.FindAsync(id);
                if (eventEntity == null)
                {
                    return NotFound(new { message = "Event not found" });
                }

                eventEntity.Title = request.Title;
                eventEntity.Description = request.Description;
                eventEntity.Category = request.Category;
                eventEntity.LocationCity = request.LocationCity;
                eventEntity.Venue = request.Venue;
                eventEntity.StartDateTime = request.StartDateTime;
                eventEntity.EndDateTime = request.EndDateTime;
                eventEntity.PosterUrl = request.PosterUrl;
                eventEntity.Capacity = request.Capacity;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Event updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating event", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEvent(Guid id)
        {
            try
            {
                var eventEntity = await _context.Events.FindAsync(id);
                if (eventEntity == null)
                {
                    return NotFound(new { message = "Event not found" });
                }

                _context.Events.Remove(eventEntity);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Event deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting event", error = ex.Message });
            }
        }
    }

    public class CreateEventRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string LocationCity { get; set; } = string.Empty;
        public string Venue { get; set; } = string.Empty;
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public string? PosterUrl { get; set; }
        public int Capacity { get; set; }
        public List<CreateTicketTypeRequest> TicketTypes { get; set; } = new();
    }

    public class UpdateEventRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string LocationCity { get; set; } = string.Empty;
        public string Venue { get; set; } = string.Empty;
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public string? PosterUrl { get; set; }
        public int Capacity { get; set; }
    }

    public class CreateTicketTypeRequest
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int QuantityAvailable { get; set; }
    }
}

