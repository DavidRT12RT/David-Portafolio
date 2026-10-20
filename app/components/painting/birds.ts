// Gulls in flight over a painting: one small 3D model (a turned body with head, beak and fanned tail;
// each wing an arm and a hand, jointed at the shoulder and the wrist) drawn once per bird with
// instancing. The vertex shader flaps, bends and folds the wings; the fragment shader lights the
// feathers with the painting's sun, sky and warm bounce, and hides a bird wherever the painting
// stands nearer than it, so a flock can circle behind a statue.

/** Model space: body length 1, x forward (to the beak), y up, z toward the right wingtip. */
const SHOULDER = [0.02, 0.04, 0.075];
const WRIST = [0.1, 0.04, 0.575];

export const BIRD_VERTEX = /* glsl */ `#version 300 es
in vec3 aPosition;
in vec3 aNormal;
in vec3 aTop;
in vec3 aBottom;
in float aPart;
in float aSide;
// Per bird: screen position (0..1, y up) and screen units per model unit; its forward and up
// directions in view space (x right, y up, z toward the visitor) with its depth and haze; and its
// wings: shoulder flap, wrist bend, wrist sweep.
in vec4 iPlace;
in vec4 iForward;
in vec4 iUp;
in vec3 iWing;
out vec3 vNormal;
out vec3 vTop;
out vec3 vBottom;
out vec2 vScreen;
out float vDepth;
out float vHaze;

vec3 rotX(vec3 v, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec3(v.x, v.y * c - v.z * s, v.y * s + v.z * c);
}

vec3 rotY(vec3 v, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec3(v.x * c + v.z * s, v.y, -v.x * s + v.z * c);
}

void main() {
  vec3 p = aPosition;
  vec3 n = aNormal;
  float side = aSide;
  if (aPart > 1.5) {
    // The hand turns about the wrist: swept back on the upstroke, bent against the arm.
    vec3 wrist = vec3(${WRIST[0]}, ${WRIST[1]}, side * ${WRIST[2]});
    vec3 q = rotY(p - wrist, -side * iWing.z);
    n = rotY(n, -side * iWing.z);
    q = rotX(q, -side * iWing.y);
    n = rotX(n, -side * iWing.y);
    p = wrist + q;
  }
  if (aPart > 0.5) {
    // The whole wing turns about the shoulder: positive raises it.
    vec3 shoulder = vec3(${SHOULDER[0]}, ${SHOULDER[1]}, side * ${SHOULDER[2]});
    vec3 q = rotX(p - shoulder, -side * iWing.x);
    n = rotX(n, -side * iWing.x);
    p = shoulder + q;
  }
  vec3 f = iForward.xyz;
  vec3 u = iUp.xyz;
  vec3 r = cross(f, u);
  vec3 c = p.x * f + p.y * u + p.z * r;
  vNormal = n.x * f + n.y * u + n.z * r;
  vTop = aTop;
  vBottom = aBottom;
  vDepth = iForward.w;
  vHaze = iUp.w;
  vec2 screen = iPlace.xy + vec2(c.x * iPlace.z, c.y * iPlace.w);
  vScreen = screen;
  // Nearer birds in front of farther ones; within a bird, what faces the visitor in front.
  float z = 0.6 - iForward.w * 0.5 - c.z * 0.012;
  gl_Position = vec4(screen * 2.0 - 1.0, z, 1.0);
}`;

export const BIRD_FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

in vec3 vNormal;
in vec3 vTop;
in vec3 vBottom;
in vec2 vScreen;
in float vDepth;
in float vHaze;
out vec4 outColor;

uniform sampler2D uDepth;
uniform vec2 uView;
uniform float uImageAspect;
uniform vec2 uCenter;
uniform vec2 uAnchor;
uniform float uZoom;
uniform vec2 uLook;
uniform float uDolly;
uniform vec2 uDollyTarget;
uniform float uHaze;
uniform vec3 uGround;
uniform vec3 uSky;

const float OVERSCAN = 1.06;

