import * as THREE from 'three';

export interface Ribbon3DOptions {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  onReady?: () => void;
}

/**
 * Custom 3D Arc Curve for sweeping architectural ribbon arches.
 * Creates an elliptical arc in 3D space with subtle Z-elevation.
 */
class RibbonArcCurve extends THREE.Curve<THREE.Vector3> {
  radiusX: number;
  radiusY: number;
  startAngle: number;
  endAngle: number;
  zStart: number;
  zEnd: number;

  constructor(
    radiusX: number,
    radiusY: number,
    startAngle: number,
    endAngle: number,
    zStart = 0,
    zEnd = 0
  ) {
    super();
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.zStart = zStart;
    this.zEnd = zEnd;
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    const angle = this.startAngle + t * (this.endAngle - this.startAngle);
    const x = this.radiusX * Math.cos(angle);
    const y = this.radiusY * Math.sin(angle);
    const z = this.zStart + t * (this.zEnd - this.zStart) + Math.sin(t * Math.PI) * 0.35;
    return optionalTarget.set(x, y, z);
  }
}

/**
 * Creates a precision beveled rectangular ribbon geometry along an extruded 3D curve.
 */
function createRibbonGeometry(
  curve: THREE.Curve<THREE.Vector3>,
  width = 0.65,
  thickness = 0.28,
  steps = 110,
  bevel = 0.04
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const w2 = width / 2;
  const t2 = thickness / 2;

  // Chamfered rectangle profile
  const b = Math.min(bevel, w2 * 0.2, t2 * 0.25);
  shape.moveTo(-w2 + b, -t2);
  shape.lineTo(w2 - b, -t2);
  shape.lineTo(w2, -t2 + b);
  shape.lineTo(w2, t2 - b);
  shape.lineTo(w2 - b, t2);
  shape.lineTo(-w2 + b, t2);
  shape.lineTo(-w2, t2 - b);
  shape.lineTo(-w2, -t2 + b);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    extrudePath: curve,
    steps,
    bevelEnabled: false, // bevel is built into the 2D cross-section profile
  });

  geom.computeVertexNormals();
  return geom;
}

/**
 * Creates the glowing highlight crest line along the primary arch's peak
 */
function createCrestHighlight(
  radiusX: number,
  radiusY: number,
  startAngle: number,
  endAngle: number,
  zStart: number,
  zEnd: number
): THREE.Mesh {
  // Only the crest portion (where the light strikes most brilliantly)
  const crestCurve = new RibbonArcCurve(
    radiusX + 0.33,
    radiusY + 0.33,
    startAngle + 0.42 * (endAngle - startAngle),
    startAngle + 0.72 * (endAngle - startAngle),
    zStart + 0.42 * (zEnd - zStart) + 0.15,
    zStart + 0.72 * (zEnd - zStart) + 0.15
  );

  const tubeGeom = new THREE.TubeGeometry(crestCurve, 40, 0.05, 12, false);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Mesh(tubeGeom, glowMat);
}

