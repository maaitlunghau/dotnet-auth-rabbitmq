using System.ComponentModel.DataAnnotations;

namespace server.DTOs.auth;

public class VerifyEmailDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(8, MinimumLength = 8, ErrorMessage = "Verification code must be 8 digits")]
    public string Code { get; set; } = string.Empty;
}
