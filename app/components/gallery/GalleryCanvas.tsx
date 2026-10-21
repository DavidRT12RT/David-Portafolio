"use client";

/* eslint-disable react-hooks/immutability -- three.js materials and scene objects are mutated in the frame loop by design */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { gallery, roomState, type FigureId, type RoomId, type RoomState } from "@/app/lib/gallery";
import { COLONNADE, FIGURES, type FigureConfig } from "./figures";
import { colonnadeMode, panelSize, pillarX, pinnedProgress, STYLOBATE_TOP } from "./colonnade-layout";

const CAMERA_Z = 6;
const MARBLE = "#ece6dc";
const STONE = "#d2c3ad";
/**
 * The two grounds a room can stand on, as on the page: the hazy afternoon sky, and the shade of the
 * works' portico. Until the sun reaches its room a figure dissolves into one of them.
 */
const SKY = "#ebe5dd";
const SHADE = "#21150e";
const SUN = "#fff4e4";
/** The colour of a shaft of afternoon sun seen in the shade: gilded, warmer than the light it carries. */
const SHAFT = "#f2c27a";
/** Light thrown back by sunlit marble into the shadows, warm as the pavement it comes from. */
const BOUNCE = "#e9cfae";

interface Frame {
  light: number;
  x: number;
  y: number;
  s: number;
  /** Plinth height (in figure heights) that reaches the bottom of the view when the figure is in place. */
  plinth: number;
  visible: boolean;
}

/** Per-frame placement of every figure, written by the light rig and read by the figures. */
const frames = new Map<FigureId, Frame>();
const pointer = { x: 0, y: 0 };

/** A small seeded generator (mulberry32): dust scatters the same way on every render. */
function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const roomElements = new Map<RoomId, HTMLElement>();
/** Reads a room's edges in the same frame it is drawn, so nothing in the canvas trails the text. */
function readRoom(id: RoomId): RoomState {
  const room = roomState(id);
  let el = roomElements.get(id);
  if (!el || !el.isConnected) {
    el = document.querySelector<HTMLElement>(`[data-room="${id}"]`) ?? undefined;
    if (el) roomElements.set(id, el);
  }
  if (el) {
    const rect = el.getBoundingClientRect();
    room.top = rect.top;
    room.bottom = rect.bottom;
    room.viewport = window.innerHeight;
  }
  return room;
}

function viewSize(camera: THREE.PerspectiveCamera) {
  const vh = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  return { vh, vw: vh * camera.aspect };
}

/**
 * Things in the canvas behave like sticky elements of their room: they rise in with the room's top
 * edge, hold their place while the room fills the screen and leave with its bottom edge.
 */
function stickyShift(room: RoomState, vh: number) {
  const px = Number.isFinite(room.top)
    ? Math.max(0, room.top) + Math.min(0, room.bottom - room.viewport)
    : room.viewport;
  return (px / Math.max(room.viewport, 1)) * vh;
}

function placement(config: FigureConfig, room: RoomState, camera: THREE.PerspectiveCamera) {
  const { vh, vw } = viewSize(camera);
  const p = camera.aspect < 0.95 ? config.portrait : config.desktop;
  const s = p.h * vh;
  const base = (p.y * vh) / 2 - s / 2;
  // On wide screens the plinth runs to the bottom of the view; on phones it is a short block, so the
  // caption beneath the figure reads on the wall rather than on stone.
  const plinth = camera.aspect < 0.95 ? 0.14 : Math.max(0, (base + vh / 2) / s) + 0.04;
  return { x: (p.x * vw) / 2, y: base - stickyShift(room, vh), s, plinth };
}

/**
 * Two shared suns (key and bounce) follow the two brightest rooms, so light counts never change; the
 * sky's own light fills every shadow.
 */
function LightRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const invalidate = useThree((s) => s.invalidate);
  const keyA = useRef<THREE.SpotLight>(null);
  const keyB = useRef<THREE.SpotLight>(null);
  const bounceA = useRef<THREE.SpotLight>(null);
  const bounceB = useRef<THREE.SpotLight>(null);
  const targets = useMemo(() => [new THREE.Object3D(), new THREE.Object3D()], []);
  const damped = useRef(new Map<FigureId, number>());

  useEffect(() => {
    gallery.invalidate = () => invalidate();
    return () => {
      gallery.invalidate = () => {};
    };
  }, [invalidate]);

  useFrame((_, dt) => {
    const reduced = gallery.reducedMotion;
    let moving = false;

    const px = gallery.pointer.active && !reduced ? gallery.pointer.x : 0;
    const py = gallery.pointer.active && !reduced ? gallery.pointer.y : 0;
    pointer.x = THREE.MathUtils.damp(pointer.x, px, 2.4, dt);
    pointer.y = THREE.MathUtils.damp(pointer.y, py, 2.4, dt);
    if (Math.abs(pointer.x - px) + Math.abs(pointer.y - py) > 0.002) moving = true;

    // The colonnade's controls are laid over it in the page, so the camera holds still in that room.
    const steady = 1 - Math.min(1, roomState("works").light * 1.5);
    camera.position.set(pointer.x * 0.1 * steady, pointer.y * 0.05 * steady, CAMERA_Z);
    camera.lookAt(0, 0, 0);

    const ranked: { config: FigureConfig; light: number; frame: Frame }[] = [];
    for (const config of FIGURES) {
      const room = readRoom(config.id);
      const previous = damped.current.get(config.id) ?? 0;
      const light = reduced ? room.light : THREE.MathUtils.damp(previous, room.light, 3.4, dt);
      if (Math.abs(light - room.light) > 0.002) moving = true;
      damped.current.set(config.id, light);
      const frame = { light, ...placement(config, room, camera), visible: light > 0.004 };
      frames.set(config.id, frame);
      ranked.push({ config, light, frame });
    }
    ranked.sort((a, b) => b.light - a.light);

    const keys = [keyA.current, keyB.current];
    const bounces = [bounceA.current, bounceB.current];
    for (let i = 0; i < 2; i++) {
      const key = keys[i];
      const bounce = bounces[i];
      const pick = ranked[i];
      if (!key || !bounce) continue;
      if (!pick || pick.light < 0.004) {
        key.intensity = 0;
        bounce.intensity = 0;
        continue;
      }
      const { x, y, s } = pick.frame;
      const side = pick.config.keySide;
      // The afternoon sun stands high to one side and a little in front, as over Cole's city; the
      // pointer moves it, so the light rakes across the carving.
      key.position.set(x + (side * 0.9 + pointer.x * 0.5) * s, y + (1.6 + pointer.y * 0.25) * s, 1.2 * s);
      bounce.position.set(x - side * 0.9 * s, y + 0.15 * s, 1.5 * s);
      targets[i].position.set(x, y + 0.58 * s, 0);
      targets[i].updateMatrixWorld();
      key.intensity = pick.light * 2.7;
      bounce.intensity = pick.light * 0.6;
    }

    if (moving) invalidate();
  });

  return (
    <>
      <hemisphereLight args={["#e2e3ee", "#9c8a78", 1.6]} />
      <primitive object={targets[0]} />
      <primitive object={targets[1]} />
      <spotLight
        ref={keyA}
        target={targets[0]}
        angle={0.55}
        penumbra={0.8}
        decay={0}
        intensity={0}
        color={SUN}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={4}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
      />
      <spotLight ref={keyB} target={targets[1]} angle={0.55} penumbra={0.8} decay={0} intensity={0} color={SUN} />
      <spotLight ref={bounceA} target={targets[0]} angle={0.7} penumbra={1} decay={0} intensity={0} color={BOUNCE} />
      <spotLight ref={bounceB} target={targets[1]} angle={0.7} penumbra={1} decay={0} intensity={0} color={BOUNCE} />
    </>
  );
}

const BEAM_VERTEX = /* glsl */ `
  uniform float uHeight;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vAlong;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - world.xyz);
    vAlong = position.y / uHeight + 0.5;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const BEAM_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uFloorPx;
  uniform float uFeatherPx;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vAlong;
  void main() {
    float facing = abs(dot(normalize(vNormalW), normalize(vViewDir)));
    float body = pow(facing, 1.8);
    // Only the lowest stretch of the shaft is on screen, between the roof and the panel: full there,
    // landing softly on the panel's top edge and thinning toward the opening above.
    // Strongest low down, where the shaft has gathered the most dust and is about to land.
    float along = smoothstep(0.0, 0.05, vAlong) * (1.0 - 0.55 * smoothstep(0.0, 0.6, vAlong))
      * (1.0 + 0.8 * (1.0 - smoothstep(0.1, 0.4, vAlong)));
    // The light comes down onto what it falls on and fades away across its upper part, along
    // straight lines on screen: from the top edge (uFloorPx) to uFeatherPx below it.
    float fall = smoothstep(uFloorPx - uFeatherPx * 0.8, uFloorPx + uFeatherPx * 0.5, gl_FragCoord.y);
    gl_FragColor = vec4(uColor, body * along * fall * uOpacity);
    #include <colorspace_fragment>
  }
`;

const DUST_VERTEX = /* glsl */ `
  attribute vec3 aSeed;
  attribute float aSize;
  uniform float uTime;
  uniform float uHeight;
  uniform float uRadius;
  uniform float uPixelRatio;
  uniform float uOpacity;
  uniform float uFloorPx;
  uniform float uFeatherPx;
  uniform float uBufferHeight;
  varying float vAlpha;
  void main() {
    float t = fract(aSeed.y - uTime * 0.01 * (0.6 + aSize));
    float y = -uHeight * 0.5 + t * uHeight * 0.34;
    float r = uRadius * (0.5 - y / uHeight);
    vec2 drift = vec2(sin(uTime * 0.21 + aSeed.x * 9.0), cos(uTime * 0.17 + aSeed.z * 7.0)) * 0.012;
    vec2 xz = aSeed.xz * r * 0.8 + drift;
    vec4 world = modelMatrix * vec4(xz.x, y, xz.y, 1.0);
    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * 15.0 / -mv.z;
    float twinkle = 0.55 + 0.45 * sin(uTime * (0.8 + aSize) + aSeed.x * 20.0);
    vAlpha = uOpacity * smoothstep(0.0, 0.14, t) * (1.0 - smoothstep(0.84, 1.0, t)) * twinkle
      * (0.35 + 0.65 * (1.0 - length(aSeed.xz)))
      * smoothstep(uFloorPx - uFeatherPx * 0.5, uFloorPx, (gl_Position.y / gl_Position.w * 0.5 + 0.5) * uBufferHeight);
  }
`;

