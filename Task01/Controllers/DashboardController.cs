using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Task01.Model;
using Task01.Service;

namespace Task01.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }


        [HttpGet("get")]
        public ActionResult<UserDashboard> getStats()
        {
            Console.WriteLine("The Get Stats Method is Running");
           var userClaim = User?.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null)
            {
                return Unauthorized("User is not Authenticated");
            }

            int userId = int.Parse(userClaim.Value);
            var userStats = _dashboardService.GetUserStat(userId);
            if (userStats == null)
            {
                return NotFound("User Stats not Found");
            }
            return Ok(userStats);

        }
    }
}
