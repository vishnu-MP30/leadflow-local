"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Sparkle,
  LinkedinLogo,
  EnvelopeSimple,
  ShieldCheck,
  ChartLineUp,
  CalendarBlank,
  Cpu,
  Clock,
  ArrowRight,
  CheckCircle,
  Lightning,
  Check
} from "@phosphor-icons/react/dist/ssr";

// ── STEP-WISE DATA DEFINITION ──
const steps = [
  {
    id: "prospect-research",
    navTitle: "Prospect Research & Enrichment",
    eyebrow: "RESEARCH & ENRICHMENT ENGINE",
    title: "Autonomous Account & Persona Enrichment",
    description:
      "Before sending a single word, LeadFlow cross-references 12+ live data sources—including recent keynote talks, job boards, podcasts, and GitHub repos—to synthesize why this prospect needs your product now.",
    graphic: (
      <div className="rounded-2xl sm:rounded-3xl bg-[#0B0A0F] border border-[#2D123D] p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-[#D93D94]/20 via-[#1F102E]/30 to-transparent pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse" />
            <span className="font-mono font-medium text-xs text-white/90 tracking-wider">
              DOSSIER #4928
            </span>
          </div>
          <span className="font-mono font-semibold text-[11px] tracking-wider uppercase text-[#D93D94] bg-[#D93D94]/15 border border-[#D93D94]/30 px-3 py-1 rounded-full">
            HIGH RELEVANCY (98%)
          </span>
        </div>

        {/* Profile Snapshot */}
        <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1F102E] to-[#D93D94] text-white flex items-center justify-center font-bold text-sm">
              SC
            </div>
            <div>
              <div className="font-sans font-bold text-sm text-white">Sarah Chen</div>
              <div className="font-mono text-xs text-white/50">VP of Infrastructure @ CloudScale</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-md border border-[#10B981]/30">
            <Check size={14} weight="bold" />
            <span>VERIFIED</span>
          </div>
        </div>

        {/* Signals Found */}
        <div className="mt-4 p-4 rounded-xl bg-[#120A1C] border border-[#D93D94]/20 relative z-10">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[#D93D94] font-semibold mb-2.5">
            12+ LIVE SIGNALS SYNTHESIZED
          </div>
          <ul className="space-y-2 font-sans text-xs text-white/80">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D93D94]" />
              <span>Hiring 4 Platform Engineers on LinkedIn (Engineering Scale)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D93D94]" />
              <span>Migrated core cluster to Kubernetes &amp; AWS 3 weeks ago</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D93D94]" />
              <span>Keynote speaker at KubeCon on multi-region reliability</span>
            </li>
          </ul>
        </div>

        {/* Latency & Confidence Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center relative z-10">
          <div>
            <div className="font-mono text-[10px] uppercase text-white/40">Enrich Time</div>
            <div className="font-sans font-bold text-sm text-white mt-0.5">1.2s</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase text-white/40">Confidence</div>
            <div className="font-sans font-bold text-sm text-[#10B981] mt-0.5">99.4%</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase text-white/40">Data Freshness</div>
            <div className="font-sans font-bold text-sm text-[#D93D94] mt-0.5">&lt; 2h Realtime</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "ai-outreach",
    navTitle: "AI-Personalised Outreach",
    eyebrow: "GENERATIVE REVENUE INTELLIGENCE",
    title: "Hyper-Personalized Context, Never Generic Templates",
    description:
      "Replicate your best SDR's deepest research and highest-converting tone at machine scale. Every hook is uniquely calibrated to verified real-time milestones, completely eliminating generic spam templates.",
    graphic: (
      <div className="rounded-2xl sm:rounded-3xl bg-[#0B0A0F] border border-[#2D123D] p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-[#D93D94]/25 via-transparent to-transparent pointer-events-none" />

        {/* Header Tabs */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#1F102E] border border-[#D93D94]/40 font-mono text-[11px] text-[#D93D94] uppercase tracking-wider font-semibold">
              GEMINI 2.5 PRO
            </span>
            <span className="font-mono text-[11px] text-white/40 uppercase tracking-wider">
              VOICE: EXECUTIVE PEER
            </span>
          </div>
          <span className="font-mono text-xs text-[#10B981] flex items-center gap-1">
            <Lightning size={14} weight="fill" />
            SYNTHESIZED
          </span>
        </div>

        {/* Dynamic Context Hook Box */}
        <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10 relative z-10">
          <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
            DYNAMIC SUBJECT LINE
          </div>
          <div className="font-sans font-semibold text-sm text-white">
            Sarah, quick question regarding CloudScale’s KubeCon keynote on platform reliability
          </div>
        </div>

        <div className="mt-3 p-4 rounded-xl bg-[#150A1F] border border-[#D93D94]/30 relative z-10">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#D93D94] font-semibold mb-2">
            AI-SYNTHESIZED EXECUTIVE HOOK
          </div>
          <p className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed italic">
            &ldquo;Loved your talk at KubeCon on multi-region failover. Noticed your team recently opened 4 senior platform roles to support the recent Kubernetes migration—wanted to share how we helped Stripe automate pipeline validation during similar scale-ups...&rdquo;
          </p>
        </div>

        {/* A/B Conversion Benchmark */}
        <div className="mt-5 pt-4 border-t border-white/10 space-y-2 relative z-10">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[#D93D94] font-semibold">LEADFLOW CONTEXT HOOK</span>
            <span className="text-[#10B981] font-bold">44.8% Reply Rate</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#D93D94] to-[#10B981] w-[45%]" />
          </div>

          <div className="flex items-center justify-between font-mono text-xs pt-1">
            <span className="text-white/40">GENERIC TEMPLATE</span>
            <span className="text-white/40">3.2% Reply Rate</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-white/30 w-[8%]" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "multi-channel",
    navTitle: "Multi-Channel Follow-Ups",
    eyebrow: "CADENCE ORCHESTRATION",
    title: "Synchronized Multi-Touch Cadence",
    description:
      "Seamlessly bridges LinkedIn profile views, connection requests, personalized InMails, and email sequences into one coherent narrative without crossing spam boundaries or overwhelming the recipient.",
    graphic: (
      <div className="rounded-2xl sm:rounded-3xl bg-[#0B0A0F] border border-[#2D123D] p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-[#D93D94]/20 via-transparent to-transparent pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="font-mono text-xs text-white/90 uppercase tracking-wider font-semibold">
            SYNCHRONIZED OMNI-TOUCH TIMELINE
          </div>
          <span className="font-mono text-[11px] text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-2.5 py-0.5 rounded-full">
            LIVE CADENCE
          </span>
        </div>

        {/* Sequenced Timeline Steps */}
        <div className="mt-5 space-y-3 relative z-10">
          {/* Touch 1 */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/20 text-[#0A66C2] flex items-center justify-center font-bold">
                <LinkedinLogo size={18} weight="fill" />
              </div>
              <div>
                <div className="font-sans font-semibold text-xs text-white">Day 1: LinkedIn Touch</div>
                <div className="font-mono text-[10px] text-white/40">Profile View &amp; Tailored Connection</div>
              </div>
            </div>
            <span className="font-mono text-[10px] text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded">
              ACCEPTED
            </span>
          </div>

          {/* Touch 2 */}
          <div className="p-3.5 rounded-xl bg-[#170B21] border border-[#D93D94]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#D93D94]/20 text-[#D93D94] flex items-center justify-center font-bold">
                <EnvelopeSimple size={18} weight="bold" />
              </div>
              <div>
                <div className="font-sans font-semibold text-xs text-white">Day 3: Value-First Email</div>
                <div className="font-mono text-[10px] text-[#D93D94]">Context Hook // KubeCon Ref</div>
              </div>
            </div>
            <span className="font-mono text-[10px] text-[#D93D94] bg-[#D93D94]/15 px-2 py-0.5 rounded">
              OPENED 3X
            </span>
          </div>

          {/* Touch 3 */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 text-white/70 flex items-center justify-center font-bold">
                <LinkedinLogo size={18} weight="fill" />
              </div>
              <div>
                <div className="font-sans font-semibold text-xs text-white">Day 6: Smart InMail Follow-up</div>
                <div className="font-mono text-[10px] text-white/40">Triggered by Email Engagement</div>
              </div>
            </div>
            <span className="font-mono text-[10px] text-white/60 bg-white/10 px-2 py-0.5 rounded">
              DELIVERED
            </span>
          </div>
        </div>

        {/* Deliverability Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono relative z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} weight="bold" className="text-[#10B981]" />
            <span className="text-white/60">INBOX PLACEMENT</span>
          </div>
          <span className="font-sans font-bold text-white">99.4% Primary Inbox</span>
        </div>
      </div>
    ),
  },
  {
    id: "reply-intelligence",
    navTitle: "Reply Intelligence & Meeting Booking",
    eyebrow: "CONVERSION AUTOMATION",
    title: "Autonomous Reply Classification & Instant Booking",
    description:
      "When a prospect replies 'sounds interesting, next week works', LeadFlow instantly parses availability, syncs with your team's calendar, and deposits qualified meetings straight into your reps' diaries.",
    graphic: (
      <div className="rounded-2xl sm:rounded-3xl bg-[#0B0A0F] border border-[#2D123D] p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-[#10B981]/20 via-[#D93D94]/20 to-transparent pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span className="font-mono text-xs text-white font-medium uppercase tracking-wider">
              INBOUND INTENT CLASSIFIER
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/30 px-2.5 py-0.5 rounded-full font-semibold">
            INTENT: MEETING READY
          </span>
        </div>

        {/* Inbound Message */}
        <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10 relative z-10">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-sans font-bold text-xs text-white">Sarah Chen</span>
            <span className="font-mono text-[10px] text-white/40">Today, 10:14 AM</span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-white/80 leading-relaxed">
            &ldquo;Hi Alex, this actually aligns with what we&apos;re tackling right now. Let&apos;s do Tuesday at 2pm EST if that works for you?&rdquo;
          </p>
        </div>

        {/* Autonomous Booking Execution */}
        <div className="mt-4 p-4 rounded-xl bg-[#0F291E] border border-[#10B981]/30 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#10B981]">
              <CalendarBlank size={16} weight="bold" />
              <span>CALENDAR SLOT MATCHED &amp; BOOKED</span>
            </div>
            <span className="font-mono text-[10px] text-white/60">AUTONOMOUS</span>
          </div>
          <div className="font-sans font-bold text-sm text-white">
            Tuesday, Oct 20 • 2:00 PM – 2:30 PM EST
          </div>
          <div className="font-mono text-[10px] text-[#10B981]/90 uppercase tracking-wider mt-1">
            SYNCED: GOOGLE CALENDAR &bull; HUBSPOT CRM &bull; ZOOM LINK ATTACHED
          </div>
        </div>

        {/* Deal Impact */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
          <span className="font-mono text-xs text-white/50">PIPELINE STAGE UPDATE</span>
          <span className="font-mono font-bold text-xs text-[#D93D94]">
            QUALIFIED MEETING CREATED ($48K DEAL)
          </span>
        </div>
      </div>
    ),
  },
];

// ── ANIMATED METRICS COUNTER COMPONENT (FAST SCROLL COUNT-UP) ──
interface CounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  inView: boolean;
}

function AnimatedCounter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1150,
  inView,
}: CounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) {
      setDisplayValue(0);
      return;
    }

    let startTime: number | null = null;
    let rafId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Fast, snappy cubic ease-out: speeds through 0 -> 50% quickly and snaps into target
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = easeProgress * value;

      setDisplayValue(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [inView, value, duration]);

  const formatted =
    decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue);

  return (
    <span className="tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export function Features() {
  const reduce = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metricsRef = useRef<HTMLDivElement>(null);
  const [metricsInView, setMetricsInView] = useState(false);

  // ── METRICS INTERSECTION OBSERVER (TRIGGERS FAST COUNT-UP ON SCROLL) ──
  useEffect(() => {
    const el = metricsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMetricsInView(true);
        } else {
          // Re-triggers when scrolling away and scrolling back
          setMetricsInView(false);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── SCROLL SPY INTERSECTION & DISTANCE TRACKER ──
  useEffect(() => {
    const handleScroll = () => {
      // Target viewing line at 45% of viewport height (constant reading level)
      const targetY = window.innerHeight * 0.45;
      let closestIndex = 0;
      let minDistance = Infinity;

      stepRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height * 0.4;
        const distance = Math.abs(targetY - elementCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveStep(closestIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to selected step when clicking the left navigation
  const scrollToStep = (index: number) => {
    setActiveStep(index);
    const target = stepRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section
      id="features"
      className="relative z-20 mx-3 sm:mx-5 md:mx-8 lg:mx-10 xl:mx-14 max-w-[1680px] 2xl:mx-auto pt-20 md:pt-28 pb-16 sm:pb-20 md:pb-24 lg:pb-28 px-6 md:px-12 lg:px-16 bg-[#FFFFFF] text-[#0B1B3D] rounded-[32px] sm:rounded-[44px] md:rounded-[54px] lg:rounded-[64px] xl:rounded-[72px] shadow-[0_25px_70px_rgba(0,0,0,0.45)] mb-8 sm:mb-12 md:mb-16"
    >
      <div className="max-w-[var(--max-width)] mx-auto">
        {/* ── SECTION HEADER (Matching Reference: Left Subtitle + Right Display Title) ── */}
        <div className="mb-16 md:mb-24">
          <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-14 xl:gap-20">
            
            {/* Left Column: Clean Supporting Description in Geist Sans (Matching Reference Left Side) */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="w-full lg:w-[42%] xl:w-[36%] shrink-0 lg:pt-2"
            >
              <p
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                className="font-sans font-normal text-lg sm:text-xl lg:text-[1.25rem] leading-[1.38] text-[#0B1B3D] tracking-[-0.015em] max-w-md"
              >
                Four synchronized capabilities working as a continuous engine to research, personalize, deliver, and book qualified B2B meetings.
              </p>
            </motion.div>

            {/* Right Column: Large 2-Line Display Headline with Pink Accent (Matching Reference Right Side) */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full lg:w-[56%] xl:w-[60%]"
            >
              <h2
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                className="font-sans font-light sm:font-[350] text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.85rem] leading-[1.08] tracking-[-0.035em] text-[#0B1B3D]"
              >
                <span className="block text-[#0B1B3D]">
                  Engineered for high reply rates,
                </span>
                <span className="block text-[#FF3388] font-light sm:font-[350]">
                  not vanity volume.
                </span>
              </h2>
            </motion.div>

          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            STEP-WISE SCROLLYTELLING CONTAINER (MATCHING REFERENCE)
           ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-start relative">
          
          {/* ── LEFT COLUMN: CONSTANT PINNED STICKY STEP TITLES (Matching Reference 1) ── */}
          <div className="lg:col-span-6 xl:col-span-6 lg:sticky lg:top-40 xl:top-44 self-start z-10 py-4">
            <div className="flex items-center gap-2 mb-8 sm:mb-10">
              <span className="w-2 h-2 rounded-full bg-[#0B1B3D]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#0B1B3D]/70 font-semibold">
                WHY LEADFLOW
              </span>
            </div>

            <div className="space-y-4 sm:space-y-5 lg:space-y-6 xl:space-y-7">
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                return (
                  <button
                    key={step.id}
                    onClick={() => scrollToStep(index)}
                    className="w-full text-left group focus:outline-none block cursor-pointer transition-colors duration-200"
                  >
                    <div
                      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                      className={`tracking-[-0.03em] leading-[1.18] lg:whitespace-nowrap transition-colors duration-300 ${
                        isActive
                          ? "font-light sm:font-[350] text-2xl sm:text-3xl lg:text-[1.8rem] xl:text-[2.15rem] 2xl:text-[2.35rem] text-[#0B1B3D]"
                          : "font-light sm:font-[350] text-2xl sm:text-3xl lg:text-[1.8rem] xl:text-[2.15rem] 2xl:text-[2.35rem] text-[#CBD5E1] hover:text-[#0B1B3D]/60"
                      }`}
                    >
                      {step.navTitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT COLUMN: SCROLLABLE INTERFACE CARDS & DESCRIPTIONS ── */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-36 lg:space-y-48 pb-12">
            {steps.map((step, index) => (
              <div
                key={step.id}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                className="scroll-mt-44 min-h-[75vh] flex flex-col justify-center"
              >
                {/* Visual Graphic Stage */}
                <div className="transition-transform duration-300 hover:scale-[1.01]">
                  {step.graphic}
                </div>

                {/* Text Content Below the Graphic */}
                <div className="mt-8">
                  <div className="font-mono text-xs uppercase tracking-wider text-[#D93D94] font-semibold mb-2">
                    {step.eyebrow}
                  </div>
                  <h3 className="font-sans font-bold text-2xl sm:text-3xl text-[#0B1B3D] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3.5 font-sans font-normal text-base sm:text-lg leading-relaxed text-[#52525B]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ── ENTERPRISE PERFORMANCE METRICS BAR (Matching Reference 1 & Animated Count-Up) ── */}
        <div
          ref={metricsRef}
          className="mt-20 sm:mt-28 lg:mt-36 pt-10 sm:pt-14 border-t border-[#E2E8F0] grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 pb-6 sm:pb-10"
        >
          <div>
            <div
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              className="font-bold text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.6rem] text-[#0B1B3D] tracking-tight leading-none"
            >
              <AnimatedCounter value={74} suffix="%" inView={metricsInView} />
            </div>
            <div
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              className="mt-2.5 sm:mt-3 text-xs sm:text-[13.5px] lg:text-[14px] text-[#64748B] font-normal sm:font-medium tracking-normal leading-snug"
            >
              Verified Lead Enrichment Rate
            </div>
          </div>

          <div>
            <div
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              className="font-bold text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.6rem] text-[#FF3388] tracking-tight leading-none"
            >
              <AnimatedCounter value={3.8} decimals={1} suffix="x" inView={metricsInView} />
            </div>
            <div
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              className="mt-2.5 sm:mt-3 text-xs sm:text-[13.5px] lg:text-[14px] text-[#64748B] font-normal sm:font-medium tracking-normal leading-snug"
            >
              Higher Meeting Booking Rate
            </div>
          </div>

          <div>
            <div
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              className="font-bold text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.6rem] text-[#0B1B3D] tracking-tight leading-none"
            >
              <AnimatedCounter prefix="< " value={3} suffix=" hrs" inView={metricsInView} />
            </div>
            <div
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              className="mt-2.5 sm:mt-3 text-xs sm:text-[13.5px] lg:text-[14px] text-[#64748B] font-normal sm:font-medium tracking-normal leading-snug"
            >
              Time to First Live Campaign
            </div>
          </div>

          <div>
            <div
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              className="font-bold text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.6rem] text-[#0B1B3D] tracking-tight leading-none"
            >
              <AnimatedCounter value={24} suffix=" Days" inView={metricsInView} />
            </div>
            <div
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              className="mt-2.5 sm:mt-3 text-xs sm:text-[13.5px] lg:text-[14px] text-[#64748B] font-normal sm:font-medium tracking-normal leading-snug"
            >
              Shorter Average Sales Cycle
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Features;
