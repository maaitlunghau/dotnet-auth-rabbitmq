using System.ComponentModel.DataAnnotations;

namespace server.Models;

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required(ErrorMessage = "Name is required")]
    [StringLength(50, ErrorMessage = "Name must be less than 50 characters")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Email is invalid")]
    [StringLength(100, ErrorMessage = "Email must be less than 100 characters")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [StringLength(255, ErrorMessage = "Password must be less than 255 characters")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Role is required")]
    [StringLength(20)]
    public string Role { get; set; } = "user";

    public UserStatus Status { get; set; } = UserStatus.Pending;

    [StringLength(8)]
    public string? VerificationCode { get; set; }

    public DateTime? VerificationCodeExpiresAt { get; set; }

    public DateTime CreatedAtUTC { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAtUTC { get; set; } = DateTime.UtcNow;

    public ICollection<RefreshTokenRecord>? RefreshTokenRecords { get; set; }
}
