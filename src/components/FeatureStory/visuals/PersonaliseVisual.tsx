"use client";

import React from "react";

export function PersonaliseVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
      {/* Blueprint Grid / Crosshairs Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="personalise-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#0B1B3D" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#personalise-grid)" />
        </svg>
      </div>

      {/* Main Blueprint Diagram: Context-to-Copy Generator */}
      <div className="relative z-10 w-full max-w-[540px] flex flex-col gap-5">
        
        {/* Token Synthesis Pill Row */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <span className="bg-slate-100 text-[#0B1B3D] border border-slate-300 px-2.5 py-1 rounded-md font-semibold">
            {"{{first_name}}"}
          </span>
          <span className="text-slate-400 font-bold">+</span>
          <span className="bg-pink-50 text-[#D93D94] border border-pink-200 px-2.5 py-1 rounded-md font-bold">
            {"{{sdr_hiring_spike}}"}
          </span>
          <span className="text-slate-400 font-bold">+</span>
          <span className="bg-slate-100 text-[#0B1B3D] border border-slate-300 px-2.5 py-1 rounded-md font-semibold">
            {"{{cloudscale_crm}}"}
          </span>
          <span className="ml-auto text-[10px] text-slate-500 font-bold tracking-wider">AI_ENGINE // v4.2</span>
        </div>

        {/* Mock UI Card: Hyper-Personalized Sequence Generator */}
        <div
          className="bg-white border-2 border-[#0B1B3D] p-5 rounded-xl relative"
          style={{ boxShadow: "6px 6px 0px #0B1B3D" }}
        >
          {/* Card Header with Channel Tabs */}
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0B1B3D]" />
              <span className="font-mono font-bold text-xs text-[#0B1B3D] uppercase tracking-wider">
                SYNTHESIZED_DRAFT // MULTI_CHANNEL
              </span>
            </div>
            {/* Channel Tabs */}
            <div className="flex items-center gap-1 font-mono text-[10px]">
              <span className="bg-[#0B1B3D] text-white px-2 py-0.5 rounded font-bold">LINKEDIN</span>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">EMAIL</span>
            </div>
          </div>

          {/* Generated Message Body */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 font-mono text-xs leading-relaxed text-[#0B1B3D] mb-4">
            <div className="text-slate-400 mb-2 text-[10px] uppercase tracking-wider">
              RE: SCALING CLOUDSCALE SDR REVENUE PIPELINE
            </div>
            <p className="mb-2">
              Hi Elena, noticed CloudScale expanded its SDR team by{" "}
              <span className="bg-pink-100 text-[#D93D94] px-1 py-0.5 rounded font-bold">
                14 reps this quarter
              </span>
              . Most revenue teams run into sequence saturation when ramping new hires on Salesforce.
            </p>
            <p>
              LeadFlow automates the pre-outreach research so your reps only touch{" "}
              <span className="bg-pink-100 text-[#D93D94] px-1 py-0.5 rounded font-bold">
                accounts showing verified buying intent
              </span>
              . Open to a 10-min breakdown?
            </p>
          </div>

          {/* Quality Telemetry & Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-slate-500">Relevance: <strong className="text-[#0B1B3D]">98.2%</strong></span>
              <span className="text-slate-500">Spam Score: <strong className="text-emerald-600">0.01</strong></span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <button className="px-3 py-1 bg-[#0B1B3D] text-white font-bold rounded hover:bg-[#1A2E5A] transition-colors">
                APPROVE
              </button>
            </div>
          </div>
        </div>

        {/* Blueprint Connecting Line SVG */}
        <div className="w-full flex items-center justify-between px-6 font-mono text-[10px] text-slate-400">
          <span>LATENCY: 420ms // TOKENS: 184</span>
          <span className="text-[#D93D94] font-bold">READY FOR STEP 03 // COORDINATE</span>
        </div>

      </div>
    </div>
  );
}
