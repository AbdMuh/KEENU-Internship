using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Task01.Data;
using Task01.Model;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace Task01.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class TransactionController : ControllerBase
    {

        ApplicationDBContext _context;
        public TransactionController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpPost("transfer")]
        public async Task<IActionResult> Transfer([FromBody] TransactionRequest request)
        {
            if (request == null || request.Amount <= 0)
            {
                return BadRequest("Invalid transaction request.");
            }
            var senderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine($"Sender ID: {int.Parse(senderId)}");
            if (senderId == null)
            {
                return Unauthorized("User not authenticated.");
            }


            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var sender = _context.Users.Find(int.Parse(senderId));

                if (sender.Balance < request.Amount)
                {
                    return BadRequest("Insufficient balance in Account");
                }
                var receiver = _context.Users.Find(request.receiverId);
                Console.WriteLine($"Reciever ID: {request.receiverId}");
                if (receiver == null)
                {
                    return NotFound("Receiver not found.");
                }
                sender.Balance -= request.Amount;
                //throw new DbUpdateException("Not able to Update Database");
                receiver.Balance += request.Amount;

                _context.Transactions.Add(new Transaction
                {
                    SenderId = sender.Id,
                    ReceiverId = receiver.Id,
                    Amount = request.Amount,
                    TransactionDate = DateTime.Now
                });

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok($"Amount: {request.Amount} Successfully sent to: {receiver.Name}");


            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Transaction failed. Error: {ex.Message}");
            }

}
           

        [HttpGet("get/{id}")]
        public ActionResult<IEnumerable<TransactionSummary>> GetUserTransactions(int id)
        {
            var transactions = _context.Transactions
                .Where(t => t.SenderId == id || t.ReceiverId == id)
                .Include(t => t.Sender)
                .Include(t => t.Receiver)
                .OrderByDescending(t => t.TransactionDate)
                .Select(t => new TransactionSummary
                {
                    SenderName = t.Sender.Name,
                    ReceiverName = t.Receiver.Name,
                    Amount = t.Amount,
                    TransactionDate = t.TransactionDate
                })
                .ToList();

            if (transactions == null || !transactions.Any())
            {
                return NotFound("No Transactions Found");

            }

            return Ok(transactions);
        }


    }
}
