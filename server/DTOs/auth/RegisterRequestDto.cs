using System.ComponentModel.DataAnnotations;

namespace server.DTOs.auth;

public class RegisterRequestDto
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(50, ErrorMessage = "Name must be less than 50 characters")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    [StringLength(100, ErrorMessage = "Email must be less than 100 characters")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [StringLength(255, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 255 characters")]
    public string Password { get; set; } = string.Empty;
}
