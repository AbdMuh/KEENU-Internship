using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Task01.Controllers;
using Task01.Data;
using Task01.Model;
using Xunit;

namespace TestProject.Controllers
{
    public class AuthControllerTests
    {

        private AuthController AuthControllerSetup ()
        {
            var options = new DbContextOptionsBuilder<ApplicationDBContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            var context = new ApplicationDBContext(options);

            //Seeding data
            var role = new UserRole
            {
               Id = 1,
               name = "Admin",
               Permissions = new List<UserPermission>
               {
                   new UserPermission { Id = 1, Name = "view_users" },
                   new UserPermission { Id = 2, Name = "edit_users" }
               }

            };

            var User = new User
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
                    Role = role,
                    RoleId = role.Id,
                    UserId = 1
                }
            };


            var loginUser = User.loginUser;

            context.Users.Add(User);
            context.LoginUsers.Add(loginUser);
            context.Roles.Add(role);
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
        public void Login_BadRequest()
        {
            var controller = AuthControllerSetup();
            var result = controller.Login(null);
            var badRequest = Assert.IsType<BadRequestObjectResult>(result); // checking response type
            Assert.Equal("Invalid login request.", badRequest.Value); // checking response type
        }

        [Fact]
        public void Login_Unauthorized()
        {
            var controller = AuthControllerSetup();
            var loginData = new CurrentLogin
            {
                username = "wrongUser",
                password = "wrongPassword"
            };
            var result = controller.Login(loginData);
            var badRequest = Assert.IsType<UnauthorizedObjectResult>(result); // checking response type
            Assert.Equal("Invalid credentials.", badRequest.Value); // checking response message
        }

        [Fact]
        public void Login_ValidCredentials_ReturnToken()
        {
            var controller = AuthControllerSetup();
            var loginData = new CurrentLogin
            {
                username = "test123",
                password = "123456"
            };
            var result = controller.Login(loginData);
            var okResult = Assert.IsType<OkObjectResult>(result);
            var data = okResult.Value?.GetType().GetProperty("token")?.GetValue(okResult.Value);
            Assert.NotNull(data);
        }

        [Fact]
        public async Task Logout_NoToken_ReturnsUnauthorized()
        {
            var controller = AuthControllerSetup();
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            var result = await controller.Logout();
            var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("No token provided.", unauthorized.Value);
        }

        [Fact]
        public async Task Logout_ValidToken_ReturnsOk()
        {
            var controller = AuthControllerSetup();
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            var loginData = new CurrentLogin
            {
                username = "test123",
                password = "123456"
            };
            var loginResult = controller.Login(loginData);
            var okResult = Assert.IsType<OkObjectResult>(loginResult);
            var token = okResult.Value?.GetType().GetProperty("token")?.GetValue(okResult.Value)?.ToString();
            Assert.False(string.IsNullOrEmpty(token));
            controller.ControllerContext.HttpContext.Request.Headers["Authorization"] = $"Bearer {token}";
            var result = await controller.Logout();
            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Successfully logged out.", ok.Value);
        }
        }

}
