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
            } else
            {
                var user = _dbContext.LoginUsers
    .Include(l => l.User)
    .FirstOrDefault(u => u.Username == currentLogin.username && u.Password == currentLogin.password);

                if (user == null) {
                    return Unauthorized("Invalid credentials.");

                }
                else
                {
                    var Name = _dbContext.Users
                        .Where(u => u.Id == user.UserId).Select(u => u.Name)
                        .FirstOrDefault();
                    var email = _dbContext.Users.Where(u => u.Id == user.Id).Select(u => u.Email).FirstOrDefault(); //perks of navigation property
                    var role = user.Role;
                    var Username = user.Username;


                    var claims = new[]
                    {
                        new Claim(ClaimTypes.Name, Name),
                        new Claim(ClaimTypes.Role, role),
                        new Claim(ClaimTypes.Email, email),
                        //new Claim("Username", Username) sing custom claim for username
                    };
                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.key)); //atleast 16 characters long
                    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var token = new JwtSecurityToken(
                        issuer: _jwtSettings.Issuer,
                        audience: _jwtSettings.Audience,
                        claims: claims,
                        expires: DateTime.Now.AddMinutes(_jwtSettings.Expiration),
                        signingCredentials: creds);

                    return Ok(new
                    {
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        expiration = DateTime.Now.AddMinutes(_jwtSettings.Expiration),
                        username = Username
                    });
                }

                   
                }
        }
    }
}
