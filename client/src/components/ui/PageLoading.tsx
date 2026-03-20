'use client'

import { Shield } from "lucide-react"

export default function PageLoading() {
  return (
    <div className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center gap-4 animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 bg-content-primary rounded-xl flex items-center justify-center">
          <Shield size={24} className="text-content-inverse" />
        </div>
        <div className="absolute inset-0 w-12 h-12 rounded-xl border-2 border-brand/30 animate-spin" style={{ borderTopColor: 'var(--color-brand)' }} />
      </div>
      <p className="text-sm text-content-secondary">Loading...</p>
    </div>
  )
}
