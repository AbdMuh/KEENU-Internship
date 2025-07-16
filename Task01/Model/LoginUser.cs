// LoginUser.cs
using System.Text.Json.Serialization;

namespace Task01.Model
{
    public class LoginUser
    {
        public int Id { get; set; }  // Primary key

        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; }

        public int UserId { get; set; }  // FK to User

        [JsonIgnore]
        public User? User { get; set; }  // Navigation property (inverse)
    }
}
