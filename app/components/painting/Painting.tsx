"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import { gallery } from "@/app/lib/gallery";
import type { Artwork } from "./artworks";
import type { Bird } from "./birds";
import { PaintingRenderer, type LayerMotion, type PaintingView, type Plume } from "./painting-renderer";

/** The margin the camera keeps around the screen so the parallax never runs out of painting. */
const OVERSCAN = 1.06;
/**
 * How much of that margin a pull-back may spend. Between two distant details the camera pulls back,
 * and on tall screens, where it holds them less close, that would pass the whole painting and stretch
 * its edge across the screen; instead it eases to a stop just short of it, the parallax still in reserve.
 */
const PULLBACK = 0.03;
/** The page's ground, #ebe5dd, as sRGB 0..1: the haze a painting dissolves into. */
const GROUND: [number, number, number] = [235 / 255, 229 / 255, 221 / 255];
/** Phones decode at most this much painting; the GPU memory goes to the rest of the gallery. */
const PHONE_TEXTURE = 2560;

/** Where the camera stands at one moment of a room's scroll. Points are 0..1 from the top left. */
export interface Shot {
  /** A point of the painting, held at a point of the screen. */
  center: [number, number];
  anchor: [number, number];
  /** 1: the painting covers the screen; more moves in on a detail. */
  zoom: number;
  /** 0..1: a push into the scene toward a point of the painting, near things growing fastest. */
  dolly?: number;
  dollyToward?: [number, number];
  /** 0 clear, 1 dissolved into the page's ground. */
  haze?: number;
  /** 0..1: the rest of the painting falls into shade around the anchor. */
  spot?: number;
  /** 0..1: mist drifting through the distance. */
  mist?: number;
  /** Smoke and vapour rising from points of the painting. */
  plumes?: Plume[];
  /** 0..1: the water marked in the depth map moves and glints. */
  water?: number;
  /** Gulls in flight over the painting. */
  birds?: Bird[];
  /** Where the light rests on screen while no pointer moves it. */
  light: [number, number];
  /** An animated painting's figures, in layer order; a storm, its lightning and the camera's shudder. */
  layers?: LayerMotion[];
  storm?: number;
  flash?: number;
  bolt?: PaintingView["bolt"];
  shake?: [number, number];
}

/** The camera for a moment of the room's scroll; `time` (seconds) runs only while motion is allowed. */
export type Direction = (progress: number, width: number, height: number, time: number) => Shot;

