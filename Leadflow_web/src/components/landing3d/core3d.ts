import * as THREE from 'three';

export interface LandingCoreOptions {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  scale?: number;
  onReady?: () => void;
}

/**
 * Creates a precision-lathed solid cylindrical ring tier with
 * inner and outer cylindrical walls, flat annular top and bottom faces,
 * and smooth beveled rim edges.
 */
function createBeveledCylinderRing(
  rOut: number,
  rIn: number,
  height: number,
  bevel = 0.04,
  segments = 80
): THREE.BufferGeometry {
  const h2 = height / 2;
  const b = Math.min(bevel, (rOut - rIn) * 0.22, height * 0.22);

  const points: THREE.Vector2[] = [
    new THREE.Vector2(rIn + b, h2),         // top inner bevel start
    new THREE.Vector2(rOut - b, h2),        // top outer bevel start
    new THREE.Vector2(rOut, h2 - b),        // outer top corner
    new THREE.Vector2(rOut, -h2 + b),       // outer bottom corner
    new THREE.Vector2(rOut - b, -h2),       // bottom outer bevel start
    new THREE.Vector2(rIn + b, -h2),        // bottom inner bevel start
    new THREE.Vector2(rIn, -h2 + b),        // inner bottom corner
    new THREE.Vector2(rIn, h2 - b),         // inner top corner
    new THREE.Vector2(rIn + b, h2),         // close polygon
  ];

  const geom = new THREE.LatheGeometry(points, segments);
  geom.computeVertexNormals();
  return geom;
}

/**
 * Creates subtle stardust micro-particles floating inside the bubble volume
 */
function createInteriorDust(count = 110, radius = 3.6): THREE.Points {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 1.4 + Math.random() * (radius - 1.4);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x8a2d6c,
    size: 0.028,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}

/**
 * Creates subtle horizon dots across the lower third of the canvas matching reference
 */
