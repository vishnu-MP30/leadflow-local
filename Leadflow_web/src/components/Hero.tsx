"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  CheckCircle,
  ChartBar,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import type { PerformanceMetrics } from "./hero3d/hero3d";

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const word1Ref = useRef<HTMLDivElement>(null);
  const word2Ref = useRef<HTMLDivElement>(null);
  const word3Ref = useRef<HTMLDivElement>(null);

  const [debugMetrics, setDebugMetrics] = useState<PerformanceMetrics | null>(null);
  const [isDebug, setIsDebug] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  // Debug query parameter check
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDebug(window.location.search.includes("debug"));
    }
  }, []);

  // Lerped cursor ring loop
  useEffect(() => {
    const hero = heroRef.current;
    const ring = cursorRef.current;
    if (!hero || !ring || typeof window === "undefined") return;

    if (window.matchMedia("(pointer: coarse)").matches) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let hasMoved = false;
    let rafId: number;

    ring.style.opacity = "0";

    const onPointerMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!isInside) {
        ring.style.opacity = "0";
        hasMoved = false;
        return;
      }

      targetX = e.clientX;
      targetY = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
      }
      ring.style.opacity = "1";
    };

    const onPointerLeave = () => {
      ring.style.opacity = "0";
      hasMoved = false;
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

    // Check reduced motion or missing WebGL support
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const start3D = async () => {
      try {
        const [{ initHero }, { makeReveal }] = await Promise.all([
          import("./hero3d/hero3d"),
          import("./hero3d/text-reveal"),
        ]);

        if (cancelled || !canvasRef.current || !heroRef.current) return;

        // Prepare letter-by-letter reveal for 3 flythrough words
        let updateReveal: ((progress: number, holding: boolean) => void) | undefined;
        if (word1Ref.current && word2Ref.current && word3Ref.current) {
          updateReveal = makeReveal([
            { el: word1Ref.current, from: 0.10, to: 0.36 },
            { el: word2Ref.current, from: 0.42, to: 0.68 },
            { el: word3Ref.current, from: 0.72, to: 0.96 },
          ]);
        }

        cleanup = initHero({
          canvas,
          hero,
          primary: 0xd93d94,
          accent: 0xff33b8,
          onReady: () => {
            // Fade in canvas smoothly once shaders are pre-compiled
            canvas.style.opacity = "1";
          },
          onProgress: (progress, _velocity, holding) => {
            setIsHolding(holding);
            updateReveal?.(progress, holding);
          },
          onMetrics: (metrics) => {
            setDebugMetrics(metrics);
          },
        });
      } catch (err) {
        console.warn("3D initialization fallback to static gradient:", err);
      }
    };

    // Load after first paint using requestIdleCallback or setTimeout
    if ("requestIdleCallback" in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
        start3D();
      });
    } else {
      setTimeout(start3D, 50);
    }

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="hero relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#07000d] text-white flex flex-col justify-end"
    >
      {/* ── 3D CANVAS LAYER (Behind DOM) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-0 opacity-0 transition-opacity duration-1000 ease-out"
      />

      {/* ── LEFT-SIDE SOFT VIGNETTE (Keeps lower-left text crisp while 3D ribbons shine on right) ── */}
      <div
        className="absolute inset-y-0 left-0 w-full lg:w-3/5 pointer-events-none z-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse at 15% 75%, rgba(7, 0, 13, 0.95) 0%, rgba(7, 0, 13, 0.65) 55%, rgba(7, 0, 13, 0) 85%)",
          opacity: isHolding ? 0.25 : 1,
        }}
      />

      {/* ── RIGHT-SIDE SOFT PROTECTIVE VIGNETTE (Protects right text from flares and ensures high contrast) ── */}
      <div
        className="absolute bottom-0 right-0 w-full lg:w-1/2 h-96 pointer-events-none z-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse at 80% 85%, rgba(7, 0, 13, 0.94) 0%, rgba(7, 0, 13, 0.6) 45%, rgba(7, 0, 13, 0) 80%)",
          opacity: isHolding ? 0.2 : 1,
        }}
      />

      {/* ── SOFT BOTTOM VIGNETTE INTO NEXT SECTION ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B0A0F] to-transparent pointer-events-none z-0" />

      {/* ── FLYTHROUGH ACTIVE STATUS PILL (Shown when holding to fly through 3D world) ── */}
      <div
        className={`fixed top-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-500 ease-out ${isHolding
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-4 scale-95"
          }`}
      >
        <div className="px-5 py-2 rounded-full bg-[#1F102E]/90 border border-[#D93D94]/60 backdrop-blur-xl text-xs font-mono text-white shadow-[0_0_30px_rgba(217,61,148,0.55)] flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D93D94] animate-ping" />
          <span className="tracking-wider uppercase font-bold text-white">
            3D FLYTHROUGH ACTIVE
          </span>
          <span className="text-white/40">|</span>
          <span className="text-slate-300 font-medium">RELEASE TO RETURN</span>
        </div>
      </div>

      {/* ── THREE FLYTHROUGH WORDS LAYER (Only reveals letter-by-letter during flight) ── */}
      <div
        className={`absolute inset-0 pointer-events-none z-5 flex items-center justify-center overflow-hidden select-none transition-opacity duration-500 ${isHolding ? "opacity-100" : "opacity-0"
          }`}
      >
        <div
          ref={word1Ref}
          className="font-mono font-black text-6xl sm:text-8xl md:text-[11rem] text-white/90 tracking-[0.24em] uppercase absolute drop-shadow-[0_0_60px_rgba(217,61,148,0.9)] opacity-0"
        >
          PROSPECT
        </div>
        <div
          ref={word2Ref}
          className="font-mono font-black text-6xl sm:text-8xl md:text-[11rem] text-[#D93D94] tracking-[0.24em] uppercase absolute drop-shadow-[0_0_65px_rgba(217,61,148,0.95)] opacity-0"
        >
          SYNTHESIZE
        </div>
        <div
          ref={word3Ref}
          className="font-mono font-black text-6xl sm:text-8xl md:text-[11rem] text-[#F452AF] tracking-[0.24em] uppercase absolute drop-shadow-[0_0_70px_rgba(244,82,175,1)] opacity-0"
        >
          CONVERT
        </div>
      </div>

      {/* ── CUSTOM RING CURSOR (DOM) ── */}
      <div ref={cursorRef} className="cursor-ring">
        <div className="cursor-ring__tick-top" />
        <div className="cursor-ring__tick-bottom" />
        <div className="cursor-ring__label">CLICK AND HOLD</div>
      </div>

      {/* ── FOREGROUND HERO CONTENT (Anchored to bottom of hero, matching reference 2) ── */}
      <div
        className={`hero__content relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8 w-full pb-10 sm:pb-14 lg:pb-16 xl:pb-20 transition-all duration-500 ease-out ${isHolding
            ? "opacity-0 scale-95 blur-sm pointer-events-none"
            : "opacity-100 scale-100 blur-0 pointer-events-auto"
          }`}
      >
        {/* Split Editorial Composition Matching Reference Image 2 with Generous Gap */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-14 xl:gap-20">

          {/* Left Column: Airy, Large, Elegant 3-Line Headline in Geist Sans (Matching User Request & Reference) */}
          <div className="shrink-0 max-w-2xl xl:max-w-3xl">
            <h1
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
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

          {/* Right Column: Clean Editorial Paragraph & Geometric Monospace Buttons (Aligned with Bottom Baseline) */}
          <div className="shrink-0 lg:max-w-sm lg:pb-2">
            <p
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              className="font-normal text-[13.5px] sm:text-[14.5px] leading-[1.62] text-slate-200/90 max-w-[360px] mb-6 select-none"
            >
              LeadFlow deploys autonomous agents that research high-intent accounts, craft hyper-personalized multi-channel sequences, and book meetings directly into your sales calendar.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                className="text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase px-5 py-2.5 sm:px-6 sm:py-3 rounded-[6px] bg-[#FF3388] hover:bg-[#FF1A75] text-white shadow-[0_0_20px_rgba(255,51,136,0.35)] hover:shadow-[0_0_30px_rgba(255,51,136,0.65)] transition-all cursor-pointer whitespace-nowrap"
              >
                GET EARLY ACCESS
              </Link>

              <a
                href="#demo"
                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                className="text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase px-5 py-2.5 sm:px-6 sm:py-3 rounded-[6px] bg-[#181124]/90 hover:bg-white/10 border border-white/15 text-white/90 shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                BOOK A DEMO
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ── MOBILE TOUCH & HOLD PROMPT (Visible on touch devices) ── */}
      <div
        className={`hero__content relative z-10 pb-6 text-center lg:hidden pointer-events-none transition-opacity duration-300 ${isHolding ? "opacity-0" : "opacity-100"
          }`}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F102E]/90 border border-[#D93D94]/40 text-xs font-mono text-white/90 shadow-lg backdrop-blur-md">
          <Sparkle size={13} className="text-[#D93D94]" weight="fill" />
          <span>Press &amp; hold screen to fly through 3D engine</span>
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
