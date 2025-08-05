namespace Task01.Model
{
    public class UserDashboard
    {
        public int Id { get; set; }
        public int totalTransactions { get; set; } = 0;
        public decimal totalIncoming {  get; set; } = 0;
        public decimal totalOutgoing { get; set; } = 0;

        public int totalCards { get; set; } = 0;
    }
}