const DUST_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * vAlpha);
    #include <colorspace_fragment>
  }
`;

/**
 * A shaft of sun through the portico's roof: an open cone from `apex` down to `base`, brightest
 * through its middle, with dust turning slowly inside it. Coordinates are in the parent's space.
 */
function Beam({
  apex,
  base,
  radius,
  strength,
  dust = 0,
  color = SUN,
  landing,
}: {
  apex: [number, number, number];
  base: [number, number, number];
  radius: number;
  strength: () => number;
  dust?: number;
  color?: string;
  /** Where the light meets what it falls on (the middle of its top edge) and where, further down
   * it, the light has faded away; both world points, read each frame. */
  landing?: () => { top: THREE.Vector3; reach: THREE.Vector3 } | null;
}) {
  const [ax, ay, az] = apex;
  const [bx, by, bz] = base;
  const buffer = useMemo(() => new THREE.Vector2(), []);
  const { geometry, position, quaternion, height } = useMemo(() => {
    const a = new THREE.Vector3(ax, ay, az);
    const b = new THREE.Vector3(bx, by, bz);
    const h = a.distanceTo(b);
    const g = new THREE.ConeGeometry(radius, h, 64, 1, true);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), a.clone().sub(b).normalize());
    return { geometry: g, position: a.clone().add(b).multiplyScalar(0.5), quaternion: q, height: h };
  }, [ax, ay, az, bx, by, bz, radius]);

  const beamMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: BEAM_VERTEX,
        fragmentShader: BEAM_FRAGMENT,
        transparent: true,
        depthWrite: false,
        // Light adds to what is behind it: the shaft glows over the shaded roof and lifts the sky.
        blending: THREE.AdditiveBlending,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: 0 },
          uHeight: { value: height },
          uFloorPx: { value: -1e6 },
          uFeatherPx: { value: 6 },
        },
      }),
    [height, color],
  );

  const motes = useMemo(() => {
    if (!dust) return null;
    const random = seeded(dust * 7919);
    const seeds = new Float32Array(dust * 3);
    const sizes = new Float32Array(dust);
    for (let i = 0; i < dust; i++) {
      const angle = random() * Math.PI * 2;
      const r = Math.sqrt(random());
      seeds[i * 3] = Math.cos(angle) * r;
      seeds[i * 3 + 1] = random();
      seeds[i * 3 + 2] = Math.sin(angle) * r;
      sizes[i] = 0.6 + random() * 1.6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(dust * 3), 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: DUST_VERTEX,
      fragmentShader: DUST_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uHeight: { value: height },
        uRadius: { value: radius },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uOpacity: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uFloorPx: { value: -1e6 },
        uFeatherPx: { value: 1 },
        uBufferHeight: { value: 1 },
      },
    });
    return { geometry: g, material: m };
  }, [dust, height, radius, color]);

  useEffect(
    () => () => {
      geometry.dispose();
      beamMaterial.dispose();
      motes?.geometry.dispose();
      motes?.material.dispose();
    },
    [geometry, beamMaterial, motes],
  );

  useFrame((state, dt) => {
    const value = strength();
    beamMaterial.uniforms.uOpacity.value = value;
    if (landing) {
      // Where the light lands and where it has faded, in the drawing buffer's pixels from the bottom.
      const points = landing();
      state.gl.getDrawingBufferSize(buffer);
      const toPx = (point: THREE.Vector3) => (point.project(state.camera).y * 0.5 + 0.5) * buffer.y;
      const top = points ? toPx(points.top) : -1e6;
      const feather = points ? Math.max(1, top - toPx(points.reach)) : 1;
      beamMaterial.uniforms.uFloorPx.value = top;
      beamMaterial.uniforms.uFeatherPx.value = feather;
      if (motes) {
        motes.material.uniforms.uFloorPx.value = top;
        motes.material.uniforms.uFeatherPx.value = feather;
        motes.material.uniforms.uBufferHeight.value = buffer.y;
      }
    }
    if (motes) {
      motes.material.uniforms.uOpacity.value = Math.min(1, value * 6);
      if (value > 0.002 && !gallery.reducedMotion) {
        motes.material.uniforms.uTime.value += dt;
        state.invalidate();
      }
    }
  });

  return (
    <mesh geometry={geometry} material={beamMaterial} position={position} quaternion={quaternion} renderOrder={2}>
      {motes ? <points geometry={motes.geometry} material={motes.material} frustumCulled={false} /> : null}
    </mesh>
  );
}

/** A hex colour as sRGB components, for mixing after the renderer's output transform. */
function srgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

interface Atmosphere {
  /** 0 clear, 1 dissolved into the ground the room stands on. */
  haze: { value: number };
}

/**
 * Daylight for a standard material. The sky's ambient light can be turned down (under the portico);
 * the baked occlusion darkens the sun as well as the sky, so it settles into the curls, the beard and
 * the chisel cuts; and the finished colour dissolves into the room's ground, the haze a figure stands
 * in until the sun finds it. The mix comes after tone mapping, so a fully hazed surface is exactly
 * the page's own colour.
 */
function atmosphere(material: THREE.MeshStandardMaterial, ground: string, ambient = 1): Atmosphere {
  const haze = { value: 1 };
  const hazeColor = { value: srgb(ground) };
  const sky = { value: ambient };
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uHaze = haze;
    shader.uniforms.uHazeColor = hazeColor;
    shader.uniforms.uAmbient = sky;
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uHaze;\nuniform vec3 uHazeColor;\nuniform float uAmbient;")
      .replace(
        "#include <lights_fragment_end>",
        `#if defined( RE_IndirectDiffuse )
          irradiance *= uAmbient;
        #endif
        #include <lights_fragment_end>`,
      )
      .replace(
        "#include <aomap_fragment>",
        `#include <aomap_fragment>
        #ifdef USE_AOMAP
          reflectedLight.directDiffuse *= mix(1.0, ambientOcclusion, 0.85);
          reflectedLight.directSpecular *= ambientOcclusion;
        #endif`,
      )
      .replace(
        "#include <dithering_fragment>",
        "#include <dithering_fragment>\ngl_FragColor.rgb = mix(gl_FragColor.rgb, uHazeColor, uHaze);",
      );
  };
  material.customProgramCacheKey = () => "gallery-atmosphere";
  return { haze };
}

