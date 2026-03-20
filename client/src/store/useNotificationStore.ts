import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Notification {
  id: string
  title: string
  body: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,

      setNotifications: (notifications) => {
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.isRead).length,
        })
      },

      addNotification: (notification) => {
        set((state) => {
          const newNotifications = [notification, ...state.notifications]
          return {
            notifications: newNotifications,
            unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
          }
        })
      },

      markAsRead: (id) => {
        set((state) => {
          const newNotifications = state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          )
          const newUnreadCount = Math.max(0, state.unreadCount - 1)
          return {
            notifications: newNotifications,
            unreadCount: newUnreadCount,
          }
        })
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        }))
      },

      clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 })
      },
    }),
    {
      name: 'notification-storage',
    }
  )
)
