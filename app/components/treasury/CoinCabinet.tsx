"use client";

import { Component, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { roomState } from "@/app/lib/gallery";
import { COINS, METALS, type Coin } from "./coins";
import { edgeMaterial, faceTextures, flan, hash, seeded, strike, type Struck } from "./mint";

/** Coins already struck on this visit, so walking back into the treasury never strikes them twice. */
const struck = new Map<string, Struck>();

/** How high the lamp hangs over the tray, in CSS pixels: lower on a phone, where the tray is narrow. */
const LAMP_HEIGHT = { desktop: 320, phone: 230 };

interface Piece {
  coin: Coin;
  /** The coin's well in the tray, and the item it belongs to (coin, name and works). */
  well: HTMLElement;
  item: HTMLElement;
  mesh: THREE.Mesh | null;
  shadow: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  /** Centre and radius in CSS pixels from the vitrine's top left. */
  x: number;
  y: number;
  r: number;
  lift: number;
  tiltX: number;
  tiltY: number;
  /** As it was laid in its well by hand: never quite straight. */
  rest: number;
}

/** Texture side for a coin of radius `r`: a little sharper than the screen, so a lifted coin stays crisp. */
const textureSize = (r: number, dpr: number) => Math.min(512, Math.max(192, Math.ceil((2 * r * dpr * 1.25) / 32) * 32));

/**
 * What the metal sees around it: the case's dark interior, the lamp over the glass a little toward the
 * visitor, the lit room behind them that the flat of each coin mirrors, and a cool window far to one side.
 */
function vitrineEnvironment(renderer: THREE.WebGLRenderer) {
  const scene = new THREE.Scene();
  const panel = (color: string, intensity: number, w: number, h: number, at: [number, number, number]) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }),
    );
    mesh.position.set(...at);
    mesh.lookAt(0, 0, 0);
    scene.add(mesh);
  };
  scene.add(
    new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.MeshBasicMaterial({ color: "#1b110b", side: THREE.BackSide })),
  );
  panel("#ffdcae", 7, 7, 2.4, [0, 6, 3]);
  panel("#c8bfb4", 1.3, 18, 10, [0, 0.5, 9]);
  panel("#cfd8e0", 1.6, 2, 4, [-8, 2, 1]);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(scene, 0.03);
  pmrem.dispose();
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      (object.material as THREE.Material).dispose();
    }
  });
  return target;
}

