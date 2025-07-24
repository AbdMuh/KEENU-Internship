namespace Task01.Model
{
    public class UserRole
    {
        public int Id { get; set; }

        public required string name { get; set; }
        public List<UserPermission> Permissions { get; set; } = new();
    }
}
    