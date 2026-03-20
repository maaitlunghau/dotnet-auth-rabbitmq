'use client'

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { authApi } from "@/api/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react"
import OAuthButtons from "@/components/ui/OAuthButtons"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const registerMutation = useMutation({
    mutationFn: () => authApi.register({ name, email, password }),
    onSuccess: () => {
      // Store email for verify-email page
      sessionStorage.setItem("verify-email", email)
      router.push("/verify-email")
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    registerMutation.mutate()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-secondary px-4">
      {/* Logo */}
      <div className="mb-6 animate-fade-in">
        <div className="w-12 h-12 bg-text-primary rounded-xl flex items-center justify-center mx-auto">
          <Shield size={24} className="text-text-inverse" />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <h1 className="text-2xl font-semibold text-text-primary text-center mb-6">
          Create your account
        </h1>

        <div className="bg-bg-card border border-border-primary rounded-xl p-6 mb-4">
          <OAuthButtons />

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-secondary" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-bg-card px-3 text-text-tertiary uppercase tracking-wide">or</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-accent-danger bg-accent-danger-bg rounded-lg border border-accent-danger/20 animate-shake">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-bg-input border border-border-primary rounded-lg
                  text-text-primary placeholder:text-text-tertiary
                  focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus
                  transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-bg-input border border-border-primary rounded-lg
                  text-text-primary placeholder:text-text-tertiary
                  focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus
                  transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 pr-10 text-sm bg-bg-input border border-border-primary rounded-lg
                    text-text-primary placeholder:text-text-tertiary
                    focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus
                    transition-all"
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-text-tertiary">
                Must be at least 6 characters long.
              </p>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full py-2.5 text-sm font-medium text-button-primary-text bg-button-primary
                hover:bg-button-primary-hover rounded-lg transition-colors
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>

        {/* Bottom Link */}
        <div className="bg-bg-card border border-border-primary rounded-xl p-4 text-center text-sm">
          <span className="text-text-secondary">Already have an account? </span>
          <Link href="/login" className="text-accent-primary font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
