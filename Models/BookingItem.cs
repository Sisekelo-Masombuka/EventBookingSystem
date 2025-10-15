using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventBookingSystem.Models
{
    public class BookingItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        public Guid BookingId { get; set; }
        
        [Required]
        public Guid TicketTypeId { get; set; }
        
        [Required]
        public int Quantity { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }
        
        // Navigation properties
        [ForeignKey("BookingId")]
        public virtual Booking Booking { get; set; } = null!;
        
        [ForeignKey("TicketTypeId")]
        public virtual TicketType TicketType { get; set; } = null!;
    }
}

