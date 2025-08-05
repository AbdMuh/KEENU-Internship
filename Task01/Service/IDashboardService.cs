using Task01.Model;

namespace Task01.Service
{
    public interface IDashboardService
    {
        UserDashboard GetUserStat(int userId);
    }
}