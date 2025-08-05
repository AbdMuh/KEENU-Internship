using Task01.Model;

namespace Task01.Service
{
    public interface IBillService
    {
      
            Bill? GetBillByChallan(string challanNumber, int userId);
            IEnumerable<Bill> GetOutstandingBills(int userId);
            IEnumerable<Bill> GetClearedBills(int userId);
            Bill? PayBill(string challanNumber, int userId);
        

    }
}
