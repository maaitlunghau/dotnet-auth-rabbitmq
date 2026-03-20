using server.Models;

namespace server.Repositories;

public interface INotificationRepository
{
    Task<IEnumerable<Notification>> GetUserNotificationsAsync(Guid userId);
    Task<Notification?> GetByIdAsync(Guid id);
    Task<Notification> CreateAsync(Notification notification);
    Task MarkAsReadAsync(Guid id);
    Task MarkAllAsReadAsync(Guid userId);
    Task DeleteAsync(Guid id);
}
