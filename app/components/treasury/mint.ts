import * as THREE from "three";
import type { Coin, Metal } from "./coins";

// Strikes a coin: a height field drawn on a canvas (the flan's slight dome, a raised rim, a beaded
// border, the legend around the rim and the emblem in rounded relief), turned into a normal map for
// the light, a colour map for the metal and a roughness map: polished on the high relief, dark and
// dull with patina in the hollows, as an ancient coin is after centuries of hands.

export const PALETTE: Record<Metal, { polished: [number, number, number]; patina: [number, number, number] }> = {
  gold: { polished: [255, 208, 128], patina: [112, 76, 30] },
  silver: { polished: [236, 234, 229], patina: [84, 82, 80] },
  bronze: { polished: [212, 148, 96], patina: [64, 58, 40] },
  electrum: { polished: [238, 216, 164], patina: [98, 86, 58] },
};

/** A small seeded generator (mulberry32), so each coin's flan and wear are its own and stay put. */
export function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const hash = (text: string) => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
};

/**
 * The flan's outline: a hand-struck coin is never quite round. Returns the radius (1 = nominal) at
 * an angle, from a few slow waves of the coin's own.
 */
export function outline(coin: Coin) {
  const random = seeded(hash(coin.id));
  const waves = [2, 3, 5, 7].map((k) => ({ k, a: (0.006 + random() * 0.012) / Math.sqrt(k / 2), p: random() * Math.PI * 2 }));
  return (angle: number) => 1 + waves.reduce((sum, w) => sum + w.a * Math.sin(w.k * angle + w.p), 0);
}

/** Box blur on a height field, in place, a few times over for a soft rounded relief. */
function blur(field: Float32Array, size: number, radius: number, passes: number) {
  const tmp = new Float32Array(field.length);
  const width = radius * 2 + 1;
  for (let pass = 0; pass < passes; pass++) {
    for (let y = 0; y < size; y++) {
      const row = y * size;
      let sum = 0;
      for (let x = -radius; x <= radius; x++) sum += field[row + Math.min(size - 1, Math.max(0, x))];
      for (let x = 0; x < size; x++) {
        tmp[row + x] = sum / width;
        sum += field[row + Math.min(size - 1, x + radius + 1)] - field[row + Math.max(0, x - radius)];
      }
    }
    for (let x = 0; x < size; x++) {
      let sum = 0;
      for (let y = -radius; y <= radius; y++) sum += tmp[Math.min(size - 1, Math.max(0, y)) * size + x];
      for (let y = 0; y < size; y++) {
        field[y * size + x] = sum / width;
        sum += tmp[Math.min(size - 1, y + radius + 1) * size + x] - tmp[Math.max(0, y - radius) * size + x];
      }
    }
  }
}

export interface Struck {
  color: HTMLCanvasElement;
  normal: HTMLCanvasElement;
  roughness: HTMLCanvasElement;
}

/**
 * Strikes `coin` at `size` pixels a side. `font` is the CSS font family the legend is cut in; it must
 * already be loaded.
 */
