'use client'

import { useState, useRef, useEffect } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useThemeStore } from "@/store/useThemeStore"
import { useAuth } from "@/hooks/use-auth"
import { useNotifications } from "@/hooks/use-notifications"
import { useNotificationStore } from "@/store/useNotificationStore"
import Link from "next/link"
import {
  Sun, Moon, Bell, X, Shield, ChevronDown,
  LogOut, User, Mail, Settings, BellOff
} from "lucide-react"

export default function Header() {
  const [showBanner, setShowBanner] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const user = useAuthStore((s) => s.user)
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const { logout } = useAuth()
  
  // Real-time notifications
  const { markAsRead, markAllAsRead } = useNotifications(user?.id)
  const { notifications, unreadCount } = useNotificationStore()

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Banner */}
      {showBanner && (
        <div className="bg-banner text-white text-sm text-center py-2.5 px-4 flex items-center justify-center relative animate-slide-down">
          <span>
            🚀 <strong>New:</strong> Email verification with RabbitMQ is now live!{" "}
            <Link href="/register" className="underline font-medium hover:opacity-80">
              Try it out →
            </Link>
          </span>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/20 transition-colors"
            aria-label="Dismiss banner"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Header */}
      <nav className="bg-primary border-b border-border-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-content-primary rounded-lg flex items-center justify-center group-hover:opacity-80 transition-opacity">
                <Shield size={18} className="text-content-inverse" />
              </div>
              <span className="text-lg font-semibold text-content-primary hidden sm:block">
                AuthGuard
              </span>
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-secondary transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notification Bell */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications)
                    setShowUserMenu(false)
                  }}
                  className="p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-secondary transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-danger text-white text-[10px] font-bold rounded-full px-1 shadow-[0_0_0_2px_var(--color-bg-primary)] animate-in zoom-in duration-200">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border-base rounded-xl shadow-[var(--shadow-dropdown)] animate-slide-down overflow-hidden">
                    <div className="px-4 py-3 border-b border-border-muted flex items-center justify-between">
                      <h3 className="font-semibold text-content-primary text-sm">Notifications</h3>
                      <button 
                        onClick={() => markAllAsRead()}
                        className="text-xs text-brand font-medium hover:underline disabled:opacity-50"
                        disabled={unreadCount === 0}
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => !n.isRead && markAsRead(n.id)}
                            className={`px-4 py-3 border-b border-border-muted hover:bg-secondary transition-colors cursor-pointer ${
                              !n.isRead ? "bg-brand/5" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {!n.isRead && (
                                <span className="mt-1.5 w-2 h-2 rounded-full bg-brand flex-shrink-0" />
                              )}
                              <div className={!n.isRead ? "" : "ml-5"}>
                                <p className="text-sm font-medium text-content-primary">{n.title}</p>
                                <p className="text-xs text-content-secondary mt-0.5">{n.body}</p>
                                <p className="text-xs text-content-tertiary mt-1">
                                  {new Date(n.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-content-tertiary">
                          <BellOff size={32} className="mb-2 opacity-20" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2.5 text-center border-t border-border-muted">
                      <span className="text-xs text-brand font-medium cursor-pointer hover:underline">
                        View all notifications
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Auth Buttons / User Menu */}
              {user ? (
                <div ref={userMenuRef} className="relative ml-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu)
                      setShowNotifications(false)
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-semibold">
                      {getInitials(user.name)}
                    </div>
                    <span className="text-sm font-medium text-content-primary hidden sm:block max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown size={14} className="text-content-tertiary hidden sm:block" />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-72 bg-card border border-border-base rounded-xl shadow-[var(--shadow-dropdown)] animate-slide-down overflow-hidden">
                      <div className="px-4 py-3 border-b border-border-muted">
                        <p className="text-sm font-semibold text-content-primary">{user.name}</p>
                        <p className="text-xs text-content-secondary mt-0.5 flex items-center gap-1.5">
                          <Mail size={12} />
                          {user.email}
                        </p>
                        <span className="inline-block mt-1.5 text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-brand/10 text-brand">
                          {user.role}
                        </span>
                      </div>
                      <div className="py-1">
                        <button className="w-full px-4 py-2 text-sm text-content-primary hover:bg-secondary transition-colors flex items-center gap-2.5">
                          <User size={15} className="text-content-secondary" />
                          Your profile
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-content-primary hover:bg-secondary transition-colors flex items-center gap-2.5">
                          <Settings size={15} className="text-content-secondary" />
                          Settings
                        </button>
                      </div>
                      <div className="border-t border-border-muted py-1">
                        <button
                          onClick={() => logout()}
                          className="w-full px-4 py-2 text-sm text-danger hover:bg-danger-bg transition-colors flex items-center gap-2.5"
                        >
                          <LogOut size={15} />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-content-primary hover:bg-secondary rounded-lg border border-border-base transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-btn-primary-text bg-btn-primary hover:bg-btn-primary-hover rounded-lg transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
