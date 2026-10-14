import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { buildWorld } from './world';

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
  onProgress?: (progress: number, velocity: number, isHolding: boolean) => void;
  onMetrics?: (metrics: PerformanceMetrics) => void;
  onReady?: () => void;
  primary?: number;
  accent?: number;
}

export function initHero({
  canvas,
  hero,
  onProgress,
  onMetrics,
  onReady,
  primary = 0x5a0a6e,
  accent = 0xd93d94,
}: InitHeroOptions) {
  const isCoarse = typeof window !== 'undefined' && matchMedia('(pointer:coarse)').matches;
  const concurrency = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
  const lite = isCoarse || concurrency <= 4;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    powerPreference: 'high-performance',
    alpha: false,
  });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  let dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, lite ? 1 : 1.5);
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07000d);
  scene.fog = new THREE.FogExp2(0x100024, 0.020);

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 150);
  const world = buildWorld(scene, { lite, primary, accent });

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloom = new UnrealBloomPass(
    new THREE.Vector2(256, 256),
    lite ? 0.7 : 0.95,
    0.4,
    0.65
  );
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  let rt: ReturnType<typeof setTimeout> | undefined;
  const resize = () => {
    if (!hero) return;
    const w = hero.clientWidth || window.innerWidth;
    const h = hero.clientHeight || window.innerHeight;
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    composer.setPixelRatio(dpr);
    composer.setSize(w, h);
    bloom.resolution.set(Math.floor(w / 2), Math.floor(h / 2));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  const onResize = () => {
    clearTimeout(rt);
    rt = setTimeout(resize, 150);
  };
  window.addEventListener('resize', onResize);
  resize();

  // Pointer & hold state
  const st = {
    holding: false,
    vel: 0.003,
    p: 0,
    px: 0,
    py: 0,
    spx: 0,
    spy: 0,
  };

  let holdTimer: ReturnType<typeof setTimeout> | undefined;
  let sx = 0;
  let sy = 0;

  const stop = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = undefined;
    }
    st.holding = false;
    hero.classList.remove('is-holding');
  };

  const onPointerDown = (e: PointerEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('a, button, input, [role="button"], select, textarea')) {
      return;
    }

    sx = e.clientX;
    sy = e.clientY;

    const start = () => {
      st.holding = true;
      hero.classList.add('is-holding');
    };

    if (e.pointerType === 'touch') {
      holdTimer = setTimeout(start, 150);
    } else {
      start();
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    const w = hero.clientWidth || window.innerWidth;
    const h = hero.clientHeight || window.innerHeight;
    st.px = (e.clientX / w) * 2 - 1;
    st.py = -((e.clientY / h) * 2 - 1);

    if (holdTimer && !st.holding) {
      const dist = Math.hypot(e.clientX - sx, e.clientY - sy);
      if (dist > 10) {
        clearTimeout(holdTimer);
        holdTimer = undefined;
      }
    }
  };

  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  hero.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointerup', stop);
  window.addEventListener('pointercancel', stop);
  hero.addEventListener('pointermove', onPointerMove);
  hero.addEventListener('contextmenu', onContextMenu);

  // Viewport Intersection & visibility tracking
  let visible = true;
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
    },
    { threshold: 0 }
  );
  io.observe(hero);

  const onVisibilityChange = () => {
    if (document.hidden) {
      stop();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  // Pre-compile shaders before reveal to avoid frame hitch
  renderer.compile(scene, camera);
  onReady?.();

  // Pre-calculate scene geometry stats (mesh draw calls and triangles)
  let sceneDrawCalls = 0;
  let sceneTriangles = 0;
  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.geometry) {
      sceneDrawCalls++;
      const index = obj.geometry.index;
      if (index) {
        sceneTriangles += index.count / 3;
      } else {
        const pos = obj.geometry.attributes.position;
        if (pos) sceneTriangles += pos.count / 3;
      }
    }
  });

  // Animation vectors
  const pos = new THREE.Vector3();
  const look = new THREE.Vector3();

  let last = performance.now();
  let acc = 0;
  let frameCount = 0;
  let metricsTimer = 0;

  renderer.setAnimationLoop((now: number) => {
    if (!visible || document.hidden) {
      last = now;
      return;
    }

    const idle = !st.holding && st.vel < 0.0055;
    // Idle 30fps throttle (~33ms)
    if (idle && now - last < 32) {
      return;
    }

    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    // Smooth exponential velocity ramp
    const targetVel = st.holding ? 0.046 : 0.003;
    st.vel += (targetVel - st.vel) * (1 - Math.exp(-2.5 * dt));
    st.p = (st.p + st.vel * dt) % 1;

    // Smoothed parallax
    st.spx += (st.px - st.spx) * (1 - Math.exp(-4 * dt));
    st.spy += (st.py - st.spy) * (1 - Math.exp(-4 * dt));

    // Rail traversal
    world.rail.getPointAt(st.p, pos);
    world.rail.getPointAt((st.p + 0.012) % 1, look);
    camera.position.copy(pos);
    camera.lookAt(look);
    camera.translateX(st.spx * 0.8);
    camera.translateY(st.spy * 0.5);

    // Speed FOV kick
    const fov = 60 + (st.vel - 0.003) * 250;
    if (Math.abs(fov - camera.fov) > 0.1) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    // World uniforms update
    world.update(now / 1000);
    onProgress?.(st.p, st.vel, st.holding);

    // Render post-processed scene
    composer.render();

    // Adaptive quality degradation if frametime exceeds budget while moving
    if (!idle && now > 3000) {
      acc += dt;
      if (++frameCount >= 90) {
        const avg = acc / frameCount;
        if (avg > 0.024) {
          if (dpr > 0.75) {
            dpr = Math.max(0.75, dpr - 0.25);
            resize();
          } else if (bloom.enabled) {
            bloom.enabled = false;
          }
        }
        acc = 0;
        frameCount = 0;
      }
    }

    // Telemetry reporting for ?debug HUD
    if (onMetrics && now - metricsTimer > 150) {
      metricsTimer = now;
      onMetrics({
        fps: Math.round(1 / Math.max(dt, 0.001)),
        frameMs: +(dt * 1000).toFixed(1),
        dpr: +dpr.toFixed(2),
        drawCalls: sceneDrawCalls,
        triangles: Math.round(sceneTriangles),
        isLite: lite,
        bloomEnabled: bloom.enabled,
      });
    }
  });

  return () => {
    renderer.setAnimationLoop(null);
    io.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('resize', onResize);
    hero.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointerup', stop);
    window.removeEventListener('pointercancel', stop);
    hero.removeEventListener('pointermove', onPointerMove);
    hero.removeEventListener('contextmenu', onContextMenu);
    clearTimeout(rt);
    if (holdTimer) clearTimeout(holdTimer);

    world.dispose();
    composer.dispose();
    renderer.dispose();
  };
}