/** How much of a room's haze remains at a given light: it lifts a little ahead of the sun. */
const hazeAt = (light: number) => Math.pow(1 - Math.min(1, Math.max(0, light)), 1.4);

/**
 * Measures a scan so it can be shown at height 1 with its base at y = 0. Pure apart from assigning
 * the shared material, so React may call it twice (Strict Mode) without moving the scene around;
 * the result is applied through props.
 */
function measure(scene: THREE.Object3D, material: THREE.Material) {
  let mesh: THREE.Mesh | null = null;
  const box = new THREE.Box3();
  const part = new THREE.Box3();
  const toScene = new THREE.Matrix4();
  scene.updateMatrixWorld(true);
  const sceneInverse = scene.matrixWorld.clone().invert();
  scene.traverse((object) => {
    const candidate = object as THREE.Mesh;
    if (!candidate.isMesh) return;
    // Keep the detail baked from the full-resolution scan: its normal and occlusion maps carry the
    // chisel marks, curls and cavities the optimized mesh cannot hold on its own.
    const baked = candidate.material as THREE.MeshStandardMaterial;
    if (baked !== material && material instanceof THREE.MeshStandardMaterial) {
      if (baked?.normalMap) {
        material.normalMap = baked.normalMap;
        material.normalScale.copy(baked.normalScale);
      }
      if (baked?.aoMap) {
        material.aoMap = baked.aoMap;
        material.aoMapIntensity = 1;
      }
      material.needsUpdate = true;
    }
    candidate.material = material;
    candidate.castShadow = true;
    candidate.receiveShadow = true;
    mesh ??= candidate;
    candidate.geometry.computeBoundingBox();
    toScene.multiplyMatrices(sceneInverse, candidate.matrixWorld);
    box.union(part.copy(candidate.geometry.boundingBox!).applyMatrix4(toScene));
  });
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  return {
    mesh: mesh as THREE.Mesh | null,
    offset: [-center.x, -box.min.y, -center.z] as [number, number, number],
    unit: 1 / Math.max(size.y, 1e-6),
  };
}

const unitBox = new THREE.BoxGeometry(1, 1, 1);

const LANDING_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const LANDING_FRAGMENT = /* glsl */ `
  uniform float uStrength;
  varying vec2 vUv;
  void main() {
    float d = length(vec2((vUv.x - 0.5) * 1.1, (1.0 - vUv.y) * 0.9));
    float lit = 1.0 - smoothstep(0.08, 1.0, d);
    vec3 light = mix(vec3(0.8, 0.78, 0.76), vec3(1.0, 0.975, 0.93), lit);
    gl_FragColor = vec4(mix(vec3(1.0), light, uStrength), 1.0);
  }
`;

/** Phones show figures small, so they get the lighter scans and keep GPU memory free. */
const modelPath = (config: FigureConfig) =>
  typeof window !== "undefined" && window.innerWidth < 768 ? config.model.replace("/models/", "/models/lite/") : config.model;

