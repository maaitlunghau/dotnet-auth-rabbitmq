'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { notificationApi } from '@/api/notification'
import { useNotificationStore } from '@/store/useNotificationStore'
import { useEffect } from 'react'

export const useNotifications = (userId?: string) => {
  const { setNotifications, markAsRead: localMarkAsRead, markAllAsRead: localMarkAllAsRead } = useNotificationStore()

  const { data: notifications, isLoading, refetch } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => notificationApi.getNotifications(),
    enabled: !!userId,
  })

  useEffect(() => {
    if (notifications) {
      setNotifications(notifications)
    }
  }, [notifications, setNotifications])

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: (_, id) => {
      localMarkAsRead(id)
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      localMarkAllAsRead()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationApi.deleteNotification(id),
    onSuccess: () => {
      refetch()
    },
  })

  return {
    notifications,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteMutation.mutate,
    refetch,
  }
}
