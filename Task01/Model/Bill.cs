using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Task01.Model
{
    public class Bill
    {
        
        public int id { get; set; }

        [Required]
        public required string challanNumber { get; set; }

        [Required]
        [Column(TypeName="decimal(10,2)")]
        public decimal amount { get; set; }

        [Required]
        public DateTime dueDate { get; set; }

        [Required]
        public string status { get; set; } = "Pending";

        [Required]
        public  required string Description { get; set; }

        public int? UserId { get; set; }

        public User? user { get; set; }

    }
}