/** A soft round shadow, dark at the middle and gone at the rim. */
function shadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const g = canvas.getContext("2d")!;
  const gradient = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(0,0,0,1)");
  gradient.addColorStop(0.62, "rgba(0,0,0,0.85)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gradient;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

/**
 * The vitrine's coins, lamp and shadows, run outside React: the component only mounts it, hands it
 * each frame and disposes of it.
 */
class Vitrine {
  private readonly root = new THREE.Group();
  private readonly lamp = new THREE.PointLight("#ffe4bf", 0, 0, 1);
  private readonly pieces: Piece[] = [];
  private readonly owned: { dispose(): void }[] = [];
  private readonly resize: ResizeObserver;
  private readonly at = { x: 0, y: 0, placed: false };
  private readonly pointer = { x: 0, y: 0, active: false };
  private readonly environment: THREE.WebGLRenderTarget;
  private cancelled = false;
  private timer = 0;

  constructor(
    gl: THREE.WebGLRenderer,
    private readonly scene: THREE.Scene,
    private readonly vitrine: HTMLElement,
    private readonly reduced: boolean,
    private readonly invalidate: () => void,
  ) {
    this.environment = vitrineEnvironment(gl);
    const top = new THREE.DirectionalLight("#fff0dc", 0.55);
    top.position.set(0.25, 1, 0.7);
    this.root.add(this.lamp, top);
    scene.add(this.root);

    const shade = shadowTexture();
    const plane = new THREE.PlaneGeometry(2, 2);
    this.owned.push(shade, plane);
    for (const well of vitrine.querySelectorAll<HTMLElement>("[data-coin]")) {
      const coin = COINS.find((c) => c.id === well.dataset.coin);
      if (!coin) continue;
      const material = new THREE.MeshBasicMaterial({ map: shade, color: 0x000000, transparent: true, depthWrite: false, opacity: 0 });
      this.owned.push(material);
      const shadow = new THREE.Mesh(plane, material);
      shadow.renderOrder = -1;
      this.root.add(shadow);
      const random = seeded(hash(coin.id) ^ 0x51ed27);
      this.pieces.push({
        coin,
        well,
        item: well.closest<HTMLElement>("[data-coin-item]") ?? well,
        mesh: null,
        shadow,
        x: 0,
        y: 0,
        r: 0,
        lift: 0,
        tiltX: 0,
        tiltY: 0,
        rest: (random() - 0.5) * 0.14,
      });
    }

    this.measure();
    this.resize = new ResizeObserver(this.measure);
    this.resize.observe(vitrine);
    this.pieces.forEach((piece) => this.resize.observe(piece.item));
    window.addEventListener("pointermove", this.onMove, { passive: true });
    window.addEventListener("pointerout", this.onOut);
    window.addEventListener("scroll", this.invalidate, { passive: true });
    vitrine.addEventListener("focusin", this.invalidate);
    vitrine.addEventListener("focusout", this.invalidate);

    // The legend is cut in the page's own Cormorant, so striking waits for the face to arrive.
    const font = getComputedStyle(document.documentElement).getPropertyValue("--font-cormorant").trim() || "serif";
    const queue = [...this.pieces];
    document.fonts
      .load(`600 32px ${font}`)
      .catch(() => undefined)
      .then(() => {
        if (this.cancelled) return;
        this.measure();
        this.strike(queue, font, gl.getPixelRatio());
      });
  }

  /** Strikes the coins a few at a time, so the page never stalls while the tray fills. */
  private strike(queue: Piece[], font: string, dpr: number) {
    if (this.cancelled) return;
    const started = performance.now();
    const laid: HTMLElement[] = [];
    while (queue.length && performance.now() - started < 8) {
      const piece = queue.shift()!;
      const metal = METALS[piece.coin.category];
      const size = textureSize(piece.r, dpr);
      const key = `${piece.coin.id}:${size}`;
      let coin = struck.get(key);
      if (!coin) {
        coin = strike(piece.coin, metal, font, size);
        struck.set(key, coin);
      }
      const maps = faceTextures(coin);
      const face = new THREE.MeshStandardMaterial({
        map: maps.color,
        normalMap: maps.normal,
        roughnessMap: maps.roughness,
        metalness: 1,
        roughness: 1,
        envMap: this.environment.texture,
      });
      const edge = edgeMaterial(metal);
      edge.envMap = this.environment.texture;
      const geometry = flan(piece.coin);
      this.owned.push(maps.color, maps.normal, maps.roughness, face, edge, geometry);
      piece.mesh = new THREE.Mesh(geometry, [face, edge]);
      this.root.add(piece.mesh);
      laid.push(piece.well);
    }
    this.invalidate();
    // Once the struck coins have been drawn, the flat ones beneath them step aside.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (!this.cancelled) laid.forEach((well) => well.setAttribute("data-struck", ""));
      }),
    );
    if (queue.length) this.timer = window.setTimeout(() => this.strike(queue, font, dpr), 16);
  }

  private measure = () => {
    const box = this.vitrine.getBoundingClientRect();
    for (const piece of this.pieces) {
      const rect = piece.well.getBoundingClientRect();
      piece.x = rect.left + rect.width / 2 - box.left;
      piece.y = rect.top + rect.height / 2 - box.top;
      piece.r = rect.width / 2;
    }
    this.invalidate();
  };

  private onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
    this.pointer.active = true;
    this.invalidate();
  };

  private onOut = (event: PointerEvent) => {
    if (event.relatedTarget) return;
    this.pointer.active = false;
    this.invalidate();
  };

  /** Moves the lamp and the coins one step; true while anything is still settling. */
  frame(width: number, height: number, delta: number) {
    const dt = Math.min(0.05, delta);
    const box = this.vitrine.getBoundingClientRect();
    const hang = window.innerWidth < 768 ? LAMP_HEIGHT.phone : LAMP_HEIGHT.desktop;
    const { pointer, at, reduced } = this;

    // The lamp: held over the tray by the visitor's pointer, or hanging from the room's ceiling so the
    // coins pass under it as the visitor walks by. Kept still where motion is unwelcome.
    let tx: number;
    let ty: number;
    if (reduced) {
      tx = width * 0.3;
      ty = height * 0.2;
    } else if (pointer.active) {
      tx = pointer.x - box.left;
      ty = pointer.y - box.top;
    } else {
      tx = window.innerWidth * 0.5 - box.left;
      ty = window.innerHeight * 0.3 - box.top;
    }
    if (!at.placed || reduced) {
      at.x = tx;
      at.y = ty;
      at.placed = true;
    } else {
      at.x = THREE.MathUtils.damp(at.x, tx, 6, dt);
      at.y = THREE.MathUtils.damp(at.y, ty, 6, dt);
    }
    let moving = Math.abs(at.x - tx) > 0.5 || Math.abs(at.y - ty) > 0.5;
    const roomLight = roomState("treasury").light;
    const lx = at.x - width / 2;
    const ly = height / 2 - at.y;
    this.lamp.position.set(lx, ly, hang);
    this.lamp.intensity = hang * 2.6 * (0.2 + 0.8 * roomLight);

    const px = pointer.x - box.left;
    const py = pointer.y - box.top;
    for (const piece of this.pieces) {
      const dx = px - piece.x;
      const dy = py - piece.y;
      const over = !reduced && pointer.active && dx * dx + dy * dy < (piece.r * 1.08) ** 2;
      const focused = !reduced && piece.item.matches(":focus-within");
      // Picked up toward the visitor and turned to the lamp in their hand.
      const goal = over || focused ? 1 : 0;
      const tiltX = over ? THREE.MathUtils.clamp(dy / piece.r, -1, 1) * 0.3 : 0;
      const tiltY = over ? THREE.MathUtils.clamp(dx / piece.r, -1, 1) * 0.3 : 0;
      piece.lift = reduced ? 0 : THREE.MathUtils.damp(piece.lift, goal, 9, dt);
      piece.tiltX = reduced ? 0 : THREE.MathUtils.damp(piece.tiltX, tiltX, 9, dt);
      piece.tiltY = reduced ? 0 : THREE.MathUtils.damp(piece.tiltY, tiltY, 9, dt);
      if (Math.abs(piece.lift - goal) > 0.002 || Math.abs(piece.tiltX - tiltX) > 0.002 || Math.abs(piece.tiltY - tiltY) > 0.002) {
        moving = true;
      }

      const wx = piece.x - width / 2;
      const wy = height / 2 - piece.y;
      const z = 6 + piece.lift * 24;
      if (piece.mesh) {
        piece.mesh.position.set(wx, wy, z);
        piece.mesh.scale.setScalar(piece.r * (1 + 0.07 * piece.lift));
        piece.mesh.rotation.set(piece.tiltX, piece.tiltY, piece.rest);
      }
      // Its shadow falls away from the lamp, wider and softer the higher the coin is lifted.
      const reach = z / Math.max(40, hang - z);
      piece.shadow.position.set(wx + (wx - lx) * reach, wy + (wy - ly) * reach, 0);
      piece.shadow.scale.setScalar(piece.r * (1.04 + 0.22 * piece.lift));
      piece.shadow.material.opacity = piece.mesh ? (0.6 - 0.22 * piece.lift) * (0.4 + 0.6 * roomLight) : 0;
    }
    return moving;
  }

  dispose() {
    this.cancelled = true;
    window.clearTimeout(this.timer);
    this.resize.disconnect();
    window.removeEventListener("pointermove", this.onMove);
    window.removeEventListener("pointerout", this.onOut);
    window.removeEventListener("scroll", this.invalidate);
    this.vitrine.removeEventListener("focusin", this.invalidate);
    this.vitrine.removeEventListener("focusout", this.invalidate);
    this.pieces.forEach((piece) => piece.well.removeAttribute("data-struck"));
    this.scene.remove(this.root);
    this.owned.forEach((resource) => resource.dispose());
    this.environment.dispose();
  }
}

