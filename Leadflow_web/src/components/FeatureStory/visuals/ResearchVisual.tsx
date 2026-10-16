"use client";

import React from "react";

export function ResearchVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
      {/* Blueprint Grid / Crosshairs Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="research-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#0B1B3D" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#research-grid)" />
        </svg>
      </div>

      {/* Main Blueprint Diagram: Account Research & Ingestion Matrix */}
      <div className="relative z-10 w-full max-w-[540px] flex flex-col gap-5">
        
        {/* Mock UI Card 1: Live Account Ingestion Bar */}
        <div
          className="bg-white border-2 border-[#0B1B3D] p-4 rounded-xl relative"
          style={{ boxShadow: "6px 6px 0px #0B1B3D" }}
        >
          {/* Card Title Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 font-mono text-[11px] text-[#0B1B3D]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D93D94] animate-pulse" />
              <span className="font-bold tracking-wider uppercase">INGESTION // LINKEDIN_RADAR</span>
            </div>
            <span className="text-slate-400">STATUS: ACTIVE</span>
          </div>

          {/* Search Scan Bar */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono text-xs text-[#0B1B3D]">
            <svg className="w-4 h-4 text-[#D93D94] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-slate-500 truncate">https://linkedin.com/in/vp-sales-acme</span>
            <span className="ml-auto text-[10px] bg-[#D93D94] text-white font-bold px-2 py-0.5 rounded">RESOLVED</span>
          </div>
        </div>

        {/* Mock UI Card 2: Enriched Prospect Data Matrix */}
        <div
          className="bg-white border-2 border-[#0B1B3D] p-5 rounded-xl relative"
          style={{ boxShadow: "6px 6px 0px #0B1B3D" }}
        >
          {/* Decorative Corner Markers */}
          <span className="absolute top-1 left-1 font-mono text-[9px] text-slate-400">+</span>
          <span className="absolute top-1 right-1 font-mono text-[9px] text-slate-400">+</span>
          <span className="absolute bottom-1 left-1 font-mono text-[9px] text-slate-400">+</span>
          <span className="absolute bottom-1 right-1 font-mono text-[9px] text-slate-400">+</span>

          {/* Profile Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-[#0B1B3D] text-white flex items-center justify-center font-mono font-bold text-sm border-2 border-[#0B1B3D]">
                VP
              </div>
              <div>
                <div className="font-sans font-bold text-base text-[#0B1B3D] tracking-tight">Elena Rostova</div>
                <div className="font-mono text-xs text-slate-500">VP Global Revenue @ CloudScale</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#D93D94] bg-pink-50 border border-pink-200 px-2 py-1 rounded-md font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D93D94]" />
              VERIFIED 99.4%
            </div>
          </div>

          {/* Signal Rows with Progress */}
          <div className="space-y-3 font-mono text-xs">
            {/* Signal 1 */}
            <div className="border border-slate-200 rounded-lg p-2.5 flex items-center justify-between bg-white">
              <span className="text-slate-600">Hiring Signal: SDR Team Expansion (+14)</span>
              <span className="text-[#D93D94] font-bold text-[11px]">HIGH INTENT</span>
            </div>

            {/* Signal 2 */}
            <div className="border border-slate-200 rounded-lg p-2.5 flex items-center justify-between bg-white">
              <span className="text-slate-600">Tech Stack: Salesforce, Outreach, HubSpot</span>
              <span className="text-emerald-600 font-bold text-[11px]">COMPATIBLE</span>
            </div>

            {/* Signal 3 with progress */}
            <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-slate-600">Account Signal Confidence</span>
                <span className="font-bold text-[#0B1B3D]">96/100</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#D93D94] rounded-full" style={{ width: "96%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Blueprint Connecting Line SVG */}
        <div className="w-full flex items-center justify-between px-6 font-mono text-[10px] text-slate-400">
          <span>LAT: 37.7749 // LNG: -122.4194</span>
          <span className="text-[#D93D94] font-bold">READY FOR STEP 02 // SYNTHESIS</span>
        </div>

      </div>
    </div>
  );
}
