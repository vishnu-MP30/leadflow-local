"use client";

import React, { useMemo } from "react";

// Pre-seeded bokeh / stardust particles to prevent any SSR hydration mismatch
// Matching the soft glowing particles in the reference image (varying sizes, opacities, and orchid/magenta glows)
const PARTICLES = [
  { top: "4%", left: "12%", size: 3, opacity: 0.65, color: "#F452AF", blur: 0.5 },
  { top: "7%", left: "28%", size: 4, opacity: 0.8, color: "#FF77C8", blur: 1 },
  { top: "11%", left: "84%", size: 2.5, opacity: 0.5, color: "#D93D94", blur: 0 },
  { top: "15%", left: "46%", size: 5, opacity: 0.7, color: "#FFFFFF", blur: 1.5 },
  { top: "18%", left: "68%", size: 3.5, opacity: 0.6, color: "#F452AF", blur: 0.5 },
  { top: "23%", left: "9%", size: 4, opacity: 0.75, color: "#E056A8", blur: 1 },
  { top: "27%", left: "91%", size: 3, opacity: 0.55, color: "#FF99DA", blur: 0.5 },
  { top: "32%", left: "35%", size: 6, opacity: 0.85, color: "#F452AF", blur: 2 },
  { top: "36%", left: "76%", size: 2.5, opacity: 0.6, color: "#FFFFFF", blur: 0 },
  { top: "41%", left: "18%", size: 4.5, opacity: 0.7, color: "#D93D94", blur: 1 },
  { top: "45%", left: "58%", size: 3, opacity: 0.5, color: "#FF77C8", blur: 0.5 },
  { top: "49%", left: "88%", size: 5, opacity: 0.8, color: "#F452AF", blur: 1.5 },
  { top: "54%", left: "24%", size: 2.5, opacity: 0.65, color: "#FFFFFF", blur: 0 },
  { top: "58%", left: "64%", size: 4, opacity: 0.75, color: "#E056A8", blur: 1 },
  { top: "63%", left: "82%", size: 3.5, opacity: 0.6, color: "#FF99DA", blur: 0.5 },
  { top: "68%", left: "14%", size: 5.5, opacity: 0.85, color: "#F452AF", blur: 2 },
  { top: "72%", left: "42%", size: 3, opacity: 0.55, color: "#FFFFFF", blur: 0.5 },
  { top: "77%", left: "94%", size: 4, opacity: 0.7, color: "#D93D94", blur: 1 },
  { top: "82%", left: "30%", size: 2.5, opacity: 0.6, color: "#FF77C8", blur: 0 },
  { top: "86%", left: "72%", size: 5, opacity: 0.8, color: "#F452AF", blur: 1.5 },
  { top: "91%", left: "20%", size: 3.5, opacity: 0.65, color: "#E056A8", blur: 0.5 },
  { top: "95%", left: "54%", size: 4, opacity: 0.75, color: "#FFFFFF", blur: 1 },
  { top: "98%", left: "85%", size: 3, opacity: 0.5, color: "#FF99DA", blur: 0.5 },
];

export function PlumAtmosphere() {
  const particles = useMemo(() => PARTICLES, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ── 1. DEEP VELVET PLUM & AUBERGINE BASE GRADIENTS ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #18051C 0%, #240828 18%, #2F0B31 45%, #240828 75%, #150519 100%)",
        }}
      />

      {/* ── 2. SCULPTED ORGANIC CURVED SHAPES (MATCHING REFERENCE EXACTLY) ── */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1440 2200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Wave Gradients */}
          <linearGradient id="plumWave1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A0E3C" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#2D0B2B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#18051C" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="plumWave2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5E144C" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#3A0C35" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#1B061F" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="orchidGlowRay" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#D93D94" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#8E1C6B" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#1A071E" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Large sweeping curve - Top right to mid left */}
        <path
          d="M1440 0 C1100 200, 750 450, 680 750 C600 1100, 950 1450, 1440 1650 L1440 0 Z"
          fill="url(#plumWave1)"
        />

        {/* Organic curved wave - Mid left sweeping downward */}
        <path
          d="M0 600 C350 750, 520 1100, 420 1500 C340 1850, 150 2050, 0 2200 L0 600 Z"
          fill="url(#plumWave2)"
        />

        {/* Ambient orchid backlighting flow path */}
        <path
          d="M0 200 C450 350, 800 700, 850 1200 C900 1700, 600 2000, 300 2200 L0 2200 Z"
          fill="url(#orchidGlowRay)"
        />
      </svg>

      {/* ── 3. RADIANT AMBIENT ORCHID / MAGENTA GLOW SPHERES ── */}
      {/* Top ambient glow */}
      <div
        className="absolute -top-32 left-1/4 w-[650px] h-[650px] rounded-full opacity-60 blur-[130px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(217, 61, 148, 0.28) 0%, rgba(142, 28, 107, 0.18) 45%, transparent 75%)",
        }}
      />

      {/* Mid-section glowing plum core (behind Testimonials) */}
      <div
        className="absolute top-1/3 right-10 w-[780px] h-[780px] rounded-full opacity-55 blur-[150px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(184, 40, 117, 0.25) 0%, rgba(85, 20, 68, 0.3) 40%, transparent 75%)",
        }}
      />

      {/* Lower-left ambient glow (behind Pricing) */}
      <div
        className="absolute bottom-40 left-0 w-[720px] h-[720px] rounded-full opacity-50 blur-[140px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(217, 61, 148, 0.22) 0%, rgba(74, 14, 60, 0.28) 50%, transparent 75%)",
        }}
      />

      {/* ── 4. LUMINOUS BOKEH STARDUST PARTICLES (MATCHING REFERENCE IMAGE) ── */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, idx) => (
          <div
            key={idx}
            className="absolute rounded-full transition-opacity duration-1000"
            style={{
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: p.opacity,
              filter: `blur(${p.blur}px)`,
              boxShadow: `0 0 ${p.size * 2.5}px ${p.color}`,
            }}
          />
        ))}
      </div>

      {/* ── 5. SUBTLE PHOTOGRAPHIC VELVET GRAIN / NOISE ── */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}

export default PlumAtmosphere;
