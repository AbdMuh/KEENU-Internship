
using Task01.Model;
using Microsoft.EntityFrameworkCore;

namespace Task01.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
        {} // constructor recieves configuration options for the db-context bass class

        public DbSet<User> Users { get; set; } 
        public DbSet<LoginUser> LoginUsers { get; set; }// Represnets the SQL Table, allowing to run queries 
    }
}
