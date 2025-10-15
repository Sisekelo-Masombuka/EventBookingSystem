using System.ComponentModel.DataAnnotations;

namespace EventBookingSystem.Models
{
    public class Event
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty; // Music, Tech, Sport, Other
        
        [Required]
        [MaxLength(100)]
        public string LocationCity { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string Venue { get; set; } = string.Empty;
        
        [Required]
        public DateTime StartDateTime { get; set; }
        
        [Required]
        public DateTime EndDateTime { get; set; }
        
        [MaxLength(500)]
        public string? PosterUrl { get; set; }
        
        [Required]
        public int Capacity { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<TicketType> TicketTypes { get; set; } = new List<TicketType>();
    }
}

