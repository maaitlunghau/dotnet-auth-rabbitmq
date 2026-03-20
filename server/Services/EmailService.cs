using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using server.DTOs;

namespace server.Services;

public interface IEmailService
{
    Task SendEmailAsync(EmailMessageDto message);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(EmailMessageDto message)
    {
        var fromEmail = _configuration["Email:From"] ?? "no-reply@authapp.com";
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(fromEmail));
        email.To.Add(MailboxAddress.Parse(message.ToEmail));
        email.Subject = message.Subject;

        var builder = new BodyBuilder
        {
            HtmlBody = message.Body
        };
        email.Body = builder.ToMessageBody();

        using var smtp = new SmtpClient();
        try
        {
            await smtp.ConnectAsync(
                _configuration["Email:Host"],
                int.Parse(_configuration["Email:Port"] ?? "587"),
                SecureSocketOptions.StartTls
            );

            await smtp.AuthenticateAsync(
                _configuration["Email:Username"],
                _configuration["Email:Password"]
            );

            await smtp.SendAsync(email);
            Console.WriteLine("--> Email sent successfully");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"--> Error sending email: {ex.Message}");
            throw;
        }
        finally
        {
            await smtp.DisconnectAsync(true);
        }
    }
}
