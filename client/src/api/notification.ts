import axiosClient from "./axios-client"
import { Notification } from "@/store/useNotificationStore"

export const notificationApi = {
  getNotifications: async () => {
    const response = await axiosClient.get<Notification[]>("/notification")
    return response.data
  },

  markAsRead: async (id: string) => {
    const response = await axiosClient.put(`/notification/${id}/read`)
    return response.data
  },

  markAllAsRead: async () => {
    const response = await axiosClient.put("/notification/read-all")
    return response.data
  },

  deleteNotification: async (id: string) => {
    const response = await axiosClient.delete(`/notification/${id}`)
    return response.data
  },
}
