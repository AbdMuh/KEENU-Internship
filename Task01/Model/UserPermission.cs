namespace Task01.Model
{
    public class UserPermission
    {
        public int Id { get; set; }
        public required string Name { get; set; }

        public List<UserRole> Roles { get; set; } = new();
    }
}
