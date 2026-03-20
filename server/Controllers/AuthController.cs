using System.Net;
using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.DTOs.auth;
using server.Models;
using server.Repositories;
using server.Services;
using server.DTOs.messages;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly TokenService _tokenService;
        private readonly IMessageBusClient _messageBusClient;

        public AuthController(
           IUserRepository userRepository,
           IRefreshTokenRepository refreshTokenRepository,
           TokenService tokenService,
           IMessageBusClient messageBusClient
       )
        {
            _userRepository = userRepository;
            _refreshTokenRepository = refreshTokenRepository;
            _tokenService = tokenService;
            _messageBusClient = messageBusClient;
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

                // Generate 8-digit code
                var verificationCode = new Random().Next(10000000, 99999999).ToString();

                var user = new User
                {
                    Name = dto.Name,
                    Email = dto.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Role = "user",
                    Status = UserStatus.Pending,
                    VerificationCode = verificationCode,
                    VerificationCodeExpiresAt = DateTime.UtcNow.AddMinutes(15)
                };

                var createdUser = await _userRepository.CreateUserAsync(user);

                // Send Email with verificationCode (RabbitMQ)
                var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "EmailVerification.html");
                var htmlBody = await System.IO.File.ReadAllTextAsync(templatePath);
                htmlBody = htmlBody.Replace("{{Name}}", createdUser.Name).Replace("{{Code}}", verificationCode);

                await _messageBusClient.PublishEmailAsync(new EmailMessageDto
                {
                    ToEmail = createdUser.Email,
                    Subject = "Please verify your email",
                    Body = htmlBody
                });

                // Publish Registration Notification (Stored in DB for first login)
                await _messageBusClient.PublishNotificationAsync(new NotificationMessage
                {
                    UserId = createdUser.Id.ToString(),
                    Title = "Account Created Successfully",
                    Body = $"Welcome {createdUser.Name}! Your account has been created. Once you verify your email, you will have full access to all features.",
                    Type = "success"
                });

                return Ok(new RegisterResponseDto
                {
                    Id = createdUser.Id,
                    Name = createdUser.Name,
                    Email = createdUser.Email,
                    Status = createdUser.Status.ToString().ToLower(),
                    CreatedAt = createdUser.CreatedAtUTC
                });
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new { message = "Registration error", detail = ex.Message });
            }
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var user = await _userRepository.GetUserByEmailAsync(dto.Email);
                if (user == null)
                    return NotFound(new { message = "User not found" });

                if (user.Status == UserStatus.Active)
                    return BadRequest(new { message = "Email already verified" });

                if (user.VerificationCode != dto.Code)
                    return BadRequest(new { message = "Invalid verification code" });

                if (user.VerificationCodeExpiresAt < DateTime.UtcNow)
                    return BadRequest(new { message = "Verification code expired" });

                user.Status = UserStatus.Active;
                user.VerificationCode = null;
                user.VerificationCodeExpiresAt = null;

                await _userRepository.UpdateUserAsync(user);

                // Publish Notification (RabbitMQ)
                await _messageBusClient.PublishNotificationAsync(new NotificationMessage
                {
                    UserId = user.Id.ToString(),
                    Title = "Email Verified",
                    Body = "Welcome! Your email has been successfully verified. You now have full access to the platform.",
                    Type = "success"
                });

                return Ok(new { message = "Email verified successfully. You can now login." });
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new { message = "Email verification error", detail = ex.Message });
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

                if (existingUser.Status == UserStatus.Pending)
                    return Unauthorized(new { message = "Please verify your email to login." });

                if (existingUser.Status == UserStatus.Banned)
                    return Unauthorized(new { message = "Your account has been banned." });

                var (accessToken, jti) = _tokenService.CreateAccessToken(existingUser);
                var refreshTokenRecord = _tokenService.CreateRefreshToken(existingUser.Id, jti);

                await _refreshTokenRepository.CreateAsync(refreshTokenRecord);

                // Publish Login Notification
                await _messageBusClient.PublishNotificationAsync(new NotificationMessage
                {
                    UserId = existingUser.Id.ToString(),
                    Title = "Login Successful",
                    Body = $"Welcome back, {existingUser.Name}! We're glad to see you again.",
                    Type = "info"
                });

                return Ok(new LoginResponseDto
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshTokenRecord.RefreshToken
                });
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new { message = "Login error", detail = ex.Message });
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

                // Publish Logout Notification
                await _messageBusClient.PublishNotificationAsync(new NotificationMessage
                {
                    UserId = refreshToken.UserId.ToString(),
                    Title = "Logged Out",
                    Body = $"You have successfully logged out at {DateTime.UtcNow:HH:mm:ss}. See you later!",
                    Type = "warning"
                });

                return Ok(new { message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new { message = "Logout error", detail = ex.Message });
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
                return StatusCode((int)HttpStatusCode.InternalServerError, new { message = "Token refresh error", detail = ex.Message });
            }
        }
    }
}
