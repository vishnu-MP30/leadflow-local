"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { List, X, ArrowRight } from "@phosphor-icons/react/dist/ssr";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
];

export function Navbar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scrolled style threshold for backdrop blur and borders
      setScrolled(currentScrollY > 20);

      // Always show navbar at the very top of the page
      if (currentScrollY < 40) {
        setVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollY;
      // Filter out tiny scrolls to prevent jitter
      if (Math.abs(diff) < 6) return;

      if (diff > 0) {
        // Scrolling DOWN -> HIDE navbar
        setVisible(false);
        setMobileOpen(false); // Close mobile drawer when user scrolls down
      } else {
        // Scrolling UP -> SHOW / POPUP navbar
        setVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-3 sm:top-5 left-0 right-0 z-50 px-4 sm:px-6 flex justify-center pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-28 opacity-0 pointer-events-none"
      )}
    >
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
          "relative w-full max-w-[1240px] rounded-full px-5 sm:px-7 py-2.5 sm:py-3 border flex items-center justify-between pointer-events-auto transition-all duration-300",
          scrolled
            ? "bg-[#200627]/90 backdrop-blur-xl border-[#D93D94]/30 shadow-[0_12px_40px_-10px_rgba(25,3,32,0.9),0_0_24px_rgba(217,61,148,0.22)]"
            : "bg-[#25082E]/80 backdrop-blur-md border-[#D93D94]/20 shadow-[0_8px_32px_rgba(25,3,32,0.6)]"
        )}
      >
        {/* Actual Leadflow Logo */}
        <Link href="/" className="flex items-center group outline-none shrink-0 py-0.5 z-10">
          <Image
            src="/logo.png"
            alt="LeadFlow"
            width={140}
            height={36}
            priority
            className="h-7 sm:h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
          />
        </Link>

        {/* Desktop Links (Features, How It Works, Pricing centered) */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13.5px] font-medium text-white/80 hover:text-white transition-colors outline-none relative py-1 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4 z-10">
          <Link
            href="/contact"
            className="text-[13.5px] font-medium text-white/75 hover:text-white transition-colors outline-none px-2"
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
            className="absolute top-20 left-4 right-4 bg-[#200627]/95 backdrop-blur-2xl border border-[#D93D94]/25 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 pointer-events-auto md:hidden"
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
