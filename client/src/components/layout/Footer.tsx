'use client'

import Link from "next/link"
import { Shield, Github, Twitter, Mail } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary border-t border-border-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-content-primary rounded-lg flex items-center justify-center">
                <Shield size={14} className="text-content-inverse" />
              </div>
              <span className="text-base font-semibold text-content-primary">AuthGuard</span>
            </Link>
            <p className="text-sm text-content-secondary leading-relaxed">
              Secure authentication system with RabbitMQ-powered email verification and JWT token management.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-content-primary mb-3">Product</h4>
            <ul className="space-y-2">
              {["Features", "Security", "Documentation", "Pricing"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-content-secondary hover:text-brand cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-content-primary mb-3">Resources</h4>
            <ul className="space-y-2">
              {["API Reference", "Guides", "Blog", "Changelog"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-text-secondary hover:text-accent-primary cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-content-primary mb-3">Company</h4>
            <ul className="space-y-2">
              {["About", "Careers", "Privacy", "Terms"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-text-secondary hover:text-accent-primary cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border-muted flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-content-tertiary">
            © {currentYear} AuthGuard. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-content-tertiary hover:text-content-primary transition-colors" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href="#" className="text-content-tertiary hover:text-content-primary transition-colors" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="#" className="text-content-tertiary hover:text-content-primary transition-colors" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
