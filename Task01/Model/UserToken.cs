namespace Task01.Model
{
    public class UserToken
    {
        public int Id { get; set; }
        public required string Token { get; set; }
        public bool IsActive { get; set; } = true;
        public required DateTime Expiration { get; set; }
        public int UserId { get; set; }

        public User User { get; set; }
    }
}
