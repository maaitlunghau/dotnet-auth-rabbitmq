using System;

namespace server.DTOs.auth;

public class LogoutRequestDto
{
    public string? RefreshToken { get; set; } = string.Empty;
}
