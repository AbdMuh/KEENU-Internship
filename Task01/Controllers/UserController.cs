using Microsoft.AspNetCore.Authorization;
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
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)] //disabling cache
        public ActionResult<IEnumerable<User>> GetAll()
        {
            var users = _userService.GetAllUsers();
            return Ok(users);
            //return Ok($"Useres Loaded at: {DateTime.UtcNow}");
        }

        [Authorize(Roles = "Admin,Manager")]
        [HttpGet("admin")]
        public IActionResult GetSecureAdminData()
        {
            var name = User.Identity?.Name;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            //var username = User.FindFirst("Username")?.Value;  since used custom claim 
            return Ok($"Welcome Mr.{name}, your  is {email}");
        }

        [Authorize(Roles = "User")]
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
            user.loginUser.Role = "User";
            if (user == null ||
                string.IsNullOrWhiteSpace(user.Name) ||  
                string.IsNullOrWhiteSpace(user.Email) ||
                user.loginUser == null ||
                string.IsNullOrWhiteSpace(user.loginUser.Username) ||
                string.IsNullOrWhiteSpace(user.loginUser.Password) ||
                string.IsNullOrWhiteSpace(user.loginUser.Role))
            {
                return BadRequest("Invalid user or login data.");
            }
            _userService.CreateUser(user); // Make sure this saves both user & login
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }


        [HttpDelete("delete/{id}")]
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
        public ActionResult<User> Update(int id, [FromBody] User user)
        {
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
