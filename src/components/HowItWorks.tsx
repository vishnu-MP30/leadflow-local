"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Cpu,
  Sparkle,
  ArrowsClockwise,
  CalendarBlank,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import { LandingCore3D } from "./landing3d/LandingCore3D";

// ── LEADFLOW AUTONOMOUS ARCHITECTURE CAPABILITIES (MATCHING REFERENCE 1 2-COLUMN SETUP) ──
const architectureCapabilities = [
  {
    id: "ai-intelligence-core",
    title: "Autonomous Intelligence Core",
    desc: "At LeadFlow, intelligence is the core engine of your pipeline: shaping every touchpoint across multi-channel outreach, automated research dossiers, and frictionless calendar booking.",
    icon: Cpu,
  },
  {
    id: "dossier-research",
    title: "Real-Time Dossier & Persona Research",
    desc: "Deep real-time dossier synthesis analyzing recent keynote talks, job boards, and tech stack milestones to find exact buyer relevance before outreach.",
    icon: Sparkle,
  },
  {
    id: "execution-engine",
    title: "Synchronized Multi-Channel Execution",
    desc: "Seamlessly coordinates LinkedIn profile visits, personalized InMails, and automated email follow-ups into one natural cadence without vanity spam.",
    icon: ArrowsClockwise,
  },
  {
    id: "reply-booking",
    title: "Reply Intelligence & Instant Meeting Booking",
    desc: "Classifies prospect replies, addresses scheduling questions, and deposits confirmed sales appointments straight into your executive calendar.",
    icon: CalendarBlank,
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section
      id="how-it-works"
      className="relative z-10 py-28 sm:py-36 lg:py-44 bg-transparent text-white overflow-hidden select-none"
    >
      {/* ── 3D STEPPED COLUMN CORE (CENTER BACKGROUND - MEDIUM SIZE) ── */}
      <LandingCore3D />

      <div className="relative z-10 max-w-[var(--max-width)] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* ── LEFT COLUMN: TITLE & CTAS (EXACT REFERENCE 1 LAYOUT) ── */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
            {/* Eyebrow Bullet */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
              <span
                style={{ fontFamily: "var(--font-mono), 'Geist Mono', monospace" }}
                className="text-[11px] sm:text-xs text-white/70 uppercase tracking-[0.2em] font-medium"
              >
                AUTONOMOUS ARCHITECTURE
              </span>
            </motion.div>

            {/* Display Headline in Geist Sans */}
            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
              style={{ fontFamily: "var(--font-sans), 'Geist', sans-serif" }}
              className="font-light sm:font-[350] text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.65rem] leading-[1.08] tracking-[-0.035em] text-white"
            >
              <span className="block text-white">
                AI-Native Outbound
              </span>
              <span className="block">
                <span className="text-[#FF3388] font-light sm:font-[350]">Starts</span> Here.
              </span>
            </motion.h2>

            {/* Supporting Description */}
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
              style={{ fontFamily: "var(--font-sans), 'Geist', sans-serif" }}
              className="mt-6 font-normal text-sm sm:text-base lg:text-[1.05rem] text-slate-300/80 leading-relaxed max-w-md"
            >
              From raw prospect list to booked executive conversation—an autonomous sales workflow engineered for high-intent pipeline generation.
            </motion.p>

            {/* CTA Buttons (Matching Reference 1 Style) */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3.5"
            >
              <Link
                href="/contact"
                style={{ fontFamily: "var(--font-mono), 'Geist Mono', monospace" }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-[#FF3388] hover:bg-[#FF1A75] text-black font-mono font-semibold text-xs tracking-[0.14em] uppercase transition-all shadow-[0_0_20px_rgba(255,51,136,0.35)] hover:shadow-[0_0_30px_rgba(255,51,136,0.6)] cursor-pointer whitespace-nowrap"
              >
                <span>GET EARLY ACCESS</span>
                <ArrowUpRight size={14} weight="bold" />
              </Link>

              <a
                href="#pricing"
                style={{ fontFamily: "var(--font-mono), 'Geist Mono', monospace" }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-[#181124]/90 hover:bg-white/10 border border-white/15 text-white/90 font-mono font-semibold text-xs tracking-[0.14em] uppercase transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                <span>VIEW PRICING</span>
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN: CLEAN CAPABILITY ITEMS (MATCHING REFERENCE 1 RIGHT SIDE) ── */}
          <div className="lg:col-span-6 xl:col-span-7 lg:pl-6 xl:pl-10">
            <div className="space-y-8 sm:space-y-10 lg:space-y-12">
              {architectureCapabilities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={reduce ? false : { opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + index * 0.08,
                      ease: "easeOut",
                    }}
                    className="group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={22}
                        weight="light"
                        className="text-white/90 shrink-0 group-hover:text-[#FF3388] transition-colors"
                      />
                      <h3
                        style={{ fontFamily: "var(--font-sans), 'Geist', sans-serif" }}
                        className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug"
                      >
                        {item.title}
                      </h3>
                    </div>
                    <p
                      style={{ fontFamily: "var(--font-sans), 'Geist', sans-serif" }}
                      className="mt-2 text-xs sm:text-[13.5px] lg:text-[14px] text-slate-300/80 leading-relaxed max-w-lg font-normal pl-0 sm:pl-[34px]"
                    >
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
