"use client";

import React, { useEffect, useRef, useState } from "react";

export function LandingCore3D() {
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
        const { initLandingCore } = await import("./core3d");
        if (cancelled || !containerRef.current || !canvasRef.current) return;

        cleanup = initLandingCore({
          canvas,
          container,
          onReady: () => {
            setIsLoaded(true);
          },
        });
      } catch (err) {
        console.warn("3D Landing Core initialization error:", err);
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
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center select-none"
    >
      {/* ── ATMOSPHERIC DARK AUBERGINE / PLUM BACKDROP (MATCHING REFERENCE EXACTLY) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 75% at 50% 36%, #220829 0%, #18051E 40%, #110315 72%, #0B0A0F 100%)",
        }}
      />

      {/* ── SOFT AMBIENT PLUM CORE GLOW (CENTERED MEDIUM) ── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full pointer-events-none opacity-65"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(184, 40, 117, 0.22) 0%, rgba(85, 20, 68, 0.30) 38%, rgba(20, 5, 24, 0.65) 65%, transparent 80%)",
        }}
      />

      {/* ── 3D CANVAS LAYER (CLEAN SCULPTURAL STRUCTURE, NO RINGS, NO DOTS) ── */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full block transition-opacity duration-1000 ease-out relative z-10 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default LandingCore3D;
