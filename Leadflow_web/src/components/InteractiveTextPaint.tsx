"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

interface TrailPoint {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

export function InteractiveTextPaint() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Mouse coordinates in SVG coordinate space (0..1400, 0..320)
  const targetPos = useRef<{ x: number; y: number }>({ x: 700, y: 160 });
  const currentPos = useRef<{ x: number; y: number }>({ x: 700, y: 160 });
  const currentRadius = useRef<number>(0);
  const targetRadius = useRef<number>(0);

  const [isHovered, setIsHovered] = useState(false);
  const [paintState, setPaintState] = useState<{
    cx: number;
    cy: number;
    radius: number;
    trail: TrailPoint[];
  }>({
    cx: 700,
    cy: 160,
    radius: 0,
    trail: [],
  });

  const trailRef = useRef<TrailPoint[]>([]);
  const lastAddRef = useRef<number>(0);

  // Convert client (mouse/touch) coordinates into SVG viewBox coordinates (1400 x 320)
  const getSvgCoordinates = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const inverse = ctm.inverse();
    const svgPt = pt.matrixTransform(inverse);
    return {
      x: Math.max(0, Math.min(1400, svgPt.x)),
      y: Math.max(0, Math.min(320, svgPt.y)),
    };
  }, []);

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent) => {
      const coords = getSvgCoordinates(e.clientX, e.clientY);
      if (coords) {
        targetPos.current = coords;
        currentPos.current = coords;
      }
      targetRadius.current = 175; // Generous ink-bleed radius covering letters
      setIsHovered(true);
    },
    [getSvgCoordinates]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const coords = getSvgCoordinates(e.clientX, e.clientY);
      if (!coords) return;
      targetPos.current = coords;
      targetRadius.current = 175;

      const now = performance.now();
      // Add a trail point every ~35ms when moving across letters
      if (now - lastAddRef.current > 35) {
        trailRef.current.push({
          x: coords.x,
          y: coords.y,
          radius: 145,
          alpha: 0.95,
        });
        if (trailRef.current.length > 18) {
          trailRef.current.shift();
        }
        lastAddRef.current = now;
      }
    },
    [getSvgCoordinates]
  );

  const handlePointerLeave = useCallback(() => {
    targetRadius.current = 0;
    setIsHovered(false);
  }, []);

  // 60FPS animation loop for silky smooth lerp physics and ink bleed decay
  useEffect(() => {
    let animId: number;

    const tick = () => {
      // Lerp position (0.18 ease factor)
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.18;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.18;

      // Lerp radius
      currentRadius.current += (targetRadius.current - currentRadius.current) * 0.12;

      // Fade out trailing ink splatters smoothly
      for (let i = 0; i < trailRef.current.length; i++) {
        trailRef.current[i].alpha *= 0.93;
      }
      trailRef.current = trailRef.current.filter((t) => t.alpha > 0.04);

      setPaintState({
        cx: currentPos.current.x,
        cy: currentPos.current.y,
        radius: currentRadius.current,
        trail: [...trailRef.current],
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerDown={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-[1400px] mx-auto cursor-crosshair select-none touch-none py-2 sm:py-4"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1400 320"
        className="w-full h-auto overflow-visible block select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* ── VIBRANT BRAND GRADIENT FOR PAINTED FILL (ORCHID / MAGENTA) ── */}
          <linearGradient id="leadflowPaintGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6EC7" />
            <stop offset="50%" stopColor="#D93D94" />
            <stop offset="100%" stopColor="#C52C82" />
          </linearGradient>

          {/* ── ORGANIC INK BLEED TURBULENCE (MATCHING HERON AI REFERENCE 1 & 2) ── */}
          {/* This deforms the paint perimeter into an organic fluid watercolor/ink contour */}
          <filter id="inkTurbulenceFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.032"
              numOctaves="3"
              result="turbulenceNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulenceNoise"
              scale="38"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacedPaint"
            />
          </filter>

          {/* ── INK PAINT MASK: REVEALS SOLID FILL WHEREVER CURSOR OR BRUSH TRAVELS ── */}
          <mask id="inkRevealMask">
            {/* Pure black base = hides everything by default */}
            <rect width="1400" height="320" fill="black" />

            {/* Organic paint blobs run through displacement filter */}
            <g filter="url(#inkTurbulenceFilter)">
              {/* Active cursor ink blob */}
              {paintState.radius > 2 && (
                <circle
                  cx={paintState.cx}
                  cy={paintState.cy}
                  r={paintState.radius}
                  fill="white"
                />
              )}

              {/* Trailing paint strokes lingering as user sweeps across letters */}
              {paintState.trail.map((t, idx) => (
                <circle
                  key={idx}
                  cx={t.x}
                  cy={t.y}
                  r={t.radius * t.alpha}
                  fill="white"
                  opacity={t.alpha}
                />
              ))}
            </g>
          </mask>
        </defs>

        {/* ══════════════════════════════════════════════════════════════════════
            1. ARCHITECTURAL BLUEPRINT TECHNICAL OVERLAYS (HERON AI REFERENCE)
           ══════════════════════════════════════════════════════════════════════ */}
        {/* Four Corner Alignment Crosshairs '+' */}
        <g stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.2">
          {/* Top-Left */}
          <line x1="16" y1="24" x2="28" y2="24" />
          <line x1="22" y1="18" x2="22" y2="30" />

          {/* Top-Right */}
          <line x1="1372" y1="24" x2="1384" y2="24" />
          <line x1="1378" y1="18" x2="1378" y2="30" />

          {/* Bottom-Left */}
          <line x1="16" y1="300" x2="28" y2="300" />
          <line x1="22" y1="294" x2="22" y2="306" />

          {/* Bottom-Right */}
          <line x1="1372" y1="300" x2="1384" y2="300" />
          <line x1="1378" y1="294" x2="1378" y2="306" />
        </g>

        {/* Fine Engineering Measurement Dashed Rulers */}
        <line
          x1="36"
          y1="24"
          x2="1364"
          y2="24"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <line
          x1="36"
          y1="300"
          x2="1364"
          y2="300"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />

        {/* Vertical Center Baseline Ticks */}
        <line x1="700" y1="12" x2="700" y2="24" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />
        <line x1="700" y1="300" x2="700" y2="312" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />

        {/* ══════════════════════════════════════════════════════════════════════
            2. LAYER A: ARCHITECTURAL WIREFRAME / OUTLINE TEXT (BASE STATE)
           ══════════════════════════════════════════════════════════════════════ */}
        <text
          x="700"
          y="238"
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.02)"
          stroke="rgba(255, 255, 255, 0.28)"
          strokeWidth="1.8"
          strokeLinejoin="round"
          className="font-sans font-black uppercase select-none pointer-events-none"
          style={{
            fontSize: "235px",
            letterSpacing: "-0.045em",
            fontFamily: "var(--font-sans), sans-serif",
          }}
        >
          LEADFLOW
        </text>

        {/* Trademark ® Badge in Outline State */}
        <g transform="translate(1324, 76)">
          <circle cx="16" cy="16" r="16" fill="none" stroke="rgba(217, 61, 148, 0.35)" strokeWidth="1.2" />
          <text
            x="16"
            y="21"
            textAnchor="middle"
            fill="rgba(217, 61, 148, 0.65)"
            fontSize="14"
            fontFamily="var(--font-mono), monospace"
            fontWeight="bold"
          >
            &reg;
          </text>
        </g>

        {/* ══════════════════════════════════════════════════════════════════════
            3. LAYER B: PAINTED FILL TEXT (REVEALED EXCLUSIVELY VIA INK MASK)
           ══════════════════════════════════════════════════════════════════════ */}
        <g mask="url(#inkRevealMask)" className="pointer-events-none">
          <text
            x="700"
            y="238"
            textAnchor="middle"
            fill="url(#leadflowPaintGrad)"
            stroke="#D93D94"
            strokeWidth="0.5"
            className="font-sans font-black uppercase select-none"
            style={{
              fontSize: "235px",
              letterSpacing: "-0.045em",
              fontFamily: "var(--font-sans), sans-serif",
              filter: "drop-shadow(0 0 28px rgba(217, 61, 148, 0.55))",
            }}
          >
            LEADFLOW
          </text>

          {/* Trademark ® in Painted State */}
          <g transform="translate(1324, 76)">
            <circle cx="16" cy="16" r="16" fill="#D93D94" stroke="#FFFFFF" strokeWidth="1.2" />
            <text
              x="16"
              y="21"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="14"
              fontFamily="var(--font-mono), monospace"
              fontWeight="bold"
            >
              &reg;
            </text>
          </g>
        </g>

        {/* ══════════════════════════════════════════════════════════════════════
            4. ACTIVE CURSOR LOCATOR POINT (MATCHING REFERENCE 1 & 2 EXACTLY)
           ══════════════════════════════════════════════════════════════════════ */}
        {isHovered && paintState.radius > 10 && (
          <g className="pointer-events-none">
            {/* Fine Hairline Crosshair */}
            <line
              x1={paintState.cx - 16}
              y1={paintState.cy}
              x2={paintState.cx + 16}
              y2={paintState.cy}
              stroke="#FF4D36"
              strokeWidth="0.8"
              opacity="0.85"
            />
            <line
              x1={paintState.cx}
              y1={paintState.cy - 16}
              x2={paintState.cx}
              y2={paintState.cy + 16}
              stroke="#FF4D36"
              strokeWidth="0.8"
              opacity="0.85"
            />

            {/* Reference 1 & 2 Red/Orange Square Indicator */}
            <rect
              x={paintState.cx - 4.5}
              y={paintState.cy - 4.5}
              width="9"
              height="9"
              fill="#FF4D36"
              className="drop-shadow-[0_0_8px_rgba(255,77,54,0.9)]"
            />
          </g>
        )}
      </svg>
    </div>
  );
}

export default InteractiveTextPaint;
