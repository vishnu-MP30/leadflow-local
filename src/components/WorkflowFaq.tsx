"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure GSAP plugins are registered safely on client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ── CLEAN 3-STEP WORKFLOW DATA (MATCHING SCREENSHOT 2 & 4) ──
const WORKFLOW_STEPS = [
  {
    stepNumber: "01",
    title: "UNDERSTAND PROSPECTS",
    description:
      "Start with your existing prospect list. LeadFlow researches prospect context to support more relevant outreach.",
  },
  {
    stepNumber: "02",
    title: "PERSONALISE OUTREACH",
    description:
      "Create personalised outreach using prospect context across LinkedIn and email.",
  },
  {
    stepNumber: "03",
    title: "KEEP CONVERSATIONS MOVING",
    description:
      "Manage follow-ups, identify interested replies, and help prospects move towards a meeting.",
  },
];

// ── FAQS DATA ──
const FAQS = [
  {
    id: "01",
    question: "WHAT IS LEADFLOW?",
    answer:
      "LeadFlow helps sales teams research prospects, personalise outreach, manage follow-ups, and handle replies in one coordinated workflow.",
  },
  {
    id: "02",
    question: "DO I NEED AN EXISTING PROSPECT LIST?",
    answer:
      "Yes. LeadFlow is designed to work with your existing prospect list rather than discovering prospects from scratch.",
  },
  {
    id: "03",
    question: "HOW DOES LEADFLOW PERSONALISE MESSAGES?",
    answer:
      "It uses available prospect context to help create relevant, personalised outreach instead of generic templates.",
  },
  {
    id: "04",
    question: "CAN LEADFLOW COORDINATE LINKEDIN AND EMAIL?",
    answer:
      "Yes. LeadFlow supports coordinated outreach across LinkedIn and email.",
  },
  {
    id: "05",
    question: "HOW DOES LEADFLOW HANDLE REPLIES?",
    answer:
      "LeadFlow helps identify replies that need attention so your team can prioritise relevant conversations.",
  },
];

