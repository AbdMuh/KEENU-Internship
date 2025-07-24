using Azure.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
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

        [HttpPost("login")]
        public IActionResult Login([FromBody] CurrentLogin currentLogin)
        {
            if (currentLogin == null || string.IsNullOrEmpty(currentLogin.username) || string.IsNullOrEmpty(currentLogin.password))
            {
                return BadRequest("Invalid login request.");
            }

            // Load user, related User object, Role, and Permissions
            var user = _dbContext.LoginUsers
                .Include(u => u.User)
                .Include(u => u.Role)
                .ThenInclude(r => r.Permissions)
                .FirstOrDefault(u => u.Username == currentLogin.username && u.Password == currentLogin.password);

            if (user == null)
            {
                return Unauthorized("Invalid credentials.");
            }

            // Extract data
            var name = user.User.Name;
            var email = user.User.Email;
            var role = user.Role.name;
            var username = user.Username;
            var permissionNames = user.Role.Permissions.Select(p => p.Name).ToList();

            // Build claims list
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, name),
        new Claim(ClaimTypes.Email, email),
        new Claim(ClaimTypes.Role, role),
        new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString())
    };

            // Add permissions as custom claims
            foreach (var permission in permissionNames)
            {
                claims.Add(new Claim("permissions", permission));
            }

            // Create token
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

            // Return token and additional data
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
