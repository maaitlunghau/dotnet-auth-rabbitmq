using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using server.Models;

namespace server.Services;

public class TokenService
{
    private readonly IConfiguration _config;
    public TokenService(IConfiguration config) => _config = config;

    public (string accessToken, string jti) CreateAccessToken(User u)
    {
        if (string.IsNullOrWhiteSpace(u.Email))
            throw new ArgumentException("Email is required", nameof(u.Email));

        if (string.IsNullOrWhiteSpace(u.Role))
            throw new ArgumentException("Role is required", nameof(u.Role));

        var keyText = _config["JWT:Key"]
            ?? throw new InvalidOperationException("JWT Key is not configured");
        var issuer = _config["JWT:Issuer"]
            ?? throw new InvalidOperationException("JWT Issuer is not configured");
        var audience = _config["JWT:Audience"]
            ?? throw new InvalidOperationException("JWT Audience is not configured");
        var accessTokenMinutes = int.Parse(_config["JWT:AccessTokenMinutes"] ?? "5");

        var jti = Guid.NewGuid().ToString();

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, u.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, u.Email),
            new(ClaimTypes.Role, u.Role),
            new(JwtRegisteredClaimNames.Jti, jti)
        };

        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyText));
        var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

        var jwtToken = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddMinutes(accessTokenMinutes),
            signingCredentials: signingCredentials
        );

        var accessToken = new JwtSecurityTokenHandler().WriteToken(jwtToken);

        return (accessToken, jti);
    }

    public RefreshTokenRecord CreateRefreshToken(Guid userId, string jti)
    {
        if (userId == Guid.Empty)
            throw new ArgumentException("User ID is required", nameof(userId));
        if (string.IsNullOrWhiteSpace(jti))
            throw new ArgumentException("Access token JTI is required", nameof(jti));

        var days = int.Parse(_config["JWT:RefreshTokenDays"] ?? "0");
        if (days <= 0)
            throw new InvalidOperationException("JWT RefreshTokenDays must be greater than 0");

        var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

        return new RefreshTokenRecord
        {
            UserId = userId,
            RefreshToken = refreshToken,
            AccessTokenJti = jti,
            CreatedAtUTC = DateTime.UtcNow,
            ExpireAtUTC = DateTime.UtcNow.AddDays(days)
        };
    }
}
