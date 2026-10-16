"use client";

import React, { useEffect, useRef } from "react";

interface PhysicsNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function SpringCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Disabled on touch devices and reduced motion preference
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // ── HIGH-DPI CANVAS SIZING ──
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // ── PHYSICS CONFIGURATION (SPRING & ELASTICITY ALGORITHM) ──
    const NUM_NODES = 14; // Compact, responsive medium-short trail length
    const MAX_SEGMENT_DIST = 16; // Clamps max stretch so line stays in medium-short range
    const nodes: PhysicsNode[] = [];
    for (let i = 0; i < NUM_NODES; i++) {
      nodes.push({ x: -100, y: -100, vx: 0, vy: 0 });
    }

    // Lead cursor coordinates
    let mouseX = -100;
    let mouseY = -100;
    let isMouseMoving = false;
    let lastMoveTime = performance.now();
    let trailAlpha = 0;
    let sectionFactor = 0; // 0 above pipeline section, 1 inside/below pipeline section

    // Physics parameters tuned for sleek medium-short whip elasticity
    const SPRING = 0.58;
    const DAMPING = 0.52;

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMoveTime = performance.now();
      isMouseMoving = true;

      // Initialize nodes if coming from offscreen
      if (nodes[0].x < -50) {
        for (let i = 0; i < NUM_NODES; i++) {
          nodes[i].x = mouseX;
          nodes[i].y = mouseY;
          nodes[i].vx = 0;
          nodes[i].vy = 0;
        }
      }

      // Wake up animation loop if paused
      if (!isLooping) {
        isLooping = true;
        lastTime = performance.now();
        rafId = requestAnimationFrame(renderLoop);
      }
    };

    const onPointerLeave = () => {
      isMouseMoving = false;
    };

    const onScroll = () => {
      if (!isLooping) {
        isLooping = true;
        lastTime = performance.now();
        rafId = requestAnimationFrame(renderLoop);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── ANIMATION & PHYSICS RENDER LOOP ──
    let rafId: number;
    let isLooping = true;
    let lastTime = performance.now();

    const renderLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // 1. SECTION DETECTOR: Active from pipeline engine (#pipeline-velocity) downwards
      const pipelineEl = document.getElementById("pipeline-velocity");
      let inTargetSection = false;
      if (pipelineEl) {
        const rect = pipelineEl.getBoundingClientRect();
        // Becomes active when top of pipeline section enters upper viewport
        inTargetSection = rect.top <= window.innerHeight * 0.85;
      }

      // Smooth section ramp
      sectionFactor += ((inTargetSection ? 1 : 0) - sectionFactor) * 0.12;

      // 2. FADE & CULL SYSTEM (Smooth vanishing act when idle or stopped)
      const timeSinceMove = now - lastMoveTime;
      if (timeSinceMove > 110) {
        isMouseMoving = false;
        trailAlpha = Math.max(0, trailAlpha - dt * 4.0);
      } else {
        trailAlpha = Math.min(1, trailAlpha + dt * 10.0);
      }

      // 3. MASS-SPRING-DAMPER PHYSICS SOLVER WITH DISTANCE CLAMPING
      // Lead node (Node 0) locks directly to live mouse position
      nodes[0].x = mouseX;
      nodes[0].y = mouseY;
      nodes[0].vx = 0;
      nodes[0].vy = 0;

      let totalMotion = 0;

      for (let i = 1; i < NUM_NODES; i++) {
        const leader = nodes[i - 1];
        const current = nodes[i];

        let dx = leader.x - current.x;
        let dy = leader.y - current.y;

        // Hooke's Law spring force with velocity damping
        current.vx = (current.vx + dx * SPRING) * DAMPING;
        current.vy = (current.vy + dy * SPRING) * DAMPING;

        current.x += current.vx;
        current.y += current.vy;

        // Medium-short range limiter: prevent excessive elongation on rapid sweeps
        const dist = Math.hypot(leader.x - current.x, leader.y - current.y);
        if (dist > MAX_SEGMENT_DIST) {
          const angle = Math.atan2(current.y - leader.y, current.x - leader.x);
          current.x = leader.x + Math.cos(angle) * MAX_SEGMENT_DIST;
          current.y = leader.y + Math.sin(angle) * MAX_SEGMENT_DIST;
          current.vx *= 0.8;
          current.vy *= 0.8;
        }

        totalMotion += Math.abs(current.vx) + Math.abs(current.vy);
      }

      // Effective render opacity combining movement fade and section factor
      const effectiveAlpha = trailAlpha * sectionFactor;

      // 4. DRAWING LAYER (Single HTML5 digital chalkboard canvas)
      ctx.clearRect(0, 0, width, height);

      if (effectiveAlpha > 0.005 && nodes[0].x > -50) {
        // A. Draw trailing elastic line segments with progressive tapering & opacity fade
        for (let i = 0; i < NUM_NODES - 1; i++) {
          const p0 = nodes[i];
          const p1 = nodes[i + 1];

          const t = i / (NUM_NODES - 1);
          // Opacity decreases along the tail from 0.95 to 0.05
          const segAlpha = Math.max(0, Math.pow(1 - t, 0.85) * effectiveAlpha);
          // Width tapers smoothly from 3.2px at head to 0.9px at tail
          const strokeW = 3.2 * (1 - t * 0.72);

          ctx.beginPath();
          ctx.strokeStyle = `rgba(217, 61, 148, ${segAlpha.toFixed(3)})`;
          ctx.lineWidth = strokeW;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          if (i === 0) {
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
          } else {
            const prevMidX = (nodes[i - 1].x + p0.x) / 2;
            const prevMidY = (nodes[i - 1].y + p0.y) / 2;
            const nextMidX = (p0.x + p1.x) / 2;
            const nextMidY = (p0.y + p1.y) / 2;

            ctx.moveTo(prevMidX, prevMidY);
            ctx.quadraticCurveTo(p0.x, p0.y, nextMidX, nextMidY);
          }
          ctx.stroke();

          // B. Draw micro-dots along the spring nodes (matching reference diagram)
          if (i > 0 && i < NUM_NODES - 1) {
            const dotR = Math.max(0.8, 1.4 * (1 - t * 0.65));
            ctx.beginPath();
            ctx.fillStyle = `rgba(217, 61, 148, ${Math.min(1, segAlpha * 1.25).toFixed(3)})`;
            ctx.arc(p0.x, p0.y, dotR, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // C. Draw the crisp solid Lead Square at the live cursor coordinate
        const squareSize = 7.5;
        const halfSquare = squareSize / 2;
        ctx.fillStyle = `rgba(217, 61, 148, ${effectiveAlpha.toFixed(3)})`;
        ctx.fillRect(mouseX - halfSquare, mouseY - halfSquare, squareSize, squareSize);

        // Crisp 1px dual contrast border for pristine visibility against both dark & light backgrounds
        ctx.strokeStyle = `rgba(255, 255, 255, ${(effectiveAlpha * 0.85).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(mouseX - halfSquare, mouseY - halfSquare, squareSize, squareSize);
      }

      // 5. RESOURCE SAVER: Freeze calculations when idle to keep CPU < 1%
      if (!isMouseMoving && totalMotion < 0.1 && effectiveAlpha < 0.005) {
        ctx.clearRect(0, 0, width, height);
        isLooping = false;
        return; // Stop animation loop until next mouse move or scroll
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
    />
  );
}

export default SpringCursorTrail;
