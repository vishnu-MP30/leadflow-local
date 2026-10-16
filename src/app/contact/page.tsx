"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CheckCircle,
  PaperPlaneTilt,
} from "@phosphor-icons/react/dist/ssr";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    leadVolume: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col justify-between bg-[var(--background)] overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, var(--emerald) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-[var(--max-width)] mx-auto px-6 w-full h-16 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors group"
          style={{ transitionDuration: "var(--duration-fast)" }}
        >
          <ArrowLeft
            size={16}
            weight="bold"
            className="transition-transform group-hover:-translate-x-0.5"
            style={{ transitionTimingFunction: "var(--ease-out)" }}
          />
          Back to Home
        </Link>

        {/* Brand logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="LeadFlow Logo"
            className="h-6 w-auto object-contain"
          />
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12 md:py-16">
        <div className="max-w-[480px] w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tighter text-[var(--foreground)]">
              Request Early Access
            </h1>
            <p className="mt-3 text-sm text-[var(--foreground-muted)] leading-relaxed text-pretty">
              LeadFlow is currently **invite-only** to ensure platform safety and delivery quality. Fill out the application below and we will get back to you shortly.
            </p>
          </div>

          <div className="relative rounded-xl border border-[var(--border)] bg-[var(--surface)]/30 backdrop-blur-xl p-6 md:p-8 glow-border">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="text-center py-8"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--emerald)]/20 flex items-center justify-center mx-auto mb-4 text-[var(--emerald)]">
                  <CheckCircle size={32} weight="fill" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] tracking-tight">
                  Application Received
                </h3>
                <p className="text-sm text-[var(--foreground-muted)] mt-2 leading-relaxed text-pretty max-w-[32ch] mx-auto">
                  Thank you for applying. We review batches weekly and will contact you via email as soon as an invitation is available.
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-flex items-center justify-center text-sm font-medium border border-[var(--border)] bg-[var(--surface-hover)] hover:bg-[var(--foreground-dim)]/20 text-[var(--foreground)] px-6 py-2.5 rounded-lg transition-all active:scale-[0.97]"
                  style={{
                    transitionTimingFunction: "var(--ease-out)",
                    transitionDuration: "var(--duration-fast)",
                  }}
                >
                  Return home
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block font-mono text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Sarah Chen"
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--foreground-dim)]/70 focus:outline-none focus:border-[var(--accent)]/50 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block font-mono text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-2"
                  >
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="sarah@stripe.com"
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--foreground-dim)]/70 focus:outline-none focus:border-[var(--accent)]/50 transition-colors"
                  />
                </div>

                {/* Company URL */}
                <div>
                  <label
                    htmlFor="company"
                    className="block font-mono text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-2"
                  >
                    Company Website
                  </label>
                  <input
                    type="url"
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="https://stripe.com"
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--foreground-dim)]/70 focus:outline-none focus:border-[var(--accent)]/50 transition-colors"
                  />
                </div>

                {/* Monthly Lead Volume */}
                <div>
                  <label
                    htmlFor="leadVolume"
                    className="block font-mono text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-2"
                  >
                    Monthly Lead Volume
                  </label>
                  <select
                    id="leadVolume"
                    required
                    value={formData.leadVolume}
                    onChange={(e) =>
                      setFormData({ ...formData, leadVolume: e.target.value })
                    }
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--foreground-dim)]/70 focus:outline-none focus:border-[var(--accent)]/50 transition-colors appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      backgroundSize: "16px",
                      paddingRight: "40px",
                    }}
                  >
                    <option value="" disabled className="text-[var(--foreground-dim)]">
                      Select target volume...
                    </option>
                    <option value="under-1000">Under 1,000 / mo</option>
                    <option value="1000-5000">1,000 - 5,000 / mo</option>
                    <option value="5000-20000">5,000 - 20,000 / mo</option>
                    <option value="20000-plus">20,000+ / mo</option>
                  </select>
                </div>

                {/* Message / Goals */}
                <div>
                  <label
                    htmlFor="message"
                    className="block font-mono text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-2"
                  >
                    What are your outreach goals?
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="We want to automate outbound to tech founders..."
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--foreground-dim)]/70 focus:outline-none focus:border-[var(--accent)]/50 transition-colors resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group inline-flex items-center justify-center gap-2 bg-[#D93D94] hover:bg-[#C52C82] disabled:bg-[#D93D94]/60 text-white font-mono font-bold text-xs uppercase tracking-[0.14em] px-6 py-3.5 rounded-lg transition-all active:scale-[0.98] cursor-pointer shadow-[0_0_20px_rgba(217,61,148,0.4)] hover:shadow-[0_0_30px_rgba(217,61,148,0.65)]"
                  style={{
                    transitionTimingFunction: "var(--ease-out)",
                    transitionDuration: "var(--duration-fast)",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Applying...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <PaperPlaneTilt
                        size={16}
                        weight="bold"
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-[var(--max-width)] mx-auto px-6 w-full py-6 flex items-center justify-center border-t border-[var(--border-subtle)]">
        <p className="font-mono text-xs text-[var(--foreground-dim)]">
          &copy; {new Date().getFullYear()} LeadFlow AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
