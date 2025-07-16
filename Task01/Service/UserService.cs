using Microsoft.AspNetCore.Mvc;
using Task01.Model;
using Task01.Data;

namespace UserApi.Services
{
    public class UserService : IUserService
    {
        ApplicationDBContext _context;
        public UserService(ApplicationDBContext context)
        {
            _context = context;
        }

        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }

        public User? GetUserById(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            return user;
        }

        public User? FindUserByEmail(string email)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
            return user;
        }

        public void CreateUser(User user)
        {
            _context.Users.Add(user); // loginUser will be saved too
            _context.SaveChanges();
            //user.loginUser.UserId = user.Id; no need if navigation set properly, done automatically 
        }

        public User? UpdateUser(User user)
        {
            var existingUser = _context.Users.Find(user.Id);
            if (existingUser != null)
            {
                existingUser.Name = user.Name;
                existingUser.Email = user.Email;
                _context.SaveChanges();
                return user;
            }
            else
            {
                throw new KeyNotFoundException($"User with ID {user.Id} not found.");
            }
        }

        public void DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            else
            {
                throw new KeyNotFoundException($"User with ID {id} not found.");

            }
        }
    }

}
