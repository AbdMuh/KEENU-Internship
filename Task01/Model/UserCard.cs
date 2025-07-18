

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Task01.Model
{
    public class UserCard
    {
        public int Id { get; set; }
        public required string HolderName { get; set; }

        public required string CardNumber { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public required DateTime ExpirationDate { get; set; }

        public int SetAsDefault { get; set; } = 0;

        public int UserId { get; set; }

        public required User User { get; set; }


    }
}
