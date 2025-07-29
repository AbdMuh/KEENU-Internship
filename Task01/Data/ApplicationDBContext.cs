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

        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<UserCard> UserCards { get; set; }
        public DbSet<UserRole> Roles { get; set; }
        public DbSet<UserPermission> Permissions { get; set; }

        public DbSet<UserToken> UserTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // always call base

            modelBuilder.Entity<User>()
                .HasMany(u => u.UserCards)
                .WithOne(uc => uc.User)
                .HasForeignKey(uc => uc.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserToken>()
            .HasOne(ut => ut.User)    
            .WithMany()                      // User can have many tokens (no navigation property needed on User)
            .HasForeignKey(ut => ut.UserId)  
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasOne(u => u.loginUser)
                .WithOne(l => l.User)
                .HasForeignKey<LoginUser>(l => l.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserRole>()
                .HasMany(ur => ur.Permissions)
                .WithMany(u => u.Roles)
                .UsingEntity(j => j.ToTable("UserRolePermissions"));

            // Prevents deletion of sender if there are transactions
        }


            //modelBuilder.Entity<UserCard>()
            //    .HasOne(uc => uc.User)
            //    .WithMany(u => u.UserCards)
            //    .HasForeignKey(uc => uc.UserId)
            //    .OnDelete(DeleteBehavior.Cascade); 
        }
    }
