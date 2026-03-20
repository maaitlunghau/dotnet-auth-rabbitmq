'use client'

import { useState, useRef, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { authApi } from "@/api/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield, CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [code, setCode] = useState<string[]>(Array(8).fill(""))
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verify-email")
    if (storedEmail) setEmail(storedEmail)
    inputRefs.current[0]?.focus()
  }, [])

  const verifyMutation = useMutation({
    mutationFn: () => authApi.verifyEmail({ email, code: code.join("") }),
    onSuccess: () => {
      setStatus("success")
      setTimeout(() => router.push("/login"), 2500)
    },
    onError: (err: any) => {
      setStatus("error")
      setError(err.response?.data?.message || "Invalid verification code")
      setTimeout(() => setStatus("idle"), 3000)
    },
  })

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]

    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, "").split("").slice(0, 8)
      digits.forEach((d, i) => {
        if (i + index < 8) newCode[i + index] = d
      })
      setCode(newCode)
      const nextIndex = Math.min(index + digits.length, 7)
      inputRefs.current[nextIndex]?.focus()

      if (newCode.every((d) => d !== "")) {
        setTimeout(() => verifyMutation.mutate(), 200)
      }
      return
    }

    newCode[index] = value
    setCode(newCode)

    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newCode.every((d) => d !== "")) {
      setTimeout(() => verifyMutation.mutate(), 200)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
      const newCode = [...code]
      newCode[index - 1] = ""
      setCode(newCode)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-secondary px-4">
      {/* Logo */}
      <div className="mb-6 animate-fade-in">
        <div className="w-12 h-12 bg-text-primary rounded-xl flex items-center justify-center mx-auto">
          <Shield size={24} className="text-text-inverse" />
        </div>
      </div>

      <div className="w-full max-w-md animate-fade-in" style={{ animationDelay: "0.1s" }}>
        {/* Success State */}
        {status === "success" ? (
          <div className="bg-bg-card border border-border-primary rounded-xl p-8 text-center animate-scale-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-success-bg flex items-center justify-center">
              <CheckCircle2 size={32} className="text-accent-success" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Email Verified!</h2>
            <p className="text-sm text-text-secondary mb-4">
              Your account has been activated successfully.
            </p>
            <p className="text-xs text-text-tertiary">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-text-primary text-center mb-2">
              Verify your email
            </h1>
            <p className="text-sm text-text-secondary text-center mb-6">
              Enter the 8-digit code sent to{" "}
              <span className="font-medium text-text-primary">{email || "your email"}</span>
            </p>

            <div className="bg-bg-card border border-border-primary rounded-xl p-6">
              {/* Error Message */}
              {status === "error" && (
                <div className="mb-4 p-3 text-sm text-accent-danger bg-accent-danger-bg rounded-lg border border-accent-danger/20 flex items-center gap-2 animate-shake">
                  <XCircle size={16} />
                  {error}
                </div>
              )}

              {/* Code Input */}
              <div className="flex justify-center gap-2 mb-6">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`w-10 h-12 text-center text-lg font-semibold rounded-lg border
                      bg-bg-input text-text-primary
                      focus:outline-none focus:ring-2 transition-all
                      ${status === "error"
                        ? "border-accent-danger focus:ring-accent-danger/30"
                        : "border-border-primary focus:ring-border-focus focus:border-border-focus"
                      }
                      ${digit ? "border-accent-primary/50" : ""}
                    `}
                    disabled={verifyMutation.isPending}
                  />
                ))}
              </div>

              {/* Loading */}
              {verifyMutation.isPending && (
                <div className="flex items-center justify-center gap-2 text-sm text-text-secondary mb-4">
                  <Loader2 size={16} className="animate-spin" />
                  Verifying...
                </div>
              )}

              {/* Resend */}
              <p className="text-center text-xs text-text-tertiary">
                Didn't receive a code?{" "}
                <button className="text-accent-primary font-medium hover:underline">
                  Resend code
                </button>
              </p>
            </div>

            {/* Back */}
            <div className="mt-4 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
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
