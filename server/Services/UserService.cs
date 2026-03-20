using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Services;

public class UserService
{
    private readonly DataContext _dbContext;
    public UserService(DataContext dbContext) => _dbContext = dbContext;

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await _dbContext.Users.ToListAsync();
    }

    public async Task<User?> GetUserByIdAsync(Guid id)
    {
        return await _dbContext.Users.FindAsync(id);
    }

    public async Task<User?> GetUserByEmailAsync(string? email)
    {
        return await _dbContext.Users.SingleOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User> CreateUserAsync(User u)
    {
        await _dbContext.Users.AddAsync(u);
        await _dbContext.SaveChangesAsync();

        return u;
    }

    public async Task<User> UpdateUserAsync(User u)
    {
        u.UpdatedAtUTC = DateTime.UtcNow;

        _dbContext.Users.Update(u);
        await _dbContext.SaveChangesAsync();

        return u;
    }

    public async Task DeleteUserAsync(User u)
    {
        _dbContext.Users.Remove(u);
        await _dbContext.SaveChangesAsync();
    }
}