function Cabinet({ vitrine, reduced }: { vitrine: HTMLElement; reduced: boolean }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);
  const engine = useRef<Vitrine | null>(null);

  useEffect(() => {
    const next = new Vitrine(gl, scene, vitrine, reduced, () => invalidate());
    engine.current = next;
    return () => {
      next.dispose();
      engine.current = null;
    };
  }, [gl, scene, vitrine, reduced, invalidate]);

  useFrame((state, delta) => {
    if (engine.current?.frame(state.size.width, state.size.height, delta)) state.invalidate();
  });

  return null;
}

let webgl2: boolean | undefined;

/** Whether this browser can draw the coins at all: asked once, with a context thrown away at once. */
function canStrike() {
  if (webgl2 === undefined) {
    try {
      const probe = document.createElement("canvas").getContext("webgl2");
      webgl2 = Boolean(probe);
      probe?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webgl2 = false;
    }
  }
  return webgl2 && !document.documentElement.classList.contains("no-webgl");
}

class Boundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The treasury's coins in metal, drawn over their wells in the tray. The canvas exists only while the
 * vitrine is near; until it has struck a coin, and wherever WebGL is missing, the flat coin in the
 * well stands in for it.
 */
export default function CoinCabinet({ vitrine, reduced }: { vitrine: RefObject<HTMLElement | null>; reduced: boolean }) {
  const [near, setNear] = useState<HTMLElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = vitrine.current;
    if (!element || !canStrike()) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting ? (entry.target as HTMLElement) : null),
      { rootMargin: "60% 0px 60% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [vitrine]);

  if (!near || failed) return null;
  const small = window.innerWidth < 768;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <Boundary onFail={() => setFailed(true)}>
        <Canvas
          orthographic
          frameloop="demand"
          dpr={small ? [1, 1.5] : [1, 1.75]}
          camera={{ position: [0, 0, 800], zoom: 1, near: 1, far: 2000 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ pointerEvents: "none" }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.toneMapping = THREE.NeutralToneMapping;
            gl.domElement.addEventListener("webglcontextlost", () => setFailed(true));
          }}
        >
          <Cabinet vitrine={near} reduced={reduced} />
        </Canvas>
      </Boundary>
    </div>
  );
}
