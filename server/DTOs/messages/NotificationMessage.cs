using System;

namespace server.DTOs.messages;

public class NotificationMessage
{
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string Type { get; set; } = "info"; // info, success, warning, error
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