vec2 toPainting(vec2 s) {
  float viewAspect = uView.x / uView.y;
  vec2 span = viewAspect > uImageAspect
    ? vec2(1.0, uImageAspect / viewAspect)
    : vec2(viewAspect / uImageAspect, 1.0);
  span /= OVERSCAN * uZoom;
  vec2 origin = clamp(uCenter - uAnchor * span, vec2(0.0), vec2(1.0) - span);
  return origin + s * span;
}

void main() {
  // Hidden behind whatever of the painting stands nearer.
  float aspect = uView.x / uView.y;
  vec2 look = uLook * vec2(1.0, aspect) * 0.012;
  float grow = 1.0 + uDolly * (0.04 + 0.22 * vDepth);
  vec2 p = uDollyTarget + (vScreen + look * (vDepth - 0.3) - uDollyTarget) / grow;
  float scene = texture(uDepth, clamp(toPainting(p), vec2(0.0005), vec2(0.9995))).r;
  if (scene > vDepth + 0.03) discard;

  // A wing is a single surface: the side turned to the visitor decides its colour and its light.
  vec3 n = normalize(vNormal);
  bool upper = n.z >= 0.0;
  vec3 albedo = upper ? vTop : vBottom;
  if (!upper) n = -n;
  // The painting's afternoon sun from the upper left, the lilac sky above, warm light off the city.
  vec3 sun = normalize(vec3(-0.5, 0.55, 0.65));
  float lit = max(dot(n, sun), 0.0);
  // Feathers are thin: sun on the far side of a wing glows through it.
  float through = max(dot(-n, sun), 0.0) * 0.35;
  vec3 light = vec3(1.0, 0.93, 0.8) * (lit * 0.85 + through)
    + vec3(0.74, 0.73, 0.82) * (0.55 + 0.45 * n.y) * 0.45
    + vec3(0.95, 0.8, 0.62) * (0.5 - 0.5 * n.y) * 0.7
    + vec3(0.2);
  vec3 color = albedo * light;
  // The farther the bird, the more of the sky's air between it and the visitor; and the room's haze.
  color = mix(color, uSky, vHaze);
  color = mix(color, uGround, smoothstep(0.0, 1.0, uHaze * 1.8 - vDepth * 0.8));
  outColor = vec4(color, 1.0);
}`;

/** Floats per vertex: position, normal, upper and under colour, part (0 body, 1 arm, 2 hand), side. */
export const BIRD_VERTEX_FLOATS = 14;
/** Floats per bird: place (4), forward + depth (4), up + haze (4), wing (3). */
export const BIRD_INSTANCE_FLOATS = 15;

const WHITE = [0.97, 0.97, 0.955];
const MANTLE = [0.8, 0.82, 0.86];
const TIP = [0.09, 0.09, 0.1];
const UNDER_TIP = [0.24, 0.24, 0.26];
const BEAK = [0.93, 0.74, 0.26];

type V3 = [number, number, number];

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const normalize = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const mix3 = (a: number[], b: number[], t: number): V3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/** The gull, triangle by triangle, as interleaved vertex data. */
export function birdMesh() {
  const data: number[] = [];
  const vertex = (p: V3, n: V3, top: number[], bottom: number[], part: number, side: number) =>
    data.push(...p, ...n, top[0], top[1], top[2], bottom[0], bottom[1], bottom[2], part, side);

  // The body, turned on its long axis: tail end, belly, chest, neck, head, beak.
  const profile: [number, number][] = [
    [-0.36, 0.012],
    [-0.3, 0.05],
    [-0.2, 0.088],
    [-0.06, 0.108],
    [0.08, 0.104],
    [0.18, 0.086],
    [0.25, 0.064],
    [0.3, 0.066],
    [0.36, 0.07],
    [0.42, 0.055],
    [0.46, 0.03],
    [0.47, 0.016],
    [0.55, 0.004],
  ];
  const rise = (x: number) => 0.03 * Math.min(1, Math.max(0, (x - 0.2) / 0.16));
  const around = 10;
  const ring = (i: number, k: number): { p: V3; n: V3 } => {
    const [x, r] = profile[i];
    const a = (k / around) * Math.PI * 2;
    // a little wider than tall, like a gull's body
    const p: V3 = [x, rise(x) + Math.sin(a) * r * 0.92, Math.cos(a) * r];
    const prev = profile[Math.max(0, i - 1)];
    const next = profile[Math.min(profile.length - 1, i + 1)];
    const slope = (next[1] - prev[1]) / Math.max(next[0] - prev[0], 1e-3);
    const n = normalize([-slope, Math.sin(a), Math.cos(a)]);
    return { p, n };
  };
  for (let i = 0; i < profile.length - 1; i++) {
    const colour = profile[i][0] >= 0.46 ? BEAK : WHITE;
    for (let k = 0; k < around; k++) {
      const a = ring(i, k);
      const b = ring(i + 1, k);
      const c = ring(i + 1, (k + 1) % around);
      const d = ring(i, (k + 1) % around);
      for (const v of [a, b, c, a, c, d]) vertex(v.p, v.n, colour, colour, 0, 1);
    }
  }

  // The tail, a shallow fan behind the body.
  const tail: V3[] = [
    [-0.3, 0.015, 0],
    [-0.3, 0.015, 0.05],
    [-0.52, 0.02, 0.11],
    [-0.5, 0.02, 0],
    [-0.52, 0.02, -0.11],
    [-0.3, 0.015, -0.05],
  ];
  const up: V3 = [0, 1, 0];
  for (const [a, b, c] of [
    [0, 1, 2],
    [0, 2, 3],
    [0, 3, 4],
    [0, 4, 5],
  ]) {
    vertex(tail[a], up, WHITE, WHITE, 0, 1);
    vertex(tail[b], up, WHITE, WHITE, 0, 1);
    vertex(tail[c], up, WHITE, WHITE, 0, 1);
  }

  // The wings: long and narrow, the hand swept back to a pointed black tip. Stations along the
  // span (from the shoulder): span, leading edge x, trailing edge x.
  const stations: [number, number, number][] = [
    [0.0, 0.14, -0.2],
    [0.18, 0.15, -0.19],
    [0.36, 0.155, -0.165],
    [0.5, 0.16, -0.14],
    [0.62, 0.13, -0.135],
    [0.78, 0.07, -0.14],
    [0.94, -0.01, -0.155],
    [1.08, -0.09, -0.175],
    [1.2, -0.16, -0.195],
    [1.27, -0.215, -0.215],
  ];
  const chord = [0, 0.4, 1];
  for (const side of [1, -1]) {
    const point = (s: number, le: number, te: number, u: number): V3 => {
      const x = le + (te - le) * u;
      const camber = 0.022 * Math.sin(Math.PI * u) * (1 - s / 1.5);
      return [x, SHOULDER[1] + camber, side * (SHOULDER[2] + s)];
    };
    for (let i = 0; i < stations.length - 1; i++) {
      const [s0, le0, te0] = stations[i];
      const [s1, le1, te1] = stations[i + 1];
      const part = s1 <= 0.5 + 1e-6 ? 1 : 2;
      for (let j = 0; j < chord.length - 1; j++) {
        const a = point(s0, le0, te0, chord[j]);
        const b = point(s1, le1, te1, chord[j]);
        const c = point(s1, le1, te1, chord[j + 1]);
        const d = point(s0, le0, te0, chord[j + 1]);
        const tip = (s: number) => Math.min(1, Math.max(0, (s - 0.9) / 0.14));
        const colours = (s: number) => ({ top: mix3(MANTLE, TIP, tip(s)), bottom: mix3(WHITE, UNDER_TIP, tip(s)) });
        let n = normalize(cross(sub(b, a), sub(d, a)));
        if (n[1] < 0) n = [-n[0], -n[1], -n[2]];
        for (const [p, s] of [
          [a, s0],
          [b, s1],
          [c, s1],
          [a, s0],
          [c, s1],
          [d, s0],
        ] as [V3, number][]) {
          const { top, bottom } = colours(s);
          vertex(p, n, top, bottom, part, side);
        }
      }
    }
  }
  return new Float32Array(data);
}

/** One bird for one frame. Directions are in view space: x right, y up, z toward the visitor. */
export interface Bird {
  /** A point of the painting (0..1 from the top left), its depth (0 far, 1 near), body length in painting heights. */
  x: number;
  y: number;
  depth: number;
  size: number;
  /** Which way it flies and how its body is turned. */
  forward: [number, number, number];
  up: [number, number, number];
  /** Shoulder flap, wrist bend and wrist sweep, radians. */
  wing: [number, number, number];
  /** 0..1: how much of the sky's air lies between it and the visitor. */
  haze: number;
}

/** A bird's level circle in the sky, seen from a little below. */
export interface Loop {
  /** The circle's centre (a point of the painting, 0..1 from the top left) and radius across the painting. */
  center: [number, number];
  radius: number;
  /** Depth and body length (painting heights) on the circle's far and near side. */
  depth: [number, number];
  size: [number, number];
  /** Seconds per turn, where on the turn it starts (0..1) and which way it turns. */
  period: number;
  phase: number;
  turn: 1 | -1;
  /** Wingbeats a second, and its own offset in the rhythm of flapping and gliding. */
  beat: number;
  rhythm: number;
}

/** The visitor looks up at the birds by this much (radians), so the circles read as flattened ellipses. */
const PITCH = 0.26;

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const toView = (v: V3): V3 => [
  v[0],
  v[1] * Math.cos(PITCH) + v[2] * Math.sin(PITCH),
  -v[1] * Math.sin(PITCH) + v[2] * Math.cos(PITCH),
];

/**
 * Where a circling bird is at a moment, and how it holds itself: banked toward the circle's centre,
 * flapping in bursts and gliding between them with its hands lowered, a gull's shallow M. `aspect` is
 * the painting's width over its height, so the circle is round in the world.
 */
export function circling(loop: Loop, time: number, aspect: number): Bird {
  const a = (time / loop.period + loop.phase) * Math.PI * 2 * loop.turn;
  const near = 0.5 + 0.5 * Math.sin(a);
  const sway = time * 0.45 + loop.rhythm * 3.1;
  // Seen from below, the near side of the circle stands higher on screen.
  const lift = loop.radius * aspect * Math.sin(PITCH);
  const x = loop.center[0] + Math.cos(a) * loop.radius;
  const y = loop.center[1] - Math.sin(a) * lift + Math.sin(sway) * 0.004;

  const ahead = normalize([-Math.sin(a) * loop.turn, Math.cos(sway) * 0.05, Math.cos(a) * loop.turn]);
  const bank = 0.42;
  let up: V3 = [-Math.cos(a) * Math.sin(bank), Math.cos(bank), -Math.sin(a) * Math.sin(bank)];
  const along = up[0] * ahead[0] + up[1] * ahead[1] + up[2] * ahead[2];
  up = normalize([up[0] - ahead[0] * along, up[1] - ahead[1] * along, up[2] - ahead[2] * along]);

  const glide = smooth(0.35, 0.75, 0.5 + 0.5 * Math.sin(time * 0.26 + loop.rhythm * 6.28));
  const phi = time * loop.beat * Math.PI * 2 + loop.rhythm * 11;
  const flap = lerp(0.12 + 0.62 * Math.sin(phi), 0.12, glide);
  const bend = lerp(-0.1 + 0.45 * Math.sin(phi - 0.9), -0.28, glide);
  const sweep = lerp(0.12 + 0.5 * Math.pow(Math.max(0, Math.cos(phi)), 1.5), 0.22, glide);

  const depth = lerp(loop.depth[0], loop.depth[1], near);
  return {
    x,
    y,
    depth,
    size: lerp(loop.size[0], loop.size[1], near),
    forward: toView(ahead),
    up: toView(up),
    wing: [flap, bend, sweep],
    haze: (1 - depth) * 0.3,
  };
}
