using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using server.DTOs;

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
        try
        {
            using var connection = await _factory.CreateConnectionAsync();
            using var channel = await connection.CreateChannelAsync();

            await channel.QueueDeclareAsync(
                queue: "email_queue",
                durable: true,
                exclusive: false,
                autoDelete: false,
                arguments: null
            );

            var body = JsonSerializer.Serialize(message);
            var encodedBody = Encoding.UTF8.GetBytes(body);

            await channel.BasicPublishAsync(
                exchange: string.Empty,
                routingKey: "email_queue",
                body: encodedBody
            );

            Console.WriteLine("--> Message published to RabbitMQ");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"--> Could not send message to Message Bus: {ex.Message}");
        }
    }
}
