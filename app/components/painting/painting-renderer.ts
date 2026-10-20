import { BIRD_FRAGMENT, BIRD_INSTANCE_FLOATS, BIRD_VERTEX, BIRD_VERTEX_FLOATS, birdMesh, type Bird } from "./birds";

// Draws a painting as a scene with depth: one full-screen pass reads the painting and its depth map,
// frames it like a camera (a point of the painting held at a point of the screen, at some zoom), moves
// near things against far ones with the pointer, relights the relief from the light, can pool that
// light on one detail, and lets the distance dissolve into the page's haze first. An animated painting
// adds a second pass: its figures, cut out of it, drawn back over the painting without them, each at
// its own depth and moving on its own (a giant falling, a cloud drifting), under a storm with
// lightning; and gulls can circle over it in 3D. Plain WebGL2, so a room with a
// painting never waits for the gallery's three.js bundle.

const VERTEX = /* glsl */ `#version 300 es
in vec2 aPosition;
out vec2 vScreen;
void main() {
  vScreen = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

in vec2 vScreen;
out vec4 outColor;

uniform sampler2D uColor;
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
uniform vec2 uSun;
uniform float uSunStrength;
uniform float uSpot;
uniform float uMist;
// Plumes of smoke or vapour: where each rises from (x, y up), how tall and how strong; and its shape
// (width at the source, how fast it widens, how far the wind bends it, a seed for its own wisps).
uniform vec4 uPlumes[6];
uniform vec4 uPlumeShape[6];
uniform int uPlumeCount;
// Moving water, where the depth map's green channel marks it.
uniform float uWater;
uniform float uTime;
uniform float uStorm;
uniform float uFlash;
// The lightning: a trunk and one branch, in painting space with x scaled by its aspect, y up.
uniform vec2 uBolt[40];
uniform int uBoltCount;
uniform vec2 uBranch[20];
uniform int uBranchCount;
uniform float uBoltGlow;
// The bolt's own pass, drawn over the figures: only the lightning, added to what is already there.
uniform bool uBoltOnly;

const float OVERSCAN = 1.06;

// The camera: the painting covers the screen (with a margin for the parallax), zoomed, with the
// painting point uCenter held at the screen point uAnchor wherever the edges allow. Both y up.
vec2 toPainting(vec2 s) {
  float viewAspect = uView.x / uView.y;
  vec2 span = viewAspect > uImageAspect
    ? vec2(1.0, uImageAspect / viewAspect)
    : vec2(viewAspect / uImageAspect, 1.0);
  span /= OVERSCAN * uZoom;
  vec2 origin = clamp(uCenter - uAnchor * span, vec2(0.0), vec2(1.0) - span);
  return origin + s * span;
}

float nearness(vec2 s) {
  return texture(uDepth, toPainting(s)).r;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += amp * noise(p);
    p *= 2.03;
    amp *= 0.5;
  }
  return sum;
}

float segment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

vec3 boltColor(vec2 uv) {
  vec2 q = uv * vec2(uImageAspect, 1.0);
  float trunk = 1e3;
  for (int i = 0; i < 39; i++) {
    if (i + 1 >= uBoltCount) break;
    trunk = min(trunk, segment(q, uBolt[i], uBolt[i + 1]));
  }
  float branch = 1e3;
  for (int i = 0; i < 19; i++) {
    if (i + 1 >= uBranchCount) break;
    branch = min(branch, segment(q, uBranch[i], uBranch[i + 1]));
  }
  float core = exp(-pow(trunk / 0.0022, 2.0)) + 0.7 * exp(-pow(branch / 0.0014, 2.0));
  float halo = exp(-trunk / 0.02) * 0.42 + exp(-branch / 0.014) * 0.24;
  return vec3(1.0, 0.98, 1.0) * core * 1.3 + vec3(0.62, 0.7, 1.0) * halo;
}

void main() {
  vec2 s = vScreen;
  float aspect = uView.x / uView.y;
  // Camera offsets in screen units, equal in pixels on both axes.
  vec2 look = uLook * vec2(1.0, aspect) * 0.012;

  if (uBoltOnly) {
    // The lightning stands in the near air, in front of the giants it strikes.
    float grow = 1.0 + uDolly * (0.04 + 0.22 * 0.6);
    vec2 at = toPainting(uDollyTarget + (s + look * (0.6 - 0.3) - uDollyTarget) / grow);
    outColor = vec4(uBoltGlow * boltColor(at), 1.0);
    return;
  }

  // Find the point of the painting that lands on this pixel once near things move more than far
  // ones (a few fixed-point steps; the depth map's near edges are grown, so silhouettes hold).
  vec2 p = s;
  for (int i = 0; i < 6; i++) {
    float d = nearness(p);
    float grow = 1.0 + uDolly * (0.04 + 0.22 * d);
    p = uDollyTarget + (s + look * (d - 0.3) - uDollyTarget) / grow;
  }
  vec2 uv = clamp(toPainting(p), vec2(0.0005), vec2(0.9995));

  // The water moves: its surface shivers in fine horizontal ripples.
  float water = uWater > 0.0 ? texture(uDepth, uv).g * uWater : 0.0;
  if (water > 0.004) {
    vec2 w = uv * vec2(uImageAspect, 1.0);
    float n1 = noise(vec2(w.x * 30.0 + uTime * 0.35, w.y * 160.0 - uTime * 0.9));
    float n2 = noise(vec2(w.x * 55.0 - uTime * 0.25, w.y * 300.0 + uTime * 0.6));
    uv = clamp(uv + vec2((n1 - 0.5) * 0.0012, (n2 - 0.5) * 0.0005) * water, vec2(0.0005), vec2(0.9995));
  }

  vec3 color = texture(uColor, uv).rgb;
  float d = texture(uDepth, uv).r;

  // Relight the relief the depth map describes: what turns toward the light warms a little.
  vec2 texel = 1.5 / vec2(textureSize(uDepth, 0));
  float dx = texture(uDepth, uv + vec2(texel.x, 0.0)).r - texture(uDepth, uv - vec2(texel.x, 0.0)).r;
  float dy = texture(uDepth, uv + vec2(0.0, texel.y)).r - texture(uDepth, uv - vec2(0.0, texel.y)).r;
  vec3 normal = normalize(vec3(-dx * 18.0, -dy * 18.0, 1.0));
  vec3 toLight = normalize(vec3((uSun - s) * vec2(aspect, 1.0), 0.55));
  color *= 1.0 + uSunStrength * 0.16 * (dot(normal, toLight) - 0.6);

  // The light's glow in the air, held most by the distance.
  float r = length((s - uSun) * vec2(aspect, 1.0));
  color += vec3(1.0, 0.86, 0.62) * uSunStrength * 0.1 * exp(-r * r * 5.0) * (1.0 - 0.7 * d);

  // A pool of light on one detail: the rest of the painting falls back into shade.
  float pool = 1.0 - smoothstep(0.16, 0.7, length((s - uAnchor) * vec2(aspect, 1.0)));
  color *= mix(1.0, 0.55 + 0.45 * pool, uSpot);

  // Mist drifting through the distance.
  float far = 1.0 - smoothstep(0.08, 0.32, d);
  float mist = noise(uv * vec2(5.0, 11.0) + vec2(uTime * 0.018, uTime * 0.004)) * noise(uv * vec2(9.0, 19.0) - vec2(uTime * 0.011, 0.0));
  color = mix(color, uGround, far * mist * 0.12 * uMist);

  // Smoke and vapour rising from points of the scene (the oracle's chasm, the city's altars), held
  // in the painting itself so they keep their place at any zoom: wisps carried upward, widening as
  // they climb and bending with the wind.
  for (int i = 0; i < 6; i++) {
    if (i >= uPlumeCount) break;
    vec4 at = uPlumes[i];
    vec4 shape = uPlumeShape[i];
    vec2 v = (uv - at.xy) * vec2(uImageAspect, 1.0);
    float up = v.y / at.z;
    float rise = smoothstep(-0.03, 0.1, up) * (1.0 - smoothstep(0.62, 1.0, up));
    float width = shape.x + shape.y * max(v.y, 0.0);
    float sway = (noise(vec2(up * 4.0 - uTime * 0.22, shape.w)) - 0.5) * 1.4 * width * up + shape.z * v.y * up;
    float across = (v.x - sway) / width;
    float column = exp(-across * across) * rise;
    float wisps = noise(vec2(across * 1.6 + shape.w, up * 7.0 - uTime * 0.55))
      * noise(vec2(across * 2.9 + 3.1 + shape.w, up * 11.0 - uTime * 0.8));
    color = mix(color, vec3(0.95, 0.93, 0.89), clamp(column * pow(wisps, 1.5) * 2.4, 0.0, 0.55) * at.w);
  }

  // The sun caught on the ripples: glints that come and go.
  if (water > 0.004) {
    vec2 w = uv * vec2(uImageAspect, 1.0);
    float glint = pow(noise(vec2(w.x * 260.0 + uTime * 0.8, w.y * 620.0 - uTime * 0.5)), 22.0);
    color += vec3(1.0, 0.93, 0.78) * glint * (2.6 + 1.2 * sin(uTime * 3.0 + w.x * 400.0)) * water;
  }

  // A storm: clouds drifting through the sky, darkening it, lit from within when the lightning strikes.
  if (uStorm > 0.0 || uFlash > 0.0) {
    float sky = 1.0 - smoothstep(0.16, 0.42, d);
    vec2 drift = vec2(uTime * 0.03, uTime * 0.008);
    float cloud = smoothstep(0.42, 0.82, fbm(uv * vec2(2.6, 4.2) + drift) * 0.7 + fbm(uv * vec2(5.5, 8.0) - drift * 1.6) * 0.3);
    color = mix(color, color * 0.58, uStorm * sky * cloud * 0.75);
    color += uFlash * (0.25 + 0.75 * sky * cloud) * vec3(0.5, 0.55, 0.7) * 0.55;
  }

  // Haze: the distance goes first and the foreground last.
  float haze = smoothstep(0.0, 1.0, uHaze * 1.8 - d * 0.8);
  color = mix(color, uGround, haze);

  outColor = vec4(color, 1.0);
}`;

