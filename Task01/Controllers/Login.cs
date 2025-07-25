using Azure.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;
using Task01.Data;
using Task01.Model;

namespace Task01.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly JwtSettings _jwtSettings;
        private readonly ApplicationDBContext _dbContext;

        public AuthController(IOptions<JwtSettings> jwtSettings, ApplicationDBContext dBContext)
        {
            _jwtSettings = jwtSettings.Value;
            _dbContext = dBContext;
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("No token provided.");
            }
            var userToken = await _dbContext.UserTokens
                .FirstOrDefaultAsync(t => t.Token == token);

            if (userToken == null)
            {
                return Unauthorized("Invalid token.");
            }
            userToken.IsActive = false;
            _dbContext.UserTokens.Remove(userToken);

            await _dbContext.SaveChangesAsync();
            return Ok("Successfully logged out.");
        }


        [HttpPost("login")]
        public IActionResult Login([FromBody] CurrentLogin currentLogin)
        {
            Console.WriteLine("Hello User");

            // Validate login input
            if (currentLogin == null || string.IsNullOrEmpty(currentLogin.username) || string.IsNullOrEmpty(currentLogin.password))
            {
                return BadRequest("Invalid login request.");
            }

            // Find the user based on username and password
            var user = _dbContext.LoginUsers
                .Include(u => u.User)
                .Include(u => u.Role)
                .ThenInclude(r => r.Permissions)
                .FirstOrDefault(u => u.Username == currentLogin.username && u.Password == currentLogin.password);

            if (user == null)
            {
                return Unauthorized("Invalid credentials.");
            }

            // Find and deactivate any previously active token for this user
            var loggedInUser = _dbContext.UserTokens
                .Where(t => t.UserId == user.UserId && t.IsActive)
                .FirstOrDefault();

            if (loggedInUser != null)
            {
                loggedInUser.IsActive = false; 
                _dbContext.UserTokens.Remove(loggedInUser);
                _dbContext.SaveChanges();
            }

            // Prepare the claims for the JWT token
            var name = user.User.Name;
            var email = user.User.Email;
            var role = user.Role.name;
            var username = user.Username;
            var permissionNames = user.Role.Permissions.Select(p => p.Name).ToList();

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, name),
        new Claim(ClaimTypes.Email, email),
        new Claim(ClaimTypes.Role, role),
        new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString())
    };

            foreach (var permission in permissionNames)
            {
                claims.Add(new Claim("permissions", permission));
            }

            // Generate the JWT token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiration = DateTime.Now.AddMinutes(_jwtSettings.Expiration);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expiration,
                signingCredentials: creds
            );

            _dbContext.UserTokens.Add(new UserToken
            {
                UserId = user.UserId,
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                IsActive = true, 
                Expiration = expiration
            });
            
            _dbContext.SaveChanges(); 
            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration,
                username,
                id = user.UserId,
                name,
                userRole = role,
                permissions = permissionNames
            });
        }


    }
}