export function initRibbon3D({
  canvas,
  container,
  onReady,
}: Ribbon3DOptions): () => void {
  let isDisposed = false;
  let animId = 0;

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0e0314, 0.045);

  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 11);

  // WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  // ── LIGHTING SETUP (MATCHING REFERENCE SATIN SPECULAR GLOSS) ──
  // Ambient deep violet light
  const ambientLight = new THREE.AmbientLight(0x2a0633, 1.6);
  scene.add(ambientLight);

  // Key light producing the intense white specular sheen
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
  keyLight.position.set(3.5, 7.5, 6.0);
  scene.add(keyLight);

  // Rim light in signature brand magenta/violet
  const rimLight = new THREE.DirectionalLight(0xff3388, 4.2);
  rimLight.position.set(-6, 2, -3);
  scene.add(rimLight);

  // Bottom bounce fill light
  const fillLight = new THREE.DirectionalLight(0x551155, 1.8);
  fillLight.position.set(0, -6, 4);
  scene.add(fillLight);

  // Concentrated luminous point light right at the crest of the primary ribbon
  const crestPointLight = new THREE.PointLight(0xffe6f8, 5.0, 10, 1.6);
  crestPointLight.position.set(1.5, 2.5, 2.0);
  scene.add(crestPointLight);

  // ── MATERIAL (RICH PLUM/VIOLET SATIN FINISH WITH SPECULAR COAT) ──
  const ribbonMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x4a0e4e),
    emissive: new THREE.Color(0x18031d),
    roughness: 0.32,
    metalness: 0.22,
    clearcoat: 0.85,
    clearcoatRoughness: 0.16,
    reflectivity: 0.8,
  });

  const secondaryMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x3e0a42),
    emissive: new THREE.Color(0x100214),
    roughness: 0.38,
    metalness: 0.20,
    clearcoat: 0.65,
    clearcoatRoughness: 0.22,
  });

  // ── SCENE ARCHITECTURE (SWEEPING ARCHITECTURAL RIBBON BANDS - MEDIUM SIZE) ──
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Orient the group so the arches sweep across from upper-right down to lower-left
  mainGroup.position.set(1.0, 0.25, 0);
  mainGroup.rotation.set(0.38, -0.42, -0.22);

  // Ribbon 1: Foreground Primary Arch (With Glowing Specular Crest)
  const curve1 = new RibbonArcCurve(2.35, 2.2, -Math.PI * 0.28, Math.PI * 1.15, 0.45, -0.3);
  const geom1 = createRibbonGeometry(curve1, 0.48, 0.20, 110, 0.035);
  const mesh1 = new THREE.Mesh(geom1, ribbonMaterial);
  mainGroup.add(mesh1);

  // Add luminous glowing crest along top ridge of Ribbon 1
  const crestGlow = createCrestHighlight(2.35, 2.2, -Math.PI * 0.28, Math.PI * 1.15, 0.45, -0.3);
  mainGroup.add(crestGlow);

  // Ribbon 2: Middle Concentric Arch
  const curve2 = new RibbonArcCurve(2.9, 2.75, -Math.PI * 0.24, Math.PI * 1.10, -0.3, -0.9);
  const geom2 = createRibbonGeometry(curve2, 0.48, 0.20, 110, 0.035);
  const mesh2 = new THREE.Mesh(geom2, ribbonMaterial);
  mainGroup.add(mesh2);

  // Ribbon 3: Outer Backdrop Arch
  const curve3 = new RibbonArcCurve(3.45, 3.3, -Math.PI * 0.20, Math.PI * 1.05, -0.9, -1.5);
  const geom3 = createRibbonGeometry(curve3, 0.48, 0.20, 110, 0.035);
  const mesh3 = new THREE.Mesh(geom3, secondaryMaterial);
  mainGroup.add(mesh3);

  // Ribbon 4: Inner Accent Arch
  const curve4 = new RibbonArcCurve(1.8, 1.7, -Math.PI * 0.32, Math.PI * 1.18, 1.0, 0.35);
  const geom4 = createRibbonGeometry(curve4, 0.40, 0.16, 90, 0.03);
  const mesh4 = new THREE.Mesh(geom4, secondaryMaterial);
  mainGroup.add(mesh4);

  // ── RESIZE & SCROLL PARALLAX ──
  const handleResize = () => {
    if (isDisposed || !container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;

    // Responsive scaling based on viewport width (Refined Medium Proportions)
    if (w < 640) {
      mainGroup.scale.set(0.48, 0.48, 0.48);
      mainGroup.position.set(0.35, 0.15, 0);
    } else if (w < 1024) {
      mainGroup.scale.set(0.58, 0.58, 0.58);
      mainGroup.position.set(0.65, 0.2, 0);
    } else {
      mainGroup.scale.set(0.68, 0.68, 0.68);
      mainGroup.position.set(1.0, 0.25, 0);
    }

    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  handleResize();

  window.addEventListener('resize', handleResize, { passive: true });

  // Mouse Parallax
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const handleMouseMove = (e: MouseEvent) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;
    mouse.targetX = normX * 0.08;
    mouse.targetY = normY * 0.08;
  };
  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  // Visibility detection (pauses when out of viewport)
  let isVisible = true;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    },
    { threshold: 0.05 }
  );
  observer.observe(container);

  // ── ANIMATION LOOP ──
  const clock = new THREE.Clock();
  const baseRotX = 0.38;
  const baseRotY = -0.42;
  const baseRotZ = -0.22;

  const animate = () => {
    if (isDisposed) return;
    animId = requestAnimationFrame(animate);

    if (!isVisible) return;

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse lerp
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Scroll parallax calculation relative to container
    const rect = container.getBoundingClientRect();
    const scrollFactor = -rect.top / (rect.height || 1);

    // Subtle majestic breathing oscillation + gentle scroll rotation
    mainGroup.rotation.x = baseRotX + Math.sin(elapsedTime * 0.35) * 0.035 + mouse.y * 0.5;
    mainGroup.rotation.y = baseRotY + Math.cos(elapsedTime * 0.28) * 0.045 + mouse.x * 0.5 + scrollFactor * 0.15;
    mainGroup.rotation.z = baseRotZ + Math.sin(elapsedTime * 0.22) * 0.025;

    // Slight vertical float
    mainGroup.position.y = (container.clientWidth < 640 ? 0.15 : 0.25) + Math.sin(elapsedTime * 0.4) * 0.05 - scrollFactor * 0.2;

    // Crest light pulsation
    crestPointLight.intensity = 4.5 + Math.sin(elapsedTime * 1.5) * 0.7;

    renderer.render(scene, camera);
  };

  animId = requestAnimationFrame(animate);

  // Trigger ready callback after initial render
  requestAnimationFrame(() => {
    if (!isDisposed) onReady?.();
  });

  // ── CLEANUP & DISPOSAL ──
  return () => {
    isDisposed = true;
    cancelAnimationFrame(animId);
    observer.disconnect();
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('mousemove', handleMouseMove);

    // Dispose geometries and materials
    [geom1, geom2, geom3, geom4].forEach((g) => g.dispose());
    crestGlow.geometry.dispose();
    (crestGlow.material as THREE.Material).dispose();
    ribbonMaterial.dispose();
    secondaryMaterial.dispose();

    renderer.dispose();
  };
}
