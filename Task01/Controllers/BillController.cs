// Controllers/BillController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Task01.Model;
using Task01.Service;

namespace Task01.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class BillController : ControllerBase
    {
        private readonly IBillService _billService;

        public BillController(IBillService billService)
        {
            _billService = billService;
        }

        [HttpGet("byChallan/{challanNumber}")]
        public ActionResult<Bill> GetByChallan(string challanNumber)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized("User not authenticated");
            }
            var bill = _billService.GetBillByChallan(challanNumber, userId.Value);
            if (bill == null)
                return NotFound("No pending bill found with this challan number.");

            return Ok(bill);
        }

        [HttpGet("outstanding")]
        public ActionResult<IEnumerable<Bill>> GetOutstanding()
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized("User not authenticated.");

            var bills = _billService.GetOutstandingBills(userId.Value);
            return Ok(bills);
        }

        [HttpGet("cleared")]
        public ActionResult<IEnumerable<Bill>> GetCleared()
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized("User not authenticated.");

            var bills = _billService.GetClearedBills(userId.Value);
            return Ok(bills);
        }

        [HttpPost("pay/{challanNumber}")]
        public ActionResult<Bill> PayBill(string challanNumber)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized("User not authenticated.");

            var bill = _billService.PayBill(challanNumber, userId.Value);
            if (bill == null)
                return BadRequest("Bill not found, already paid, or insufficient balance.");

            return Ok(bill); 
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null ? int.Parse(claim.Value) : null;
        }
    }
}
