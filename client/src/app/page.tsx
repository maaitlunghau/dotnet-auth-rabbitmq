'use client'

import { useState, useEffect } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import PageLoading from "@/components/ui/PageLoading"
import Link from "next/link"
import {
  Shield, Zap, Lock, Mail, RefreshCw, Database,
  ArrowRight, CheckCircle2
} from "lucide-react"

const FEATURES = [
  {
    icon: Shield,
    title: "JWT Authentication",
    desc: "Industry-standard JSON Web Tokens with access and refresh token rotation for maximum security.",
  },
  {
    icon: Mail,
    title: "Email Verification",
    desc: "Automated email verification with 8-digit codes, powered by RabbitMQ for reliable delivery.",
  },
  {
    icon: Zap,
    title: "RabbitMQ Processing",
    desc: "Asynchronous message queuing ensures fast API responses while background workers handle emails.",
  },
  {
    icon: RefreshCw,
    title: "Token Refresh",
    desc: "Seamless token rotation with automatic refresh, keeping users logged in securely.",
  },
  {
    icon: Lock,
    title: "Password Security",
    desc: "BCrypt hashing with salt rounds ensures passwords are stored safely and irreversibly.",
  },
  {
    icon: Database,
    title: "Docker Ready",
    desc: "Pre-configured Docker Compose setup with MySQL and RabbitMQ for instant development.",
  },
]

const TECH_STACK = [
  ".NET 10", "Next.js 16", "RabbitMQ", "MySQL", "JWT", "Docker", "TypeScript", "TailwindCSS"
]

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <PageLoading />

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--accent-primary)/5%,transparent_70%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-medium mb-6">
                <Zap size={12} />
                Built with .NET 10 & Next.js 16
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-content-primary leading-tight tracking-tight">
                Secure Auth,{" "}
                <span className="bg-gradient-to-r from-brand to-success bg-clip-text text-transparent">
                  Blazing Fast
                </span>
              </h1>
              <p className="mt-5 text-lg text-content-secondary max-w-xl mx-auto leading-relaxed">
                Enterprise-grade authentication system with RabbitMQ-powered email verification, JWT token management, and seamless developer experience.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-btn-primary-text bg-btn-primary
                    hover:bg-btn-primary-hover rounded-lg transition-colors
                    flex items-center justify-center gap-2"
                >
                  Get started free
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-btn-secondary-text bg-btn-secondary
                    border border-btn-secondary-border hover:bg-btn-secondary-hover rounded-lg transition-colors
                    flex items-center justify-center"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="bg-secondary border-y border-border-base">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {TECH_STACK.map((tech) => (
                <span key={tech} className="text-sm font-medium text-content-tertiary hover:text-content-secondary transition-colors">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-content-primary">Everything you need</h2>
              <p className="mt-3 text-content-secondary max-w-lg mx-auto">
                A complete authentication solution built with modern best practices and production-ready architecture.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="p-6 bg-card border border-border-base rounded-xl
                    hover:border-brand/30 hover:shadow-[var(--shadow-md)]
                    transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-4
                    group-hover:bg-brand/20 transition-colors">
                    <f.icon size={20} className="text-brand" />
                  </div>
                  <h3 className="text-base font-semibold text-content-primary mb-2">{f.title}</h3>
                  <p className="text-sm text-content-secondary leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-secondary border-t border-border-base">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-2xl font-bold text-content-primary mb-3">Ready to get started?</h2>
            <p className="text-content-secondary mb-6">Create your free account and explore the platform.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="px-6 py-3 text-sm font-medium text-btn-primary-text bg-btn-primary
                  hover:bg-btn-primary-hover rounded-lg transition-colors
                  flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                Create free account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
