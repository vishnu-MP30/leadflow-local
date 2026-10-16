"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";

// ── 4 REFINED LEADFLOW WORKFLOW PHASES (REDUCED TO 2 CLEAN POINTS, CENTER ALIGNED) ──
interface StepData {
  number: string;
  letter: string;
  name: string;
  title: string;
  lead: string;
  bullets: Array<{
    text: string;
    highlight?: string;
  }>;
}

const workflowSteps: StepData[] = [
  {
    number: "01",
    letter: "R",
    name: "RESEARCH",
    title: "Research.",
    lead: "Start with your existing prospect list. LeadFlow helps your team understand relevant prospect and company context before reaching out.",
    bullets: [
      {
        text: "work from existing prospect lists and LinkedIn profile URLs.",
        highlight: "LinkedIn profile URLs",
      },
      {
        text: "enrich records with verified professional and company signals before reaching out.",
      },
    ],
  },
  {
    number: "02",
    letter: "P",
    name: "PERSONALISE",
    title: "Personalise.",
    lead: "Generic messages get ignored. LeadFlow helps your team create personalised outreach using the information available about each prospect.",
    bullets: [
      {
        text: "generate tailored outreach messages using relevant prospect context.",
      },
      {
        text: "prepare personalised copy for supported LinkedIn and email channels.",
        highlight: "LinkedIn and email channels",
      },
    ],
  },
  {
    number: "03",
    letter: "C",
    name: "COORDINATE",
    title: "Coordinate.",
    lead: "Bring LinkedIn outreach and email follow-ups into one organised workflow to help your team maintain consistent communication.",
    bullets: [
      {
        text: "coordinate multi-channel outreach across supported communication paths.",
      },
      {
        text: "manage follow-ups through an organised sequence that pauses when prospects engage.",
        highlight: "organised sequence",
      },
    ],
  },
  {
    number: "04",
    letter: "P",
    name: "PROGRESS",
    title: "Progress.",
    lead: "Identify meaningful replies, focus on interested prospects, and help move promising conversations towards a sales meeting.",
    bullets: [
      {
        text: "detect, classify, and review prospect replies and intent signals.",
      },
      {
        text: "help interested prospects move towards a meeting through the supported scheduling workflow.",
        highlight: "scheduling workflow",
      },
    ],
  },
];

