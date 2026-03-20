using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.DTOs.user;
using server.Models;
using server.Repositories;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        public UserController(IUserRepository userRepo) => _userRepo = userRepo;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var users = await _userRepo.GetAllUsersAsync();

                var response = users.Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role,
                    CreatedAt = u.CreatedAtUTC,
                    UpdatedAt = u.UpdatedAtUTC
                });

                return Ok(response);
            }
            catch (Exception ex)
            {
                var detailMessage = $"Exception message: {ex.Message}. Detail: {ex}";
                return StatusCode((int)HttpStatusCode.InternalServerError, detailMessage);
            }
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var user = await _userRepo.GetUserByIdAsync(id);
                if (user == null)
                    return NotFound(new { message = $"User with {id} not found." });

                var response = new UserResponseDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role,
                    CreatedAt = user.CreatedAtUTC,
                    UpdatedAt = user.UpdatedAtUTC
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                var detailMessage = $"Exception message: {ex.Message}. Detail: {ex}";
                return StatusCode((int)HttpStatusCode.InternalServerError, detailMessage);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var existingUser = await _userRepo.GetUserByEmailAsync(dto.Email);
                if (existingUser != null)
                    return Conflict(new { message = "Email already exists." });

                var user = new User
                {
                    Name = dto.Name,
                    Email = dto.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Role = "user"
                };

                var newlyCreatedUser = await _userRepo.CreateUserAsync(user);

                var response = new UserResponseDto
                {
                    Id = newlyCreatedUser.Id,
                    Name = newlyCreatedUser.Name,
                    Email = newlyCreatedUser.Email,
                    Role = newlyCreatedUser.Role,
                    CreatedAt = newlyCreatedUser.CreatedAtUTC,
                    UpdatedAt = newlyCreatedUser.UpdatedAtUTC
                };

                return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
            }
            catch (Exception ex)
            {
                var detailMessage = $"Exception message: {ex.Message}. Detail: {ex}";
                return StatusCode((int)HttpStatusCode.InternalServerError, detailMessage);
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UserUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var existingUser = await _userRepo.GetUserByIdAsync(id);
                if (existingUser == null)
                    return NotFound(new { message = $"User with {id} not found." });

                if (!string.IsNullOrWhiteSpace(dto.Email) && dto.Email != existingUser.Email)
                {
                    var emailExists = await _userRepo.GetUserByEmailAsync(dto.Email);
                    if (emailExists != null)
                        return Conflict(new { message = "Email already exists." });
                }

                if (!string.IsNullOrWhiteSpace(dto.Name))
                    existingUser.Name = dto.Name;

                if (!string.IsNullOrWhiteSpace(dto.Email))
                    existingUser.Email = dto.Email;

                var updatedUser = await _userRepo.UpdateUserAsync(existingUser);

                var response = new UserResponseDto
                {
                    Id = updatedUser.Id,
                    Name = updatedUser.Name,
                    Email = updatedUser.Email,
                    Role = updatedUser.Role,
                    CreatedAt = updatedUser.CreatedAtUTC,
                    UpdatedAt = updatedUser.UpdatedAtUTC
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                var detailMessage = $"Exception message: {ex.Message}. Detail: {ex}";
                return StatusCode((int)HttpStatusCode.InternalServerError, detailMessage);
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var existingUser = await _userRepo.GetUserByIdAsync(id);
                if (existingUser is null)
                    return NotFound(new { message = $"User with {id} not found." });

                await _userRepo.DeleteUserAsync(existingUser);

                return NoContent();
            }
            catch (Exception ex)
            {
                var detailMessage = $"Exception message: {ex.Message}. Detail: {ex}";
                return StatusCode((int)HttpStatusCode.InternalServerError, detailMessage);
            }
        }
    }
}
