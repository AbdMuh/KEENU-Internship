using Xunit;
using Task01.Model;
using Task01.Data;
using UserApi.Controllers;
using UserApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace TestProject.Controllers
{
    public class UsersControllerTests
    {
        private readonly UsersController _controller;
        private readonly UserService _userService;
        private readonly ApplicationDBContext _context;

        public UsersControllerTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDBContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDBContext(options);

            var userRole = new UserRole
            {
                Id = 1,
                name = "User",
                Permissions = new List<UserPermission>()
            };

            _context.Roles.Add(userRole);
            _context.SaveChanges();

            var user = new User
            {
                Id = 1,
                Name = "Test",
                Email = "test@example.com",
                Balance = 1000,
                loginUser = new LoginUser
                {
                    Id = 1,
                    Username = "test123",
                    Password = "123456",
                    Role = userRole,
                    RoleId = userRole.Id,
                    UserId = 1
                }
            };

            user.loginUser.User = user;

            _context.Users.Add(user);
            _context.LoginUsers.Add(user.loginUser);
            _context.SaveChanges();

            _userService = new UserService(_context);
            _controller = new UsersController(_userService);
        }

        [Fact]
        public void GetAll_ReturnsAllUsers()
        {
            var result = _controller.GetAll();
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var users = Assert.IsAssignableFrom<IEnumerable<User>>(okResult.Value);
            Assert.Single(users);
        }

        [Fact]
        public void GetById_Found()
        {
            var result = _controller.GetById(1);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var user = Assert.IsType<User>(okResult.Value);
            Assert.Equal("Test", user.Name);
        }

        [Fact]
        public void GetById_NotFound()
        {
            var result = _controller.GetById(99);
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal("User not found.", notFoundResult.Value);
        }

        [Fact]
        public void Create_ReturnsCreated()
        {
            var role = _context.Roles.FirstOrDefault(r => r.name == "User");

            var userData = new User
            {
                Id = 2,
                Name = "Test2",
                Email = "test2@example.com",
                loginUser = new LoginUser
                {
                    Username = "test2",
                    Password = "123456",
                    Role = role,
                    RoleId = role.Id
                }
            };

            var result = _controller.Create(userData);
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdUser = Assert.IsType<User>(createdResult.Value);
            Assert.Equal("Test2", createdUser.Name);
        }

        [Fact]
        public void GetBalance_ValidUser_ReturnsBalance()
        {
            var user = _context.Users.First();

            var httpContext = new DefaultHttpContext();
            httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            }));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            };

            var result = _controller.GetBalance();
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(user.Balance, okResult.Value);
        }

        [Fact]
        public void Delete_ValidUser_ReturnsOk()
        {
            var result = _controller.Delete(1);
            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("User with ID: 1 deleted Successfully", ok.Value);
        }

        [Fact]
        public void Delete_InvalidUser_ReturnsNotFound()
        {
            var result = _controller.Delete(99);
            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("User with ID 99 not found.", notFound.Value);
        }

        [Fact]
        public void Update_ValidUser_ReturnsUpdatedUser()
        {
            var updateUser = new User
            {
                Id = 1,
                Name = "John Updated",
                Email = "john.new@example.com",
                loginUser = _context.Users.First().loginUser
            };

            var result = _controller.Update(1, updateUser);
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var updatedUser = Assert.IsType<User>(ok.Value);
            Assert.Equal("John Updated", updatedUser.Name);
        }
    }
}
