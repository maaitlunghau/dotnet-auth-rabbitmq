using server.Models;

namespace server.Repositories;

public interface IRefreshTokenRepository
{
    public Task<RefreshTokenRecord?> GetByRefreshTokenAsync(string refreshToken);
    public Task<RefreshTokenRecord?> GetByAccessTokenJtiAsync(string jti);
    public Task<RefreshTokenRecord> CreateAsync(RefreshTokenRecord refreshToken);
    public Task RevokeAsync(RefreshTokenRecord refreshToken);
}
