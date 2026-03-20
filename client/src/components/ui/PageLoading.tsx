'use client'

import { Shield } from "lucide-react"

export default function PageLoading() {
  return (
    <div className="fixed inset-0 z-[100] bg-bg-primary flex flex-col items-center justify-center gap-4 animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 bg-text-primary rounded-xl flex items-center justify-center">
          <Shield size={24} className="text-text-inverse" />
        </div>
        <div className="absolute inset-0 w-12 h-12 rounded-xl border-2 border-accent-primary/30 animate-spin" style={{ borderTopColor: 'var(--accent-primary)' }} />
      </div>
      <p className="text-sm text-text-secondary">Loading...</p>
    </div>
  )
}
