import * as THREE from 'three';
import { PALETTE, PALETTE_HEX } from './palette';
import {
  makeRail,
  sampleRail,
  helixSamples,
  helixBand,
  helixEdge,
  buildGates,
  beamVS,
  beamFS,
  RailSample,
} from './rail';

export interface BuildWorldOptions {
  lite?: boolean;
  renderer: THREE.WebGLRenderer;
  camera?: THREE.Camera;
}

export interface WorldInstance {
  rail: THREE.CatmullRomCurve3;
  samples: RailSample[];
  update: (dt: number, vel: number, vTour: number) => void;
  dispose: () => void;
}

// ── SEEDED RNG FOR LIGHT BEAMS ONLY ──
function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── 2D CANVAS GRADIENT TEXTURE FOR DEEP VOID ATMOSPHERE (ALIGNED WITH MARQUEE) ──
function makeBackgroundTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Exact marquee gradient tones from LogoWall:
    // linear-gradient(90deg, #0B0A0F 0%, #1A071E 15%, #2D0B2B 35%, #4A0E3C 55%, #350A2E 75%, #15051B 90%, #0B0A0F 100%)
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#0b0a0f');    // Deep black base matching marquee
    grad.addColorStop(0.2, '#1a071e');  // Plum shadow
    grad.addColorStop(0.45, '#3b0b33'); // Rich mid plum
    grad.addColorStop(0.68, '#591347'); // Orchid facet glow
    grad.addColorStop(0.88, '#1f0622'); // Soft plum transition
    grad.addColorStop(1, '#0b0a0f');    // Deep black at bottom (matching LogoWall header)
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle dot lattice matrix pattern like LogoWall (36px grid)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
    for (let x = 18; x < 512; x += 36) {
      for (let y = 18; y < 512; y += 36) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Fine starlight dust specks matching the reference
    const rng = makeRng(888);
    for (let i = 0; i < 60; i++) {
      const x = rng() * 512;
      const y = rng() * 512;
      const radius = 0.4 + rng() * 0.7;
      const alpha = 0.15 + rng() * 0.35;
      ctx.fillStyle = `rgba(255, 215, 245, ${alpha.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ── PROCEDURAL ENVIRONMENT FOR SUBTLE PURPLE/MAGENTA SPECULAR REFLECTIONS ──
function setupEnvironment(renderer: THREE.WebGLRenderer, scene: THREE.Scene): () => void {
  const envScene = new THREE.Scene();
  const envGeo = new THREE.SphereGeometry(20, 16, 16);
  const envMat = new THREE.MeshBasicMaterial({
    color: PALETTE.plumDark,
    side: THREE.BackSide,
  });
  envScene.add(new THREE.Mesh(envGeo, envMat));

  const panelGeo = new THREE.PlaneGeometry(10, 10);
  const panelMat = new THREE.MeshBasicMaterial({ color: PALETTE.orchidAccent });

  const p1 = new THREE.Mesh(panelGeo, panelMat);
  p1.position.set(14, 12, -8);
  p1.lookAt(0, 0, 0);
  envScene.add(p1);

  const p2 = new THREE.Mesh(panelGeo, panelMat);
  p2.position.set(-14, -8, 12);
  p2.lookAt(0, 0, 0);
  envScene.add(p2);

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envRT = pmrem.fromScene(envScene);

  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.45;

  envGeo.dispose();
  envMat.dispose();
  panelGeo.dispose();
  panelMat.dispose();
  pmrem.dispose();

  return () => {
    envRT.dispose();
  };
}

export function buildWorld(scene: THREE.Scene, { lite = false, renderer, camera }: BuildWorldOptions): WorldInstance {
  const disposables: { dispose: () => void }[] = [];

  // 1. Background Texture & Fog
  const bgTexture = makeBackgroundTexture();
  scene.background = bgTexture;
  disposables.push(bgTexture);

  scene.fog = new THREE.FogExp2(0x100414, 0.022);

  // 2. Procedural Environment Map
  const disposeEnv = setupEnvironment(renderer, scene);
  disposables.push({ dispose: disposeEnv });

  // 3. Lighting (Hemisphere + Camera-Tracking Key & Fill Lights)
  const hemiLight = new THREE.HemisphereLight(0xc52c82, PALETTE.bgDeep, 0.85);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xff70dc, 1.6);
  dirLight.position.set(12, 16, 14);

  const fillLight = new THREE.DirectionalLight(0xd93d94, 0.85);
  fillLight.position.set(-10, -6, 10);

  if (camera) {
    camera.add(dirLight);
    camera.add(fillLight);
    scene.add(camera);
  } else {
    scene.add(dirLight);
    scene.add(fillLight);
  }

  // 4. Rail & Sampling
  const SEG = lite ? 240 : 400;
  const rail = makeRail();
  const S = sampleRail(rail, SEG);

  // 5. Clean, elegant Gate Rings (InstancedMesh)
  const gateCount = lite ? 20 : 30;
  const gatesMesh = buildGates(S, gateCount, 6.6);
  scene.add(gatesMesh);
  disposables.push(gatesMesh.geometry, gatesMesh.material as THREE.Material);

  // 6. Three Clean Wide Sculptural Ribbon Layers (Alternating Marquee Orchid / Black / Plum)
  // Layer 0: Vibrant Orchid / Magenta Plum Facet from Marquee (Reference 2 slice)
  const matOrchid = new THREE.MeshStandardMaterial({
    color: 0x9e2478,            // Rich vibrant orchid matching LogoWall
    roughness: 0.38,
    metalness: 0.18,
    emissive: 0x4a0e3c,          // Deep luminous plum glow
    emissiveIntensity: 0.52,
    side: THREE.DoubleSide,
  });

  // Layer 1: Sleek Obsidian Black Contrast Layer ("next is black current color like one by one")
  const matBlack = new THREE.MeshStandardMaterial({
    color: 0x110c14,            // Sleek obsidian black
    roughness: 0.32,
    metalness: 0.32,
    emissive: 0x1a071e,          // Faint deep plum base
    emissiveIntensity: 0.18,
    side: THREE.DoubleSide,
  });

  // Layer 2: Deep Marquee Plum Facet (Reference 1 slice)
  const matPlum = new THREE.MeshStandardMaterial({
    color: 0x6e1654,            // Deep plum tone from LogoWall facet
    roughness: 0.4,
    metalness: 0.2,
    emissive: 0x350a2e,
    emissiveIntensity: 0.46,
    side: THREE.DoubleSide,
  });

  const ribbonMaterials = [matOrchid, matBlack, matPlum];
  disposables.push(matOrchid, matBlack, matPlum);

  const rimMat = new THREE.MeshBasicMaterial({
    color: PALETTE.magenta400, // #D93D94 (LeadFlow marquee seam ray)
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.95,
  });
  disposables.push(rimMat);

  const ribbonPhases = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
  const R = 5.8;
  const width = 7.0;
  const thick = 0.22;
  const turns = 2; // 2 gentle turns per loop for sleek, wide sweeping layers
  const hw = width / 2;
  const ht = thick / 2;
  const radialOffset = -(ht + 0.03);

  const beamCurves: THREE.CatmullRomCurve3[] = [];

  ribbonPhases.forEach((phase, index) => {
    const H = helixSamples(S, { phase, turns, R });
    const geo = helixBand(H, { width, thick });
    const mesh = new THREE.Mesh(geo, ribbonMaterials[index % ribbonMaterials.length]);
    scene.add(mesh);
    disposables.push(geo);

    // Inner edge curve for glowing rim highlight and light beams
    const edgeLeft = helixEdge(H, -hw, radialOffset);
    const edgeRight = helixEdge(H, hw, radialOffset);

    // Sleek glowing magenta rim tubes along ribbon edges
    const rimLeftGeo = new THREE.TubeGeometry(edgeLeft, Math.floor(SEG / 2), 0.024, 4, true);
    const rimRightGeo = new THREE.TubeGeometry(edgeRight, Math.floor(SEG / 2), 0.024, 4, true);
    scene.add(new THREE.Mesh(rimLeftGeo, rimMat));
    scene.add(new THREE.Mesh(rimRightGeo, rimMat));
    disposables.push(rimLeftGeo, rimRightGeo);

    beamCurves.push(edgeLeft, edgeRight);
  });

  // 7. Light Beams along Ribbon Inner Edges
  // 6 beams total on desktop, 4 on lite
  const beamCount = lite ? 4 : 6;
  const rng = makeRng(1337);
  const beamMaterials: THREE.ShaderMaterial[] = [];
  const sharedTimeUniform = { value: 0 };

  const uHead = new THREE.Color(PALETTE.lavenderHead);
  const uTail = new THREE.Color(PALETTE.magenta300);

  for (let b = 0; b < beamCount; b++) {
    const curve = beamCurves[b % beamCurves.length];
    const beamGeo = new THREE.TubeGeometry(curve, SEG, 0.035, 5, true);
    disposables.push(beamGeo);

    const speed = 0.05 + rng() * 0.07; // 0.05 - 0.12
    const offset = rng();              // 0 - 1
    const len = 0.03 + rng() * 0.05;   // 0.03 - 0.08

    const mat = new THREE.ShaderMaterial({
      vertexShader: beamVS,
      fragmentShader: beamFS,
      uniforms: {
        uTime: sharedTimeUniform,
        uSpeed: { value: speed },
        uOffset: { value: offset },
        uLen: { value: len },
        uHead: { value: uHead },
        uTail: { value: uTail },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    beamMaterials.push(mat);
    disposables.push(mat);

    const beamMesh = new THREE.Mesh(beamGeo, mat);
    scene.add(beamMesh);
  }

  // 8. Update loop for beam clock acceleration
  let beamClock = 0;
  const update = (dt: number, vel: number, vTour: number) => {
    // Beams advance continuously and accelerate smoothly with camera speed
    const speedRatio = Math.max(0, vel / vTour);
    beamClock += dt * (1.0 + 0.6 * speedRatio);
    sharedTimeUniform.value = beamClock;
  };

  const dispose = () => {
    disposables.forEach((item) => {
      try {
        item.dispose();
      } catch {
        // ignore
      }
    });
    scene.clear();
  };

  return {
    rail,
    samples: S,
    update,
    dispose,
  };
}