export function WorkflowFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const reduce = useReducedMotion();

  // GSAP animation references
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // ── GSAP PINNED STAGGERED SCROLL REVEAL (MATCHING SCREENSHOT 2 & 4) ──
  useEffect(() => {
    if (typeof window === "undefined" || reduce) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const stage = stageRef.current;
      const col1 = col1Ref.current;
      const col2 = col2Ref.current;
      const col3 = col3Ref.current;
      const header = headerRef.current;

      if (!stage || !col1 || !col2 || !col3) return;

      // Initial positions: hidden below viewport boundary with progressive offsets
      gsap.set(col1, { y: 360, opacity: 0 });
      gsap.set(col2, { y: 500, opacity: 0 });
      gsap.set(col3, { y: 640, opacity: 0 });

      // Pinned scrub timeline:
      // As user scrolls down:
      // 1. Column 1 pops up to full tall height (showing header, title, and body clearly)
      // 2. Column 2 pops up to full tall height next
      // 3. Column 3 pops up to full tall height next
      // 4. All 3 lock into an aligned row before normal scrolling continues into FAQs!
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          pin: true,
          start: "top top",
          end: "+=170%",
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Header gently shifts up slightly to provide maximum space for popup columns
      if (header) {
        tl.to(header, { y: -30, opacity: 0.9, ease: "power1.out", duration: 0.6 }, 0.0);
      }

      // Column 1 pops up to prominent full height (0.0 -> 0.38)
      tl.to(col1, { y: 0, opacity: 1, ease: "power2.out", duration: 0.38 }, 0.0);

      // Column 2 pops up to prominent full height (0.30 -> 0.68)
      tl.to(col2, { y: 0, opacity: 1, ease: "power2.out", duration: 0.38 }, 0.30);

      // Column 3 pops up to prominent full height (0.60 -> 0.96)
      tl.to(col3, { y: 0, opacity: 1, ease: "power2.out", duration: 0.38 }, 0.60);
    });

    return () => {
      mm.revert();
    };
  }, [reduce]);

  return (
    <section
      ref={containerRef}
      id="workflow-faq"
      aria-label="LeadFlow Real-Life Architectural Workflow and FAQs"
      className="relative mx-3 sm:mx-5 md:mx-8 lg:mx-10 xl:mx-14 max-w-[1680px] 2xl:mx-auto bg-white text-[#0B1B3D] border border-slate-200/90 rounded-[32px] sm:rounded-[44px] md:rounded-[54px] lg:rounded-[64px] xl:rounded-[72px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.35)] select-none"
      style={{ fontFamily: "var(--font-sans), 'Geist', sans-serif" }}
    >
      {/* Subtle Engineering Drafting Grid on Pure White Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(11,27,61,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,27,61,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════════════════════════════════════
          PINNED STAGE: HEADER + 3 TALL POPUP COLUMNS (ROUNDED TOP CORNERS)
         ══════════════════════════════════════════════════════════════════════════ */}
      <div
        ref={stageRef}
        className="relative w-full h-screen min-h-[760px] max-h-[960px] flex flex-col justify-between overflow-hidden z-10 bg-white rounded-t-[32px] sm:rounded-t-[44px] md:rounded-t-[54px] lg:rounded-t-[64px] xl:rounded-t-[72px]"
      >
        {/* Top Header Block: Center-Aligned Title & Subtitle (No Image) */}
        <div
          ref={headerRef}
          className="relative z-30 shrink-0 flex-1 flex flex-col justify-center items-center text-center px-6 sm:px-10 lg:px-14 py-8 sm:py-12 max-w-4xl mx-auto"
        >
          {/* Engineering Crosshair Accents */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-slate-400 text-xs select-none">[01]</span>
            <span
              className="font-mono text-[11px] sm:text-xs text-[#0B1B3D]/70 tracking-[0.25em] uppercase font-semibold"
              style={{ fontFamily: "var(--font-mono), 'Geist Mono', monospace" }}
            >
              AUTONOMOUS ARCHITECTURE
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-[-0.035em] text-[#0B1B3D] uppercase leading-[1.08] mb-4 sm:mb-5">
            FROM PROSPECT TO PIPELINE, <br className="hidden sm:inline" />
            IN 3 STEPS
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-6">
            Cut the manual work, keep your focus on high-intent deals, and stay in control of every conversation.
          </p>

          <div
            className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-500 tracking-[0.22em] uppercase font-semibold py-1.5 px-3.5 rounded-full border border-slate-200 bg-slate-50/80"
            style={{ fontFamily: "var(--font-mono), 'Geist Mono', monospace" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B1B3D] animate-ping" />
            <span>SCROLL TO EXPLORE WORKFLOW</span>
          </div>
        </div>

        {/* ── THREE-COLUMN WORKFLOW GRID (TALL POPUP CARDS MATCHING SCREENSHOT 2) ── */}
        <div className="relative border-t border-slate-200 bg-white z-20 shrink-0 overflow-hidden shadow-[0_-8px_32px_rgba(0,0,0,0.03)]">
          <div className="max-w-[1680px] mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-slate-200 relative bg-white">
            {/* Engineering Crosshairs */}
            <span className="absolute top-2.5 left-4 font-mono text-slate-400 text-xs select-none z-30">+</span>
            <span className="absolute top-2.5 right-4 font-mono text-slate-400 text-xs select-none z-30">+</span>

            {/* Column 1 */}
            <div
              ref={col1Ref}
              className="bg-white p-7 sm:p-9 lg:p-10 flex flex-col justify-start min-h-[260px] sm:min-h-[290px] lg:min-h-[320px] will-change-transform"
            >
              <div
                className="flex items-center justify-between text-xs sm:text-sm text-slate-400 pb-3.5 border-b border-dashed border-slate-300 mb-5"
                style={{ fontFamily: "var(--font-mono), 'Geist Mono', monospace" }}
              >
                <span className="tracking-[0.18em] uppercase font-semibold text-slate-400">STEP</span>
                <span className="font-bold text-[#D93D94] tracking-wider text-sm sm:text-base">[{WORKFLOW_STEPS[0].stepNumber}]</span>
              </div>
              <h3 className="text-2xl sm:text-2xl lg:text-[1.85rem] font-bold text-[#0B1B3D] uppercase tracking-[-0.03em] leading-tight mb-4">
                {WORKFLOW_STEPS[0].title}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md">
                {WORKFLOW_STEPS[0].description}
              </p>
            </div>

            {/* Column 2 */}
            <div
              ref={col2Ref}
              className="bg-white p-7 sm:p-9 lg:p-10 flex flex-col justify-start min-h-[260px] sm:min-h-[290px] lg:min-h-[320px] will-change-transform"
            >
              <div
                className="flex items-center justify-between text-xs sm:text-sm text-slate-400 pb-3.5 border-b border-dashed border-slate-300 mb-5"
                style={{ fontFamily: "var(--font-mono), 'Geist Mono', monospace" }}
              >
                <span className="tracking-[0.18em] uppercase font-semibold text-slate-400">STEP</span>
                <span className="font-bold text-[#D93D94] tracking-wider text-sm sm:text-base">[{WORKFLOW_STEPS[1].stepNumber}]</span>
              </div>
              <h3 className="text-2xl sm:text-2xl lg:text-[1.85rem] font-bold text-[#0B1B3D] uppercase tracking-[-0.03em] leading-tight mb-4">
                {WORKFLOW_STEPS[1].title}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md">
                {WORKFLOW_STEPS[1].description}
              </p>
            </div>

            {/* Column 3 */}
            <div
              ref={col3Ref}
              className="bg-white p-7 sm:p-9 lg:p-10 flex flex-col justify-start min-h-[260px] sm:min-h-[290px] lg:min-h-[320px] will-change-transform"
            >
              <div
                className="flex items-center justify-between text-xs sm:text-sm text-slate-400 pb-3.5 border-b border-dashed border-slate-300 mb-5"
                style={{ fontFamily: "var(--font-mono), 'Geist Mono', monospace" }}
              >
                <span className="tracking-[0.18em] uppercase font-semibold text-slate-400">STEP</span>
                <span className="font-bold text-[#D93D94] tracking-wider text-sm sm:text-base">[{WORKFLOW_STEPS[2].stepNumber}]</span>
              </div>
              <h3 className="text-2xl sm:text-2xl lg:text-[1.85rem] font-bold text-[#0B1B3D] uppercase tracking-[-0.03em] leading-tight mb-4">
                {WORKFLOW_STEPS[2].title}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md">
                {WORKFLOW_STEPS[2].description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          STAGE 2: FAQ SECTION (MATCHING REF 4 2-COLUMN ACCORDION - ROUNDED BOTTOM CORNERS)
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="relative border-t border-slate-200 bg-white rounded-b-[32px] sm:rounded-b-[44px] md:rounded-b-[54px] lg:rounded-b-[64px] xl:rounded-b-[72px] overflow-hidden">
        <div className="max-w-[1680px] mx-auto grid grid-cols-1 lg:grid-cols-12 relative bg-white">
          {/* Engineering Crosshairs */}
          <span className="absolute top-3 left-4 font-mono text-slate-400 text-xs select-none">+</span>
          <span className="absolute top-3 right-4 font-mono text-slate-400 text-xs select-none">+</span>

          {/* ── LEFT COLUMN: DISPLAY TITLE & STIPPLE TEXTURE ── */}
          <div className="lg:col-span-5 xl:col-span-4 p-8 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white flex flex-col justify-between relative overflow-hidden">
            {/* Technical Dot Matrix Grid Texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage: "radial-gradient(#0B1B3D 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10">
              <span
                className="text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold block mb-4"
                style={{ fontFamily: "var(--font-mono), 'Geist Mono', monospace" }}
              >
                FAQS
              </span>

              <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold tracking-[-0.04em] text-[#0B1B3D] uppercase leading-[0.96]">
                GOT QUESTIONS? <br />
                WE&apos;VE GOT <br />
                ANSWERS
              </h2>
            </div>

            <div
              className="relative z-10 pt-8 sm:pt-12 text-slate-500 text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-mono), 'Geist Mono', monospace" }}
            >
              <p>Everything you need to know about setting up LeadFlow with your existing prospect workflow.</p>
            </div>
          </div>

          {/* ── RIGHT COLUMN: EXPANDABLE FAQS (ACCORDION) ── */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white p-6 sm:p-10 lg:p-14 divide-y divide-slate-200">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.id} className="py-5 sm:py-6 first:pt-0 last:pb-0">
                  <button
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer select-none"
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      <span
                        className="text-xs sm:text-sm font-bold text-[#D93D94]"
                        style={{ fontFamily: "var(--font-mono), 'Geist Mono', monospace" }}
                      >
                        {faq.id}.
                      </span>
                      <h3 className="text-base sm:text-lg lg:text-[1.12rem] font-bold text-[#0B1B3D] uppercase tracking-[-0.02em] group-hover:text-[#D93D94] transition-colors">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isOpen
                          ? "bg-[#D93D94] border-[#D93D94] text-white rotate-45"
                          : "bg-white text-slate-600 group-hover:border-[#0B1B3D] group-hover:text-[#0B1B3D]"
                      }`}
                    >
                      <Plus size={15} weight="bold" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={reduce ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={reduce ? { opacity: 0, height: 0 } : { opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pt-3.5 sm:pt-4 pl-7 sm:pl-9 text-slate-600 text-sm sm:text-base leading-relaxed pr-6">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WorkflowFaq;
