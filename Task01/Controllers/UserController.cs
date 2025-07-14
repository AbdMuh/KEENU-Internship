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
        public ActionResult<IEnumerable<User>> GetAll()
        {
            var users = _userService.GetAllUsers();
            //return Ok(users);
            return Ok($"Useres Loaded at: {DateTime.UtcNow}");
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
            if (user == null || string.IsNullOrWhiteSpace(user.Name) || string.IsNullOrWhiteSpace(user.Email))
            {
                return BadRequest("Invalid user data.");
            }
            _userService.CreateUser(user);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        [HttpGet("{id}")]
        public ActionResult<User> GetById(int id)
        {
            var user = _userService.GetUserById(id);
            return user == null ? NotFound("User not found.") : Ok(user);
        }

        [HttpGet("find")]
        public ActionResult<User> FindByEmail([FromQuery] string email)
        {
            var user = _userService.FindUserByEmail(email);
            return user == null ? NotFound("User not found.") : Ok(user);
        }
    }
}
