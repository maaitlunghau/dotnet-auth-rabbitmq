using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using server.DTOs;
using server.DTOs.messages;

namespace server.Services;

public class MessageBusClient : IMessageBusClient
{
    private readonly IConfiguration _configuration;
    private readonly IConnectionFactory _factory;

    public MessageBusClient(IConfiguration configuration)
    {
        _configuration = configuration;
        var host = _configuration["RabbitMQ:Host"] ?? "localhost";
        var portStr = _configuration["RabbitMQ:Port"] ?? "5672";
        int.TryParse(portStr, out var port);

        _factory = new ConnectionFactory()
        {
            HostName = host,
            Port = port
        };
    }

    public async Task PublishEmailAsync(EmailMessageDto message)
    {
        await PublishToQueueAsync("email_queue", message);
    }

    public async Task PublishNotificationAsync(NotificationMessage message)
    {
        await PublishToQueueAsync("notification_queue", message);
    }

    private async Task PublishToQueueAsync<T>(string queueName, T message)
    {
        try
        {
            using var connection = await _factory.CreateConnectionAsync();
            using var channel = await connection.CreateChannelAsync();

            await channel.QueueDeclareAsync(
                queue: queueName,
                durable: true,
                exclusive: false,
                autoDelete: false,
                arguments: null
            );

            var body = JsonSerializer.Serialize(message);
            var encodedBody = Encoding.UTF8.GetBytes(body);

            await channel.BasicPublishAsync(
                exchange: string.Empty,
                routingKey: queueName,
                body: encodedBody
            );

            Console.WriteLine($"--> Message published to RabbitMQ queue: {queueName}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"--> Could not send message to Message Bus ({queueName}): {ex.Message}");
        }
    }
}
