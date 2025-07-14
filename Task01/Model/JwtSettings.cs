namespace Task01.Model
{
    public class JwtSettings
    {
        public required string key { get; set; } 
        public required string Issuer { get; set; }
        public required string Audience { get; set; }
        public int Expiration { get; set; } = 30;
    }
}
