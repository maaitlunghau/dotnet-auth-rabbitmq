using server.DTOs;

namespace server.Services;

public interface IMessageBusClient
{
    Task PublishEmailAsync(EmailMessageDto message);
}
