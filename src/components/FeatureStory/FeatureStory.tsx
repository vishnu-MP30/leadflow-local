/**
 * ══════════════════════════════════════════════════════════════════════════════
 * FEATURE STORY — PINNED SCROLL-SCRUBBED PIPELINE ENGINE
 * ══════════════════════════════════════════════════════════════════════════════
 * 
 * HOW THE TIMELINE WORKS:
 * 1. The stage pins when its top hits the top of the viewport (pin: true, scrub: 0.8).
 * 2. Total scroll distance is (N * 100)% of viewport height.
 * 3. Each step has a hold duration where its content is fully visible.
 * 4. Between step i and step i+1, a signature 1.5px accent line travels from y = 100% to 0%.
 *    Simultaneously, the incoming panel is unclipped with clipPath: inset(100% 0 0 0) -> inset(0% 0 0 0).
 *    The outgoing panel fades to 0.35 and lifts -3vh.
 * 5. At the 50% midpoint of the line transit, the active tab state switches in both directions.
 * 
 * HOW TO ADD A NEW STEP:
 * 1. Open `src/components/FeatureStory/steps-config.ts`.
 * 2. Add a new object to the `steps` array with index, tabLabel, eyebrow, heading, paragraph, bullets, coordinates.
 * 3. Create a corresponding visual in `src/components/FeatureStory/visuals/` or map in `VISUAL_COMPONENTS`.
 * 4. The tab rail automatically renders N equal columns, and GSAP computes the end scroll distance dynamically.
 */

"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FEATURE_STORY_CONFIG, StepItem } from "./steps-config";
import { ResearchVisual } from "./visuals/ResearchVisual";
import { PersonaliseVisual } from "./visuals/PersonaliseVisual";
import { CoordinateVisual } from "./visuals/CoordinateVisual";
import { ProgressVisual } from "./visuals/ProgressVisual";

// Ensure GSAP plugins are registered safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const VISUAL_COMPONENTS: Record<string, React.FC> = {
  "step-1": ResearchVisual,
  "step-2": PersonaliseVisual,
  "step-3": CoordinateVisual,
  "step-4": ProgressVisual,
};

