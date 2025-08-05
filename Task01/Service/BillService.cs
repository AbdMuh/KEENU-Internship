// Services/BillService.cs
using Task01.Data;
using Task01.Model;

namespace Task01.Service
{
    public class BillService : IBillService
    {
        private readonly ApplicationDBContext _context;

        public BillService(ApplicationDBContext context)
        {
            _context = context;
        }

        public Bill? GetBillByChallan(string challanNumber, int userId)
        {
            return _context.Bills.FirstOrDefault(b => b.challanNumber == challanNumber &&( b.status == "Pending" && b.UserId==userId));
        }

        public IEnumerable<Bill> GetOutstandingBills(int userId)
        {
            return _context.Bills.Where(b => b.UserId == userId && b.status == "Pending").ToList();
        }

        public IEnumerable<Bill> GetClearedBills(int userId)
        {
            return _context.Bills.Where(b => b.UserId == userId && b.status == "Paid").ToList();
        }

        public Bill? PayBill(string challanNumber, int userId)
        {
            var bill = _context.Bills.FirstOrDefault(b => b.challanNumber == challanNumber && b.status == "Pending");
            var user = _context.Users.Find(userId);

            if (bill == null || user == null || user.Balance < bill.amount)
                return null;

            user.Balance -= bill.amount;
            bill.status = "Paid";
            bill.UserId = userId;

            _context.SaveChanges();
            return bill;
        }
    }
}
