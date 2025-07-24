using Task01.Model;

namespace UserApi.Services
{
    public interface IUserService
    {
        void CreateUser(User user);
        void DeleteUser(int id);
        User? FindUserByEmail(string email);
        IEnumerable<User> GetAllUsers();
        User? GetUserById(int id);
        User? UpdateUser(User user);
        UserRole GetUserRole(string roleName);
    }
}