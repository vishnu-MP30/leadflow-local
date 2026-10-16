"use client";

import React, { useEffect, useRef, useState } from "react";

export function HowItWorks3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const start3D = async () => {
      try {
        const { initRibbon3D } = await import("./ribbon3d");
        if (cancelled || !containerRef.current || !canvasRef.current) return;

        cleanup = initRibbon3D({
          canvas,
          container,
          onReady: () => {
            setIsLoaded(true);
          },
        });
      } catch (err) {
        console.warn("3D HowItWorks ribbon initialization error:", err);
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
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* ── ATMOSPHERIC DARK VIOLET / PLUM BACKDROP (MATCHING REFERENCE EXACTLY) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 95% 80% at 55% 28%, #260830 0%, #190520 38%, #110316 70%, #0B0A0F 100%)",
        }}
      />

      {/* ── SOFT AMBIENT PLUM CORE GLOW (MEDIUM SIZE) ── */}
      <div
        className="absolute top-1/3 right-1/4 w-[540px] h-[540px] rounded-full pointer-events-none opacity-55 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(184, 40, 117, 0.28) 0%, rgba(75, 14, 78, 0.35) 45%, transparent 75%)",
        }}
      />

      {/* ── 3D CANVAS LAYER (SCULPTURAL SWEEPING RIBBON ARCHES, NO RINGS, NO DOTS) ── */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full block transition-opacity duration-1000 ease-out relative z-10 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default HowItWorks3D;
