using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Task01.Data;
using Task01.Model;



namespace Task01.Service
{
    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDBContext _context;

        public DashboardService(ApplicationDBContext context)
        {
            _context = context;
        }

        public UserDashboard GetUserStat(int userId)
        {
            var totalTransactions = _context.Transactions.Where(u => u.ReceiverId == userId || u.SenderId == userId);
            var totalAmountOutgoing = totalTransactions.Where(u => u.SenderId == userId).Sum(u => u.Amount);
            var totalAmountIncoming = totalTransactions.Where(u => u.ReceiverId == userId).Sum(u => u.Amount);
            var totalCards = _context.UserCards.Where(u => u.UserId == userId);

            return new UserDashboard
            {
                totalTransactions = totalTransactions?.ToList().Count() ?? 0,
                totalCards = totalCards?.Count() ?? 0,
                totalIncoming = totalAmountIncoming,
                totalOutgoing = totalAmountOutgoing
            };

        }

    }
}
