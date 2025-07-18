using Microsoft.EntityFrameworkCore;
using Task01.Model;

namespace Task01.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
        { }

        public DbSet<User> Users { get; set; }
        public DbSet<LoginUser> LoginUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // always call base

            modelBuilder.Entity<User>()
                .HasOne(u => u.loginUser)
                .WithOne(l => l.User)
                .HasForeignKey<LoginUser>(l => l.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade); // Optional: cleans up login when user is deleted
        }
    }
}
