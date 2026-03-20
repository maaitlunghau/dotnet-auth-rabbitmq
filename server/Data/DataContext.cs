using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<RefreshTokenRecord> RefreshTokenRecords { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<RefreshTokenRecord>()
            .HasOne(rft => rft.User)
            .WithMany(u => u.RefreshTokenRecords)
            .HasForeignKey(rft => rft.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