function Figure({ config }: { config: FigureConfig }) {
  const gltf = useGLTF(modelPath(config), false);
  const gl = useThree((s) => s.gl);
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const plinth = useRef<THREE.Mesh>(null);
  const yaw = useRef(config.yaw[0]);

  const marble = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({ color: MARBLE, roughness: 0.68, metalness: 0 });
    return { material, air: atmosphere(material, SKY) };
  }, []);
  const stone = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({ color: STONE, roughness: 0.9, metalness: 0 });
    return { material, air: atmosphere(material, SKY) };
  }, []);
  // The discus thrower's ground is only the shadow he throws on it, so no edge of floor shows in the haze.
  const ground = useMemo(() => new THREE.ShadowMaterial({ color: "#3b2717", opacity: 0, transparent: true }), []);
  const { mesh, offset, unit } = useMemo(() => measure(gltf.scene, marble.material), [gltf.scene, marble]);

  useEffect(() => {
    const material = marble.material;
    const anisotropy = gl.capabilities.getMaxAnisotropy();
    if (material.normalMap) {
      material.normalMap.anisotropy = anisotropy;
      material.normalScale.setScalar(config.relief ?? 1);
    }
    if (material.aoMap) material.aoMap.anisotropy = anisotropy;
    material.needsUpdate = true;
  }, [gl, marble, mesh, config.relief]);

  useEffect(
    () => () => {
      marble.material.dispose();
      stone.material.dispose();
      ground.dispose();
    },
    [marble, stone, ground],
  );

  useFrame((state, dt) => {
    const frame = frames.get(config.id);
    const group = outer.current;
    const turn = inner.current;
    if (!frame || !group || !turn) return;

    const visible = frame.visible;
    group.visible = visible;
    if (!visible) return;

    group.position.set(frame.x, frame.y, 0);
    group.scale.setScalar(frame.s);

    const haze = hazeAt(frame.light);
    marble.air.haze.value = haze;
    stone.air.haze.value = haze;
    ground.opacity = frame.light * 0.12;

    const room = roomState(config.id);
    const base = THREE.MathUtils.lerp(config.yaw[0], config.yaw[1], room.progress);
    const goal = base + pointer.x * 0.08;
    yaw.current = gallery.reducedMotion ? base : THREE.MathUtils.damp(yaw.current, goal, 2.2, dt);
    turn.rotation.y = yaw.current;
    if (Math.abs(yaw.current - goal) > 0.001) state.invalidate();

    if (plinth.current && config.plinth) {
      plinth.current.scale.set(config.plinth.w, frame.plinth, config.plinth.d);
      plinth.current.position.y = -frame.plinth / 2 - 0.002;
    }

  });

  return (
    <group ref={outer} visible={false}>
      {config.floor ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -0.9]} material={ground} receiveShadow>
          <planeGeometry args={[6, 3.4]} />
        </mesh>
      ) : null}
      <group ref={inner}>
        <group scale={unit}>
          <primitive object={gltf.scene} position={offset} />
        </group>
        {config.plinth ? (
          <mesh ref={plinth} geometry={unitBox} material={stone.material} castShadow receiveShadow />
        ) : null}
      </group>
    </group>
  );
}

/** Lets one failed model (a 404, a decoder error) drop out, or fall back, without taking the canvas down. */
class AssetBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}

