"use client";

import React from "react";

export function ProgressVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
      {/* Blueprint Grid / Crosshairs Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="progress-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#0B1B3D" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#progress-grid)" />
        </svg>
      </div>

      {/* Main Blueprint Diagram: Intent Triage & Calendar Booking */}
      <div className="relative z-10 w-full max-w-[540px] flex flex-col gap-5">
        
        {/* Mock UI Card 1: Intent Triage Classifier */}
        <div
          className="bg-white border-2 border-[#0B1B3D] p-4 rounded-xl relative"
          style={{ boxShadow: "6px 6px 0px #0B1B3D" }}
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#0B1B3D]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-bold tracking-wider uppercase">INTENT_TRIAGE // CLASSIFIER</span>
            </div>
            <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              MEETING_READY 94%
            </span>
          </div>

          <div className="flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Classification:</span>
              <span className="font-bold text-[#0B1B3D]">Buying Cycle Inquiry</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Route:</span>
              <span className="text-[#D93D94] font-bold">Auto-Schedule Link Sent</span>
            </div>
          </div>
        </div>

        {/* Mock UI Card 2: Calendar Slot Auto-Booked */}
        <div
          className="bg-white border-2 border-[#0B1B3D] p-5 rounded-xl relative"
          style={{ boxShadow: "6px 6px 0px #0B1B3D" }}
        >
          {/* Calendar Confirmed Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D93D94] text-white flex items-center justify-center font-mono font-bold text-xs">
                CAL
              </div>
              <div>
                <div className="font-sans font-bold text-sm text-[#0B1B3D]">Demo Confirmed · 30m Meeting</div>
                <div className="font-mono text-[11px] text-slate-500">Synced to Google & Outlook Calendars</div>
              </div>
            </div>
            <span className="font-mono text-[10px] bg-[#0B1B3D] text-white font-bold px-2.5 py-1 rounded">
              INVITE_SENT
            </span>
          </div>

          {/* Meeting Details Pill Block */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2 font-mono text-xs text-[#0B1B3D] mb-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Invitee:</span>
              <strong className="text-[#0B1B3D]">Elena Rostova (CloudScale)</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Time:</span>
              <strong className="text-[#0B1B3D]">Thursday, Oct 17 · 2:00 PM EST</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Pre-Meeting Dossier:</span>
              <span className="text-[#D93D94] font-bold">Generated & Attached</span>
            </div>
          </div>

          {/* Outcome Metric Bar */}
          <div className="pt-2 flex items-center justify-between font-mono text-[11px] text-slate-600">
            <span>TOTAL TIME TO CONVERSION: <strong>48h 12m</strong></span>
            <span className="text-emerald-600 font-bold">0 HRS MANUAL WORK</span>
          </div>
        </div>

        {/* Blueprint Summary Coordinates */}
        <div className="w-full flex items-center justify-between px-6 font-mono text-[10px] text-slate-400">
          <span>PIPELINE VELOCITY: +340%</span>
          <span className="text-[#D93D94] font-bold">CYCLE COMPLETE // REPEATABLE</span>
        </div>

      </div>
    </div>
  );
}
