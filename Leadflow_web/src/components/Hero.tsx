"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import type { PerformanceMetrics, HeroEngineControls } from "./hero3d/hero3d";
import type { TourMode } from "./hero3d/tour";

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const word1Ref = useRef<HTMLDivElement>(null);
  const word2Ref = useRef<HTMLDivElement>(null);
  const word3Ref = useRef<HTMLDivElement>(null);

  const engineRef = useRef<HeroEngineControls | null>(null);

  const [tourMode, setTourMode] = useState<TourMode>("idle");
  const [isInviting, setIsInviting] = useState(true);
  const [debugMetrics, setDebugMetrics] = useState<PerformanceMetrics | null>(null);
  const [isDebug, setIsDebug] = useState(false);

  // Debug query parameter check
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDebug(window.location.search.includes("debug"));
    }
  }, []);

  // Desktop lerped cursor ring loop
  useEffect(() => {
    const hero = heroRef.current;
    const ring = cursorRef.current;
    if (!hero || !ring || typeof window === "undefined") return;

    if (window.matchMedia("(pointer: coarse)").matches) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let isInsideHero = false;
    let rafId: number;

    ring.style.opacity = "0";

    const onPointerMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!inside) {
        ring.style.opacity = "0";
        isInsideHero = false;
        return;
      }

      targetX = e.clientX;
      targetY = e.clientY;
      isInsideHero = true;

      // Hide cursor ring while touring or holding
      const heroEl = heroRef.current;
      const isTouring = heroEl?.classList.contains("is-touring");
      const isHolding = heroEl?.classList.contains("is-holding");
      ring.style.opacity = isTouring || isHolding ? "0" : "1";
    };

    const onPointerLeave = () => {
      ring.style.opacity = "0";
      isInsideHero = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);
    window.addEventListener("scroll", onPointerLeave, { passive: true });

    const loop = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      ring.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("scroll", onPointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Dynamic 3D initialization after first paint / idle
  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas || typeof window === "undefined") return;

    // Check reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let cancelled = false;

    const start3D = async () => {
      try {
        const [{ initHero }, { makeReveal }] = await Promise.all([
          import("./hero3d/hero3d"),
          import("./hero3d/text-reveal"),
        ]);

        if (cancelled || !canvasRef.current || !heroRef.current) return;

        // Stage words letter-by-letter reveal tied to loop progress
        // "Research." (0.12-0.26), "Personalize." (0.40-0.54), "Book." (0.68-0.82)
        let updateReveal: ((travel: number, isActive: boolean) => void) | undefined;
        if (word1Ref.current && word2Ref.current && word3Ref.current) {
          updateReveal = makeReveal([
            { el: word1Ref.current, from: 0.12, to: 0.26 },
            { el: word2Ref.current, from: 0.40, to: 0.54 },
            { el: word3Ref.current, from: 0.68, to: 0.82 },
          ]);
        }

        const engine = initHero({
          canvas,
          hero,
          onReady: () => {
            canvas.style.opacity = "1";
          },
          onTourStateChange: (mode) => {
            setTourMode(mode);
            if (mode !== "idle") {
              setIsInviting(false);
            }
          },
          onProgress: (travel, _vel, isTouringOrHolding, mode) => {
            setTourMode(mode);
            updateReveal?.(travel, isTouringOrHolding);
          },
          onMetrics: (metrics) => {
            setDebugMetrics(metrics);
          },
        });

        engineRef.current = engine;
      } catch (err) {
        console.warn("3D initialization fallback to static gradient:", err);
      }
    };

    if ("requestIdleCallback" in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
        start3D();
      });
    } else {
      setTimeout(start3D, 50);
    }

    return () => {
      cancelled = true;
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  const handleToggleTour = useCallback(() => {
    setIsInviting(false);
    engineRef.current?.toggleTour();
  }, []);

  const isTouring = tourMode === "tour";

  return (
    <section
      ref={heroRef}
      className="hero relative min-h-[100svh] w-full overflow-hidden text-white flex flex-col justify-end"
    >
      {/* ── 3D CANVAS LAYER ── */}
      <canvas
        ref={canvasRef}
        className="hero__canvas opacity-0 transition-opacity duration-1000 ease-out"
      />

      {/* ── FILM GRAIN CSS OVERLAY (SVG feTurbulence noise, opacity 0.06, mix-blend overlay) ── */}
      <div className="hero__grain" />

      {/* ── DARK SCRIM (Protects text contrast over canvas) ── */}
      <div className="hero__scrim" />

      {/* ── PLAY BUTTON (Mobile View Only, Hidden on Desktop as requested) ── */}
      <button
        type="button"
        onClick={handleToggleTour}
        className={`play md:hidden ${isInviting ? "is-inviting" : ""}`}
        aria-label={isTouring ? "Pause tour" : "Play immersive tour"}
        aria-pressed={isTouring}
      >
        {isTouring ? (
          <Pause size={22} weight="fill" className="text-white" />
        ) : (
          <Play size={22} weight="fill" className="text-white ml-0.5" />
        )}
      </button>

      {/* ── VIDEO-LIKE 2PX PROGRESS BAR (Mobile View Only) ── */}
      <div className="hero__bar md:hidden" />

      {/* ── STAGE WORDS LAYER (Tied to loop progress, letter-by-letter) ── */}
      <div
        ref={word1Ref}
        className="hero__word"
        data-word="Research."
        aria-hidden="true"
        style={{ opacity: 0 }}
      >
        Research.
      </div>
      <div
        ref={word2Ref}
        className="hero__word"
        data-word="Personalize."
        aria-hidden="true"
        style={{ opacity: 0 }}
      >
        Personalize.
      </div>
      <div
        ref={word3Ref}
        className="hero__word"
        data-word="Book."
        aria-hidden="true"
        style={{ opacity: 0 }}
      >
        Book.
      </div>

      {/* ── DESKTOP RING CURSOR (Hidden on touch / while touring) ── */}
      <div ref={cursorRef} className="cursor-ring">
        <div className="cursor-ring__dot-left" />
        <div className="cursor-ring__dot-right" />
        <div className="cursor-ring__label">CLICK AND HOLD</div>
      </div>

      {/* ── FOREGROUND HERO CONTENT (Anchored to bottom, fades & slides via --ui) ── */}
      <div className="hero__content relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8 w-full pb-6 sm:pb-8 lg:pb-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-14 xl:gap-20">

          {/* Left Column: Airy, Large 3-Line Headline in Geist (Current Site Copy) */}
          <div className="shrink-0 max-w-2xl xl:max-w-3xl">
            <h1
              style={{ fontFamily: "var(--font-sans), 'Geist', sans-serif" }}
              className="font-light sm:font-[350] text-4xl sm:text-5xl md:text-6xl lg:text-[3.85rem] xl:text-[4.5rem] 2xl:text-[4.95rem] leading-[1.04] tracking-[-0.038em] text-white select-none"
            >
              <span className="block whitespace-normal sm:whitespace-nowrap">Turn cold prospects into</span>
              <span className="block whitespace-normal sm:whitespace-nowrap">
                qualified{" "}
                <span className="text-[#FF3388] font-light sm:font-[350]">revenue</span>{" "}
                without
              </span>
              <span className="block whitespace-normal sm:whitespace-nowrap">
                the manual busywork.
              </span>
            </h1>
          </div>

          {/* Right Column: Clean Editorial Paragraph & Geometric Monospace Buttons */}
          <div className="shrink-0 lg:max-w-sm lg:pb-2">
            <p
              style={{ fontFamily: "var(--font-sans), 'Geist', sans-serif" }}
              className="font-normal text-[13.5px] sm:text-[14.5px] leading-[1.62] text-slate-200/90 max-w-[360px] mb-6 select-none"
            >
              LeadFlow deploys autonomous agents that research high-intent accounts, craft hyper-personalized multi-channel sequences, and book meetings directly into your sales calendar.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                style={{ fontFamily: "var(--font-mono), 'Geist Mono', monospace" }}
                className="text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase px-5 py-2.5 sm:px-6 sm:py-3 rounded-[6px] bg-[#FF3388] hover:bg-[#FF1A75] text-white shadow-[0_0_20px_rgba(255,51,136,0.35)] hover:shadow-[0_0_30px_rgba(255,51,136,0.65)] transition-all cursor-pointer whitespace-nowrap"
              >
                GET EARLY ACCESS
              </Link>

              <a
                href="#pricing"
                style={{ fontFamily: "var(--font-mono), 'Geist Mono', monospace" }}
                className="text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase px-5 py-2.5 sm:px-6 sm:py-3 rounded-[6px] bg-[#181124]/90 hover:bg-white/10 border border-white/15 text-white/90 shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                BOOK A DEMO
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ── DEV TELEMETRY HUD (Activated when URL has ?debug) ── */}
      {isDebug && debugMetrics && (
        <div className="fixed bottom-4 right-4 z-50 p-3 bg-black/85 border border-[#D93D94]/50 rounded-xl font-mono text-[11px] text-white/90 backdrop-blur-md shadow-2xl space-y-1">
          <div className="text-[10px] font-bold text-[#D93D94] uppercase tracking-wider pb-1 border-b border-white/10">
            3D ENGINE TELEMETRY
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">FPS:</span>
            <span
              className={
                debugMetrics.fps >= 55
                  ? "text-emerald-400 font-bold"
                  : "text-amber-400 font-bold"
              }
            >
              {debugMetrics.fps}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Frame:</span>
            <span>{debugMetrics.frameMs} ms</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">DPR:</span>
            <span>{debugMetrics.dpr}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Draw Calls:</span>
            <span>{debugMetrics.drawCalls}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Triangles:</span>
            <span>{debugMetrics.triangles.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Mode:</span>
            <span>
              {debugMetrics.isLite ? "Lite (Mobile/Low Core)" : "Full Desktop"}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Bloom:</span>
            <span
              className={
                debugMetrics.bloomEnabled ? "text-emerald-400" : "text-red-400"
              }
            >
              {debugMetrics.bloomEnabled ? "Active" : "Disabled"}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

export default Hero;
