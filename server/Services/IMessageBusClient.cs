using server.DTOs;
using server.DTOs.messages;

namespace server.Services;

public interface IMessageBusClient
{
    Task PublishEmailAsync(EmailMessageDto message);
    Task PublishNotificationAsync(NotificationMessage message);
}
