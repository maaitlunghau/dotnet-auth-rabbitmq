using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models;

public class Notification
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public string? Title { get; set; } = string.Empty;

    public string? Body { get; set; } = string.Empty;

    public string? Type { get; set; } = "info"; // info, success, warning, error

    public bool IsRead { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public virtual User? User { get; set; }
}
