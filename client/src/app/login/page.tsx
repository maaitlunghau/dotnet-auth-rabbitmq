'use client'

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { authApi } from "@/api/auth"
import { useAuthStore } from "@/store/useAuthStore"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react"
import OAuthButtons from "@/components/ui/OAuthButtons"

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const loginMutation = useMutation({
    mutationFn: () => authApi.login({ email, password }),
    onSuccess: (data) => {
      setAuth(data.user || { id: "", name: email.split("@")[0], email, role: "user", status: "active" }, data.accessToken, data.refreshToken)
      router.push("/")
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Invalid email or password")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    loginMutation.mutate()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary px-4">
      {/* Logo */}
      <div className="mb-6 animate-fade-in">
        <div className="w-12 h-12 bg-content-primary rounded-xl flex items-center justify-center mx-auto">
          <Shield size={24} className="text-content-inverse" />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <h1 className="text-2xl font-semibold text-content-primary text-center mb-6">
          Sign in to AuthGuard
        </h1>

        {/* OAuth */}
        <div className="bg-card border border-border-base rounded-xl p-6 mb-4">
          <OAuthButtons />

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-muted" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-content-tertiary uppercase tracking-wide">or</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-danger bg-danger-bg rounded-lg border border-danger/20 animate-shake">
                {error}
              </div>
            )}

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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-content-primary">Password</label>
                <Link href="/forgot-password" className="text-xs text-brand hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 pr-10 text-sm bg-input border border-border-base rounded-lg
                    text-content-primary placeholder:text-content-tertiary
                    focus:outline-none focus:ring-2 focus:ring-border-active focus:border-border-active
                    transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-2.5 text-sm font-medium text-btn-primary-text bg-btn-primary
                hover:bg-btn-primary-hover rounded-lg transition-colors
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        {/* Bottom Link */}
        <div className="bg-card border border-border-base rounded-xl p-4 text-center text-sm">
          <span className="text-content-secondary">New to AuthGuard? </span>
          <Link href="/register" className="text-brand font-medium hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}
