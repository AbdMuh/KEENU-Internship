using Microsoft.AspNetCore.Mvc;
using Task01.Model;

namespace UserApi.Services
{
    public class UserService : IUserService
    {
        private static List<User> users = new()
        {
            new User { Id = 1, Name = "Alice", Email = "alice@example.com" },
            new User { Id = 2, Name = "Bob", Email = "bob@example.com" }
        };

        public IEnumerable<User> GetAllUsers()
        {
            return users;
        }

        public User? GetUserById(int id)
        {
            var user = users.FirstOrDefault(u => u.Id == id);
            return user;
        }

        public User? FindUserByEmail(string email)
        {
            var user = users.FirstOrDefault(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
            return user;
        }

        public void CreateUser(User user)
        {
            user.Id = users.Max(u => u.Id) + 1;
            users.Add(user);
        }

        public void UpdateUser(User user)
        {
            throw new NotImplementedException();
        }

        public void DeleteUser(int id)
        {
            throw new NotImplementedException();
        }
    }

}