const LAYER_VERTEX = /* glsl */ `#version 300 es
in vec2 aPosition;
in vec2 aUV;
in vec2 aMask;
out vec2 vUV;
out vec2 vScreen;
out vec2 vMask;
void main() {
  vUV = aUV;
  vScreen = aPosition;
  vMask = aMask;
  gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);
}`;

// A figure cut out of the painting, lit like the scene around it: the same light, pool and haze, and
// the lightning's flash, brightest on what stands nearest the strike. A layer of the sky (a cloud)
// shows only where the depth map's blue channel marks open sky, so it passes behind the city.
const LAYER_FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUV;
in vec2 vScreen;
in vec2 vMask;
out vec4 outColor;

uniform sampler2D uLayer;
uniform sampler2D uDepth;
uniform float uMasked;
uniform float uLayerDepth;
uniform vec2 uView;
uniform vec2 uAnchor;
uniform float uSpot;
uniform vec2 uSun;
uniform float uSunStrength;
uniform float uHaze;
uniform vec3 uGround;
uniform float uFlash;
uniform vec2 uStrike;

void main() {
  vec4 c = texture(uLayer, vUV);
  if (uMasked > 0.5) c *= texture(uDepth, clamp(vMask, vec2(0.0005), vec2(0.9995))).b;
  if (c.a < 0.004) discard;
  vec3 color = c.rgb / c.a;
  float aspect = uView.x / uView.y;
  float r = length((vScreen - uSun) * vec2(aspect, 1.0));
  color += vec3(1.0, 0.86, 0.62) * uSunStrength * 0.05 * exp(-r * r * 5.0);
  float pool = 1.0 - smoothstep(0.16, 0.7, length((vScreen - uAnchor) * vec2(aspect, 1.0)));
  color *= mix(1.0, 0.55 + 0.45 * pool, uSpot);
  float near = exp(-length((vScreen - uStrike) * vec2(aspect, 1.0)) * 2.4);
  color += uFlash * vec3(0.42, 0.45, 0.55) * (0.3 + 0.5 * near);
  float haze = smoothstep(0.0, 1.0, uHaze * 1.8 - uLayerDepth * 0.8);
  color = mix(color, uGround, haze);
  outColor = vec4(color * c.a, c.a);
}`;


/** One frame of the camera and its light. Points are 0..1 from the top left. */
export interface PaintingView {
  /** The painting point held on screen, and where on screen it is held. */
  center: [number, number];
  anchor: [number, number];
  /** 1: the painting covers the screen; more moves in on a detail. */
  zoom: number;
  /** Camera offset from the pointer, -1..1 on each axis. */
  look: [number, number];
  /** 0..1: a push into the scene, near things growing faster than far ones, toward a screen point. */
  dolly: number;
  dollyTarget: [number, number];
  /** 0 clear, 1 dissolved into the page's ground. */
  haze: number;
  /** The light on screen and how strongly it reads. */
  sun: [number, number];
  sunStrength: number;
  /** 0..1: how far the rest of the painting falls into shade around the anchor. */
  spot: number;
  /** 0..1: mist drifting through the distance. */
  mist: number;
  /** Smoke and vapour rising from points of the painting. */
  plumes?: Plume[];
  /** 0..1: the water marked in the depth map moves and glints. */
  water?: number;
  /** Gulls in flight over the painting. */
  birds?: Bird[];
  time: number;
  /** Animated paintings: how each figure has moved, in layer order. */
  layers?: LayerMotion[];
  /** 0..1: storm clouds drifting through the sky. */
  storm?: number;
  /** 0..1: the lightning's flash over the whole scene. */
  flash?: number;
  /** A bolt of lightning in painting space, and how brightly it burns. */
  bolt?: { points: [number, number][]; branch: [number, number][]; glow: number } | null;
}

/** A plume of smoke or vapour rising from a point of the painting (0..1 from the top left). */
export interface Plume {
  from: [number, number];
  /** Its height, and its width at the source and how fast it widens, in painting heights. */
  height: number;
  width: number;
  growth: number;
  /** How far the wind bends it as it climbs (negative: to the left). */
  drift?: number;
  strength: number;
  seed?: number;
}

/** A figure's movement from where the painter put it. Painting units, 0..1 from the top left. */
export interface LayerMotion {
  dx: number;
  dy: number;
  /** Radians, clockwise on screen, about the layer's pivot. */
  rotate: number;
  scale?: number;
}

/** A figure cut out of the painting: its box, its depth (0 far, 1 near) and the point it turns about. */
export interface LayerSpec {
  rect: [number, number, number, number];
  depth: number;
  pivot: [number, number];
  /** A part of the sky: shown only over open sky, so it passes behind everything else. */
  mask?: "sky";
}

const UNIFORMS = [
  "uColor",
  "uDepth",
  "uView",
  "uImageAspect",
  "uCenter",
  "uAnchor",
  "uZoom",
  "uLook",
  "uDolly",
  "uDollyTarget",
  "uHaze",
  "uGround",
  "uSun",
  "uSunStrength",
  "uSpot",
  "uMist",
  "uPlumes",
  "uPlumeShape",
  "uPlumeCount",
  "uWater",
  "uTime",
  "uStorm",
  "uFlash",
  "uBolt",
  "uBoltCount",
  "uBranch",
  "uBranchCount",
  "uBoltGlow",
  "uBoltOnly",
] as const;

const LAYER_UNIFORMS = [
  "uLayer",
  "uDepth",
  "uMasked",
  "uLayerDepth",
  "uView",
  "uAnchor",
  "uSpot",
  "uSun",
  "uSunStrength",
  "uHaze",
  "uGround",
  "uFlash",
  "uStrike",
] as const;

type LayerUniform = (typeof LAYER_UNIFORMS)[number];

const BIRD_UNIFORMS = [
  "uDepth",
  "uView",
  "uImageAspect",
  "uCenter",
  "uAnchor",
  "uZoom",
  "uLook",
  "uDolly",
  "uDollyTarget",
  "uHaze",
  "uGround",
  "uSky",
] as const;

type BirdUniform = (typeof BIRD_UNIFORMS)[number];

/** The hero's sky behind the gulls, sRGB 0..1: what the distance fades them toward. */
const SKY: [number, number, number] = [0.77, 0.74, 0.75];

const OVERSCAN = 1.06;

type Uniform = (typeof UNIFORMS)[number];

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`painting shader: ${log}`);
  }
  return shader;
}

function link(gl: WebGL2RenderingContext, vertex: string, fragment: string) {
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`painting program: ${gl.getProgramInfoLog(program)}`);
  }
  return program;
}

function upload(gl: WebGL2RenderingContext, unit: number, source: TexImageSource, mipmaps: boolean, premultiply = false) {
  const texture = gl.createTexture()!;
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiply);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  if (mipmaps) gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mipmaps ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return texture;
}

interface Layer extends LayerSpec {
  texture: WebGLTexture;
}

export class PaintingRenderer {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private buffer: WebGLBuffer;
  private vao: WebGLVertexArrayObject;
  private textures: WebGLTexture[] = [];
  private uniforms = {} as Record<Uniform, WebGLUniformLocation | null>;
  private aspect = 1;
  private layers: Layer[] = [];
  private layerProgram: WebGLProgram | null = null;
  private layerUniforms = {} as Record<LayerUniform, WebGLUniformLocation | null>;
  private layerBuffer: WebGLBuffer | null = null;
  private layerVao: WebGLVertexArrayObject | null = null;
  private quad = new Float32Array(24);
  private birdProgram: WebGLProgram | null = null;
  private birdUniforms = {} as Record<BirdUniform, WebGLUniformLocation | null>;
  private birdVao: WebGLVertexArrayObject | null = null;
  private birdMesh: WebGLBuffer | null = null;
  private birdInstances: WebGLBuffer | null = null;
  private birdVertices = 0;
  private birdData = new Float32Array(0);

  constructor(
    private canvas: HTMLCanvasElement,
    private ground: [number, number, number],
  ) {
    // Multisampled, so a gull's wing is a clean line at any angle; the painting itself is one triangle.
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: true, powerPreference: "high-performance" });
    if (!gl) throw new Error("WebGL2 unavailable");
    this.gl = gl;

    const program = link(gl, VERTEX, FRAGMENT);
    this.program = program;
    gl.useProgram(program);
    for (const name of UNIFORMS) this.uniforms[name] = gl.getUniformLocation(program, name);

    this.vao = gl.createVertexArray()!;
    gl.bindVertexArray(this.vao);
    this.buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  }

  /** The painting and its depth map, both already decoded. */
  setImages(color: HTMLImageElement | HTMLCanvasElement, depth: HTMLImageElement) {
    const gl = this.gl;
    this.textures.forEach((t) => gl.deleteTexture(t));
    this.textures = [upload(gl, 0, color, true), upload(gl, 1, depth, false)];
    // An <img> reports its laid-out size as width/height; the texture's shape is its natural one.
    this.aspect =
      color instanceof HTMLImageElement ? color.naturalWidth / color.naturalHeight : color.width / color.height;
    gl.uniform1i(this.uniforms.uColor, 0);
    gl.uniform1i(this.uniforms.uDepth, 1);
  }

  /** The figures of an animated painting, cut out with their alpha, in the order they are drawn. */
  setLayers(images: (HTMLImageElement | HTMLCanvasElement)[], specs: LayerSpec[]) {
    const gl = this.gl;
    this.layers.forEach((layer) => gl.deleteTexture(layer.texture));
    this.layers = images.map((image, i) => ({ ...specs[i], texture: upload(gl, 2, image, true, true) }));
    if (this.layerProgram || !this.layers.length) return;
    const program = link(gl, LAYER_VERTEX, LAYER_FRAGMENT);
    this.layerProgram = program;
    for (const name of LAYER_UNIFORMS) this.layerUniforms[name] = gl.getUniformLocation(program, name);
    this.layerVao = gl.createVertexArray()!;
    gl.bindVertexArray(this.layerVao);
    this.layerBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.layerBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.quad.byteLength, gl.DYNAMIC_DRAW);
    const attribute = (name: string, offset: number) => {
      const location = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 24, offset);
    };
    attribute("aPosition", 0);
    attribute("aUV", 8);
    attribute("aMask", 16);
    gl.bindVertexArray(this.vao);
  }

  resize(width: number, height: number, dpr: number) {
    const w = Math.max(1, Math.round(width * dpr));
    const h = Math.max(1, Math.round(height * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.gl.viewport(0, 0, w, h);
  }

  /** The camera's window on the painting, y up: what share of it is seen, and from where. */
  private window(view: PaintingView) {
    const viewAspect = this.canvas.width / this.canvas.height;
    const cover = viewAspect > this.aspect ? [1, this.aspect / viewAspect] : [viewAspect / this.aspect, 1];
    const span = [cover[0] / (OVERSCAN * view.zoom), cover[1] / (OVERSCAN * view.zoom)];
    const center = [view.center[0], 1 - view.center[1]];
    const anchor = [view.anchor[0], 1 - view.anchor[1]];
    const origin = [
      Math.min(1 - span[0], Math.max(0, center[0] - anchor[0] * span[0])),
      Math.min(1 - span[1], Math.max(0, center[1] - anchor[1] * span[1])),
    ];
    return { span, origin, viewAspect };
  }

  /** Where a point of the painting (top-left units) at some depth lands on screen (0..1, y up). */
  private project(x: number, y: number, depth: number, view: PaintingView, frame: ReturnType<PaintingRenderer["window"]>) {
    const sx = (x - frame.origin[0]) / frame.span[0];
    const sy = (1 - y - frame.origin[1]) / frame.span[1];
    const target = [view.dollyTarget[0], 1 - view.dollyTarget[1]];
    const grow = 1 + view.dolly * (0.04 + 0.22 * depth);
    const lookX = view.look[0] * 0.012;
    const lookY = view.look[1] * frame.viewAspect * 0.012;
    return [
      target[0] + (sx - target[0]) * grow - lookX * (depth - 0.3),
      target[1] + (sy - target[1]) * grow - lookY * (depth - 0.3),
    ] as const;
  }

  /** The point of the painting (texture units, y up) under a screen point, for things at some depth. */
  private unproject(sx: number, sy: number, depth: number, view: PaintingView, frame: ReturnType<PaintingRenderer["window"]>) {
    const target = [view.dollyTarget[0], 1 - view.dollyTarget[1]];
    const grow = 1 + view.dolly * (0.04 + 0.22 * depth);
    const lookX = view.look[0] * 0.012;
    const lookY = view.look[1] * frame.viewAspect * 0.012;
    const px = target[0] + (sx + lookX * (depth - 0.3) - target[0]) / grow;
    const py = target[1] + (sy + lookY * (depth - 0.3) - target[1]) / grow;
    return [frame.origin[0] + px * frame.span[0], frame.origin[1] + py * frame.span[1]] as const;
  }

  render(view: PaintingView) {
    const gl = this.gl;
    const u = this.uniforms;
    const up = ([x, y]: [number, number]) => [x, 1 - y] as const;
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    gl.uniform2f(u.uView, this.canvas.width, this.canvas.height);
    gl.uniform1f(u.uImageAspect, this.aspect);
    gl.uniform2f(u.uCenter, ...up(view.center));
    gl.uniform2f(u.uAnchor, ...up(view.anchor));
    gl.uniform1f(u.uZoom, view.zoom);
    gl.uniform2f(u.uLook, ...view.look);
    gl.uniform1f(u.uDolly, view.dolly);
    gl.uniform2f(u.uDollyTarget, ...up(view.dollyTarget));
    gl.uniform1f(u.uHaze, view.haze);
    gl.uniform3f(u.uGround, ...this.ground);
    gl.uniform2f(u.uSun, ...up(view.sun));
    gl.uniform1f(u.uSunStrength, view.sunStrength);
    gl.uniform1f(u.uSpot, view.spot);
    gl.uniform1f(u.uMist, view.mist);
    const plumes = (view.plumes ?? []).slice(0, 6);
    const at = new Float32Array(24);
    const shape = new Float32Array(24);
    plumes.forEach((plume, i) => {
      at.set([plume.from[0], 1 - plume.from[1], plume.height, plume.strength], i * 4);
      shape.set([plume.width, plume.growth, plume.drift ?? 0, plume.seed ?? i * 1.7], i * 4);
    });
    gl.uniform4fv(u.uPlumes, at);
    gl.uniform4fv(u.uPlumeShape, shape);
    gl.uniform1i(u.uPlumeCount, plumes.length);
    gl.uniform1f(u.uWater, view.water ?? 0);
    gl.uniform1f(u.uTime, view.time);
    gl.uniform1f(u.uStorm, view.storm ?? 0);
    gl.uniform1f(u.uFlash, view.flash ?? 0);
    const bolt = view.bolt;
    const toBolt = (points: [number, number][], max: number) => {
      const flat = new Float32Array(max * 2);
      points.slice(0, max).forEach(([x, y], i) => {
        flat[i * 2] = x * this.aspect;
        flat[i * 2 + 1] = 1 - y;
      });
      return flat;
    };
    if (bolt && bolt.glow > 0) {
      gl.uniform2fv(u.uBolt, toBolt(bolt.points, 40));
      gl.uniform1i(u.uBoltCount, Math.min(40, bolt.points.length));
      gl.uniform2fv(u.uBranch, toBolt(bolt.branch, 20));
      gl.uniform1i(u.uBranchCount, Math.min(20, bolt.branch.length));
      gl.uniform1f(u.uBoltGlow, bolt.glow);
    } else {
      gl.uniform1i(u.uBoltCount, 0);
      gl.uniform1f(u.uBoltGlow, 0);
    }
    gl.uniform1i(u.uBoltOnly, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (this.layers.length) this.renderLayers(view);
    if (view.birds?.length) this.renderBirds(view);
    if (bolt && bolt.glow > 0) {
      // The bolt over everything, its light added to the scene it strikes.
      gl.uniform1i(u.uBoltOnly, 1);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.disable(gl.BLEND);
      gl.uniform1i(u.uBoltOnly, 0);
    }
  }

  /** The figures, each moved, turned and projected at its own depth, lit like the scene. */
  private renderLayers(view: PaintingView) {
    const gl = this.gl;
    const program = this.layerProgram;
    if (!program || !this.layerVao || !this.layerBuffer) return;
    const u = this.layerUniforms;
    const frame = this.window(view);
    const up = ([x, y]: [number, number]) => [x, 1 - y] as const;
    gl.useProgram(program);
    gl.bindVertexArray(this.layerVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.layerBuffer);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(u.uView, this.canvas.width, this.canvas.height);
    gl.uniform2f(u.uAnchor, ...up(view.anchor));
    gl.uniform1f(u.uSpot, view.spot);
    gl.uniform2f(u.uSun, ...up(view.sun));
    gl.uniform1f(u.uSunStrength, view.sunStrength);
    gl.uniform1f(u.uHaze, view.haze);
    gl.uniform3f(u.uGround, ...this.ground);
    gl.uniform1f(u.uFlash, view.flash ?? 0);
    const strike = view.bolt?.points[view.bolt.points.length - 1];
    const strikeAt = strike ? this.project(strike[0], strike[1], 0.2, view, frame) : ([0.5, 2] as const);
    gl.uniform2f(u.uStrike, strikeAt[0], strikeAt[1]);
    gl.uniform1i(u.uLayer, 2);
    gl.uniform1i(u.uDepth, 1);
    gl.activeTexture(gl.TEXTURE2);

    this.layers.forEach((layer, i) => {
      const motion = view.layers?.[i] ?? { dx: 0, dy: 0, rotate: 0 };
      const [x0, y0, x1, y1] = layer.rect;
      const [px, py] = layer.pivot;
      const cos = Math.cos(motion.rotate);
      const sin = Math.sin(motion.rotate);
      const k = motion.scale ?? 1;
      // Corners in drawing order (top left, top right, bottom left, bottom right) with their texture
      // coordinates, turned about the pivot in true proportions, then moved.
      const corners: [number, number, number, number][] = [
        [x0, y0, 0, 1],
        [x1, y0, 1, 1],
        [x0, y1, 0, 0],
        [x1, y1, 1, 0],
      ];
      corners.forEach(([cx, cy, tu, tv], j) => {
        const X = (cx - px) * this.aspect * k;
        const Y = (cy - py) * k;
        const x = px + (X * cos - Y * sin) / this.aspect + motion.dx;
        const y = py + (X * sin + Y * cos) + motion.dy;
        const [sx, sy] = this.project(x, y, layer.depth, view, frame);
        const [mx, my] = this.unproject(sx, sy, layer.depth, view, frame);
        this.quad.set([sx, sy, tu, tv, mx, my], j * 6);
      });
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.quad);
      gl.bindTexture(gl.TEXTURE_2D, layer.texture);
      gl.uniform1f(u.uLayerDepth, layer.depth);
      gl.uniform1f(u.uMasked, layer.mask === "sky" ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    });

    gl.disable(gl.BLEND);
    gl.bindVertexArray(this.vao);
    gl.useProgram(this.program);
  }

  /** The gulls, one instanced draw: each placed, sized and lit at its own depth, hidden behind what is nearer. */
  private renderBirds(view: PaintingView) {
    const gl = this.gl;
    const birds = view.birds!;
    if (!this.birdProgram) {
      const program = link(gl, BIRD_VERTEX, BIRD_FRAGMENT);
      this.birdProgram = program;
      for (const name of BIRD_UNIFORMS) this.birdUniforms[name] = gl.getUniformLocation(program, name);
      this.birdVao = gl.createVertexArray()!;
      gl.bindVertexArray(this.birdVao);
      const mesh = birdMesh();
      this.birdVertices = mesh.length / BIRD_VERTEX_FLOATS;
      this.birdMesh = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.birdMesh);
      gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
      const attribute = (name: string, size: number, offset: number, stride: number, divisor: number) => {
        const location = gl.getAttribLocation(program, name);
        if (location < 0) return;
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride * 4, offset * 4);
        gl.vertexAttribDivisor(location, divisor);
      };
      attribute("aPosition", 3, 0, BIRD_VERTEX_FLOATS, 0);
      attribute("aNormal", 3, 3, BIRD_VERTEX_FLOATS, 0);
      attribute("aTop", 3, 6, BIRD_VERTEX_FLOATS, 0);
      attribute("aBottom", 3, 9, BIRD_VERTEX_FLOATS, 0);
      attribute("aPart", 1, 12, BIRD_VERTEX_FLOATS, 0);
      attribute("aSide", 1, 13, BIRD_VERTEX_FLOATS, 0);
      this.birdInstances = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.birdInstances);
      attribute("iPlace", 4, 0, BIRD_INSTANCE_FLOATS, 1);
      attribute("iForward", 4, 4, BIRD_INSTANCE_FLOATS, 1);
      attribute("iUp", 4, 8, BIRD_INSTANCE_FLOATS, 1);
      attribute("iWing", 3, 12, BIRD_INSTANCE_FLOATS, 1);
    }

    const needed = birds.length * BIRD_INSTANCE_FLOATS;
    if (this.birdData.length < needed) this.birdData = new Float32Array(needed);
    const data = this.birdData;
    const frame = this.window(view);
    birds.forEach((bird, i) => {
      const [sx, sy] = this.project(bird.x, bird.y, bird.depth, view, frame);
      const grow = 1 + view.dolly * (0.04 + 0.22 * bird.depth);
      const ux = (bird.size * grow) / (this.aspect * frame.span[0]);
      const uy = (bird.size * grow) / frame.span[1];
      data.set([sx, sy, ux, uy, ...bird.forward, bird.depth, ...bird.up, bird.haze, ...bird.wing], i * BIRD_INSTANCE_FLOATS);
    });

    const u = this.birdUniforms;
    const up = ([x, y]: [number, number]) => [x, 1 - y] as const;
    gl.useProgram(this.birdProgram);
    gl.bindVertexArray(this.birdVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.birdInstances);
    gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, needed), gl.DYNAMIC_DRAW);
    gl.uniform1i(u.uDepth, 1);
    gl.uniform2f(u.uView, this.canvas.width, this.canvas.height);
    gl.uniform1f(u.uImageAspect, this.aspect);
    gl.uniform2f(u.uCenter, ...up(view.center));
    gl.uniform2f(u.uAnchor, ...up(view.anchor));
    gl.uniform1f(u.uZoom, view.zoom);
    gl.uniform2f(u.uLook, ...view.look);
    gl.uniform1f(u.uDolly, view.dolly);
    gl.uniform2f(u.uDollyTarget, ...up(view.dollyTarget));
    gl.uniform1f(u.uHaze, view.haze);
    gl.uniform3f(u.uGround, ...this.ground);
    gl.uniform3f(u.uSky, ...SKY);
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, this.birdVertices, birds.length);
    gl.disable(gl.DEPTH_TEST);
    gl.bindVertexArray(this.vao);
    gl.useProgram(this.program);
  }

  dispose() {
    const gl = this.gl;
    this.textures.forEach((t) => gl.deleteTexture(t));
    this.layers.forEach((layer) => gl.deleteTexture(layer.texture));
    gl.deleteBuffer(this.buffer);
    if (this.layerBuffer) gl.deleteBuffer(this.layerBuffer);
    if (this.layerProgram) gl.deleteProgram(this.layerProgram);
    if (this.birdMesh) gl.deleteBuffer(this.birdMesh);
    if (this.birdInstances) gl.deleteBuffer(this.birdInstances);
    if (this.birdProgram) gl.deleteProgram(this.birdProgram);
    gl.deleteProgram(this.program);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