export function PipelineVelocity() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Active step tracker (0: Intro, 1: Step 01, 2: Step 02, 3: Step 03, 4: Step 04)
  const [activeStep, setActiveStep] = useState(0);
  const [progressString, setProgressString] = useState("020%");

  // Track vertical scroll across the tall scrollytelling container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Keep state updated for telemetry & interactive bottom timeline
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const pct = Math.min(100, Math.max(0, Math.round(latest * 100)));
    setProgressString(String(pct).padStart(3, "0") + "%");

    if (latest < 0.15) {
      setActiveStep(0);
    } else if (latest < 0.36) {
      setActiveStep(1);
    } else if (latest < 0.57) {
      setActiveStep(2);
    } else if (latest < 0.78) {
      setActiveStep(3);
    } else {
      setActiveStep(4);
    }
  });

  // Smooth scroll jump helper when clicking bottom timeline node
  const scrollToPhase = (phaseIndex: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const targetMap = [0.05, 0.24, 0.45, 0.66, 0.88];
    const targetProgress = targetMap[phaseIndex] ?? 0.05;
    const rect = container.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const scrollDistance = container.offsetHeight - window.innerHeight;
    const targetY = absoluteTop + scrollDistance * targetProgress;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  // ── FRAME 0: INTRO SCREEN ("The 4 method.") ──
  // Vanishes completely after scrolling (display: none when scroll >= 0.15), shows only when scrolled back up
  const introOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.14],
    [1, 1, 0],
    { clamp: true }
  );
  const introY = useTransform(
    scrollYProgress,
    [0, 0.08, 0.14],
    ["0px", "0px", "-20px"],
    { clamp: true }
  );
  const introDisplay = useTransform(scrollYProgress, (v) =>
    v >= 0.15 ? "none" : "flex"
  );

  // ── STEP 01 ("Research.") ──
  const step1Opacity = useTransform(
    scrollYProgress,
    [0.13, 0.19, 0.30, 0.36],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const step1X = useTransform(
    scrollYProgress,
    [0.13, 0.19, 0.30, 0.36],
    reduce ? ["0px", "0px", "0px", "0px"] : ["40px", "0px", "0px", "-40px"],
    { clamp: true }
  );
  const step1Display = useTransform(scrollYProgress, (v) =>
    v < 0.13 || v >= 0.36 ? "none" : "flex"
  );

  // ── STEP 02 ("Personalise.") ──
  const step2Opacity = useTransform(
    scrollYProgress,
    [0.34, 0.40, 0.51, 0.57],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const step2X = useTransform(
    scrollYProgress,
    [0.34, 0.40, 0.51, 0.57],
    reduce ? ["0px", "0px", "0px", "0px"] : ["40px", "0px", "0px", "-40px"],
    { clamp: true }
  );
  const step2Display = useTransform(scrollYProgress, (v) =>
    v < 0.34 || v >= 0.57 ? "none" : "flex"
  );

  // ── STEP 03 ("Coordinate.") ──
  const step3Opacity = useTransform(
    scrollYProgress,
    [0.55, 0.61, 0.72, 0.78],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const step3X = useTransform(
    scrollYProgress,
    [0.55, 0.61, 0.72, 0.78],
    reduce ? ["0px", "0px", "0px", "0px"] : ["40px", "0px", "0px", "-40px"],
    { clamp: true }
  );
  const step3Display = useTransform(scrollYProgress, (v) =>
    v < 0.55 || v >= 0.78 ? "none" : "flex"
  );

  // ── STEP 04 ("Progress.") ──
  const step4Opacity = useTransform(
    scrollYProgress,
    [0.76, 0.82, 1.0],
    [0, 1, 1],
    { clamp: true }
  );
  const step4X = useTransform(
    scrollYProgress,
    [0.76, 0.82, 1.0],
    reduce ? ["0px", "0px", "0px"] : ["40px", "0px", "0px"],
    { clamp: true }
  );
  const step4Display = useTransform(scrollYProgress, (v) =>
    v < 0.76 ? "none" : "flex"
  );

  // Bottom Timeline visibility (fades in as user scrolls out of Intro frame)
  const timelineOpacity = useTransform(
    scrollYProgress,
    [0.10, 0.16],
    [0, 1],
    { clamp: true }
  );
  const timelineDisplay = useTransform(scrollYProgress, (v) =>
    v < 0.12 ? "none" : "flex"
  );

  return (
    <section
      ref={containerRef}
      id="pipeline-velocity"
      className="relative h-[460vh] bg-transparent text-[#0B1B3D] select-none mx-3 sm:mx-5 md:mx-8 lg:mx-10 xl:mx-14 max-w-[1680px] 2xl:mx-auto my-6 sm:my-10 md:my-14"
    >
      {/* ══════════════════════════════════════════════════════════
          PINNED STICKY STAGE (ROUNDED WHITE PAGE WITH CORNERS ON TOP & BOTTOM)
         ══════════════════════════════════════════════════════════ */}
      <div className="sticky top-3 sm:top-4 md:top-6 h-[calc(100vh-1.5rem)] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] w-full overflow-hidden bg-white text-[#0B1B3D] rounded-[32px] sm:rounded-[44px] md:rounded-[54px] lg:rounded-[64px] xl:rounded-[72px] shadow-[0_25px_70px_rgba(0,0,0,0.45)] z-20 flex items-center justify-center">
        
        {/* ── TOP SECTION HEADER (MINIMALIST & UNOBTRUSIVE) ── */}
        <div className="absolute top-6 sm:top-8 left-6 sm:left-12 lg:left-16 z-30 flex items-center gap-2.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#0B1B3D]/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3388]" />
          <span>THE LEADFLOW PIPELINE ENGINE</span>
        </div>

        {/* ── RIGHT EDGE TELEMETRY SCROLL INDICATOR (| 025%) ── */}
        <div className="absolute right-4 sm:right-8 lg:right-12 top-1/2 -translate-y-1/2 z-30 flex items-center gap-2 font-mono text-[11px] sm:text-xs text-[#0B1B3D]/60 font-medium select-none pointer-events-none">
          <span className="w-px h-3.5 bg-slate-300" />
          <span>{progressString}</span>
        </div>

        {/* ══════════════════════════════════════════════════════════
            FRAME 0: INTRO SCREEN (EXACT REFERENCE IMAGE 1)
            [ THE FRAMEWORK ]
            The 4 method.
            VANISHES COMPLETELY WHEN SCROLLED PAST (display: none)
           ══════════════════════════════════════════════════════════ */}
        <motion.div
          style={{
            opacity: introOpacity,
            y: introY,
            display: introDisplay,
          }}
          className="absolute inset-0 flex-col items-center justify-center text-center px-6 sm:px-12 z-20"
        >
          {/* Eyebrow badge in brackets */}
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-[#0B1B3D]/60 mb-5 sm:mb-6 font-medium">
            [ THE FRAMEWORK ]
          </div>

          {/* Large display headline with period in brand deep blue */}
          <h2 className="font-sans font-black text-6xl sm:text-7xl md:text-8xl lg:text-[5.5rem] text-[#0B1B3D] tracking-tight leading-none mb-6 sm:mb-8">
            The 4 method.
          </h2>

          {/* Centered, balanced paragraph copy */}
          <p className="font-mono text-xs sm:text-sm md:text-base text-[#0B1B3D]/75 max-w-xl mx-auto leading-relaxed mb-10 sm:mb-12 font-normal">
            Technology accelerates faster every day. Most sales pipelines fall behind.
            LeadFlow is the continuous four-phase engine that closes that gap — turning
            cold prospect lists into predictable revenue conversations. No bloat.
            No spam. No excuses.
          </p>

          {/* Phase preview line with accent on the final milestone */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#0B1B3D]/70">
            <button
              onClick={() => scrollToPhase(1)}
              className="hover:text-[#0B1B3D] transition-colors cursor-pointer"
            >
              DISCOVER
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => scrollToPhase(2)}
              className="hover:text-[#0B1B3D] transition-colors cursor-pointer"
            >
              DIAGNOSE
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => scrollToPhase(3)}
              className="hover:text-[#0B1B3D] transition-colors cursor-pointer"
            >
              COORDINATE
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => scrollToPhase(4)}
              className="text-[#FF3388] font-semibold hover:text-[#FF1A75] transition-colors cursor-pointer"
            >
              PROGRESS
            </button>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════
            STEP 01: RESEARCH (CENTER ALIGNED, DEEP BLUE TEXT #0B1B3D)
           ══════════════════════════════════════════════════════════ */}
        <motion.div
          style={{
            x: step1X,
            opacity: step1Opacity,
            display: step1Display,
          }}
          className="absolute inset-0 flex-col items-center justify-center px-6 sm:px-12 md:px-20 z-10"
        >
          <div className="w-full max-w-xl mx-auto text-center relative">
            {/* Center-aligned watermark number 01 nested directly behind the title */}
            <span className="absolute -top-10 sm:-top-14 md:-top-16 left-1/2 -translate-x-1/2 font-sans font-black text-[120px] sm:text-[170px] md:text-[210px] text-[#E9EEF4]/75 leading-none pointer-events-none select-none -z-10">
              01
            </span>

            {/* Display title (Center-aligned, brand deep blue) */}
            <h3 className="font-sans font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#0B1B3D] tracking-tight leading-none mb-5 sm:mb-6">
              Research.
            </h3>

            {/* Dividing line (Centered) */}
            <div className="w-14 h-px bg-slate-300 mx-auto mb-6 sm:mb-7" />

            {/* Single punchy lead statement (Centered) */}
            <p className="font-mono text-sm sm:text-base md:text-lg text-[#0B1B3D] max-w-lg mx-auto leading-relaxed mb-6 sm:mb-8 font-normal">
              {workflowSteps[0].lead}
            </p>

            {/* 2 Refined Bullets (Centered Block, Clean Aligned Points) */}
            <div className="space-y-3 font-mono text-xs sm:text-sm text-[#0B1B3D]/80 max-w-lg mx-auto leading-relaxed text-left">
              {workflowSteps[0].bullets.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-slate-400 select-none font-semibold shrink-0">—</span>
                  <span>
                    {b.highlight ? (
                      <>
                        {b.text.split(b.highlight)[0]}
                        <span className="bg-slate-100 text-[#0B1B3D] px-1.5 py-0.5 rounded-[3px] font-medium">
                          {b.highlight}
                        </span>
                        {b.text.split(b.highlight)[1]}
                      </>
                    ) : (
                      b.text
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════
            STEP 02: PERSONALISE (CENTER ALIGNED, DEEP BLUE TEXT #0B1B3D)
           ══════════════════════════════════════════════════════════ */}
        <motion.div
          style={{
            x: step2X,
            opacity: step2Opacity,
            display: step2Display,
          }}
          className="absolute inset-0 flex-col items-center justify-center px-6 sm:px-12 md:px-20 z-10"
        >
          <div className="w-full max-w-xl mx-auto text-center relative">
            {/* Center-aligned watermark number 02 */}
            <span className="absolute -top-10 sm:-top-14 md:-top-16 left-1/2 -translate-x-1/2 font-sans font-black text-[120px] sm:text-[170px] md:text-[210px] text-[#E9EEF4]/75 leading-none pointer-events-none select-none -z-10">
              02
            </span>

            {/* Display title */}
            <h3 className="font-sans font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#0B1B3D] tracking-tight leading-none mb-5 sm:mb-6">
              Personalise.
            </h3>

            {/* Dividing line (Centered) */}
            <div className="w-14 h-px bg-slate-300 mx-auto mb-6 sm:mb-7" />

            {/* Single punchy lead statement */}
            <p className="font-mono text-sm sm:text-base md:text-lg text-[#0B1B3D] max-w-lg mx-auto leading-relaxed mb-6 sm:mb-8 font-normal">
              {workflowSteps[1].lead}
            </p>

            {/* 2 Refined Bullets */}
            <div className="space-y-3 font-mono text-xs sm:text-sm text-[#0B1B3D]/80 max-w-lg mx-auto leading-relaxed text-left">
              {workflowSteps[1].bullets.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-slate-400 select-none font-semibold shrink-0">—</span>
                  <span>
                    {b.highlight ? (
                      <>
                        {b.text.split(b.highlight)[0]}
                        <span className="bg-slate-100 text-[#0B1B3D] px-1.5 py-0.5 rounded-[3px] font-medium">
                          {b.highlight}
                        </span>
                        {b.text.split(b.highlight)[1]}
                      </>
                    ) : (
                      b.text
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════
            STEP 03: COORDINATE (CENTER ALIGNED, DEEP BLUE TEXT #0B1B3D)
           ══════════════════════════════════════════════════════════ */}
        <motion.div
          style={{
            x: step3X,
            opacity: step3Opacity,
            display: step3Display,
          }}
          className="absolute inset-0 flex-col items-center justify-center px-6 sm:px-12 md:px-20 z-10"
        >
          <div className="w-full max-w-xl mx-auto text-center relative">
            {/* Center-aligned watermark number 03 */}
            <span className="absolute -top-10 sm:-top-14 md:-top-16 left-1/2 -translate-x-1/2 font-sans font-black text-[120px] sm:text-[170px] md:text-[210px] text-[#E9EEF4]/75 leading-none pointer-events-none select-none -z-10">
              03
            </span>

            {/* Display title */}
            <h3 className="font-sans font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#0B1B3D] tracking-tight leading-none mb-5 sm:mb-6">
              Coordinate.
            </h3>

            {/* Dividing line (Centered) */}
            <div className="w-14 h-px bg-slate-300 mx-auto mb-6 sm:mb-7" />

            {/* Single punchy lead statement */}
            <p className="font-mono text-sm sm:text-base md:text-lg text-[#0B1B3D] max-w-lg mx-auto leading-relaxed mb-6 sm:mb-8 font-normal">
              {workflowSteps[2].lead}
            </p>

            {/* 2 Refined Bullets */}
            <div className="space-y-3 font-mono text-xs sm:text-sm text-[#0B1B3D]/80 max-w-lg mx-auto leading-relaxed text-left">
              {workflowSteps[2].bullets.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-slate-400 select-none font-semibold shrink-0">—</span>
                  <span>
                    {b.highlight ? (
                      <>
                        {b.text.split(b.highlight)[0]}
                        <span className="bg-slate-100 text-[#0B1B3D] px-1.5 py-0.5 rounded-[3px] font-medium">
                          {b.highlight}
                        </span>
                        {b.text.split(b.highlight)[1]}
                      </>
                    ) : (
                      b.text
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════
            STEP 04: PROGRESS (CENTER ALIGNED, DEEP BLUE TEXT #0B1B3D)
           ══════════════════════════════════════════════════════════ */}
        <motion.div
          style={{
            x: step4X,
            opacity: step4Opacity,
            display: step4Display,
          }}
          className="absolute inset-0 flex-col items-center justify-center px-6 sm:px-12 md:px-20 z-10"
        >
          <div className="w-full max-w-xl mx-auto text-center relative">
            {/* Center-aligned watermark number 04 */}
            <span className="absolute -top-10 sm:-top-14 md:-top-16 left-1/2 -translate-x-1/2 font-sans font-black text-[120px] sm:text-[170px] md:text-[210px] text-[#E9EEF4]/75 leading-none pointer-events-none select-none -z-10">
              04
            </span>

            {/* Display title */}
            <h3 className="font-sans font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#0B1B3D] tracking-tight leading-none mb-5 sm:mb-6">
              Progress.
            </h3>

            {/* Dividing line (Centered) */}
            <div className="w-14 h-px bg-slate-300 mx-auto mb-6 sm:mb-7" />

            {/* Single punchy lead statement */}
            <p className="font-mono text-sm sm:text-base md:text-lg text-[#0B1B3D] max-w-lg mx-auto leading-relaxed mb-6 sm:mb-8 font-normal">
              {workflowSteps[3].lead}
            </p>

            {/* 2 Refined Bullets */}
            <div className="space-y-3 font-mono text-xs sm:text-sm text-[#0B1B3D]/80 max-w-lg mx-auto leading-relaxed text-left">
              {workflowSteps[3].bullets.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-slate-400 select-none font-semibold shrink-0">—</span>
                  <span>
                    {b.highlight ? (
                      <>
                        {b.text.split(b.highlight)[0]}
                        <span className="bg-slate-100 text-[#0B1B3D] px-1.5 py-0.5 rounded-[3px] font-medium">
                          {b.highlight}
                        </span>
                        {b.text.split(b.highlight)[1]}
                      </>
                    ) : (
                      b.text
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════
            BOTTOM CONNECTED TIMELINE RAIL (EXACT REFERENCE IMAGE 3)
           ══════════════════════════════════════════════════════════ */}
        <motion.div
          style={{
            opacity: timelineOpacity,
            display: timelineDisplay,
          }}
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex-col items-center pointer-events-auto select-none"
        >
          {/* Connected timeline track */}
          <div className="relative flex items-center justify-between w-64 sm:w-80 mb-2.5">
            {/* Connecting baseline rule */}
            <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-px bg-slate-200 -z-0" />

            {/* Nodes: R ── P ── C ── P */}
            {workflowSteps.map((step, idx) => {
              const stepIndex = idx + 1;
              const isActive = activeStep === stepIndex;
              const isPast = activeStep > stepIndex;

              return (
                <button
                  key={step.number}
                  onClick={() => scrollToPhase(stepIndex)}
                  className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                  aria-label={`Jump to ${step.name}`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-[#0B1B3D] text-white shadow-[0_0_18px_rgba(255,51,136,0.4)] scale-110"
                        : isPast
                        ? "bg-slate-200 text-[#0B1B3D]"
                        : "bg-white border border-slate-300 text-slate-400 group-hover:border-slate-500 group-hover:text-slate-700"
                    }`}
                  >
                    {step.letter}
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF3388] ring-2 ring-white animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Step name labels underneath in Geist Mono */}
          <div className="flex items-center justify-between w-72 sm:w-96 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-slate-400">
            {workflowSteps.map((step, idx) => {
              const stepIndex = idx + 1;
              const isActive = activeStep === stepIndex;
              return (
                <span
                  key={step.number}
                  className={`transition-colors duration-200 ${
                    isActive ? "text-[#0B1B3D] font-bold" : ""
                  }`}
                >
                  {step.name}
                </span>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default PipelineVelocity;
