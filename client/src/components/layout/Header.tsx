'use client'

import { useState, useRef, useEffect } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useThemeStore } from "@/store/useThemeStore"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import {
  Sun, Moon, Bell, X, Shield, ChevronDown,
  LogOut, User, Mail, Settings
} from "lucide-react"

// Seeded notifications
const SAMPLE_NOTIFICATIONS = [
  { id: 1, title: "Welcome to the platform!", body: "Your account has been created successfully.", time: "Just now", unread: true },
  { id: 2, title: "Security update", body: "We've enhanced our encryption protocols.", time: "2 hours ago", unread: true },
  { id: 3, title: "New login detected", body: "A new login was detected from Ho Chi Minh City.", time: "5 hours ago", unread: true },
  { id: 4, title: "Email verified", body: "Your email has been successfully verified.", time: "1 day ago", unread: false },
  { id: 5, title: "Password policy update", body: "We've updated our password requirements.", time: "2 days ago", unread: false },
  { id: 6, title: "Maintenance scheduled", body: "Planned maintenance on March 25, 2026.", time: "3 days ago", unread: false },
  { id: 7, title: "Feature release", body: "Check out the new dashboard analytics.", time: "4 days ago", unread: false },
  { id: 8, title: "API rate limit update", body: "Rate limits have been increased to 1000/min.", time: "5 days ago", unread: false },
  { id: 9, title: "New team member", body: "John Doe has joined your organization.", time: "1 week ago", unread: false },
  { id: 10, title: "Billing reminder", body: "Your subscription renews in 7 days.", time: "1 week ago", unread: false },
]

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

  const unreadCount = SAMPLE_NOTIFICATIONS.filter((n) => n.unread).length

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
        <div className="bg-bg-banner text-white text-sm text-center py-2.5 px-4 flex items-center justify-center relative animate-slide-down">
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
      <nav className="bg-bg-primary border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-text-primary rounded-lg flex items-center justify-center group-hover:opacity-80 transition-opacity">
                <Shield size={18} className="text-text-inverse" />
              </div>
              <span className="text-lg font-semibold text-text-primary hidden sm:block">
                AuthGuard
              </span>
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
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
                  className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-danger rounded-full" />
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-bg-card border border-border-primary rounded-xl shadow-[var(--shadow-dropdown)] animate-slide-down overflow-hidden">
                    <div className="px-4 py-3 border-b border-border-secondary flex items-center justify-between">
                      <h3 className="font-semibold text-text-primary text-sm">Notifications</h3>
                      <span className="text-xs text-accent-primary font-medium cursor-pointer hover:underline">
                        Mark all as read
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                      {SAMPLE_NOTIFICATIONS.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 border-b border-border-secondary hover:bg-bg-secondary transition-colors cursor-pointer ${
                            n.unread ? "bg-accent-primary/5" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {n.unread && (
                              <span className="mt-1.5 w-2 h-2 rounded-full bg-accent-primary flex-shrink-0" />
                            )}
                            <div className={n.unread ? "" : "ml-5"}>
                              <p className="text-sm font-medium text-text-primary">{n.title}</p>
                              <p className="text-xs text-text-secondary mt-0.5">{n.body}</p>
                              <p className="text-xs text-text-tertiary mt-1">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 text-center border-t border-border-secondary">
                      <span className="text-xs text-accent-primary font-medium cursor-pointer hover:underline">
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
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-bg-secondary transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center text-white text-xs font-semibold">
                      {getInitials(user.name)}
                    </div>
                    <span className="text-sm font-medium text-text-primary hidden sm:block max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown size={14} className="text-text-tertiary hidden sm:block" />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-72 bg-bg-card border border-border-primary rounded-xl shadow-[var(--shadow-dropdown)] animate-slide-down overflow-hidden">
                      <div className="px-4 py-3 border-b border-border-secondary">
                        <p className="text-sm font-semibold text-text-primary">{user.name}</p>
                        <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1.5">
                          <Mail size={12} />
                          {user.email}
                        </p>
                        <span className="inline-block mt-1.5 text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary">
                          {user.role}
                        </span>
                      </div>
                      <div className="py-1">
                        <button className="w-full px-4 py-2 text-sm text-text-primary hover:bg-bg-secondary transition-colors flex items-center gap-2.5">
                          <User size={15} className="text-text-secondary" />
                          Your profile
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-text-primary hover:bg-bg-secondary transition-colors flex items-center gap-2.5">
                          <Settings size={15} className="text-text-secondary" />
                          Settings
                        </button>
                      </div>
                      <div className="border-t border-border-secondary py-1">
                        <button
                          onClick={() => logout()}
                          className="w-full px-4 py-2 text-sm text-accent-danger hover:bg-accent-danger-bg transition-colors flex items-center gap-2.5"
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
                    className="px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-secondary rounded-lg border border-border-primary transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-button-primary-text bg-button-primary hover:bg-button-primary-hover rounded-lg transition-colors"
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