export function FeatureStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabRailRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeTab, setActiveTab] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const { theme, intro, steps } = FEATURE_STORY_CONFIG;

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    if (mediaQuery.matches) {
      return;
    }

    const mm = gsap.matchMedia();
    const container = containerRef.current;
    const stage = stageRef.current;
    const line = lineRef.current;

    if (!container || !stage || !line) return;

    // Desktop Experience (>= 1024px): Full pinned, scrubbed signature line wipe
    mm.add("(min-width: 1024px)", () => {
      const panels = panelsRef.current.filter(Boolean) as HTMLDivElement[];
      if (panels.length < steps.length) return;

      // Set initial states for panels
      // First panel is visible and unclipped
      gsap.set(panels[0], {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        y: "0vh",
        zIndex: 1,
      });

      // Subsequent panels start fully clipped at bottom edge
      for (let i = 1; i < panels.length; i++) {
        gsap.set(panels[i], {
          clipPath: "inset(100% 0% 0% 0%)",
          opacity: 1,
          y: "0vh",
          zIndex: i + 1,
        });
      }

      // Transition line starts hidden at bottom
      gsap.set(line, {
        top: "100%",
        opacity: 0,
      });

      // Master Timeline bound to ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          pin: true,
          scrub: FEATURE_STORY_CONFIG.animation.scrub,
          start: "top top",
          end: `+=${steps.length * 100}%`,
          anticipatePin: FEATURE_STORY_CONFIG.animation.pinAnticipate,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Update active tab accurately across both forward & reverse scroll
            const progress = self.progress;
            const stepFraction = 1 / steps.length;
            const currentStep = Math.min(
              steps.length - 1,
              Math.floor(progress / stepFraction)
            );
            setActiveTab(currentStep);
          },
        },
      });

      // Structure uniform timeline with hold -> transition -> hold segments
      steps.forEach((step, i) => {
        tl.addLabel(`step${i + 1}`);

        // Hold segment for step i
        tl.to({}, { duration: 0.6 });

        // If there is a next step, animate the signature transition
        if (i < steps.length - 1) {
          const outgoingPanel = panels[i];
          const incomingPanel = panels[i + 1];
          const outgoingText = outgoingPanel.querySelector(".story-text");
          const incomingText = incomingPanel.querySelector(".story-text");

          // 1. Signature Traveling Line (Bottom edge to Top edge)
          tl.fromTo(
            line,
            { top: "100%", opacity: 1 },
            { top: "0%", opacity: 1, ease: "none", duration: 1.2 },
            `transition-${i}`
          );

          // 2. Incoming Panel reveals simultaneously with line: clip-path inset(100% 0 0 0) -> inset(0% 0 0 0)
          tl.fromTo(
            incomingPanel,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1.2 },
            `transition-${i}`
          );

          // 3. Outgoing Panel ghosting: opacity 1 -> 0.35, y 0 -> -3vh
          tl.to(
            outgoingPanel,
            { opacity: 0.35, y: "-3vh", ease: "power1.inOut", duration: 1.0 },
            `transition-${i}`
          );

          if (outgoingText) {
            tl.to(
              outgoingText,
              { opacity: 0.3, ease: "none", duration: 0.8 },
              `transition-${i}`
            );
          }

          // 4. Incoming Text: starts muted/semi-transparent and animates to full ink as line passes ~60%
          if (incomingText) {
            tl.fromTo(
              incomingText,
              { opacity: 0.4 },
              { opacity: 1, ease: "power2.out", duration: 0.6 },
              `transition-${i}+=0.6`
            );
          }

          // Fade out the traveling line right when it reaches top
          tl.to(line, { opacity: 0, duration: 0.1 }, `transition-${i}+=1.2`);
        }
      });
    });

    return () => {
      mm.revert();
    };
  }, [steps, isReducedMotion]);

  const [activeMobileTab, setActiveMobileTab] = useState(0);

  // Mobile scroll observer to update active tab indicator
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-step-index"));
            if (!isNaN(index)) {
              setActiveMobileTab(index);
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -40% 0px",
        threshold: 0.1,
      }
    );

    const stepElements = document.querySelectorAll("[data-step-index]");
    stepElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [steps]);

  // Tab click smooth scroll navigation (Desktop)
  const handleTabClick = (index: number) => {
    setActiveTab(index);
    if (!stageRef.current) return;

    const stageTop = stageRef.current.getBoundingClientRect().top + window.scrollY;
    const stageHeight = window.innerHeight;
    const targetScroll = stageTop + index * stageHeight;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  // Tab click smooth scroll navigation (Mobile)
  const handleMobileTabClick = (index: number) => {
    setActiveMobileTab(index);
    const targetEl = document.getElementById(`mobile-step-${index}`);
    if (targetEl) {
      const yOffset = -90;
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      id="pipeline-velocity"
      aria-label="LeadFlow Pipeline Engine Feature Story"
      className="relative bg-transparent text-[#0B1B3D] select-none mx-3 sm:mx-5 md:mx-8 lg:mx-10 xl:mx-14 max-w-[1680px] 2xl:mx-auto my-6 sm:my-10 md:my-14"
    >
      {/* ══════════════════════════════════════════════════════════
          PINNED 100VH STAGE (DESKTOP ONLY SCROLLYTELLING >= 1024px)
         ══════════════════════════════════════════════════════════ */}
      <div
        ref={stageRef}
        className="hidden lg:flex relative h-screen w-full bg-white text-[#0B1B3D] rounded-[32px] sm:rounded-[44px] md:rounded-[54px] lg:rounded-[64px] border-2 border-[#0B1B3D] overflow-hidden flex-col z-20"
        style={{ boxShadow: "8px 8px 0px #0B1B3D" }}
      >
        {/* ── TOP STICKY TAB RAIL (4 Columns on Desktop) ── */}
        <nav
          ref={tabRailRef}
          aria-label="LeadFlow Engine Phases"
          className="w-full shrink-0 border-b-2 border-[#0B1B3D] bg-white z-40 grid grid-cols-4"
        >
          {steps.map((step, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={step.id}
                onClick={() => handleTabClick(idx)}
                aria-current={isActive ? "step" : undefined}
                className={`flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-r border-slate-200 last:border-r-0 font-mono text-xs transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#0B1B3D] text-white font-bold"
                    : "bg-white text-slate-600 hover:bg-slate-50 hover:text-[#0B1B3D]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={isActive ? "text-[#D93D94]" : "text-slate-400 font-normal"}>
                    [{step.index}]
                  </span>
                  <span className="tracking-wider uppercase font-semibold">{step.tabLabel}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D93D94] animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── THE SIGNATURE TRAVELING LINE (1.5px Accent Line) ── */}
        <div
          ref={lineRef}
          aria-hidden="true"
          className="absolute left-0 right-0 h-[2px] bg-[#D93D94] z-50 pointer-events-none"
          style={{
            boxShadow: "0 0 16px rgba(217, 61, 148, 0.8), 0 0 32px rgba(217, 61, 148, 0.4)",
          }}
        />

        {/* ── TWO-COLUMN STACKED PANELS CONTAINER (DESKTOP) ── */}
        <div className="relative flex-1 w-full overflow-hidden">
          {steps.map((step, idx) => {
            const VisualComponent = VISUAL_COMPONENTS[step.id] || ResearchVisual;

            return (
              <div
                key={step.id}
                ref={(el) => {
                  panelsRef.current[idx] = el;
                }}
                className={`absolute inset-0 w-full h-full bg-white flex flex-row items-center p-6 sm:p-10 lg:p-14 ${
                  isReducedMotion ? (activeTab === idx ? "opacity-100 relative" : "opacity-0 hidden") : ""
                }`}
              >
                {/* ── LEFT-EDGE VERTICAL RULER WITH TICK MARKS ── */}
                <div className="hidden lg:flex flex-col items-center justify-between h-[80%] w-5 mr-6 py-4 border-r border-slate-200 select-none opacity-40 shrink-0">
                  <span className="font-mono text-[9px] text-slate-400">00</span>
                  <div className="w-2 h-px bg-slate-300" />
                  <div className="w-1.5 h-px bg-slate-300" />
                  <div className="w-1.5 h-px bg-slate-300" />
                  <div className="w-2.5 h-px bg-[#D93D94]" />
                  <div className="w-1.5 h-px bg-slate-300" />
                  <div className="w-1.5 h-px bg-slate-300" />
                  <span className="font-mono text-[9px] text-slate-400">50</span>
                  <div className="w-2 h-px bg-slate-300" />
                  <div className="w-1.5 h-px bg-slate-300" />
                  <div className="w-1.5 h-px bg-slate-300" />
                  <div className="w-2.5 h-px bg-[#D93D94]" />
                  <div className="w-1.5 h-px bg-slate-300" />
                  <div className="w-1.5 h-px bg-slate-300" />
                  <span className="font-mono text-[9px] text-slate-400">99</span>
                </div>

                {/* ── LEFT COLUMN: 5/12 TEXT CONTENT + BLUEPRINT LABELS ── */}
                <div className="story-text w-full lg:w-5/12 flex flex-col justify-center pr-0 lg:pr-8 z-10 mb-6 lg:mb-0">
                  
                  {/* Left-Margin Step Index & Ruler Tick */}
                  <div className="flex items-center gap-3 font-mono text-xs text-slate-400 mb-3">
                    <span className="text-[#D93D94] font-bold">[{step.index}]</span>
                    <span className="w-8 h-px bg-slate-300" />
                    <span>{step.coordinates}</span>
                  </div>

                  {/* Mono Eyebrow in Brand Accent */}
                  <div className="font-mono text-xs uppercase tracking-[0.22em] text-[#D93D94] font-bold mb-3">
                    {step.eyebrow}
                  </div>

                  {/* Heading: Uppercase, tight letter spacing, fluid clamp size */}
                  <h3 className="font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] text-[#0B1B3D] tracking-tight leading-[1.08] mb-5">
                    {step.heading}
                  </h3>

                  {/* Concise paragraph copy in Geist */}
                  <p className="font-sans text-sm sm:text-base text-[#0B1B3D]/80 leading-relaxed mb-6 font-normal">
                    {step.paragraph}
                  </p>

                  {/* 2 Bullet Points with Clean Dashes & Syntax Highlights */}
                  <div className="space-y-2.5 font-mono text-xs text-[#0B1B3D]/85 border-l-2 border-slate-200 pl-4">
                    {step.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5">
                        <span className="text-[#D93D94] font-bold select-none">—</span>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>

                  {/* Progress Indicator Dots */}
                  <div className="mt-8 flex items-center gap-2">
                    {steps.map((_, dotIdx) => (
                      <div
                        key={dotIdx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeTab === dotIdx
                            ? "w-8 bg-[#D93D94]"
                            : dotIdx < activeTab
                            ? "w-3 bg-slate-400"
                            : "w-3 bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* ── RIGHT COLUMN: 7/12 BLUEPRINT SVG VISUAL ── */}
                <div className="w-full lg:w-7/12 h-full relative flex items-center justify-center bg-slate-50/60 rounded-2xl lg:rounded-3xl border border-slate-200/80 overflow-hidden">
                  {/* Crosshair markers at corners */}
                  <span className="absolute top-2 left-2 font-mono text-[10px] text-slate-400 select-none">+</span>
                  <span className="absolute top-2 right-2 font-mono text-[10px] text-slate-400 select-none">+</span>
                  <span className="absolute bottom-2 left-2 font-mono text-[10px] text-slate-400 select-none">+</span>
                  <span className="absolute bottom-2 right-2 font-mono text-[10px] text-slate-400 select-none">+</span>

                  {/* Render Visual */}
                  <VisualComponent />
                </div>

              </div>
            );
          })}
        </div>

        {/* Continuous bottom transition border into next section */}
        <div
          aria-hidden="true"
          className="w-full h-[2px] bg-[#D93D94] shrink-0"
          style={{
            boxShadow: "0 0 16px rgba(217, 61, 148, 0.6)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════
          MOBILE EXPERIENCE: NATURAL SCROLL STEP-BY-STEP (< 1024px)
         ══════════════════════════════════════════════════════════ */}
      <div className="block lg:hidden flex flex-col gap-6 sm:gap-8">
        {/* Mobile Sticky Tab Rail */}
        <div className="sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#0B1B3D] p-1.5 shadow-[4px_4px_0px_#0B1B3D]">
          <div className="grid grid-cols-4 gap-1">
            {steps.map((step, idx) => {
              const isActive = activeMobileTab === idx;
              return (
                <button
                  key={`tab-btn-${step.id}`}
                  type="button"
                  onClick={() => handleMobileTabClick(idx)}
                  className={`py-2 px-1 rounded-xl font-mono text-[11px] sm:text-xs transition-all duration-200 flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                    isActive
                      ? "bg-[#0B1B3D] text-white font-bold shadow-sm"
                      : "text-slate-600 hover:text-[#0B1B3D] hover:bg-slate-100"
                  }`}
                >
                  <span className={isActive ? "text-[#D93D94]" : "text-slate-400 font-normal text-[10px]"}>
                    [{step.index}]
                  </span>
                  <span className="truncate uppercase font-semibold text-[10px] sm:text-[11px]">
                    {step.tabLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vertical Step Cards */}
        {steps.map((step, idx) => {
          const VisualComponent = VISUAL_COMPONENTS[step.id] || ResearchVisual;

          return (
            <div
              key={`mobile-${step.id}`}
              id={`mobile-step-${idx}`}
              data-step-index={idx}
              className="bg-white text-[#0B1B3D] rounded-[28px] sm:rounded-[36px] border-2 border-[#0B1B3D] p-6 sm:p-8 flex flex-col gap-6 shadow-[6px_6px_0px_#0B1B3D] overflow-hidden"
            >
              {/* Step Header */}
              <div className="flex items-center justify-between font-mono text-xs text-slate-400 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[#D93D94] font-bold">[{step.index}]</span>
                  <span className="font-bold text-[#0B1B3D] uppercase tracking-wider">{step.tabLabel}</span>
                </div>
                <span className="text-[11px]">{step.coordinates}</span>
              </div>

              {/* Eyebrow & Headline */}
              <div>
                <div className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#D93D94] font-bold mb-2">
                  {step.eyebrow}
                </div>
                <h3 className="font-sans font-black text-2xl sm:text-3xl text-[#0B1B3D] tracking-tight leading-[1.12]">
                  {step.heading}
                </h3>
              </div>

              {/* Paragraph Copy */}
              <p className="font-sans text-sm sm:text-base text-[#0B1B3D]/80 leading-relaxed font-normal">
                {step.paragraph}
              </p>

              {/* Bullets */}
              <div className="space-y-2 font-mono text-xs text-[#0B1B3D]/85 border-l-2 border-slate-200 pl-3.5">
                {step.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2">
                    <span className="text-[#D93D94] font-bold select-none">—</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {/* Blueprint Visual */}
              <div className="w-full h-[300px] sm:h-[360px] relative flex items-center justify-center bg-slate-50/70 rounded-2xl border border-slate-200/90 overflow-hidden">
                <span className="absolute top-2 left-2 font-mono text-[10px] text-slate-400 select-none">+</span>
                <span className="absolute top-2 right-2 font-mono text-[10px] text-slate-400 select-none">+</span>
                <span className="absolute bottom-2 left-2 font-mono text-[10px] text-slate-400 select-none">+</span>
                <span className="absolute bottom-2 right-2 font-mono text-[10px] text-slate-400 select-none">+</span>
                <VisualComponent />
              </div>

              {/* Progress Footer */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5">
                  {steps.map((_, dotIdx) => (
                    <div
                      key={dotIdx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === dotIdx
                          ? "w-7 bg-[#D93D94]"
                          : dotIdx < idx
                          ? "w-2.5 bg-slate-400"
                          : "w-2.5 bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  PHASE {idx + 1} OF 4
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FeatureStory;
