using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<RefreshTokenRecord> RefreshTokenRecords { get; set; } = null!;
    public DbSet<Notification> Notifications { get; set; } = null!;

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

        modelBuilder.Entity<Notification>()
            .HasOne(n => n.User)
            .WithMany() // or WithMany(u => u.Notifications) if we add it to User
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>().HasData(new User
        {
            Id = Guid.Parse("f8a2e1d0-1c5e-4b7e-9f3a-8c2d1b5e4f7a"),
            Name = "Mai Trung Hau",
            Email = "trunghau@mstsoftware.vn",
            Password = BCrypt.Net.BCrypt.HashPassword("admin@123"),
            Role = "admin",
            Status = UserStatus.Active,
            CreatedAtUTC = DateTime.UtcNow,
            UpdatedAtUTC = DateTime.UtcNow
        });
    }
}