export function strike(coin: Coin, metal: Metal, font: string, size: number): Struck {
  const shape = outline(coin);
  const random = seeded(hash(coin.id) ^ 0x9e3779b9);
  const R = size / 2;
  const drawn = document.createElement("canvas");
  drawn.width = drawn.height = size;
  const g = drawn.getContext("2d", { willReadFrequently: true })!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, size, size);
  const grey = (v: number) => `rgb(${Math.round(v * 255)},${Math.round(v * 255)},${Math.round(v * 255)})`;

  // The raised rim, following the flan's own irregular edge.
  g.beginPath();
  for (let i = 0; i <= 180; i++) {
    const a = (i / 180) * Math.PI * 2;
    const r = R * 0.965 * shape(a);
    if (i === 0) g.moveTo(R + Math.cos(a) * r, R + Math.sin(a) * r);
    else g.lineTo(R + Math.cos(a) * r, R + Math.sin(a) * r);
  }
  g.lineWidth = size * 0.05;
  g.strokeStyle = grey(0.52);
  g.stroke();

  // The beaded border.
  const beads = 52;
  g.fillStyle = grey(0.46);
  for (let i = 0; i < beads; i++) {
    const a = (i / beads) * Math.PI * 2;
    const r = R * 0.84 * shape(a);
    g.beginPath();
    g.arc(R + Math.cos(a) * r, R + Math.sin(a) * r, size * 0.0125, 0, Math.PI * 2);
    g.fill();
  }

  // The legend, struck along the upper arc inside the beads, reading left to right.
  const letters = [...coin.legend];
  const fontSize = size * (letters.length > 16 ? 0.052 : letters.length > 11 ? 0.06 : 0.07);
  g.font = `600 ${fontSize}px ${font}`;
  g.fillStyle = grey(0.42);
  g.textAlign = "center";
  g.textBaseline = "middle";
  const arcR = R * 0.7;
  const widths = letters.map((ch) => g.measureText(ch).width * 1.12);
  const total = widths.reduce((a, b) => a + b, 0);
  let angle = -Math.PI / 2 - total / arcR / 2;
  letters.forEach((ch, i) => {
    const step = widths[i] / arcR;
    const a = angle + step / 2;
    g.save();
    g.translate(R + Math.cos(a) * arcR, R + Math.sin(a) * arcR);
    g.rotate(a + Math.PI / 2);
    g.fillText(ch, 0, 0);
    g.restore();
    angle += step;
  });

  // The emblem: the brand's mark, or for a legend-only coin its name, large in the field.
  g.fillStyle = grey(0.82);
  if (coin.logo) {
    const mark = size * 0.4;
    g.save();
    g.translate(R - mark / 2, R - mark / 2 + size * 0.04);
    g.scale(mark / 24, mark / 24);
    g.fill(new Path2D(coin.logo));
    g.restore();
  } else {
    // As large as the field allows: a short name fills it, a long one shrinks to fit inside the beads.
    g.font = `600 ${size * 0.2}px ${font}`;
    const fit = Math.min(1, (size * 0.58) / g.measureText(coin.name).width);
    g.font = `600 ${size * 0.2 * fit}px ${font}`;
    g.fillText(coin.name, R, R + size * 0.05);
  }

  // Height: the drawing with a fine grain of wear, rounded, over the flan's shallow dome.
  const pixels = g.getImageData(0, 0, size, size).data;
  const height = new Float32Array(size * size);
  for (let i = 0; i < size * size; i++) height[i] = pixels[i * 4] / 255 + (random() - 0.5) * 0.015;
  blur(height, size, Math.max(1, Math.round(size / 220)), 3);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x - R) / R;
      const dy = (y - R) / R;
      height[y * size + x] += 0.12 * (1 - dx * dx - dy * dy);
    }
  }
  // Hollows hold the patina: where a point lies below its surroundings.
  const around = Float32Array.from(height);
  blur(around, size, Math.max(2, Math.round(size / 40)), 2);

  const canvas = (side: number) => {
    const c = document.createElement("canvas");
    c.width = c.height = side;
    const ctx = c.getContext("2d")!;
    return { c, ctx, data: ctx.createImageData(side, side) };
  };
  const normal = canvas(size);
  const color = canvas(size);
  const half = size >> 1;
  const rough = canvas(half);
  const { polished, patina } = PALETTE[metal];
  const strength = size / 34;
  const at = (x: number, y: number) => height[Math.min(size - 1, Math.max(0, y)) * size + Math.min(size - 1, Math.max(0, x))];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      // Canvas rows run down and the texture's v runs up, so a slope down the canvas tilts the normal up.
      const nx = -(at(x + 1, y) - at(x - 1, y)) * strength;
      const ny = (at(x, y + 1) - at(x, y - 1)) * strength;
      const l = Math.hypot(nx, ny, 1);
      normal.data.data[i * 4] = Math.round((nx / l) * 127.5 + 127.5);
      normal.data.data[i * 4 + 1] = Math.round((ny / l) * 127.5 + 127.5);
      normal.data.data[i * 4 + 2] = Math.round((1 / l) * 127.5 + 127.5);
      normal.data.data[i * 4 + 3] = 255;
      const high = Math.min(1, Math.max(0, (height[i] - 0.18) / 0.55));
      const hollow = Math.min(1, Math.max(0, (around[i] - height[i]) * 6));
      const shine = high * high * (3 - 2 * high);
      const dull = 1 - 0.55 * hollow;
      for (let k = 0; k < 3; k++) {
        color.data.data[i * 4 + k] = Math.round((patina[k] + (polished[k] - patina[k]) * (0.55 + 0.45 * shine)) * dull);
      }
      color.data.data[i * 4 + 3] = 255;
      if ((x & 1) === 0 && (y & 1) === 0 && x >> 1 < half && y >> 1 < half) {
        // Roughness in green, as the material reads it: satin field, polished relief, dull hollows.
        const j = ((y >> 1) * half + (x >> 1)) * 4;
        const roughness = 0.4 - 0.18 * shine + 0.2 * hollow;
        rough.data.data[j] = 0;
        rough.data.data[j + 1] = Math.round(Math.min(1, Math.max(0, roughness)) * 255);
        rough.data.data[j + 2] = 255;
        rough.data.data[j + 3] = 255;
      }
    }
  }
  normal.ctx.putImageData(normal.data, 0, 0);
  color.ctx.putImageData(color.data, 0, 0);
  rough.ctx.putImageData(rough.data, 0, 0);
  return { color: color.c, normal: normal.c, roughness: rough.c };
}