/** Mounts its children (and fetches their assets) only once the room is within reach of the visitor. */
function WhenNear({ room, eager = false, children }: { room: RoomId; eager?: boolean; children: ReactNode }) {
  const [near, setNear] = useState(eager);
  useFrame(() => {
    if (near) return;
    const state = roomState(room);
    if (state.progress > 0 || state.light > 0) setNear(true);
  });
  useEffect(() => {
    if (near || typeof IntersectionObserver === "undefined") return;
    const el = document.querySelector(`[data-room="${room}"]`);
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && setNear(true),
      { rootMargin: "150% 0px 150% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near, room]);
  if (!near) return null;
  return (
    <AssetBoundary>
      <Suspense fallback={null}>{children}</Suspense>
    </AssetBoundary>
  );
}

// The works room: a colonnade, one Ionic column per project, each under its own light.

interface PillarFrame {
  x: number;
  panelY: number;
  panelW: number;
  panelH: number;
  focus: number;
}

const colonnade = {
  light: 0,
  visible: false,
  stylobateY: 0,
  vw: 1,
  pillars: [] as PillarFrame[],
};

/** A unit-height Doric shaft: 20 flutes meeting at sharp arrises, tapering with a breath of entasis. */
function fluteGeometry(flutes = 20, perFlute = 6) {
  const g = new THREE.CylinderGeometry(1, 1, 1, flutes * perFlute, 24, true);
  const pos = g.getAttribute("position") as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const h = y + 0.5;
    const taper = 1 - 0.16 * h + 0.02 * Math.sin(Math.PI * h);
    const angle = Math.atan2(z, x);
    const phase = ((((angle / (Math.PI * 2)) * flutes) % 1) + 1) % 1;
    const flute = Math.pow(Math.sin(Math.PI * phase), 0.65);
    const r = taper * (1 - 0.06 * flute);
    const len = Math.hypot(x, z) || 1;
    pos.setXYZ(i, (x / len) * r, y, (z / len) * r);
  }
  g.computeVertexNormals();
  return g;
}

/** The echinus: the cushion that spreads from the shaft's neck to carry the square abacus. */
function echinusGeometry() {
  const profile = [
    new THREE.Vector2(0.84, 0),
    new THREE.Vector2(0.9, 0.12),
    new THREE.Vector2(1.02, 0.38),
    new THREE.Vector2(1.15, 0.72),
    new THREE.Vector2(1.22, 1),
  ];
  return new THREE.LatheGeometry(profile, 72);
}

function colonnadeLayout(camera: THREE.PerspectiveCamera) {
  const room = readRoom("works");
  const { vh, vw } = viewSize(camera);
  const mode = colonnadeMode(window.innerWidth, window.innerHeight);
  const progress = pinnedProgress(room.top, room.bottom, room.viewport);
  const shift = stickyShift(room, vh);
  const panel = panelSize(mode, camera.aspect);
  const count = COLONNADE.plates.length;
  const pillars: PillarFrame[] = [];
  for (let i = 0; i < count; i++) {
    const fx = pillarX(i, progress, count, mode);
    pillars.push({
      x: (fx - 0.5) * vw,
      panelY: vh / 2 - (panel.top + panel.height / 2) * vh - shift,
      panelW: panel.width * vw,
      panelH: panel.height * vh,
      focus: 1 - Math.min(1, Math.abs(fx - 0.5) / 0.55),
    });
  }
  colonnade.pillars = pillars;
  colonnade.stylobateY = vh / 2 - STYLOBATE_TOP * vh - shift;
  colonnade.vw = vw;
  return room;
}

/** The colonnade's ceiling lights, one per column, always present so light counts never change. */
function ColonnadeRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const lights = useRef<(THREE.SpotLight | null)[]>([]);
  const targets = useMemo(() => COLONNADE.plates.map(() => new THREE.Object3D()), []);
  const damped = useRef(0);

  useFrame((state, dt) => {
    const room = colonnadeLayout(camera);
    const goal = room.light;
    damped.current = gallery.reducedMotion ? goal : THREE.MathUtils.damp(damped.current, goal, 3.4, dt);
    if (Math.abs(damped.current - goal) > 0.002) state.invalidate();
    colonnade.light = damped.current;
    colonnade.visible = damped.current > 0.004;

    colonnade.pillars.forEach((pillar, i) => {
      const light = lights.current[i];
      if (!light) return;
      const w = pillar.panelW;
      // From the opening in the roof above the visitor: across the panel and down onto the capital.
      light.position.set(pillar.x + w * 0.06, pillar.panelY + pillar.panelH / 2 + w * 1.25, w * 1.05);
      targets[i].position.set(pillar.x, pillar.panelY - pillar.panelH * 0.62, 0);
      targets[i].updateMatrixWorld();
      // The shaft's own light: it lands on the work and the capital, warm as the shaft itself.
      light.intensity = colonnade.light * (1.2 + 1.1 * pillar.focus);
    });
  });

  return (
    <>
      {targets.map((target, i) => (
        <group key={i}>
          <primitive object={target} />
          <spotLight
            ref={(el) => {
              lights.current[i] = el;
            }}
            target={target}
            angle={0.62}
            penumbra={0.8}
            decay={0}
            intensity={0}
            color={SHAFT}
          />
        </group>
      ))}
    </>
  );
}

/** Column lower diameter in panel widths: wide enough for the capital to carry its panel. */
const COLUMN_D = 0.42;
/** Under the portico's roof only some of the sky's light reaches the columns. */
const PORTICO_SKY = 0.3;

/**
 * The detailed Ionic column from the scan workshop: three parts so only the shaft stretches. Each
 * part keeps the file's own (quantization) transform inside a group that the layout moves.
 */
function IonicColumns() {
  const gltf = useGLTF("/models/column-ionic.glb", false);
  const holders = useRef<(THREE.Group | null)[]>([]);

  const kit = useMemo(() => {
    gltf.scene.updateMatrixWorld(true);
    const inverse = gltf.scene.matrixWorld.clone().invert();
    const part = (name: string) => {
      let mesh: THREE.Mesh | null = null;
      gltf.scene.getObjectByName(name)?.traverse((object) => {
        if (!mesh && (object as THREE.Mesh).isMesh) mesh = object as THREE.Mesh;
      });
      if (!mesh) throw new Error(`column part "${name}" is missing`);
      const found = mesh as THREE.Mesh;
      const matrix = new THREE.Matrix4().multiplyMatrices(inverse, found.matrixWorld);
      found.geometry.computeBoundingBox();
      const box = found.geometry.boundingBox!.clone().applyMatrix4(matrix);
      const material = (found.material as THREE.MeshStandardMaterial).clone();
      const air = atmosphere(material, SHADE, PORTICO_SKY);
      return { geometry: found.geometry, material, air, matrix, box, height: box.max.y - box.min.y };
    };
    return [part("base"), part("shaft"), part("capital")] as const;
  }, [gltf.scene]);

  useEffect(() => () => kit.forEach((p) => p.material.dispose()), [kit]);

  useFrame(() => {
    const [base, shaft, capital] = kit;
    const haze = hazeAt(colonnade.light);
    kit.forEach((part) => (part.air.haze.value = haze));
    const stylobate = colonnade.stylobateY;
    colonnade.pillars.forEach((pillar, i) => {
      const d = pillar.panelW * COLUMN_D;
      const panelBottom = pillar.panelY - pillar.panelH / 2;
      const baseTop = stylobate + base.height * d;
      const capitalBottom = panelBottom - capital.height * d;
      const shaftScale = Math.max(0.01, capitalBottom - baseTop) / shaft.height;
      const place = (k: number, part: (typeof kit)[number], bottom: number, sy: number) => {
        const holder = holders.current[i * 3 + k];
        if (!holder) return;
        holder.scale.set(d, sy, d);
        holder.position.set(pillar.x, bottom - part.box.min.y * sy, 0);
      };
      place(0, base, stylobate, d);
      place(1, shaft, baseTop, shaftScale);
      place(2, capital, capitalBottom, d);
    });
  });

  return (
    <>
      {COLONNADE.plates.map((_, i) =>
        kit.map((part, k) => (
          <group
            key={`${i}-${k}`}
            ref={(el) => {
              holders.current[i * 3 + k] = el;
            }}
          >
            <mesh
              geometry={part.geometry}
              material={part.material}
              matrix={part.matrix}
              matrixAutoUpdate={false}
              castShadow
              receiveShadow
            />
          </group>
        )),
      )}
    </>
  );
}

/** The simple Doric fallback, used if the detailed column cannot load. */
function DoricColumns({ marble }: { marble: THREE.Material }) {
  const holders = useRef<(THREE.Group | null)[]>([]);
  const geometry = useMemo(() => ({ shaft: fluteGeometry(), echinus: echinusGeometry() }), []);
  useEffect(
    () => () => {
      geometry.shaft.dispose();
      geometry.echinus.dispose();
    },
    [geometry],
  );

  useFrame(() => {
    const stylobate = colonnade.stylobateY;
    colonnade.pillars.forEach((pillar, i) => {
      const column = holders.current[i];
      if (!column) return;
      const w = pillar.panelW;
      const r = w * 0.2;
      const abacusH = w * 0.055;
      const echinusH = w * 0.07;
      const panelBottom = pillar.panelY - pillar.panelH / 2;
      const capitalBottom = panelBottom - abacusH - echinusH;
      const shaftH = Math.max(0.01, capitalBottom - stylobate);
      column.position.set(pillar.x, 0, 0);
      const [abacus, echinus, shaft] = column.children as THREE.Mesh[];
      abacus.scale.set(r * 2.55, abacusH, r * 2.55);
      abacus.position.set(0, panelBottom - abacusH / 2, 0);
      echinus.scale.set(r, echinusH, r);
      echinus.position.set(0, capitalBottom, 0);
      shaft.scale.set(r, shaftH, r);
      shaft.position.set(0, stylobate + shaftH / 2, 0);
    });
  });

  return (
    <>
      {COLONNADE.plates.map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            holders.current[i] = el;
          }}
        >
          <mesh geometry={unitBox} material={marble} castShadow receiveShadow />
          <mesh geometry={geometry.echinus} material={marble} castShadow receiveShadow />
          <mesh geometry={geometry.shaft} material={marble} castShadow receiveShadow />
        </group>
      ))}
    </>
  );
}

