using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventBookingSystem.Models
{
    public class TicketType
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        public Guid EventId { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty; // General, VIP, Early Bird, etc.
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        [Required]
        public int QuantityAvailable { get; set; }
        
        public int QuantitySold { get; set; } = 0;
        
        public bool IsActive { get; set; } = true;
        
        // Navigation properties
        [ForeignKey("EventId")]
        public virtual Event Event { get; set; } = null!;
        
        public virtual ICollection<BookingItem> BookingItems { get; set; } = new List<BookingItem>();
    }
}

