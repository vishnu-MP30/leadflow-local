"use client";

import Link from "next/link";
import {
  LinkedinLogo,
  EnvelopeSimple,
  GithubLogo,
  TwitterLogo,
} from "@phosphor-icons/react/dist/ssr";

export function Footer() {
  return (
    <footer className="relative z-10 bg-[#070709] text-white border-t border-white/10 overflow-hidden select-none">
      
      {/* ── MASSIVE CENTER-ALIGNED "LEADFLOW" WORDMARK (EXACT REFERENCE 4) ── */}
      <div className="w-full pt-16 sm:pt-20 md:pt-28 pb-8 sm:pb-12 border-b border-white/10 overflow-hidden">
        <div className="max-w-[var(--max-width)] mx-auto px-6 text-center">
          <div className="relative inline-block">
            <h1 className="font-sans font-black text-[17vw] sm:text-[16vw] md:text-[15vw] tracking-tighter text-white leading-none uppercase text-center select-none hover:text-[#D93D94] transition-colors duration-500">
              LeadFlow
            </h1>
            <span className="absolute top-2 -right-4 sm:-right-8 md:-right-12 font-mono text-sm sm:text-xl md:text-2xl text-[#D93D94] border border-[#D93D94]/40 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-bold">
              &reg;
            </span>
          </div>

          {/* Sub-headline directly below wordmark (Exact Reference 4 "STUDIO + WORLDVIEW" style) */}
          <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3 font-mono text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] uppercase text-white/90">
            <span className="w-2 h-2 rounded-full bg-[#D93D94] animate-pulse" />
            <span>AUTONOMOUS PIPELINE + OUTBOUND ENGINE</span>
          </div>
        </div>
      </div>

      {/* ── 4-COLUMN EDITORIAL CONTENT GRID (MATCHING REFERENCE 3 & 4) ── */}
      <div className="max-w-[var(--max-width)] mx-auto px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          
          {/* Column 1: Editorial Company Mission */}
          <div className="md:col-span-5 pr-0 md:pr-8">
            <p className="font-sans font-normal text-sm sm:text-base text-slate-400 leading-relaxed max-w-[42ch]">
              An autonomous research, messaging, and meeting scheduling platform for B2B revenue teams ready to scale closed pipeline. Engineered calmly, with enterprise-grade deliverability and zero human busywork.
            </p>

            <div className="inline-flex items-center gap-2 mt-6 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 font-mono text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>ALL SYSTEMS OPERATIONAL // 99.999% SLA</span>
            </div>
          </div>

          {/* Column 2: PLATFORM / PRODUCT */}
          <div className="md:col-span-2">
            <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-slate-400 mb-5">
              PLATFORM
            </h4>
            <ul className="space-y-3 font-mono text-xs sm:text-sm uppercase tracking-wider text-slate-300">
              <li>
                <Link href="/#features" className="hover:text-white hover:underline transition-colors">
                  FEATURES
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white hover:underline transition-colors">
                  WORKFLOW
                </Link>
              </li>
              <li>
                <Link href="/#security" className="hover:text-white hover:underline transition-colors">
                  SECURITY & TRUST
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-white hover:underline transition-colors">
                  PRICING PLANS
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: SOCIAL */}
          <div className="md:col-span-2">
            <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-slate-400 mb-5">
              SOCIAL
            </h4>
            <ul className="space-y-3 font-mono text-xs sm:text-sm uppercase tracking-wider text-slate-300">
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white hover:underline transition-colors">
                  LINKEDIN
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white hover:underline transition-colors">
                  TWITTER / X
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white hover:underline transition-colors">
                  GITHUB
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white hover:underline transition-colors">
                  CONTACT TEAM
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: LEGAL */}
          <div className="md:col-span-3">
            <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-slate-400 mb-5">
              LEGAL
            </h4>
            <ul className="space-y-3 font-mono text-xs sm:text-sm uppercase tracking-wider text-slate-300">
              <li>
                <a href="#" className="hover:text-white hover:underline transition-colors">
                  PRIVACY POLICY
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline transition-colors">
                  TERMS OF SERVICE
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline transition-colors">
                  SOC 2 TYPE II COMPLIANCE
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline transition-colors">
                  ACCESSIBILITY STATEMENT
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── BOTTOM COPYRIGHT & ATTRIBUTION BAR ── */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} LEADFLOW INC. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span>SYSTEM v2.4</span>
            <span>&bull;</span>
            <span>CONTINUOUS OUTBOUND VELOCITY</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