function createHorizonDots(count = 28, width = 20, y = -3.7): THREE.Points {
  const positions = new Float32Array(count * 3);
  const step = width / (count - 1);
  const startX = -width / 2;

  for (let i = 0; i < count; i++) {
    positions[i * 3] = startX + i * step;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = 0;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x5a1a45,
    size: 0.035,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}

export function initLandingCore({
  canvas,
  container,
  scale = 0.68,
  onReady,
}: LandingCoreOptions) {
  let isDisposed = false;
  let isPaused = true;
  let rafId: number;

  // 1. SCENE SETUP
  const scene = new THREE.Scene();

  // 2. CAMERA SETUP
  const camera = new THREE.PerspectiveCamera(
    40,
    container.clientWidth / Math.max(container.clientHeight, 1),
    0.1,
    100
  );
  camera.position.set(0, 0, 10.6);

  // 3. RENDERER SETUP
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
    stencil: false,
  });

  const updateSize = () => {
    if (isDisposed || !container) return;
    const width = container.clientWidth;
    const height = Math.max(container.clientHeight, 1);
    const aspect = width / height;
    camera.aspect = aspect;

    // Responsive camera distance: when container is tall (aspect < 1.2), back up camera so 3D structure stays beautifully framed and never clipped
    const baseZ = 10.6;
    if (aspect < 1.2) {
      camera.position.set(0, 0, baseZ * (1.18 / Math.max(aspect, 0.42)));
    } else {
      camera.position.set(0, 0, baseZ);
    }
    camera.updateProjectionMatrix();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
  };

  updateSize();

  // 4. LIGHTING SYSTEM (Atmospheric Dark Aubergine & Soft Plum Specular)
  const ambientLight = new THREE.AmbientLight(0x18051b, 1.4);
  scene.add(ambientLight);

  // Key directional light for satin highlights on the top of each stepped tier
  const keyLight = new THREE.DirectionalLight(0xf5d6eb, 2.4);
  keyLight.position.set(6, 8, 6);
  scene.add(keyLight);

  // Dark moody fill light from bottom-left
  const fillLight = new THREE.DirectionalLight(0x1a0518, 1.2);
  fillLight.position.set(-7, -4, -4);
  scene.add(fillLight);

  // Focused warm plum highlight spot on the right side of the stepped tiers
  const highlightSpot = new THREE.PointLight(0xc93888, 2.8, 6.0, 1.4);
  highlightSpot.position.set(1.4, -0.15, 1.3);
  scene.add(highlightSpot);

  // 5. MASTER GROUP (CENTERED 3D STRUCTURE)
  const masterGroup = new THREE.Group();
  masterGroup.scale.set(scale, scale, scale);
  masterGroup.position.set(0, 0, 0);
  scene.add(masterGroup);

  // ── A. THE STEPPED CONCENTRIC CYLINDER COIL (ONE UNIFIED COLOR THEME - NOT PINK) ──
  const steppedGroup = new THREE.Group();
  // Offset Y by +0.35 to center the bounding box of the tiered stack at (0, 0, 0)
  steppedGroup.position.set(0, 0.35, 0);
  masterGroup.add(steppedGroup);

  // Diagonal tilt matching the exact angle in the uploaded screenshot (~45 deg)
  steppedGroup.rotation.z = -0.72;
  steppedGroup.rotation.x = 0.46;
  steppedGroup.rotation.y = 0.20;

  // Single unified dark aubergine / dark wine plum material (NO contrasting pink bands!)
  const tierMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a1238,       // Rich dark aubergine / plum
    roughness: 0.42,       // Smooth satin / matte finish
    metalness: 0.28,       // Subtle metallic depth
  });

  // Stepped tier specifications forming the exact tiered spiral/concentric silhouette
  const tierSpecs = [
    { rOut: 1.35, rIn: 0.85, h: 0.60, y: 1.55 },   // Tier 1 (top cap)
    { rOut: 1.85, rIn: 1.35, h: 0.65, y: 0.95 },   // Tier 2
    { rOut: 2.40, rIn: 1.85, h: 0.72, y: 0.30 },   // Tier 3
    { rOut: 2.92, rIn: 2.30, h: 0.82, y: -0.42 },  // Tier 4 (widest tier!)
    { rOut: 2.52, rIn: 1.95, h: 0.72, y: -1.14 },  // Tier 5
    { rOut: 1.92, rIn: 1.40, h: 0.62, y: -1.78 },  // Tier 6
    { rOut: 1.32, rIn: 0.80, h: 0.48, y: -2.28 },  // Tier 7 (bottom cap)
  ];

  tierSpecs.forEach((spec) => {
    const geom = createBeveledCylinderRing(spec.rOut, spec.rIn, spec.h, 0.045, 80);
    const mesh = new THREE.Mesh(geom, tierMaterial);
    mesh.position.y = spec.y;
    steppedGroup.add(mesh);
  });

  // Central cylindrical connecting shaft through the core
  const shaftGeom = new THREE.CylinderGeometry(0.82, 0.82, 4.4, 48);
  const shaftMesh = new THREE.Mesh(shaftGeom, tierMaterial);
  shaftMesh.position.y = -0.35;
  steppedGroup.add(shaftMesh);

  // ── B. TRANSLUCENT AUBERGINE / MAUVE SPHERICAL BUBBLE ENVELOPE (REFERENCE SCREENSHOT) ──
  const bubbleGeom = new THREE.SphereGeometry(3.95, 64, 64);
  const bubbleMat = new THREE.MeshPhysicalMaterial({
    color: 0x5a1848,
    emissive: 0x360a2c,
    emissiveIntensity: 0.22,
    roughness: 0.10,
    transmission: 0.88,
    opacity: 0.30,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const bubble = new THREE.Mesh(bubbleGeom, bubbleMat);
  masterGroup.add(bubble);

  // ── C. INTERIOR STARDUST PARTICLES (SUBTLE, SPARSE SPECS) ──
  const interiorDust = createInteriorDust(110, 3.6);
  masterGroup.add(interiorDust);

  // ── D. HORIZON PERSPECTIVE DOTS (MATCHING BOTTOM OF REFERENCE IMAGE) ──
  const horizonDots = createHorizonDots(28, 20, -2.85);
  scene.add(horizonDots);

  // 6. INTERACTIVE PARALLAX & SCROLL VELOCITY
  let targetRotX = 0.46;
  let targetRotY = 0.20;
  let mouseX = 0;
  let mouseY = 0;
  let scrollSpeed = 0;
  let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

  const onPointerMove = (e: PointerEvent) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseX = normX * 0.16;
    mouseY = normY * 0.14;
  };

  const onScroll = () => {
    const currentScrollY = window.scrollY;
    const deltaY = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;
    scrollSpeed = Math.min(Math.abs(deltaY) * 0.003, 0.2);
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  const resizeObserver = new ResizeObserver(() => {
    updateSize();
  });
  resizeObserver.observe(container);

  // 7. ANIMATION TICK LOOP
  let clock = new THREE.Clock();

  const tick = () => {
    if (isDisposed) return;

    if (!isPaused) {
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Smooth axial rotation of the stepped core
      const rotSpeed = 0.09 + scrollSpeed;
      steppedGroup.rotation.y += delta * rotSpeed;

      // Damp scroll acceleration
      scrollSpeed *= 0.94;

      // Mouse Parallax Lerp
      targetRotX = 0.46 + mouseY + Math.sin(time * 0.35) * 0.04;
      targetRotY = 0.20 + mouseX;
      steppedGroup.rotation.x += (targetRotX - steppedGroup.rotation.x) * 0.04;

      // Subtle bubble breathing
      const breath = 1.0 + Math.sin(time * 0.75) * 0.006;
      bubble.scale.set(breath, breath, breath);

      // Subtle interior dust drift
      interiorDust.rotation.y += delta * 0.03;

      renderer.render(scene, camera);
    }

    rafId = requestAnimationFrame(tick);
  };

  // 8. INTERSECTION OBSERVER FOR GPU EFFICIENCY
  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      isPaused = !entry.isIntersecting;
      if (!isPaused) {
        clock.getDelta();
      }
    },
    { threshold: 0.05 }
  );

  intersectionObserver.observe(container);

  // Start tick loop
  isPaused = false;
  rafId = requestAnimationFrame(tick);
  onReady?.();

  // 9. CLEANUP HANDLER
  return () => {
    isDisposed = true;
    cancelAnimationFrame(rafId);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('scroll', onScroll);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();

    masterGroup.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    tierMaterial.dispose();
    bubbleMat.dispose();
    renderer.dispose();
  };
}
