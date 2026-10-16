"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

// ── 4 CYCLING COLOR STATES (WHITE -> PURPLE/PLUM -> YELLOW -> BRAND ORCHID/MAGENTA) ──
const typePhrases = [
  {
    text: "Stop writing cold emails by hand.",
    bgColor: "#FFFFFF",
    textColor: "#0B1B3D",
    descColor: "text-slate-600",
    badgeBg: "bg-slate-100 border-slate-200 text-[#0B1B3D]",
    badgeDot: "bg-[#D93D94]",
    btnPrimary: "bg-[#0B1B3D] hover:bg-[#16274E] text-white shadow-xl",
    btnSecondary: "bg-black/5 hover:bg-black/10 text-[#0B1B3D] border-[#0B1B3D]/20",
    tagColor: "text-slate-500",
  },
  {
    text: "Turn cold prospects into pipeline.",
    bgColor: "#26082A",
    textColor: "#FFFFFF",
    descColor: "text-pink-100/80",
    badgeBg: "bg-white/10 border-white/20 text-white",
    badgeDot: "bg-[#D93D94]",
    btnPrimary: "bg-[#D93D94] hover:bg-[#C52C82] text-white shadow-xl shadow-[#D93D94]/30",
    btnSecondary: "bg-white/10 hover:bg-white/20 text-white border-white/25",
    tagColor: "text-pink-200/70",
  },
  {
    text: "Start closing pipeline.",
    bgColor: "#E5DE4D",
    textColor: "#0B1B3D",
    descColor: "text-slate-800",
    badgeBg: "bg-black/10 border-black/15 text-[#0B1B3D]",
    badgeDot: "bg-[#0B1B3D]",
    btnPrimary: "bg-[#0B1B3D] hover:bg-[#16274E] text-white shadow-xl",
    btnSecondary: "bg-black/10 hover:bg-black/15 text-[#0B1B3D] border-[#0B1B3D]/25",
    tagColor: "text-slate-700",
  },
  {
    text: "Book high-intent meetings.",
    bgColor: "#D93D94",
    textColor: "#FFFFFF",
    descColor: "text-pink-100",
    badgeBg: "bg-white/15 border-white/25 text-white",
    badgeDot: "bg-white",
    btnPrimary: "bg-white hover:bg-pink-50 text-[#0B1B3D] shadow-xl",
    btnSecondary: "bg-white/10 hover:bg-white/20 text-white border-white/30",
    tagColor: "text-pink-200",
  },
];

export function CTA() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const currentTheme = typePhrases[phraseIdx];
  const targetText = currentTheme.text;

  // ── TYPEWRITER + REVERSE DELETION EFFECT ──
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayedText.length < targetText.length) {
        // Typing forward
        timeout = setTimeout(() => {
          setDisplayedText(targetText.slice(0, displayedText.length + 1));
        }, 55);
      } else {
        // Finished typing full phrase, pause before reverse deletion
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (displayedText.length > 0) {
        // Deleting backward (reverse typing)
        timeout = setTimeout(() => {
          setDisplayedText(targetText.slice(0, displayedText.length - 1));
        }, 28);
      } else {
        // Finished deleting, change color state and begin typing next phrase
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIdx((prev) => (prev + 1) % typePhrases.length);
        }, 350);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, targetText]);

  return (
    <section
      style={{ backgroundColor: currentTheme.bgColor }}
      className="relative z-20 min-h-[85vh] sm:min-h-screen flex flex-col justify-between py-20 sm:py-28 lg:py-32 px-6 sm:px-12 lg:px-20 transition-colors duration-700 ease-in-out select-none"
    >
      {/* ── TOP SECTION STATUS BADGE ── */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-500 ${currentTheme.badgeBg}`}
        >
          <span className={`w-2 h-2 rounded-full animate-pulse ${currentTheme.badgeDot}`} />
          <span>AUTONOMOUS OUTBOUND ENGINE</span>
        </div>

        <div className={`font-mono text-xs uppercase tracking-widest hidden sm:block ${currentTheme.tagColor}`}>
          PHASE 0{phraseIdx + 1} // CONTINUOUS MOMENTUM
        </div>
      </div>

      {/* ── CENTER EDITORIAL CONTENT (MASSIVE TYPING TITLE + FIXED PARAGRAPH) ── */}
      <div className="w-full max-w-7xl mx-auto my-12 sm:my-16">
        
        {/* Massive Animated Headline with Typing Cursor */}
        <div className="min-h-[140px] sm:min-h-[190px] md:min-h-[240px] lg:min-h-[290px] flex items-center">
          <h2
            style={{ color: currentTheme.textColor }}
            className="font-sans font-black text-5xl sm:text-7xl md:text-8xl lg:text-[108px] tracking-tight leading-[1.04] transition-colors duration-500"
          >
            <span>{displayedText}</span>
            <span
              style={{ backgroundColor: currentTheme.textColor }}
              className="inline-block w-1.5 sm:w-2.5 md:w-3.5 h-[0.9em] ml-1.5 align-baseline animate-pulse"
            />
          </h2>
        </div>

        {/* Fixed Content Paragraph (Never jumps, stays crystal clear) */}
        <p
          className={`font-sans font-normal text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed mt-6 sm:mt-8 transition-colors duration-500 ${currentTheme.descColor}`}
        >
          Join forward-thinking B2B revenue teams using LeadFlow to book more executive conversations with zero manual busywork.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center gap-4">
          <Link
            href="/contact"
            className={`font-sans px-8 py-4 rounded-full font-bold text-base transition-all duration-300 flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98] ${currentTheme.btnPrimary}`}
          >
            <span>Get Early Access</span>
            <ArrowRight
              size={17}
              weight="bold"
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <a
            href="#pricing"
            className={`font-sans px-7 py-4 rounded-full font-semibold text-base border backdrop-blur-sm transition-all duration-200 ${currentTheme.btnSecondary}`}
          >
            Explore Pricing Plans
          </a>
        </div>
      </div>

      {/* ── BOTTOM MICRO GUARANTEES ── */}
      <div className="w-full max-w-7xl mx-auto pt-8 border-t border-current/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className={`flex flex-wrap items-center gap-6 sm:gap-8 ${currentTheme.tagColor}`}>
          <div className="flex items-center gap-2">
            <CheckCircle size={15} weight="bold" />
            <span>14-DAY FREE TRIAL</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={15} weight="bold" />
            <span>NO CREDIT CARD REQUIRED</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} weight="bold" />
            <span>SOC 2 TYPE II COMPLIANT</span>
          </div>
        </div>

        <div className={`uppercase tracking-widest hidden md:block ${currentTheme.tagColor}`}>
          LEADFLOW REVENUE ARCHITECTURE &darr;
        </div>
      </div>
    </section>
  );
}

export default CTA;
