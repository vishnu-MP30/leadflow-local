import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { buildWorld, WorldInstance } from './world';
import { createTour, TourMode } from './tour';

export interface PerformanceMetrics {
  fps: number;
  frameMs: number;
  dpr: number;
  drawCalls: number;
  triangles: number;
  isLite: boolean;
  bloomEnabled: boolean;
}

export interface InitHeroOptions {
  canvas: HTMLCanvasElement;
  hero: HTMLElement;
  onProgress?: (travel: number, velocity: number, isTouringOrHolding: boolean, mode: TourMode) => void;
  onTourStateChange?: (mode: TourMode) => void;
  onMetrics?: (metrics: PerformanceMetrics) => void;
  onReady?: () => void;
}

export interface HeroEngineControls {
  toggleTour: () => void;
  pauseTour: () => void;
  resumeTour: () => void;
  dispose: () => void;
}

const smoothstep = (min: number, max: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

export function initHero({
  canvas,
  hero,
  onProgress,
  onTourStateChange,
  onMetrics,
  onReady,
}: InitHeroOptions): HeroEngineControls {
  const isCoarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const concurrency = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
  const memory = typeof navigator !== 'undefined' ? (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8 : 8;
  const lite = isCoarse || concurrency <= 4 || memory <= 4;

  // 1. WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    powerPreference: 'high-performance',
    alpha: false,
  });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;

  let currentDpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, lite ? 1 : 1.5);
  renderer.setPixelRatio(currentDpr);

  // 2. Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 160);

  // 3. Post-Processing (Bloom for light beams only, threshold 1.0)
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  let bloomEnabled = true;
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(256, 256),
    0.5, // strength
    0.5, // radius
    1.0  // threshold: ONLY beams glow, standard surfaces stay clean
  );
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  // 4. World construction
  let world: WorldInstance | null = buildWorld(scene, { lite, renderer, camera });

  // 5. Tour State Machine
  const tour = createTour({
    onMode: (mode) => {
      onTourStateChange?.(mode);
      if (mode === 'tour') {
        hero.classList.add('is-touring');
      } else if (mode === 'idle') {
        hero.classList.remove('is-touring');
        hero.classList.remove('is-holding');
      } else if (mode === 'hold') {
        hero.classList.add('is-holding');
      } else if (mode === 'paused') {
        hero.classList.remove('is-touring');
      }
    },
  });

  // 6. Viewport, Orientation & Sizing
  let currentWidth = 1;
  let currentHeight = 1;
  let isPortrait = false;

  const updateSize = () => {
    if (!hero) return;
    const w = hero.clientWidth || window.innerWidth;
    const h = hero.clientHeight || window.innerHeight;
    currentWidth = w;
    currentHeight = h;
    isPortrait = h > w;

    renderer.setPixelRatio(currentDpr);
    renderer.setSize(w, h, false);
    composer.setPixelRatio(currentDpr);
    composer.setSize(w, h);

    // Mobile bloom target at 1/3 viewport, desktop 1/2
    const bloomDiv = lite ? 3 : 2;
    bloomPass.resolution.set(Math.floor(w / bloomDiv), Math.floor(h / bloomDiv));

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  const onResizeDebounced = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateSize, 150);
  };
  window.addEventListener('resize', onResizeDebounced, { passive: true });
  window.addEventListener('orientationchange', onResizeDebounced, { passive: true });
  updateSize();

  // 7. Desktop Pointer Parallax & Hold Handling
  let mouseTargetX = 0;
  let mouseTargetY = 0;
  let mouseCurX = 0;
  let mouseCurY = 0;

  const onPointerMove = (e: PointerEvent) => {
    if (lite) return;
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseTargetX = normX * 0.5;
    mouseTargetY = normY * 0.5;
  };

  const onPointerDown = (e: PointerEvent) => {
    // Only desktop fine pointer can hold-to-fly
    if (isCoarse || lite) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('a, button, input, [role="button"], select, textarea, .play')) {
      return;
    }
    tour.holdStart();
  };

  const onPointerUp = () => {
    if (isCoarse || lite) return;
    tour.holdEnd(performance.now());
  };

  if (!isCoarse) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    hero.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  }

  // 8. Visibility & Intersection Observers
  let isIntersecting = true;
  let isTabVisible = true;

  const observer = new IntersectionObserver(
    (entries) => {
      isIntersecting = entries[0].isIntersecting;
    },
    { threshold: 0.05 }
  );
  observer.observe(hero);

  const onVisibilityChange = () => {
    isTabVisible = document.visibilityState !== 'hidden';
    if (!isTabVisible) {
      tour.pause();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  // 9. Context Loss Handling
  const onContextLost = (e: Event) => {
    e.preventDefault();
    canvas.style.opacity = '0';
  };
  const onContextRestored = () => {
    if (world) world.dispose();
    world = buildWorld(scene, { lite, renderer, camera });
    updateSize();
    canvas.style.opacity = '1';
  };
  canvas.addEventListener('webglcontextlost', onContextLost, false);
  canvas.addEventListener('webglcontextrestored', onContextRestored, false);

  // 10. Pre-compile Shaders before First Reveal
  renderer.compile(scene, camera);
  onReady?.();

  // 11. Animation & Telemetry Loop
  let rafId: number;
  let lastTime = performance.now();
  let lastIdleRenderTime = 0;
  let lastUiVal = -1;

  // Adaptive Quality Tracker
  let movingTime = 0;
  let frameCount = 0;
  let frameTimeSum = 0;
  let adaptiveResolved = false;

  // Frame metrics
  let lastFpsUpdate = performance.now();
  let fpsFrames = 0;
  let currentFps = 60;
  let currentFrameMs = 16.6;

  const posVec = new THREE.Vector3();
  const tanVec = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();
  const upVector = new THREE.Vector3(0, 1, 0);

  const renderLoop = (now: number) => {
    rafId = requestAnimationFrame(renderLoop);

    if (!isIntersecting || !isTabVisible || !world) return;

    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    // Throttle idle rendering to ~30 fps (33ms) to conserve battery / GPU
    const isMoving = tour.S.mode !== 'idle' || Math.abs(tour.S.vel) > 0.0001;
    if (!isMoving) {
      if (now - lastIdleRenderTime < 32) {
        return;
      }
      lastIdleRenderTime = now;
    }

    const tState = tour.update(dt, now);
    world.update(dt, tState.vel, tour.V_TOUR);

    // Camera pose along closed rail
    const u = tour.frac(tState.travel);
    world.rail.getPointAt(u, posVec);
    world.rail.getTangentAt(u, tanVec);

    // Idle sway & parallax
    const idleSway = (tState.mode === 'idle') ? Math.sin(now * 0.0002 * Math.PI) * 0.25 : 0;
    mouseCurX += (mouseTargetX - mouseCurX) * 0.08;
    mouseCurY += (mouseTargetY - mouseCurY) * 0.08;

    // UI visibility: 1 on hero, 0 during flight
    const dist = tour.distToHero(tState.travel);
    const ui = 1 - smoothstep(0.012, 0.05, dist);

    // Camera FOV Kick
    const baseFov = isPortrait ? 75 : 60;
    const fovKick = Math.min(4, (Math.abs(tState.vel) / tour.V_HOLD) * 4);
    camera.fov = baseFov + fovKick;

    // Camera View Offset: shifts tunnel opening away from text
    // Desktop (landscape): shift scene ~15% to right
    // Mobile (portrait): shift scene ~12% up
    if (isPortrait) {
      const offsetY = Math.round(currentHeight * 0.12 * ui);
      camera.setViewOffset(currentWidth, currentHeight, 0, offsetY, currentWidth, currentHeight);
    } else {
      const offsetX = Math.round(-currentWidth * 0.15 * ui);
      camera.setViewOffset(currentWidth, currentHeight, offsetX, 0, currentWidth, currentHeight);
    }
    camera.updateProjectionMatrix();

    // Position camera & look along rail tangent
    const parallaxScale = ui; // Fade parallax during tour
    camera.position.set(
      posVec.x + mouseCurX * parallaxScale,
      posVec.y + idleSway + mouseCurY * parallaxScale,
      posVec.z
    );
    lookTarget.copy(posVec).addScaledVector(tanVec, 8);
    camera.lookAt(lookTarget);

    // Render frame
    if (bloomEnabled) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }

    // Update DOM CSS variable --ui only if changed by > 0.01
    if (Math.abs(ui - lastUiVal) > 0.01) {
      lastUiVal = ui;
      hero.style.setProperty('--ui', ui.toFixed(3));
      hero.setAttribute('data-ui', ui < 0.5 ? 'off' : 'on');
    }

    // Video-like progress bar
    const tourProgress = (tState.mode === 'tour' || tState.mode === 'paused')
      ? Math.max(0, Math.min(1, tState.travel - (tState.tourEnd - 1)))
      : tour.frac(tState.travel);
    hero.style.setProperty('--tour', tourProgress.toFixed(3));
    hero.style.setProperty(
      '--tourOn',
      (tState.mode === 'tour' || tState.mode === 'paused' || tState.mode === 'hold') ? '1' : '0'
    );

    const isTouringOrHolding = tState.mode === 'tour' || tState.mode === 'hold' || tState.mode === 'return';
    onProgress?.(tState.travel, tState.vel, isTouringOrHolding, tState.mode);

    // Adaptive Quality Routine
    if (isMoving && !adaptiveResolved) {
      movingTime += dt;
      if (movingTime > 3.0) {
        frameCount++;
        frameTimeSum += (now - lastTime);
        if (frameCount >= 90) {
          const avgFrameMs = frameTimeSum / frameCount;
          if (avgFrameMs > 24) {
            if (currentDpr > 0.75) {
              currentDpr = Math.max(0.75, currentDpr - 0.25);
              renderer.setPixelRatio(currentDpr);
              composer.setPixelRatio(currentDpr);
            } else {
              bloomEnabled = false;
              adaptiveResolved = true;
            }
          } else {
            adaptiveResolved = true;
          }
          frameCount = 0;
          frameTimeSum = 0;
        }
      }
    }

    // Telemetry stats
    fpsFrames++;
    if (now - lastFpsUpdate >= 500) {
      currentFps = Math.round((fpsFrames * 1000) / (now - lastFpsUpdate));
      currentFrameMs = Math.round(dt * 1000 * 10) / 10;
      fpsFrames = 0;
      lastFpsUpdate = now;

      onMetrics?.({
        fps: currentFps,
        frameMs: currentFrameMs,
        dpr: currentDpr,
        drawCalls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        isLite: lite,
        bloomEnabled,
      });
    }
  };

  rafId = requestAnimationFrame(renderLoop);

  const dispose = () => {
    cancelAnimationFrame(rafId);
    clearTimeout(resizeTimer);
    window.removeEventListener('resize', onResizeDebounced);
    window.removeEventListener('orientationchange', onResizeDebounced);
    if (!isCoarse) {
      window.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    }
    document.removeEventListener('visibilitychange', onVisibilityChange);
    observer.disconnect();
    canvas.removeEventListener('webglcontextlost', onContextLost);
    canvas.removeEventListener('webglcontextrestored', onContextRestored);

    world?.dispose();
    renderer.dispose();
    composer.dispose();
  };

  return {
    toggleTour: () => tour.toggle(),
    pauseTour: () => tour.pause(),
    resumeTour: () => tour.resume(),
    dispose,
  };
}