function Colonnade() {
  const textures = useTexture(COLONNADE.plates);
  const group = useRef<THREE.Group>(null);
  const panels = useRef<(THREE.Group | null)[]>([]);
  const steps = useRef<(THREE.Mesh | null)[]>([]);

  const parts = useMemo(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
    });
    const marble = new THREE.MeshStandardMaterial({ color: "#e4dccd", roughness: 0.82 });
    // The screenshots keep their own colours: no tone curve, a little light of their own.
    const plates = textures.map(
      (texture) =>
        new THREE.MeshStandardMaterial({
          map: texture,
          color: "#9e9e9e",
          emissiveMap: texture,
          emissive: "#ffffff",
          emissiveIntensity: 0.5,
          roughness: 0.62,
          toneMapped: false,
        }),
    );
    const air = [marble, ...plates].map((material) => atmosphere(material, SHADE, PORTICO_SKY));
    // Where each shaft falls on its work: the light as it lands, warm at the top edge and falling
    // off down the work and toward its sides into the portico's shade. Multiplied over the screenshot,
    // so it lights it without ever washing it out.
    const pools = plates.map(
      () =>
        new THREE.ShaderMaterial({
          vertexShader: LANDING_VERTEX,
          fragmentShader: LANDING_FRAGMENT,
          uniforms: { uStrength: { value: 0 } },
          transparent: true,
          depthWrite: false,
          blending: THREE.CustomBlending,
          blendEquation: THREE.AddEquation,
          blendSrc: THREE.ZeroFactor,
          blendDst: THREE.SrcColorFactor,
          toneMapped: false,
        }),
    );
    return { marble, plates, pools, air, plane: new THREE.PlaneGeometry(1, 1) };
  }, [textures]);

  useEffect(
    () => () => {
      parts.marble.dispose();
      parts.plates.forEach((m) => m.dispose());
      parts.pools.forEach((m) => m.dispose());
      parts.plane.dispose();
    },
    [parts],
  );

  useFrame(() => {
    if (!group.current) return;
    group.current.visible = colonnade.visible;
    if (!colonnade.visible) return;

    const haze = hazeAt(colonnade.light);
    parts.air.forEach((air) => (air.haze.value = haze));

    colonnade.pillars.forEach((pillar, i) => {
      const panel = panels.current[i];
      if (!panel) return;
      const w = pillar.panelW;
      panel.position.set(pillar.x, 0, 0);
      const [plate, pool] = panel.children as THREE.Mesh[];
      plate.scale.set(w, pillar.panelH, 1);
      plate.position.set(0, pillar.panelY, w * 0.0176 + 0.002);
      pool.scale.set(w, pillar.panelH, 1);
      pool.position.set(0, pillar.panelY, w * 0.0176 + 0.004);
      parts.pools[i].uniforms.uStrength.value = colonnade.light * (0.65 + 0.35 * pillar.focus);
    });

    // The krepidoma: three steps the whole colonnade stands on, stepping down toward the visitor.
    const stylobate = colonnade.stylobateY;
    const vw = colonnade.vw;
    const rise = vw * 0.012;
    steps.current.forEach((step, k) => {
      if (!step) return;
      const depth = vw * (0.24 + k * 0.06);
      step.scale.set(vw * 6, rise, depth);
      step.position.set(0, stylobate - rise * (k + 0.5), depth / 2 - vw * 0.12);
    });
  });

  return (
    <group ref={group} visible={false}>
      {parts.plates.map((plateMaterial, i) => (
        <group
          key={i}
          ref={(el) => {
            panels.current[i] = el;
          }}
        >
          <mesh geometry={parts.plane} material={plateMaterial} />
          <mesh geometry={parts.plane} material={parts.pools[i]} renderOrder={1} />
        </group>
      ))}
      <AssetBoundary fallback={<DoricColumns marble={parts.marble} />}>
        <Suspense fallback={null}>
          <IonicColumns />
        </Suspense>
      </AssetBoundary>
      {[0, 1, 2].map((k) => (
        <mesh
          key={k}
          ref={(el) => {
            steps.current[k] = el;
          }}
          geometry={unitBox}
          material={parts.marble}
          receiveShadow
        />
      ))}
      {COLONNADE.plates.map((_, i) => (
        <PillarBeam key={i} index={i} />
      ))}
    </group>
  );
}

