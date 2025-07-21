

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Task01.Model
{
    public class UserCard
    {
        public int Id { get; set; }
        public required string HolderName { get; set; }

        [StringLength(16, MinimumLength = 16)]
        public required string CardNumber { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public required DateTime ExpirationDate { get; set; } = new DateTime(2027, 12, 31);

        public int SetAsDefault { get; set; } = 0;

        [Required]
        public int UserId { get; set; }

        [JsonIgnore]
        public User? User { get; set; }



    }
}
