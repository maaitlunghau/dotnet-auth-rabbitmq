'use client'

import { useEffect, useRef } from 'react'
import * as signalR from '@microsoft/signalr'
import { useAuthStore } from '@/store/useAuthStore'
import { useNotificationStore, Notification } from '@/store/useNotificationStore'
import { notificationApi } from '@/api/notification'

const HUB_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '/hubs/notifications') || 'http://localhost:5000/hubs/notifications'

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const connectionRef = useRef<signalR.HubConnection | null>(null)
  const user = useAuthStore((s) => s.user)
  const accessToken = useAuthStore((s) => s.accessToken)
  const addNotification = useNotificationStore((s) => s.addNotification)
  const setNotifications = useNotificationStore((s) => s.setNotifications)
  const clearNotifications = useNotificationStore((s) => s.clearNotifications)

  useEffect(() => {
    // Only connect if user is logged in
    if (!user || !accessToken) {
      if (connectionRef.current) {
        connectionRef.current.stop()
        connectionRef.current = null
      }
      clearNotifications() // Clear from memory when logout
      return
    }

    const startConnection = async () => {
      try {
        // 1. Fetch initial notifications from DB
        const data = await notificationApi.getNotifications()
        setNotifications(data)

        // 2. Setup SignalR for real-time
        const connection = new signalR.HubConnectionBuilder()
          .withUrl(HUB_URL, {
            accessTokenFactory: () => accessToken,
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
          })
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Information)
          .build()

        connection.on('ReceiveNotification', (notification: Notification) => {
          console.log('New notification received via SignalR:', notification)
          addNotification(notification)
          
          // Optionally: Show a browser toast/notification if needed
        })

        await connection.start()
        console.log('SignalR connected successfully for notifications')
        connectionRef.current = connection
      } catch (err) {
        console.error('SignalR connection error:', err)
        // Wait and retry
        setTimeout(startConnection, 5000)
      }
    }

    startConnection()

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop()
        connectionRef.current = null
      }
    }
  }, [user, accessToken, addNotification, setNotifications, clearNotifications])

  return <>{children}</>
}
