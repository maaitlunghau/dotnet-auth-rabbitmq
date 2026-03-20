using System;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Repositories;

namespace server.Services;

public class RefreshTokenRecordService : IRefreshTokenRepository
{
    private readonly DataContext _dbContext;
    public RefreshTokenRecordService(DataContext context) => _dbContext = context;

    public async Task<RefreshTokenRecord?> GetByRefreshTokenAsync(string refreshToken)
    {
        return await _dbContext.RefreshTokenRecords
            .FirstOrDefaultAsync(rt => rt.RefreshToken == refreshToken);
    }

    public async Task<RefreshTokenRecord?> GetByAccessTokenJtiAsync(string jti)
    {
        return await _dbContext.RefreshTokenRecords
            .FirstOrDefaultAsync(rt => rt.AccessTokenJti == jti);
    }

    public async Task<RefreshTokenRecord> CreateAsync(RefreshTokenRecord refreshToken)
    {
        await _dbContext.RefreshTokenRecords.AddAsync(refreshToken);
        await _dbContext.SaveChangesAsync();

        return refreshToken;
    }

    public async Task RevokeAsync(RefreshTokenRecord refreshToken)
    {
        refreshToken.RevokedAtUTC = DateTime.UtcNow;

        _dbContext.RefreshTokenRecords.Update(refreshToken);
        await _dbContext.SaveChangesAsync();
    }
}
