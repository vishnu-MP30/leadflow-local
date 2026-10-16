import * as THREE from 'three';
import { PALETTE } from './palette';

export interface RailSample {
  p: THREE.Vector3;
  t: THREE.Vector3;
  n: THREE.Vector3;
  b: THREE.Vector3;
}

export interface HelixSample {
  c: THREE.Vector3;
  r: THREE.Vector3;
  w: THREE.Vector3;
  R: number;
}

// ── CLOSED SMOOTH RAIL CURVE (8 POINTS ON STRETCHED ELLIPSE) ──
export function makeRail(): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  const N = 8;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * 60, Math.sin(a * 2) * 5, Math.sin(a) * 40));
  }
  const rail = new THREE.CatmullRomCurve3(pts, true, 'centripetal');
  rail.arcLengthDivisions = 2000;
  return rail;
}

// ── ARC-LENGTH FRENET SAMPLING ──
export function sampleRail(rail: THREE.CatmullRomCurve3, SEG: number): RailSample[] {
  const fr = rail.computeFrenetFrames(SEG, true);
  const S: RailSample[] = [];
  for (let i = 0; i <= SEG; i++) {
    const u = i / SEG;
    S.push({
      p: rail.getPointAt(u),
      t: rail.getTangentAt(u),
      n: fr.normals[i],
      b: fr.binormals[i],
    });
  }
  return S;
}

// ── HELIX RIBBON SAMPLES AROUND RAIL ──
export function helixSamples(
  S: RailSample[],
  { phase, turns, R }: { phase: number; turns: number; R: number }
): HelixSample[] {
  const last = S.length - 1;
  return S.map((s, i) => {
    const th = phase + (i / last) * turns * Math.PI * 2;
    const r = s.n.clone().multiplyScalar(Math.cos(th)).addScaledVector(s.b, Math.sin(th));
    const w = new THREE.Vector3().crossVectors(s.t, r).normalize();
    return { c: s.p, r, w, R };
  });
}

// ── QUAD-EXTRUDED HELIX BAND BUFFER GEOMETRY ──
export function helixBand(
  H: HelixSample[],
  { width, thick }: { width: number; thick: number }
): THREE.BufferGeometry {
  const hw = width / 2;
  const ht = thick / 2;
  const C = [
    [-hw, -ht],
    [hw, -ht],
    [hw, ht],
    [-hw, ht],
  ]; // [lateral, radial]
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const last = H.length - 1;

  H.forEach((h, i) => {
    for (let c = 0; c < 4; c++) {
      for (let k = 0; k < 2; k++) {
        const [lx, rx] = C[(c + k) % 4];
        pos.push(
          h.c.x + h.r.x * (h.R + rx) + h.w.x * lx,
          h.c.y + h.r.y * (h.R + rx) + h.w.y * lx,
          h.c.z + h.r.z * (h.R + rx) + h.w.z * lx
        );
        uv.push(k, i / last);
      }
    }
  });

  for (let i = 0; i < last; i++) {
    for (let c = 0; c < 4; c++) {
      const a = i * 8 + c * 2;
      const b = a + 1;
      const d = a + 8;
      const e = d + 1;
      idx.push(a, b, d, b, e, d);
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// ── EDGE CURVE FOR BEAMS & RIM STRIPS ──
export function helixEdge(
  H: HelixSample[],
  lateral: number,
  radialOffset: number
): THREE.CatmullRomCurve3 {
  const pts = H.slice(0, -1).map((h) =>
    h.c.clone().addScaledVector(h.r, h.R + radialOffset).addScaledVector(h.w, lateral)
  );
  const c = new THREE.CatmullRomCurve3(pts, true);
  c.arcLengthDivisions = 1000;
  return c;
}

// ── INSTANCED GATE RINGS ──
export function buildGates(
  S: RailSample[],
  count: number,
  radius: number = 6.6
): THREE.InstancedMesh {
  const geo = new THREE.TorusGeometry(radius, 0.022, 6, 64);
  const mat = new THREE.MeshBasicMaterial({
    color: PALETTE.magenta400,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const m = new THREE.Matrix4();
  for (let k = 0; k < count; k++) {
    const s = S[Math.round((k / count) * (S.length - 1))];
    m.makeBasis(s.n, s.b, s.t).setPosition(s.p);
    mesh.setMatrixAt(k, m);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

// ── BEAM SHADERS (UV.X ALONG TUBE, ADDITIVE BLENDING, PEAK > 1 FOR BLOOM) ──
export const beamVS = `
varying vec2 vUv;
varying vec3 vW;
void main() {
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const beamFS = `
uniform float uTime;
uniform float uSpeed;
uniform float uOffset;
uniform float uLen;
uniform vec3 uHead;
uniform vec3 uTail;
varying vec2 vUv;
varying vec3 vW;

void main() {
  float head = fract(uTime * uSpeed + uOffset) * (1.0 + uLen);
  float d = head - vUv.x;
  float tail = clamp(1.0 - d / uLen, 0.0, 1.0);
  float m = step(0.0, d) * pow(tail, 2.5) * smoothstep(0.0, 0.004, d);
  float dist = distance(vW, cameraPosition);
  float fade = smoothstep(1.0, 3.5, dist) * (1.0 - smoothstep(30.0, 80.0, dist));
  vec3 col = mix(uTail, uHead, m * m) * 2.6;
  gl_FragColor = vec4(col, m * fade);
}
`;
