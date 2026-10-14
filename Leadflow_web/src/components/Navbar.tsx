"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { List, X, ArrowRight, Sparkle } from "@phosphor-icons/react/dist/ssr";

const navLinks = [
  { label: "Product", href: "#" },
  { label: "Features", href: "/#features" },
  { label: "Security", href: "/#security" },
  { label: "Workflow", href: "/#workflow" },
  { label: "Pricing", href: "/#pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-4 sm:px-6 flex justify-center pointer-events-none">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
          "w-full max-w-[1240px] rounded-full px-5 sm:px-7 py-3 border flex items-center justify-between pointer-events-auto transition-all duration-300",
          scrolled
            ? "bg-[#0B0A0F]/85 backdrop-blur-xl border-[#D93D94]/25 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(217,61,148,0.15)]"
            : "bg-[#0B0A0F]/60 backdrop-blur-md border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group outline-none shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1F102E] to-[#D93D94]/30 border border-[#D93D94]/40 flex items-center justify-center shadow-[0_0_12px_rgba(217,61,148,0.35)] group-hover:scale-105 transition-transform">
            <span className="text-[#D93D94] font-black text-sm tracking-tighter">LF</span>
          </div>
          <span className="text-white font-bold text-base tracking-tight">
            LeadFlow<span className="text-[#D93D94]">.ai</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13.5px] font-medium text-white/75 hover:text-white transition-colors outline-none relative py-1 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/contact"
            className="text-[13.5px] font-medium text-white/70 hover:text-white transition-colors outline-none px-2"
          >
            Sign In
          </Link>
          <Link
            href="/contact"
            className="text-[13.5px] font-semibold bg-[#D93D94] hover:bg-[#C52C82] text-white px-5 py-2.5 rounded-full transition-all duration-200 shadow-[0_0_20px_-3px_rgba(217,61,148,0.5)] hover:shadow-[0_0_28px_rgba(217,61,148,0.7)] outline-none active:scale-[0.98] flex items-center gap-1.5"
          >
            <span>Get Early Access</span>
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-1.5 text-white/80 hover:text-[#D93D94] outline-none rounded-full"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
        </button>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-20 left-4 right-4 bg-[#0B0A0F]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 pointer-events-auto md:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-white/80 hover:text-[#D93D94] py-2 border-b border-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-white/80 border border-white/10 rounded-full"
              >
                Sign In
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-3 text-sm font-semibold text-white bg-[#D93D94] hover:bg-[#C52C82] rounded-full shadow-[0_0_20px_rgba(217,61,148,0.5)] flex items-center justify-center gap-2"
              >
                <span>Get Early Access</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
