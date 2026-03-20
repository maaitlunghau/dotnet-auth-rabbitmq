using System.Net;
using Microsoft.AspNetCore.Mvc;
using server.DTOs.auth;
using server.Models;
using server.Repositories;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly TokenService _tokenService;

        public AuthController(
           IUserRepository userRepository,
           IRefreshTokenRepository refreshTokenRepository,
           TokenService tokenService
       )
        {
            _userRepository = userRepository;
            _refreshTokenRepository = refreshTokenRepository;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var existingUser = await _userRepository.GetUserByEmailAsync(dto.Email);
                if (existingUser != null)
                    return Conflict(new { message = "Email already registered" });

                var user = new User
                {
                    Name = dto.Name,
                    Email = dto.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Role = "user" // Default role
                };

                var createdUser = await _userRepository.CreateUserAsync(user);

                return Ok(new RegisterResponseDto
                {
                    Id = createdUser.Id,
                    Name = createdUser.Name,
                    Email = createdUser.Email,
                    CreatedAt = createdUser.CreatedAtUTC
                });
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var existingUser = await _userRepository.GetUserByEmailAsync(dto.Email);
                if (existingUser == null || !BCrypt.Net.BCrypt.Verify(dto.Password, existingUser.Password))
                    return Unauthorized(new { message = "Invalid email or password" });

                var (accessToken, jti) = _tokenService.CreateAccessToken(existingUser);
                var refreshTokenRecord = _tokenService.CreateRefreshToken(existingUser.Id, jti);

                await _refreshTokenRepository.CreateAsync(refreshTokenRecord);

                return Ok(new LoginResponseDto
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshTokenRecord.RefreshToken
                });
            }
            catch (Exception ex)
            {
                var detailMessage = $"Exception message: {ex.Message}. Detail: {ex}";
                return StatusCode((int)HttpStatusCode.InternalServerError, detailMessage);
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequestDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var refreshToken = await _refreshTokenRepository.GetByRefreshTokenAsync(dto.RefreshToken!);
                if (refreshToken is null)
                    return NotFound(new { message = "Refresh token not found" });

                if (!refreshToken.IsActive)
                {
                    return Ok(new { message = "Already logged out" });
                }

                await _refreshTokenRepository.RevokeAsync(refreshToken);

                return Ok(new { message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                var detailMessage = $"Exception message: {ex.Message}. Detail: {ex}";
                return StatusCode((int)HttpStatusCode.InternalServerError, detailMessage);
            }
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var currentRefreshToken = await _refreshTokenRepository.GetByRefreshTokenAsync(dto.RefreshToken!);
                if (currentRefreshToken is null)
                    return Unauthorized(new { message = "Invalid refresh token" });

                if (!currentRefreshToken.IsActive)
                    return Unauthorized(new { message = "Refresh token has been revoked or expired" });

                var user = await _userRepository.GetUserByIdAsync(currentRefreshToken.UserId);
                if (user is null)
                    return Unauthorized(new { message = "User not found" });

                var (newAccessToken, newJti) = _tokenService.CreateAccessToken(user);
                var newRefreshTokenRecord = _tokenService.CreateRefreshToken(user.Id, newJti);

                await _refreshTokenRepository.CreateAsync(newRefreshTokenRecord);

                currentRefreshToken.ReplacedByRefreshToken = newRefreshTokenRecord.RefreshToken;
                await _refreshTokenRepository.RevokeAsync(currentRefreshToken);

                return Ok(new RefreshTokenResponseDto
                {
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshTokenRecord.RefreshToken
                });
            }
            catch (Exception ex)
            {
                var detailMessage = $"Exception message: {ex.Message}. Detail: {ex}";
                return StatusCode((int)HttpStatusCode.InternalServerError, detailMessage);
            }
        }
    }
}
