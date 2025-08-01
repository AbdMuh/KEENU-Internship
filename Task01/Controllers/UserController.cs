using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Task01.Model;
using UserApi.Services;

namespace UserApi.Controllers
{
    [ApiController]
    [Route("[controller]")]

    [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any, NoStore = false)]
    public class UsersController : ControllerBase
    {

        private readonly IUserService _userService;
        public UsersController(IUserService userService)
        {
            _userService = userService;
        }


        [HttpGet]
        [Authorize]
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)] //disabling cache
        public ActionResult<IEnumerable<User>> GetAll()
        {
            var users = _userService.GetAllUsers();
            return Ok(users);
            //return Ok($"Useres Loaded at: {DateTime.UtcNow}");
        }

        [HttpGet("getBalance")]
        [Authorize]
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]

        public ActionResult<decimal> GetBalance()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("User not authenticated.");
            }

            decimal balance = _userService.GetUserBalance(int.Parse(userId));
            return Ok(Math.Round(balance, 2));
        }


        //[Authorize(Roles = "Admin,Manager")]
        [Authorize(Policy = "CanEditUsers")]
        [HttpGet("admin")]
        public IActionResult GetSecureAdminData()
        {
            var name = User.Identity?.Name;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            //var username = User.FindFirst("Username")?.Value;  since used custom claim 
            return Ok($"Welcome Mr.{name}, your  is {email}");
        }

        [HttpGet("getNames")]

        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
        public ActionResult<IEnumerable<TransferUserDTO>> GetNames()
        {
            var senderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (senderId == null)
            {
                return Unauthorized("User not authenticated.");
            }

            var users = _userService.GetTransferUsers(int.Parse(senderId));

            if (users == null || !users.Any())
                return NotFound("No Users Present");

            return Ok(users);
        }


        [Authorize(Policy = "CanViewUsers")]
        [HttpGet("user")]
        public IActionResult GetSecureUserData()
        {
            return Ok("This is User only data");
        }

        [HttpGet("keyCrash")]
        [ResponseCache(NoStore = true)]
        public IActionResult KeyCrash()
        {
            throw new KeyNotFoundException("This is a test crash.");
        }

        [HttpGet("serverCrash")]
        public IActionResult ServerCrash()
        {
            throw new Exception("This is a test crash.");
        }


        [HttpPost]
        public ActionResult<User> Create([FromBody] User user)
        {
            Console.WriteLine($"Creating user: {user.loginUser.Username}, Email: {user.Email}");

            var role = _userService.GetUserRole("User");
            if (role == null)
                return BadRequest("Default role 'User' not found.");

            // Assign full role object
            user.loginUser.Role = role;

            if (user == null ||
                string.IsNullOrWhiteSpace(user.Name) ||
                string.IsNullOrWhiteSpace(user.Email) ||
                user.loginUser == null ||
                string.IsNullOrWhiteSpace(user.loginUser.Username) ||
                string.IsNullOrWhiteSpace(user.loginUser.Password))
            {
                return BadRequest("Invalid user or login data.");
            }

            _userService.CreateUser(user);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }


        [HttpDelete("delete/{id}")]
        [Authorize(Policy = "CanEditUsers")]
        public ActionResult Delete(int id)
        {
            try
            {
                _userService.DeleteUser(id);
                return Ok($"User with ID: {id} deleted Successfully"); // 204 No Content
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message); // 404 Not Found
            }
        }
        [HttpGet("{id}")]
        public ActionResult<User> GetById(int id)
        {
            var user = _userService.GetUserById(id);
            return user == null ? NotFound("User not found.") : Ok(user);
        }

        [HttpPut("update/{id}")]
        [Authorize(Policy = "CanEditUsers")]
        public ActionResult<User> Update(int id, [FromBody] User user)
        {
            Console.WriteLine("Entering Update");
            if (user == null)
                return BadRequest("Request body is null.");

            if (user.Id == 0)
            {
                user.Id = id;
            }
            else if (id != user.Id)
            {
                return BadRequest("Route ID does not match body ID.");
            }

            var existingUser = _userService.GetUserById(id);
            if (existingUser == null)
                return NotFound("User not found.");

            var updatedUser = _userService.UpdateUser(user);
            if (updatedUser == null)
                throw new Exception("Server error: Failed to update user.");

            return Ok(updatedUser);
        }

    }
}
