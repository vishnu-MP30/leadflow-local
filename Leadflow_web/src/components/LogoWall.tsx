"use client";

import React from "react";

// ── TRUSTED PARTNER LOGOS FROM USER SPECIFICATION ──
// Content: Potager, TacticForge, Playfullyyours, HeritageCollective, Ashareeri, League of Legal
// Style: Pure White (#FFFFFF), Bold, Distinctive Emblem Logos matching Reference 1
const trustBrands = [
  {
    name: "Potager",
    render: () => (
      <div className="flex items-center gap-2.5">
        {/* Botanical / Sprout Geometric Emblem */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-white shrink-0 drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C7.5 2 4 6 4 11c0 4 2.5 7.5 6 8.7V22h4v-2.3c3.5-1.2 6-4.7 6-8.7 0-5-3.5-9-8-9zm0 3c2.8 0 5 2.5 5 6 0 2.2-1.1 4.2-2.8 5.2-.6-2.8-2.6-5-5.2-5.7.5-3 1.7-5.5 3-5.5z" />
        </svg>
        <span className="font-sans font-bold text-lg sm:text-xl tracking-tight text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
          Potager
        </span>
      </div>
    ),
  },
  {
    name: "TacticForge",
    render: () => (
      <div className="flex items-center gap-2.5">
        {/* Tactical Hexagon & Anvil Forge Emblem */}
        <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center p-0.5 shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5 fill-[#0B0A0F]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 4h16l-3 6h-3l2 10H8l2-10H7L4 4z" />
          </svg>
        </div>
        <span className="font-sans font-black text-base sm:text-lg tracking-wider text-white uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
          TacticForge
        </span>
      </div>
    ),
  },
  {
    name: "Playfullyyours",
    render: () => (
      <div className="flex items-center gap-2.5">
        {/* Kinetic Play Ribbon / Loop Emblem */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-white shrink-0 drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 3a9 9 0 0 0-9 9c0 3.8 2.4 7 5.8 8.3 1.2.5 2.2-.5 2.2-1.6v-2.2c0-.8-.7-1.5-1.5-1.5a3 3 0 1 1 3-3v8.5a1.5 1.5 0 0 0 2.5 1.1l5.5-5.5A9 9 0 0 0 12 3zm0 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" />
        </svg>
        <span className="font-sans font-extrabold text-lg sm:text-xl tracking-tight text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
          Playfullyyours
        </span>
      </div>
    ),
  },
  {
    name: "HeritageCollective",
    render: () => (
      <div className="flex items-center gap-2.5">
        {/* Architectural Classical Pillar / Arch Emblem */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-white shrink-0 drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 21h18v-2H3v2zm2-4h2V8H5v9zm5 0h4V8h-4v9zm7 0h2V8h-2v9zM2 6h20V3H2v3zm2-1h16v1H4V5z" />
        </svg>
        <span className="font-sans font-bold text-base sm:text-lg tracking-normal text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
          HeritageCollective
        </span>
      </div>
    ),
  },
  {
    name: "Ashareeri",
    render: () => (
      <div className="flex items-center gap-2.5">
        {/* Geometric Multi-Point Celestial Asterism Emblem */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-white shrink-0 drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l2.4 6.6L21 11l-5.6 4.4L17 22l-5-4-5 4 1.6-6.6L3 11l6.6-2.4L12 2z" />
        </svg>
        <span className="font-sans font-black text-base sm:text-lg tracking-widest text-white uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
          Ashareeri
        </span>
      </div>
    ),
  },
  {
    name: "League of Legal",
    render: () => (
      <div className="flex items-center gap-2.5">
        {/* Balanced Scales of Justice Geometric Crest */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-white shrink-0 drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 3c-.6 0-1 .4-1 1v1.1C7.8 5.6 5.5 8 5.1 11H3c-.6 0-1 .4-1 1s.4 1 1 1h2.1c.4 3 2.7 5.4 5.9 5.9V20H8c-.6 0-1 .4-1 1s.4 1 1 1h8c.6 0 1-.4 1-1s-.4-1-1-1h-3v-1.1c3.2-.5 5.5-2.9 5.9-5.9H21c.6 0 1-.4 1-1s-.4-1-1-1h-2.1c-.4-3-2.7-5.4-5.9-5.9V4c0-.6-.4-1-1-1zm0 4c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z" />
        </svg>
        <span className="font-sans font-extrabold text-base sm:text-lg tracking-tight text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
          League of Legal
        </span>
      </div>
    ),
  },
];

export function LogoWall() {
  // Triple the array to create an uninterrupted, perfectly seamless infinite loop
  const infiniteBrands = [...trustBrands, ...trustBrands, ...trustBrands];

  return (
    <section className="relative pt-4 sm:pt-6 pb-16 sm:pb-20 bg-[#0B0A0F] z-20 overflow-hidden select-none">
      {/* ══════════════════════════════════════════════════════════
          SEAMLESS ATMOSPHERIC FLOW (BLENDED DIRECTLY WITH HERO)
         ══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Deep Plum & Orchid Diagonal Ribbon Bands */}
        <div
          className="absolute inset-0 opacity-95"
          style={{
            background:
              "linear-gradient(90deg, #0B0A0F 0%, #1A071E 15%, #2D0B2B 35%, #4A0E3C 55%, #350A2E 75%, #15051B 90%, #0B0A0F 100%)",
          }}
        />

        {/* Diagonal Angled Facet 1 (Left Plum Slice) */}
        <div
          className="absolute -top-24 -bottom-24 w-[32rem] opacity-75 pointer-events-none"
          style={{
            left: "12%",
            background: "linear-gradient(135deg, rgba(82, 17, 68, 0.85) 0%, rgba(35, 7, 30, 0.95) 100%)",
            transform: "skewX(-24deg)",
            boxShadow: "0 0 60px rgba(0,0,0,0.85)",
          }}
        />

        {/* Diagonal Angled Facet 2 (Vibrant Orchid Accent Slice + Glowing Edge) */}
        <div
          className="absolute -top-24 -bottom-24 w-80 opacity-90 pointer-events-none"
          style={{
            left: "46%",
            background: "linear-gradient(135deg, rgba(142, 28, 107, 0.85) 0%, rgba(70, 12, 54, 0.95) 100%)",
            transform: "skewX(-24deg)",
            borderLeft: "2px solid rgba(217, 61, 148, 0.8)",
            borderRight: "1px solid rgba(217, 61, 148, 0.35)",
            boxShadow: "0 0 45px rgba(217, 61, 148, 0.3), -20px 0 35px rgba(0,0,0,0.7)",
          }}
        />

        {/* Diagonal Angled Facet 3 (Right Plum Wedge) */}
        <div
          className="absolute -top-24 -bottom-24 w-[28rem] opacity-70 pointer-events-none"
          style={{
            left: "68%",
            background: "linear-gradient(135deg, rgba(62, 12, 52, 0.85) 0%, rgba(25, 5, 22, 0.98) 100%)",
            transform: "skewX(-24deg)",
            borderLeft: "1.5px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "-15px 0 30px rgba(0,0,0,0.75)",
          }}
        />

        {/* Reference 2 Dot Lattice Matrix Pattern across the transition gap */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />


        {/* Reference 2 Illuminated Seam Light Ray between Facets */}
        <div
          className="absolute bottom-0 w-1.5 h-64 opacity-95 pointer-events-none blur-[0.5px]"
          style={{
            left: "46%",
            background:
              "linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(217, 61, 148, 0.9) 60%, transparent 100%)",
            transform: "skewX(-24deg)",
            boxShadow: "0 0 25px #FFFFFF, 0 0 45px #D93D94",
          }}
        />

        {/* Soft Upward Blend Gradient (Dissolves any seam into Hero's dark canvas) */}
        <div
          className="absolute top-0 left-0 right-0 h-28 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to bottom, #07000d 0%, rgba(7, 0, 13, 0.7) 40%, transparent 100%)",
          }}
        />

        {/* Atmospheric Upward Radial Bloom (Gently illuminates the transition from Hero to Marquee) */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[900px] h-[180px] pointer-events-none blur-3xl opacity-35 z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(217, 61, 148, 0.5) 0%, rgba(142, 28, 107, 0.2) 45%, transparent 75%)",
          }}
        />
      </div>

      {/* ── TOP CONTEXT LABEL ── */}
      <div className="text-center mb-5 sm:mb-6 relative z-10 px-4">
        <span className="font-mono font-medium text-[11px] sm:text-xs tracking-[0.25em] uppercase text-white/60">
          TRUSTED BY SALES TEAMS AT
        </span>
      </div>

      {/* ── SEAMLESS INFINITE MARQUEE WITH EDGE GRADIENT FADES ── */}
      <div className="relative w-full overflow-hidden">
        {/* Left and Right Blurred Edge Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-r from-[#0B0A0F] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-l from-[#0B0A0F] to-transparent z-20 pointer-events-none" />

        {/* Moving Logo Track */}
        <div className="flex w-max items-center whitespace-nowrap animate-marquee gap-14 sm:gap-20 md:gap-24 relative z-10 py-1">
          {infiniteBrands.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="inline-flex items-center shrink-0 cursor-default transition-transform duration-200 hover:scale-105"
            >
              {item.render()}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LogoWall;
