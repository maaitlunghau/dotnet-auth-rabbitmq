'use client'

import { useState } from "react"
import Link from "next/link"
import { Shield, ArrowLeft, Loader2, CheckCircle2, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    // Simulate API call (no backend endpoint exists yet)
    setTimeout(() => setStatus("sent"), 1500)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary px-4">
      {/* Logo */}
      <div className="mb-6 animate-fade-in">
        <div className="w-12 h-12 bg-content-primary rounded-xl flex items-center justify-center mx-auto">
          <Shield size={24} className="text-content-inverse" />
        </div>
      </div>

      <div className="w-full max-w-sm animate-fade-in" style={{ animationDelay: "0.1s" }}>
        {status === "sent" ? (
          /* Success State */
          <div className="bg-card border border-border-base rounded-xl p-8 text-center animate-scale-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success-bg flex items-center justify-center">
              <Mail size={28} className="text-success" />
            </div>
            <h2 className="text-xl font-semibold text-content-primary mb-2">Check your email</h2>
            <p className="text-sm text-content-secondary mb-1">
              We sent a password reset link to
            </p>
            <p className="text-sm font-medium text-content-primary mb-6">{email}</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-brand font-medium hover:underline"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>
          </div>
        ) : (
          /* Form State */
          <>
            <h1 className="text-2xl font-semibold text-content-primary text-center mb-2">
              Reset your password
            </h1>
            <p className="text-sm text-content-secondary text-center mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <div className="bg-card border border-border-base rounded-xl p-6 mb-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-input border border-border-base rounded-lg
                      text-content-primary placeholder:text-content-tertiary
                      focus:outline-none focus:ring-2 focus:ring-border-active focus:border-border-active
                      transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-2.5 text-sm font-medium text-btn-primary-text bg-btn-primary
                    hover:bg-btn-primary-hover rounded-lg transition-colors
                    disabled:opacity-60 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-content-secondary hover:text-content-primary transition-colors"
              >
                <ArrowLeft size={14} />
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
