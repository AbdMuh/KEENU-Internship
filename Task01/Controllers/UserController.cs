using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Task01.Model;
using UserApi.Services;

namespace UserApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
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
            return Ok(users);
        }

        [Authorize]
        [HttpGet("secure")]
        public IActionResult GetSecureData()
        {
            return Ok("This is protected data.");
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