/** Each column's own shaft of light, falling on its panel from above the view. */
function PillarBeam({ index }: { index: number }) {
  const holder = useRef<THREE.Group>(null);
  const edge = useMemo(() => new THREE.Vector3(), []);
  const reach = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const pillar = colonnade.pillars[index];
    if (!holder.current || !pillar) return;
    holder.current.position.set(pillar.x, pillar.panelY + pillar.panelH / 2, 0);
    holder.current.scale.setScalar(pillar.panelW);
  });
  return (
    <group ref={holder}>
      <Beam
        apex={[0.06, 1.9, 0.9]}
        base={[0, -0.4, 0.04]}
        radius={0.7}
        dust={80}
        color={SHAFT}
        strength={() => {
          const pillar = colonnade.pillars[index];
          return pillar ? colonnade.light * (0.38 + 0.42 * pillar.focus) : 0;
        }}
        landing={() => {
          const pillar = colonnade.pillars[index];
          if (!pillar) return null;
          // It meets the work at its top edge and has faded away a little under halfway down it.
          const top = pillar.panelY + pillar.panelH / 2;
          return { top: edge.set(pillar.x, top, 0), reach: reach.set(pillar.x, top - pillar.panelH * 0.45, 0) };
        }}
      />
    </group>
  );
}

class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    document.documentElement.classList.add("no-webgl");
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function GalleryCanvas() {
  // Rendered on the client only (dynamic import with ssr: false), so the check can run during render.
  const [webgl] = useState(supportsWebGL);

  useEffect(() => {
    if (!webgl) document.documentElement.classList.add("no-webgl");
  }, [webgl]);

  if (!webgl) return null;

  const small = window.innerWidth < 768;

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <CanvasBoundary>
        <Canvas
          frameloop="demand"
          dpr={small ? [1, 1.5] : [1, 1.75]}
          shadows={small ? false : "percentage"}
          camera={{ fov: 30, position: [0, 0, CAMERA_Z], near: 0.1, far: 60 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            // A neutral curve keeps sunlit marble from flattening into white; the haze is mixed in after
            // it, so a figure out of the sun is exactly the page's colour.
            gl.toneMapping = THREE.NeutralToneMapping;
            gl.domElement.addEventListener("webglcontextlost", () => {
              document.documentElement.classList.add("no-webgl");
            });
          }}
        >
          <LightRig />
          <ColonnadeRig />
          {FIGURES.map((config) => (
            <WhenNear key={config.id} room={config.id}>
              <Figure config={config} />
            </WhenNear>
          ))}
          <WhenNear room="works">
            <Colonnade />
          </WhenNear>
        </Canvas>
      </CanvasBoundary>
    </div>
  );
}