export interface PaintingFrame {
  /** Smoothed camera offset, -1..1. */
  look: [number, number];
  /** The light's position in CSS pixels from the top left of the viewport. */
  sun: [number, number];
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** A shot's zoom, eased so the painting always covers the screen (see PULLBACK). */
const covering = (zoom: number) => (zoom >= 1 ? zoom : 1 - PULLBACK + PULLBACK * Math.exp((zoom - 1) / PULLBACK));

/** The camera's window on the painting for a shot: the visible span and its top left, 0..1 of the painting. */
function windowOf(shot: Shot, viewAspect: number, imageAspect: number) {
  const cover = viewAspect > imageAspect ? [1, imageAspect / viewAspect] : [viewAspect / imageAspect, 1];
  const span = [cover[0] / (OVERSCAN * shot.zoom), cover[1] / (OVERSCAN * shot.zoom)];
  const origin = [
    clamp(shot.center[0] - shot.anchor[0] * span[0], 0, 1 - span[0]),
    clamp(shot.center[1] - shot.anchor[1] * span[1], 0, 1 - span[1]),
  ];
  return { span, origin };
}

/** Where a point of the painting lands on screen for a shot (0..1 from the top left). */
export function onScreen(point: [number, number], shot: Shot, viewAspect: number, imageAspect: number) {
  const { span, origin } = windowOf(shot, viewAspect, imageAspect);
  return [(point[0] - origin[0]) / span[0], (point[1] - origin[1]) / span[1]] as [number, number];
}

const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

function loaded(image: HTMLImageElement) {
  if (image.complete && image.naturalWidth) return image.decode().catch(() => undefined);
  return new Promise<void>((resolve, reject) => {
    image.addEventListener("load", () => resolve(), { once: true });
    image.addEventListener("error", () => reject(new Error("painting failed to load")), { once: true });
  });
}

/**
 * A painting filling its room. The image is there from the first paint and follows the camera on its
 * own; where WebGL2 runs, a canvas takes over with the same framing and gives the painting depth,
 * light and haze. The canvas exists only while the room is near, so several paintings never hold
 * GPU memory at once.
 */
export default function Painting({
  art,
  progress,
  reduced,
  direct,
  onFrame,
  priority = false,
  zoomMax = 1,
}: {
  art: Artwork;
  progress: MotionValue<number>;
  reduced: boolean;
  direct: Direction;
  onFrame?: (frame: PaintingFrame) => void;
  /** The first room's painting is the page's largest paint: fetch it first. */
  priority?: boolean;
  /** The closest the camera comes, so the browser picks a file sharp enough for it. */
  zoomMax?: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const directRef = useRef(direct);
  const frameRef = useRef(onFrame);

  useEffect(() => {
    directRef.current = direct;
    frameRef.current = onFrame;
  }, [direct, onFrame]);

  useEffect(() => {
    const container = box.current;
    const image = img.current;
    if (!container || !image) return;

    let renderer: PaintingRenderer | null = null;
    let surface: HTMLCanvasElement | null = null;
    let textures: {
      color: HTMLImageElement | HTMLCanvasElement;
      depth: HTMLImageElement;
      layers: (HTMLImageElement | HTMLCanvasElement)[];
    } | null = null;
    let raf = 0;
    let near = false;
    let disposed = false;
    let last = performance.now();
    const start = last;
    const look: [number, number] = [0, 0];
    const sun: [number, number] = [0.4, 0.3];
    let sunPlaced = false;

    const size = () => {
      const rect = container.getBoundingClientRect();
      return { width: Math.max(1, rect.width), height: Math.max(1, rect.height) };
    };

    // The plain image placed exactly where the canvas would draw it, for any shot.
    const placeImage = (shot: Shot, width: number, height: number) => {
      const { span, origin } = windowOf(shot, width / height, art.aspect);
      const w = width / span[0];
      const h = height / span[1];
      image.style.width = `${w}px`;
      image.style.height = `${h}px`;
      image.style.transform = `translate3d(${-origin[0] * w}px, ${-origin[1] * h}px, 0)`;
    };

    const draw = (now: number) => {
      raf = 0;
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - start) / 1000;
      const { width, height } = size();
      const directed = directRef.current(progress.get(), width, height, reduced ? 0 : t);
      const shot = directed.zoom < 1 ? { ...directed, zoom: covering(directed.zoom) } : directed;
      placeImage(shot, width, height);
      // Once the haze is complete the painting gives way entirely, so whatever stands behind it in the
      // gallery canvas (the next room's figure) is never cut by its edge. Without WebGL the image
      // simply fades into the ground.
      const haze = reduced ? 0 : (shot.haze ?? 0);
      const clearing = renderer ? Math.min(1, Math.max(0, (haze - 0.9) / 0.1)) : haze;
      container.style.opacity = (1 - clearing).toFixed(3);
      // The navbar reads how much of the painting still shows to pick its lettering's tone.
      gallery.paintings.set(container, renderer ? haze : 0);

      if (renderer && surface) {
        const pointer = gallery.pointer;
        const still = reduced;
        const targetLook: [number, number] = still
          ? [0, 0]
          : pointer.active
            ? [pointer.x, pointer.y]
            : [Math.sin(t * 0.21) * 0.55, Math.sin(t * 0.13 + 1) * 0.3];
        const targetSun: [number, number] =
          !still && pointer.active
            ? [pointer.x * 0.5 + 0.5, 0.5 - pointer.y * 0.5]
            : [shot.light[0] + (still ? 0 : Math.sin(t * 0.09) * 0.1), shot.light[1] + (still ? 0 : Math.sin(t * 0.07 + 2) * 0.04)];
        if (!sunPlaced || still) {
          sun[0] = targetSun[0];
          sun[1] = targetSun[1];
          sunPlaced = true;
        }
        look[0] = still ? 0 : damp(look[0], targetLook[0], 2.2, dt);
        look[1] = still ? 0 : damp(look[1], targetLook[1], 2.2, dt);
        sun[0] = damp(sun[0], targetSun[0], 3, dt);
        sun[1] = damp(sun[1], targetSun[1], 3, dt);

        const view: PaintingView = {
          center: shot.center,
          anchor: shot.anchor,
          zoom: shot.zoom,
          look: shot.shake && !still ? [look[0] + shot.shake[0], look[1] + shot.shake[1]] : look,
          dolly: still ? 0 : (shot.dolly ?? 0),
          dollyTarget: shot.dollyToward ? onScreen(shot.dollyToward, shot, width / height, art.aspect) : [0.5, 0.5],
          haze: still ? 0 : (shot.haze ?? 0),
          sun,
          sunStrength: still ? 0.4 : pointer.active ? 1 : 0.7,
          spot: shot.spot ?? 0,
          mist: still ? 0 : (shot.mist ?? 0),
          plumes: still ? [] : shot.plumes,
          water: still ? 0 : shot.water,
          birds: still ? [] : shot.birds,
          time: still ? 0 : t,
          layers: shot.layers,
          storm: still ? 0 : shot.storm,
          flash: still ? 0 : shot.flash,
          bolt: still ? null : shot.bolt,
        };
        const rect = surface.getBoundingClientRect();
        renderer.resize(rect.width, rect.height, Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.render(view);
        frameRef.current?.({ look, sun: [rect.left + sun[0] * rect.width, rect.top + sun[1] * rect.height] });
      }

      // Keep drawing while the room is near: the mist, the drifting light and the damped pointer move.
      if (!reduced && near) raf = requestAnimationFrame(draw);
    };

    const kick = () => {
      if (!raf && !disposed) raf = requestAnimationFrame(draw);
    };

    const fetchImage = async (src: string) => {
      const next = new Image();
      next.src = src;
      await next.decode();
      return next;
    };

    /** Scales an image down to a width limit through a 2D canvas, so the GPU never holds more than it needs. */
    const fit = (source: HTMLImageElement, limit: number): HTMLImageElement | HTMLCanvasElement => {
      if (source.naturalWidth <= limit) return source;
      const scaled = document.createElement("canvas");
      scaled.width = limit;
      scaled.height = Math.round((limit * source.naturalHeight) / source.naturalWidth);
      const ctx = scaled.getContext("2d");
      if (!ctx) return source;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(source, 0, 0, scaled.width, scaled.height);
      return scaled;
    };

    const loadTextures = async () => {
      if (textures) return textures;
      const phone = window.innerWidth < 768;
      const limit = phone ? PHONE_TEXTURE : 4096;
      if (art.plate && art.layers) {
        // An animated painting draws its figures over the painting without them.
        // As sharp as the screen asks for once the camera comes close, and no sharper.
        const need = Math.min(4096, window.innerWidth * Math.min(window.devicePixelRatio || 1, 1.75) * OVERSCAN * zoomMax);
        const width = art.plate.find((w) => w >= need) ?? art.plate[art.plate.length - 1];
        const [plate, depth, ...figures] = await Promise.all([
          fetchImage(`/paintings/${art.slug}-plate-${width}.webp`),
          fetchImage(`/paintings/${art.slug}-${art.sharedDepth ? "depth" : "plate-depth"}.webp`),
          ...art.layers.map((layer) => fetchImage(`/paintings/${art.slug}-layer-${layer.name}.webp`)),
        ]);
        const share = phone ? 0.6 : 1;
        textures = {
          color: fit(plate, limit),
          depth,
          layers: figures.map((figure) => fit(figure, Math.round(figure.naturalWidth * share))),
        };
        return textures;
      }
      await loaded(image);
      const depth = await fetchImage(`/paintings/${art.slug}-depth.webp`);
      textures = { color: fit(image, limit), depth, layers: [] };
      return textures;
    };

    const wake = async () => {
      if (renderer || typeof window.WebGL2RenderingContext === "undefined") return;
      try {
        const { color, depth, layers } = await loadTextures();
        if (disposed || !near || renderer) return;
        const canvas = document.createElement("canvas");
        canvas.className = "absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700";
        canvas.setAttribute("aria-hidden", "true");
        canvas.addEventListener("webglcontextlost", (event) => {
          event.preventDefault();
          sleep();
        });
        const next = new PaintingRenderer(canvas, GROUND);
        next.setImages(color, depth);
        if (art.layers && layers.length) next.setLayers(layers, art.layers);
        container.appendChild(canvas);
        renderer = next;
        surface = canvas;
        draw(performance.now());
        requestAnimationFrame(() => canvas.classList.replace("opacity-0", "opacity-100"));
      } catch {
        // The plain image stays.
      }
    };

    const sleep = () => {
      renderer?.dispose();
      surface?.remove();
      renderer = null;
      surface = null;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) {
          void wake();
          kick();
        } else {
          sleep();
        }
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    observer.observe(container);
    const unsubscribe = progress.on("change", kick);
    window.addEventListener("pointermove", kick, { passive: true });
    window.addEventListener("resize", kick);
    draw(performance.now());

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      unsubscribe();
      window.removeEventListener("pointermove", kick);
      window.removeEventListener("resize", kick);
      sleep();
    };
  }, [art, progress, reduced, zoomMax]);

  const srcSet = art.widths.map((w) => `/paintings/${art.slug}-${w}.webp ${w}w`).join(", ");
  // Phones never draw more than PHONE_TEXTURE pixels of a painting, so they never fetch a larger file.
  const phoneSrcSet = art.widths
    .filter((w) => w <= PHONE_TEXTURE)
    .map((w) => `/paintings/${art.slug}-${w}.webp ${w}w`)
    .join(", ");
  // Cover fits by height on screens narrower than the painting; the camera adds its margin and zoom.
  const scale = OVERSCAN * zoomMax;
  const sizes = `(max-aspect-ratio: ${Math.round(art.aspect * 1000)}/1000) ${Math.ceil(art.aspect * 100 * scale)}vh, ${Math.ceil(100 * scale)}vw`;

  return (
    <div ref={box} aria-hidden="true" data-painting className="absolute inset-0 overflow-hidden" style={{ background: art.tone }}>
      <picture>
        <source media="(max-width: 767.98px)" srcSet={phoneSrcSet} sizes={sizes} />
        {/* The canvas reads this exact file as its texture. */}
        <img
          ref={img}
          src={`/paintings/${art.slug}-${art.widths[1]}.webp`}
          srcSet={srcSet}
          sizes={sizes}
          alt=""
          fetchPriority={priority ? "high" : "auto"}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute left-0 top-0 h-full w-full max-w-none origin-top-left object-cover"
        />
      </picture>
    </div>
  );
}