/** Wraps a struck coin's canvases as the textures its face is drawn with. */
export function faceTextures(struck: Struck) {
  const color = new THREE.CanvasTexture(struck.color);
  color.colorSpace = THREE.SRGBColorSpace;
  const normal = new THREE.CanvasTexture(struck.normal);
  const roughness = new THREE.CanvasTexture(struck.roughness);
  for (const t of [color, normal, roughness]) t.anisotropy = 4;
  return { color, normal, roughness };
}

/** The coin's body: a face and a back on the flan's outline, and a rounded edge between them. */
export function flan(coin: Coin, segments = 120) {
  const shape = outline(coin);
  const thickness = 0.085;
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const groups: { start: number; count: number; material: number }[] = [];
  const push = (p: number[], nrm: number[], uv: number[]) => {
    positions.push(...p);
    normals.push(...nrm);
    uvs.push(...uv);
  };
  const ring = (a: number, r: number) => [Math.cos(a) * r * shape(a), Math.sin(a) * r * shape(a)];

  // Face (toward the visitor), its UVs straight from the face so the emblem stands upright.
  let start = 0;
  for (let i = 0; i < segments; i++) {
    const a0 = (i / segments) * Math.PI * 2;
    const a1 = ((i + 1) / segments) * Math.PI * 2;
    const [x0, y0] = ring(a0, 0.985);
    const [x1, y1] = ring(a1, 0.985);
    for (const [x, y] of [
      [0, 0],
      [x0, y0],
      [x1, y1],
    ]) {
      push([x, y, thickness / 2], [0, 0, 1], [x * 0.5 + 0.5, y * 0.5 + 0.5]);
    }
  }
  groups.push({ start, count: positions.length / 3 - start, material: 0 });

  // The edge: from the face's rim, over a small bevel, round the side, to the back.
  start = positions.length / 3;
  const profile: [number, number, number, number][] = [
    // radius, z, the normal's radial and z parts
    [0.985, thickness / 2, 0.35, 0.94],
    [1.0, thickness / 2 - 0.018, 0.92, 0.38],
    [1.0, -thickness / 2 + 0.018, 0.92, -0.38],
    [0.985, -thickness / 2, 0.35, -0.94],
  ];
  const corner = (a: number, k: number) => {
    const [r, z, nr, nz] = profile[k];
    const [x, y] = ring(a, r);
    return { p: [x, y, z], n: [Math.cos(a) * nr, Math.sin(a) * nr, nz] };
  };
  for (let i = 0; i < segments; i++) {
    const a0 = (i / segments) * Math.PI * 2;
    const a1 = ((i + 1) / segments) * Math.PI * 2;
    for (let j = 0; j < profile.length - 1; j++) {
      const a = corner(a0, j);
      const b = corner(a1, j);
      const c = corner(a1, j + 1);
      const d = corner(a0, j + 1);
      for (const v of [a, d, c, a, c, b]) push(v.p, v.n, [0.5, 0.5]);
    }
  }
  groups.push({ start, count: positions.length / 3 - start, material: 1 });

  // Back.
  start = positions.length / 3;
  for (let i = 0; i < segments; i++) {
    const a0 = (i / segments) * Math.PI * 2;
    const a1 = ((i + 1) / segments) * Math.PI * 2;
    const [x0, y0] = ring(a0, 0.985);
    const [x1, y1] = ring(a1, 0.985);
    for (const [x, y] of [
      [0, 0],
      [x1, y1],
      [x0, y0],
    ]) {
      push([x, y, -thickness / 2], [0, 0, -1], [0.5, 0.5]);
    }
  }
  groups.push({ start, count: positions.length / 3 - start, material: 1 });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  groups.forEach((group) => geometry.addGroup(group.start, group.count, group.material));
  return geometry;
}

/** The edge and back of a coin: the same metal, worn smooth. */
export function edgeMaterial(metal: Metal) {
  const [r, g, b] = PALETTE[metal].polished;
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(`rgb(${Math.round(r * 0.82)},${Math.round(g * 0.82)},${Math.round(b * 0.82)})`),
    metalness: 1,
    roughness: 0.42,
  });
}
