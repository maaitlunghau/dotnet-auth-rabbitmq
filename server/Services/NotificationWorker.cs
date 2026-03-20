using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using server.DTOs.messages;
using server.Hubs;
using server.Models;
using server.Repositories;

namespace server.Services;

public class NotificationWorker : BackgroundService
{
    private readonly IConfiguration _configuration;
    private readonly IServiceProvider _serviceProvider;
    private readonly IHubContext<NotificationHub> _hubContext;
    private IConnection? _connection;
    private IChannel? _channel;

    public NotificationWorker(
        IConfiguration configuration,
        IServiceProvider serviceProvider,
        IHubContext<NotificationHub> hubContext)
    {
        _configuration = configuration;
        _serviceProvider = serviceProvider;
        _hubContext = hubContext;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var host = _configuration["RabbitMQ:Host"] ?? "localhost";
        var portStr = _configuration["RabbitMQ:Port"] ?? "5672";
        int.TryParse(portStr, out var port);

        var factory = new ConnectionFactory() { HostName = host, Port = port };
        _connection = await factory.CreateConnectionAsync();
        _channel = await _connection.CreateChannelAsync();

        await _channel.QueueDeclareAsync(
            queue: "notification_queue",
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null
        );

        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            var notificationMsg = JsonSerializer.Deserialize<NotificationMessage>(message);

            if (notificationMsg != null)
            {
                await ProcessNotification(notificationMsg);
            }
        };

        await _channel.BasicConsumeAsync(queue: "notification_queue", autoAck: true, consumer: consumer);

        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(1000, stoppingToken);
        }
    }

    private async Task ProcessNotification(NotificationMessage msg)
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            var repo = scope.ServiceProvider.GetRequiredService<INotificationRepository>();

            // 1. Save to Database
            var notification = new Notification
            {
                UserId = Guid.Parse(msg.UserId),
                Title = msg.Title,
                Body = msg.Body,
                Type = msg.Type,
                CreatedAt = msg.CreatedAt
            };

            await repo.CreateAsync(notification);

            // 2. Push to SignalR Hub (Real-time)
            // Send specifically to the group named after UserId
            await _hubContext.Clients.Group(msg.UserId).SendAsync("ReceiveNotification", new
            {
                id = notification.Id,
                title = notification.Title,
                body = notification.Body,
                type = notification.Type,
                isRead = notification.IsRead,
                createdAt = notification.CreatedAt
            });

            Console.WriteLine($"--> Notification processed and pushed to User: {msg.UserId}");
        }
    }

    public override void Dispose()
    {
        _channel?.Dispose();
        _connection?.Dispose();
        base.Dispose();
    }
}
