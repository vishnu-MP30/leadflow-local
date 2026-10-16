"use client";

import React from "react";

export function CoordinateVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
      {/* Blueprint Grid / Crosshairs Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="coordinate-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#0B1B3D" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#coordinate-grid)" />
        </svg>
      </div>

      {/* Main Blueprint Diagram: Multi-Channel Sequence DAG */}
      <div className="relative z-10 w-full max-w-[540px] flex flex-col gap-4">
        
        {/* Step 1 Node: Day 01 LinkedIn Invite */}
        <div
          className="bg-white border-2 border-[#0B1B3D] p-3.5 rounded-xl flex items-center justify-between"
          style={{ boxShadow: "6px 6px 0px #0B1B3D" }}
        >
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-[#0B1B3D] text-white flex items-center justify-center font-mono font-bold text-xs">
              01
            </span>
            <div>
              <div className="font-sans font-bold text-sm text-[#0B1B3D]">Day 01 · LinkedIn Connection</div>
              <div className="font-mono text-[11px] text-slate-500">Tailored note with team signal hook</div>
            </div>
          </div>
          <span className="font-mono text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">
            DELIVERED
          </span>
        </div>

        {/* Connector Line with Pulse */}
        <div className="flex items-center justify-center -my-1">
          <div className="w-0.5 h-6 bg-slate-300 relative">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#D93D94]" />
          </div>
        </div>

        {/* Step 2 Node: Day 03 Email 1 */}
        <div
          className="bg-white border-2 border-[#0B1B3D] p-3.5 rounded-xl flex items-center justify-between"
          style={{ boxShadow: "6px 6px 0px #0B1B3D" }}
        >
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-[#0B1B3D] text-white flex items-center justify-center font-mono font-bold text-xs">
              02
            </span>
            <div>
              <div className="font-sans font-bold text-sm text-[#0B1B3D]">Day 03 · Email 01 (Value Hypothesis)</div>
              <div className="font-mono text-[11px] text-slate-500">Trigger: Prospect accepted connection</div>
            </div>
          </div>
          <span className="font-mono text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold">
            OPENED 2X
          </span>
        </div>

        {/* Branching Logic Card: Instant Pause On Reply */}
        <div
          className="bg-pink-50 border-2 border-[#D93D94] p-4 rounded-xl relative"
          style={{ boxShadow: "6px 6px 0px #0B1B3D" }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D93D94] animate-ping" />
              <span className="font-mono font-bold text-xs text-[#0B1B3D] uppercase tracking-wider">
                INTERRUPT ENGINE // AUTO_PAUSE
              </span>
            </div>
            <span className="font-mono text-[10px] bg-[#D93D94] text-white font-bold px-2 py-0.5 rounded">
              ENGAGED
            </span>
          </div>
          <p className="font-mono text-xs text-[#0B1B3D] leading-relaxed">
            Prospect responded via LinkedIn: <em className="text-[#D93D94] font-semibold">&ldquo;Interesting timing, can you send case studies for SDR teams?&rdquo;</em>
          </p>
          <div className="mt-2.5 pt-2 border-t border-pink-200/60 flex items-center justify-between font-mono text-[10px] text-slate-600">
            <span>SEQUENCE STATUS: PAUSED</span>
            <span className="text-[#D93D94] font-bold">TRANSFERRED TO STEP 04 // PROGRESS</span>
          </div>
        </div>

      </div>
    </div>
  );
}
