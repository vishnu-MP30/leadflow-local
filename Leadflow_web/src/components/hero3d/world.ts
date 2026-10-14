import * as THREE from 'three';

const rng = (s: number) => () => (s = (s * 16807) % 2147483647) / 2147483647;

export interface SweepBandOptions {
  segments: number;
  width: number;
  thickness: number;
}

export function sweepBand(curve: THREE.CatmullRomCurve3, { segments, width, thickness }: SweepBandOptions): THREE.BufferGeometry {
  const fr = curve.computeFrenetFrames(segments, true);
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const hw = width / 2;
  const ht = thickness / 2;
  const C = [
    [-hw, -ht],
    [hw, -ht],
    [hw, ht],
    [-hw, ht]
  ];
  const p = new THREE.Vector3();

  for (let i = 0; i <= segments; i++) {
    curve.getPointAt(i / segments, p);
    const N = fr.normals[i];
    const B = fr.binormals[i];
    for (let f = 0; f < 4; f++) {
      for (let k = 0; k < 2; k++) {
        const [cx, cy] = C[(f + k) % 4];
        pos.push(
          p.x + N.x * cx + B.x * cy,
          p.y + N.y * cx + B.y * cy,
          p.z + N.z * cx + B.z * cy
        );
        uv.push(k, i / segments);
      }
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let f = 0; f < 4; f++) {
      const a = i * 8 + f * 2;
      const b = a + 1;
      const c = a + 8;
      const d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

const pulseVS = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vW;
void main() {
  vUv = uv;
  vNormal = normalMatrix * normal;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const pulseFS = `
uniform float uTime, uSpeed, uOffset, uLen, uSoft, uNear, uFar;
uniform vec3 uColorCore;
uniform vec3 uColorHalo;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vW;

void main() {
  float head = fract(uTime * uSpeed + uOffset) * (1.0 + uLen);
  float d = head - vUv.x;
  if (d < 0.0 || d > uLen) discard;

  // Smooth clean rounded head and tapered glowing comet tail
  float shape = smoothstep(0.0, uSoft, d) * (1.0 - d / uLen);
  shape = pow(shape, 0.85);

  // Surface normal view-angle falloff for white-hot core and neon halo
  vec3 viewDir = normalize(cameraPosition - vW);
  vec3 norm = normalize(vNormal);
  float rim = clamp(dot(viewDir, norm), 0.0, 1.0);

  // Crisp, controlled white core & vivid orchid halo hugging the ribbon track
  vec3 col = mix(uColorHalo * 1.6, uColorCore * 2.6, pow(rim, 2.2));

  // Camera proximity culling: smoothly fade down if passing close to camera to protect DOM text
  float dist = distance(vW, cameraPosition);
  float camNear = smoothstep(14.0, 24.0, dist);
  float camFar = 1.0 - smoothstep(uNear, uFar, dist);
  float alpha = shape * camNear * camFar;

  gl_FragColor = vec4(col * alpha, alpha);
}
`;

export interface BuildWorldOptions {
  lite?: boolean;
  primary?: number;
  accent?: number;
}

export interface WorldInstance {
  rail: THREE.CatmullRomCurve3;
  update: (time: number) => void;
  dispose: () => void;
}

export function buildWorld(
  scene: THREE.Scene,
  { lite = false, primary = 0x5a0a6e, accent = 0xd93d94 }: BuildWorldOptions = {}
): WorldInstance {
  const rand = rng(7);
  const pts: THREE.Vector3[] = [];

  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    pts.push(
      new THREE.Vector3(
        Math.cos(a) * 38 + Math.sin(a * 3) * 4,
        Math.sin(a * 2) * 6,
        Math.sin(a * 38)
      )
    );
  }

  const rail = new THREE.CatmullRomCurve3(pts, true, 'centripetal');
  const S = 120;
  const fr = rail.computeFrenetFrames(S, true);
  const v = new THREE.Vector3();

  const offsetCurve = (ox: number, oy: number, wob: number, ph: number) => {
    const p: THREE.Vector3[] = [];
    for (let i = 0; i < S; i++) {
      rail.getPointAt(i / S, v);
      const N = fr.normals[i];
      const B = fr.binormals[i];
      const w1 = Math.sin((i / S) * Math.PI * 6 + ph) * wob;
      const w2 = Math.cos((i / S) * Math.PI * 4 + ph) * wob;
      p.push(v.clone().addScaledVector(N, ox + w1).addScaledVector(B, oy + w2));
    }
    return new THREE.CatmullRomCurve3(p, true, 'centripetal');
  };

  const group = new THREE.Group();
  scene.add(group);

  // Atmospheric Bright Luminous Lighting
  const hemi = new THREE.HemisphereLight(0xff55d2, 0x1a0628, 1.4);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xff33b8, 2.6);
  key.position.set(6, 10, 5);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x9d4edd, 1.8);
  fill.position.set(-6, -4, -4);
  scene.add(fill);

  const specular = new THREE.PointLight(0xffffff, 2.5, 60);
  specular.position.set(0, 5, 8);
  scene.add(specular);

  // Vibrant rich metallic ribbon materials
  const mat1 = new THREE.MeshStandardMaterial({
    color: 0xd93d94, // Vivid orchid
    emissive: 0x4a0038,
    emissiveIntensity: 0.45,
    roughness: 0.32,
    metalness: 0.28,
  });

  const mat2 = new THREE.MeshStandardMaterial({
    color: 0x9d4edd, // Electric amethyst
    emissive: 0x2a0055,
    emissiveIntensity: 0.42,
    roughness: 0.32,
    metalness: 0.28,
  });

  const mat3 = new THREE.MeshStandardMaterial({
    color: 0xf452af, // Bright neon orchid
    emissive: 0x6a004c,
    emissiveIntensity: 0.52,
    roughness: 0.26,
    metalness: 0.32,
  });

  const ribbonMaterials = [mat1, mat2, mat3];

  const shared = { uTime: { value: 0 } };
  const ribbons = lite ? 6 : 10;
  const pulses = lite ? 6 : 14;
  const seg = lite ? 160 : 260;

  for (let r = 0; r < ribbons; r++) {
    const side = r % 2 ? 1 : -1;
    const ox = side * (3 + rand() * 6);
    const oy = (rand() - 0.5) * 8;
    const width = 2 + rand() * 3;
    const thick = 0.3 + rand() * 0.3;
    const wob = 1 + rand() * 2;
    const ph = rand() * 6.28;

    const curve = offsetCurve(ox, oy, wob, ph);
    const bandGeo = sweepBand(curve, { segments: seg, width, thickness: thick });
    const selectedMat = ribbonMaterials[r % ribbonMaterials.length];
    const bandMesh = new THREE.Mesh(bandGeo, selectedMat);
    group.add(bandMesh);

    if (r < pulses) {
      // Sit flush along the upper surface of the ribbon band (like reference image)
      const edge = offsetCurve(ox, oy + thick * 0.48, wob, ph);

      // 1. Subtle static metallic guide track beneath the pulse
      const trackMat = new THREE.MeshStandardMaterial({
        color: 0x8a2b6e,
        roughness: 0.25,
        metalness: 0.65,
        emissive: 0x350826,
        emissiveIntensity: 0.3,
      });
      const trackGeo = new THREE.TubeGeometry(edge, seg, 0.045, 6, true);
      group.add(new THREE.Mesh(trackGeo, trackMat));

      // 2. Focused photon beam riding strictly along the structure guide track
      const pm = new THREE.ShaderMaterial({
        vertexShader: pulseVS,
        fragmentShader: pulseFS,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: shared.uTime,
          uSpeed: { value: 0.055 + rand() * 0.055 },
          uOffset: { value: rand() },
          uLen: { value: 0.12 + rand() * 0.09 }, // Clean continuous pulse beam
          uSoft: { value: 0.016 },              // Clean rounded beam head
          uNear: { value: 20 },
          uFar: { value: 60 },
          uColorCore: { value: new THREE.Color(0xffffff) }, // Pure white-hot laser core
          uColorHalo: { value: new THREE.Color(0xff2eb8) }, // Vivid electric orchid halo
        },
      });

      // Sleek 0.058 radius rides strictly on the structure track without bulging out
      const tubeGeo = new THREE.TubeGeometry(edge, seg, 0.058, 8, true);
      const tubeMesh = new THREE.Mesh(tubeGeo, pm);
      group.add(tubeMesh);
    }
  }

  return {
    rail,
    update: (t: number) => {
      shared.uTime.value = t;
    },
    dispose() {
      group.traverse((o: THREE.Object3D) => {
        if (o instanceof THREE.Mesh) {
          o.geometry?.dispose();
          if (Array.isArray(o.material)) {
            o.material.forEach((m) => m.dispose());
          } else {
            o.material?.dispose();
          }
        }
      });
      scene.remove(group);
      scene.remove(hemi);
      scene.remove(key);
      scene.remove(fill);
      scene.remove(specular);
      mat1.dispose();
      mat2.dispose();
      mat3.dispose();
    },
  };
}
