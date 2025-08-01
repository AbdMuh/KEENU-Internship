using Xunit;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Collections.Generic;
using System;
using System.Linq;
using Task01.Controllers;
using Task01.Data;
using Task01.Model;

namespace TestProject.Controllers
{
    public class AuthControllerTests
    {
        private AuthController CreateControllerWithSeededData(out ApplicationDBContext context)
        {
            var options = new DbContextOptionsBuilder<ApplicationDBContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()) // ensures isolation
                .Options;

            context = new ApplicationDBContext(options);

            // Seed data
            var role = new UserRole
            {
                Id = 1,
                name = "User",
                Permissions = new List<UserPermission>
            {
                new UserPermission { Id = 1, Name = "CanView" }
            }
            };

            var loginUser = new LoginUser
            {
                Id = 1,
                Username = "alice",
                Password = "pass",
                Role = role,
                RoleId = role.Id,
            };

            var user = new User
            {
                Id = 1,
                Name = "Alice",
                Email = "alice@example.com",
                Balance = 100,
                loginUser = loginUser // required by model
            };

            loginUser.User = user; // link back


            context.Roles.Add(role);
            context.Users.Add(user);
            context.LoginUsers.Add(loginUser);
            context.SaveChanges();

            var jwtSettings = Options.Create(new JwtSettings
            {
                key = "super_secret_key_for_tests_123456",
                Issuer = "testIssuer",
                Audience = "testAudience",
                Expiration = 60
            });

            return new AuthController(jwtSettings, context);
        }

        [Fact]
        public void Login_InvalidInput_ReturnsBadRequest()
        {
            var controller = CreateControllerWithSeededData(out _);
            var result = controller.Login(null);
            var badResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid login request.", badResult.Value);
        }

        [Fact]
        public void Login_InvalidCredentials_ReturnsUnauthorized()
        {
            var controller = CreateControllerWithSeededData(out _);
            var login = new CurrentLogin { username = "wrong", password = "wrong" };
            var result = controller.Login(login);

            var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Invalid credentials.", unauthorized.Value);
        }

        [Fact]
        public void Login_ValidCredentials_ReturnsToken()
        {
            var controller = CreateControllerWithSeededData(out _);
            var login = new CurrentLogin { username = "alice", password = "pass" };

            var result = controller.Login(login);
            var ok = Assert.IsType<OkObjectResult>(result);

            var response = ok.Value?.GetType().GetProperty("token")?.GetValue(ok.Value);
            Assert.NotNull(response);
        }

        [Fact]
        public async Task Logout_NoToken_ReturnsUnauthorized()
        {
            var controller = CreateControllerWithSeededData(out _);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            var result = await controller.Logout();
            var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("No token provided.", unauthorized.Value);
        }

        [Fact]
        public async Task Logout_ValidToken_LogsOutSuccessfully()
        {
            var controller = CreateControllerWithSeededData(out var context);

            // Login first
            var login = new CurrentLogin { username = "alice", password = "pass" };
            var loginResult = controller.Login(login) as OkObjectResult;
            var token = loginResult?.Value?.GetType().GetProperty("token")?.GetValue(loginResult.Value)?.ToString();
            Assert.False(string.IsNullOrEmpty(token));

            // Set token on HttpContext
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = $"Bearer {token}";
            controller.ControllerContext = new ControllerContext { HttpContext = httpContext };

            // Act
            var result = await controller.Logout();
            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Successfully logged out.", ok.Value);
        }
    }

}
