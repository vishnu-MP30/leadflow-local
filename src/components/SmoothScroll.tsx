"use client";

import { useEffect } from "react";
import Lenis from "@/lib/lenis";

export function SmoothScroll() {
  useEffect(() => {
    // Only initialize smooth scroll on desktop with mouse wheel
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({ lerp: 0.08 });
    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
