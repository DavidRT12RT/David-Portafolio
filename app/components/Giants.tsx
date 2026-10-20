"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useLanguage } from "@/app/context/LanguageContext";
import { ScrollStage } from "@/components/ui/ScrollStage";
import { CinematicText } from "@/components/ui/CinematicText";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import Painting, { type Direction, type Shot } from "./painting/Painting";
import { ARTWORKS } from "./painting/artworks";
import type { LayerMotion } from "./painting/painting-renderer";
import { goToWork } from "./gallery/colonnade-layout";
import RoomSign from "./RoomSign";
import { ArrowIcon } from "./icons";

const ART = ARTWORKS.giants;
const EASE = [0.16, 1, 0.3, 1] as const;

const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const mix = (a: [number, number], b: [number, number], t: number) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)] as [number, number];
const logLerp = (a: number, b: number, t: number) => Math.exp(lerp(Math.log(a), Math.log(b), t));

/** A small seeded generator (mulberry32), so each strike draws the same bolt every frame it lasts. */
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

// Layer order, as in the artwork: the falling pair, the screaming giant, the giant holding his head,
// the lifter, the crushed giant, Atlas under his rock and the giant diving headfirst.
const FALLERS = 0;
const SCREAMER = 1;
const LIFTER = 3;
const CRUSHED = 4;
const ATLAS = 5;

/** Where the thunderbolts land (points of the painting, from the top left), and which giant they shake. */
const TARGETS: { at: [number, number]; from: number; layer: number }[] = [
  { at: [0.1, 0.2], from: 0.3, layer: LIFTER },
  { at: [0.62, 0.07], from: 0.36, layer: ATLAS },
  { at: [0.36, 0.3], from: 0.27, layer: FALLERS },
  { at: [0.9, 0.12], from: 0.7, layer: SCREAMER },
  { at: [0.78, 0.68], from: 0.84, layer: CRUSHED },
];

type Side = "left" | "right";

/**
 * The whole battle under the room's sign, then one stop per part of the story: the giants falling
 * from the sky, the lifter, Atlas under the mountain, the crushed giant's face, and the whole again.
 * Each stop's text stands on `side`, the detail on the other; `target` is the bolt that falls as the
 * camera arrives.
 */
const STOPS: { center: [number, number]; zoom: number; tall: number; side: Side; spot: number; target: number }[] = [
  { center: [0.5, 0.5], zoom: 1.02, tall: 1, side: "left", spot: 0, target: 2 },
  { center: [0.34, 0.25], zoom: 1.5, tall: 1.05, side: "right", spot: 0.35, target: 2 },
  { center: [0.13, 0.36], zoom: 1.75, tall: 1.15, side: "right", spot: 0.4, target: 0 },
  { center: [0.6, 0.36], zoom: 1.35, tall: 1.05, side: "left", spot: 0.35, target: 1 },
  { center: [0.86, 0.82], zoom: 2.1, tall: 1.4, side: "left", spot: 0.45, target: 4 },
  { center: [0.5, 0.5], zoom: 1.03, tall: 1, side: "left", spot: 0, target: 3 },
];
/** Share of each stop's stretch of scroll the camera holds before it travels on. */
const HOLD = 0.55;

function shot(i: number, wide: boolean): Shot {
  const stop = STOPS[i];
  const whole = stop.zoom < 1.1;
  // Wide screens hold the detail on the side away from the text; tall ones hold it high, above it.
  const anchor: [number, number] = whole ? [0.5, 0.5] : wide ? (stop.side === "left" ? [0.66, 0.46] : [0.34, 0.46]) : [0.5, 0.34];
  return { center: stop.center, anchor, zoom: wide ? stop.zoom : stop.tall, spot: stop.spot, light: [0.3, 0.12] };
}

/** Where the scroll stands: the stop, and how far through its stretch (0..1). */
function place(p: number) {
  const at = Math.min(STOPS.length, Math.max(0, p * STOPS.length));
  const index = Math.min(STOPS.length - 1, Math.floor(at));
  return { index, local: at - index };
}

interface Strike {
  start: number;
  target: number;
  seed: number;
}

/** Each stop brings down a bolt of its own as the camera arrives; the rest fall on a slow beat. */
const storm = { last: -1, forced: null as Strike | null };
const PERIOD = 4.6;

function strikeAt(time: number, p: number): Strike | null {
  for (let i = 1; i < STOPS.length; i++) {
    const at = i / STOPS.length;
    if (storm.last >= 0 && (storm.last < at) !== (p < at)) {
      storm.forced = { start: time, target: STOPS[i].target, seed: 97 + i * 13 + Math.floor(time) };
    }
  }
  storm.last = p;
  const k = Math.floor((time - 1.5) / PERIOD);
  const beat = k >= 0 ? { start: 1.5 + k * PERIOD + (seeded(k * 7 + 3)() - 0.5) * 1.2, target: k % TARGETS.length, seed: k * 31 + 5 } : null;
  const candidates = [beat, storm.forced].filter((s): s is Strike => !!s && s.start <= time && time - s.start < 1.2);
  return candidates.sort((a, b) => b.start - a.start)[0] ?? null;
}

const ASPECT = ART.aspect;

/**
 * Lightning's crooked path between two points of the painting: each segment split at a midpoint
 * pushed sideways, less at every level, so it forks and jags at every scale like the real thing.
 */
function crooked(start: [number, number], end: [number, number], levels: number, spread: number, random: () => number) {
  let path: [number, number][] = [start, end];
  let push = spread;
  for (let level = 0; level < levels; level++) {
    const next: [number, number][] = [path[0]];
    for (let i = 0; i < path.length - 1; i++) {
      const [ax, ay] = path[i];
      const [bx, by] = path[i + 1];
      // Work in true proportions, so the sideways push is the same in both directions.
      const dx = (bx - ax) * ASPECT;
      const dy = by - ay;
      const length = Math.hypot(dx, dy) || 1;
      const offset = (random() - 0.5) * 2 * push;
      next.push([(ax + bx) / 2 + (-dy / length) * offset / ASPECT, (ay + by) / 2 + (dx / length) * offset]);
      next.push(path[i + 1]);
    }
    path = next;
    push *= 0.58;
  }
  return path;
}

/** A bolt from the golden light down to its target, with one branch splitting off partway. */
function boltFor(strike: Strike) {
  const target = TARGETS[strike.target];
  const random = seeded(strike.seed);
  const start: [number, number] = [target.from + (random() - 0.5) * 0.1, -0.02];
  const points = crooked(start, target.at, 5, 0.07, random);
  const from = points[12 + Math.floor(random() * 9)];
  const away: [number, number] = [from[0] + (random() < 0.5 ? -1 : 1) * (0.05 + random() * 0.07), from[1] + 0.07 + random() * 0.08];
  const branch = crooked(from, away, 4, 0.03, random);
  return { points, branch };
}

/** A strike's light: a first flash, a flicker, a second flash, then it dies away. */
function envelope(u: number) {
  if (u < 0) return { glow: 0, flash: 0 };
  if (u < 0.07) return { glow: 1, flash: 0.85 };
  if (u < 0.13) return { glow: 0.15, flash: 0.3 };
  if (u < 0.2) return { glow: 0.85, flash: 0.7 };
  return { glow: Math.exp(-(u - 0.2) * 9), flash: 0.7 * Math.exp(-(u - 0.2) * 6) };
}

/** A giant's flinch when the bolt lands: a damped shudder. */
const flinch = (u: number) => (u < 0 ? 0 : Math.exp(-u * 4.5) * Math.sin(u * 14));

/**
 * The giants' flow. The camera holds each stop with a slow creep, then travels on, pulling back
 * mid-flight over long distances. Meanwhile each figure moves on its own: the falling pair and the
 * diver fall further as the visitor scrolls, the lifter heaves his rock, the screamer trembles, the
 * crushed giant strains to rise, Atlas sways under his mountain. Thunderbolts fall from the golden
 * light, the struck giant flinches and the camera shudders, while storm clouds drift through the sky.
 */
const direction: Direction = (p, width, height, time) => {
  const wide = width / height >= 1;
  const { index, local } = place(p);
  const from = shot(index, wide);
  const last = index === STOPS.length - 1;
  let camera: Shot;
  if (last || local < HOLD) {
    camera = { ...from, zoom: from.zoom * (1 + 0.035 * smoother(clamp01(local / HOLD))) };
  } else {
    const t = smoother((local - HOLD) / (1 - HOLD));
    const to = shot(index + 1, wide);
    const travel = Math.hypot(to.center[0] - from.center[0], to.center[1] - from.center[1]);
    const dip = 1 - 0.26 * Math.min(1, travel / 0.4) * Math.sin(Math.PI * t);
    camera = {
      center: mix(from.center, to.center, t),
      anchor: mix(from.anchor, to.anchor, t),
      zoom: logLerp(from.zoom * 1.035, to.zoom, t) * dip,
      spot: lerp(from.spot ?? 0, to.spot ?? 0, t),
      light: from.light,
    };
  }

  // The storm.
  const strike = time > 0 ? strikeAt(time, p) : null;
  const u = strike ? time - strike.start : -1;
  const light = envelope(u);
  const struck = strike ? TARGETS[strike.target].layer : -1;
  const shudder = (layer: number) => flinch(u) * (layer === struck ? 1 : 0.25);

  // The figures.
  const fall = smoother(clamp01((p - 0.05) / 0.9));
  const s = Math.sin;
  const layers: LayerMotion[] = [
    { dx: -0.03 * fall + 0.004 * s(time * 0.6), dy: 0.07 * fall + 0.004 * s(time * 0.8 + 1), rotate: 0.16 * fall + 0.03 * s(time * 0.7) + 0.04 * shudder(FALLERS) },
    { dx: 0.0015 * s(time * 5.1), dy: 0, rotate: 0.022 * s(time * 2.6) + 0.05 * shudder(SCREAMER) },
    { dx: 0, dy: 0.003 * s(time * 0.9 + 2), rotate: 0.014 * s(time * 0.9 + 2) },
    { dx: 0, dy: -0.004 * s(time * 1.25) + 0.01 * shudder(LIFTER), rotate: 0.02 * s(time * 1.25) + 0.03 * shudder(LIFTER) },
    { dx: 0, dy: -0.005 * (0.5 + 0.5 * s(time * 1.1)) + 0.006 * shudder(CRUSHED), rotate: 0.006 * s(time * 1.1) + 0.012 * shudder(CRUSHED) },
    { dx: 0.002 * s(time * 0.7), dy: 0.004 * s(time * 1.6) + 0.012 * shudder(ATLAS), rotate: 0.006 * s(time * 0.8) + 0.025 * shudder(ATLAS) },
    { dx: -0.014 * fall, dy: 0.04 * fall + 0.003 * s(time * 1.4), rotate: -0.09 * fall + 0.025 * s(time * 1.1 + 1) },
  ];

  return {
    ...camera,
    mist: 0.2,
    storm: 0.85,
    flash: light.flash,
    bolt: strike && light.glow > 0.01 ? { ...boltFor(strike), glow: light.glow } : null,
    shake: light.flash > 0.02 ? [light.flash * 0.25 * s(time * 83), light.flash * 0.25 * Math.cos(time * 71)] : undefined,
    layers,
    haze: last ? clamp01((local - 0.4) / 0.5) : 0,
  };
};

/** Which text the stage shows: the stop's while the camera holds it, nothing while it travels. */
function useCaption(progress: MotionValue<number>) {
  const [caption, setCaption] = useState(0);
  useMotionValueEvent(progress, "change", (p) => {
    const { index, local } = place(p);
    const last = index === STOPS.length - 1;
    const next = last ? (local < 0.42 ? index : -1) : local < HOLD + 0.03 ? index : -1;
    setCaption((current) => (current === next ? current : next));
  });
  return caption;
}

type Part = { title: string; text: string; detail: string; practice: string; project: number | null };

/** A part's link to the work it runs in, and the lines that say so. */
function Practice({ part, reduced }: { part: Part; reduced: boolean }) {
  const { t } = useLanguage();
  const copy = t.giants;
  if (part.project === null) {
    return (
      <button
        type="button"
        onClick={() => goToWork(0, !reduced)}
        className="group mt-5 inline-flex items-center gap-1.5 text-[0.875rem] text-tone-accent"
      >
        {copy.seeWorks}
        <ArrowIcon className="size-3.5 -rotate-90 transition-transform duration-300 group-hover:-translate-y-0.5" />
      </button>
    );
  }
  const work = t.projects.items[part.project];
  return (
    <button
      type="button"
      onClick={() => goToWork(part.project ?? 0, !reduced)}
      aria-label={`${copy.seeWork}: ${work.title}`}
      className="group mt-5 flex max-w-[46ch] flex-col items-start gap-1 text-left text-[0.875rem]"
    >
      <span className="text-tone-soft">
        <span className="text-[0.75rem] font-medium uppercase tracking-[0.16em] text-tone-accent">{copy.inPractice}</span>
        {" · "}
        <span className="text-tone underline decoration-tone-line underline-offset-4 transition-colors duration-300 group-hover:text-tone-accent group-hover:decoration-tone-accent">
          {work.title}
        </span>
        {": "}
        {part.practice}
      </span>
      <span className="inline-flex items-center gap-1.5 text-tone-accent">
        {copy.seeWork}
        <ArrowIcon className="size-3.5 -rotate-90 transition-transform duration-300 group-hover:-translate-y-0.5" />
      </span>
    </button>
  );
}

function Stage({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const { t } = useLanguage();
  const copy = t.giants;
  const painting = t.paintings.giants;
  const caption = useCaption(progress);
  const part: Part | null = caption > 0 ? copy.story[caption - 1] : null;
  const side = caption > 0 ? STOPS[caption].side : "left";
  // The shade and the credit leave with the painting as the battle recedes into the haze.
  const leaveFrom = (STOPS.length - 1 + 0.4) / STOPS.length;
  const leave = useTransform(progress, [leaveFrom, leaveFrom + 0.06], [1, 0]);

  return (
    <div className="on-shade relative h-full w-full">
      <Painting art={ART} progress={progress} reduced={reduced} direct={direction} zoomMax={2.1} />

      {/* Shade taken from the painting's own umber wherever the words stand: one side on wide
          screens, the foot on tall ones, and the room's sign low on the left. */}
      <motion.div aria-hidden="true" style={reduced ? undefined : { opacity: leave }} className="pointer-events-none absolute inset-0">
        <div
          className={`absolute inset-0 transition-opacity duration-700 max-md:hidden bg-[linear-gradient(to_right,rgba(20,12,7,0.86)_0%,rgba(20,12,7,0.52)_32%,rgba(20,12,7,0)_58%)] ${
            caption > 0 && side === "left" ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-0 transition-opacity duration-700 max-md:hidden bg-[linear-gradient(to_left,rgba(20,12,7,0.86)_0%,rgba(20,12,7,0.52)_32%,rgba(20,12,7,0)_58%)] ${
            caption > 0 && side === "right" ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-0 transition-opacity duration-700 bg-[linear-gradient(to_top,rgba(20,12,7,0.92)_0%,rgba(20,12,7,0.58)_40%,rgba(20,12,7,0)_70%)] ${
            caption === 0 ? "opacity-100" : "opacity-0 max-md:opacity-100"
          } ${caption < 0 ? "max-md:opacity-60" : ""}`}
        />
        <div className="absolute inset-x-0 top-0 h-[22%] bg-[linear-gradient(to_bottom,rgba(20,12,7,0.6),rgba(20,12,7,0))] md:hidden" />
      </motion.div>

      {/* The whole story, in order, for screen readers; the captions below show it a part at a time. */}
      <div className="sr-only">
        <p>{copy.intro}</p>
        <ol>
          {copy.story.map((s) => (
            <li key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {caption === 0 ? (
          <motion.div
            key="sign"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="absolute inset-x-0 bottom-[9svh] mx-auto max-w-[90rem] px-5 md:bottom-[11vh] md:px-10"
          >
            <div aria-hidden="true" className="md:w-[54%]">
              <RoomSign
                id="giants-sign"
                greek={t.rooms.giants.greek}
                local={copy.title}
                highlight={copy.titleHighlight}
                note={copy.subtitle}
                noteClassName="text-tone-soft"
              />
              <p className="mt-5 max-w-[58ch] text-[0.9375rem] leading-[1.65] text-tone-soft md:text-[1rem]">{copy.intro}</p>
            </div>
          </motion.div>
        ) : part ? (
          <motion.div
            key={part.title}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute inset-x-0 bottom-[3rem] mx-auto max-w-[90rem] px-5 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:px-10"
          >
            <div className={`md:w-[36%] ${side === "right" ? "md:ml-auto" : ""}`}>
              <div aria-hidden="true">
                <p className="text-[clamp(1.6rem,2.4vw,2.25rem)] font-[440] leading-tight text-tone [font-variation-settings:'FLAR'_60]">
                  {part.title}
                </p>
                <CinematicText
                  as="p"
                  delay={0.1}
                  stagger={0.016}
                  blur={8}
                  className="mt-4 max-w-[46ch] text-[1rem] leading-[1.6] text-tone-soft md:text-[clamp(1rem,1.2vw,1.1875rem)]"
                >
                  {part.text}
                </CinematicText>
                <p className="mt-4 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-tone-accent">
                  {t.ui.methodDetail} · <span className="normal-case tracking-[0.02em]">{part.detail}</span>
                </p>
              </div>
              <Practice part={part} reduced={reduced} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.p
        style={reduced ? undefined : { opacity: leave }}
        className="absolute right-5 top-[4.75rem] max-w-[30ch] text-right text-[0.6875rem] leading-[1.45] text-tone-soft md:bottom-8 md:right-10 md:top-auto md:max-w-[40ch] md:text-[0.75rem]"
      >
        {painting.artist}, <cite className="not-italic text-tone">{painting.title}</cite>, {painting.date} ·{" "}
        {painting.collection}
      </motion.p>
    </div>
  );
}

const WHOLE: Direction = () => shot(0, true);

/** Reduced motion: the painting held still and whole, the story read as a list beneath it. */
function Still() {
  const { t } = useLanguage();
  const copy = t.giants;
  const painting = t.paintings.giants;
  const still = useMotionValue(0);
  return (
    <div className="on-shade bg-shade" data-guide-cover>
      <div className="relative h-[70svh]">
        <Painting art={ART} progress={still} reduced direct={WHOLE} />
      </div>
      <div className="mx-auto max-w-[90rem] px-5 pb-16 pt-12 md:px-10">
        <div aria-hidden="true">
          <RoomSign id="giants-sign" greek={t.rooms.giants.greek} local={copy.title} highlight={copy.titleHighlight} note={copy.subtitle} />
        </div>
        <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-tone-soft">{copy.intro}</p>
        <ol className="mt-12 grid gap-9 md:grid-cols-2 lg:grid-cols-3">
          {copy.story.map((s) => (
            <li key={s.title} className="border-t hairline pt-5">
              <h3 className="text-[1.25rem] font-[460] text-tone">{s.title}</h3>
              <p className="mt-2 text-[1rem] leading-[1.7] text-tone-soft">{s.text}</p>
              <Practice part={s} reduced />
            </li>
          ))}
        </ol>
        <p className="mt-12 text-[0.75rem] text-tone-soft">
          {painting.artist}, <cite className="not-italic text-tone">{painting.title}</cite>, {painting.date} ·{" "}
          {painting.collection}
        </p>
      </div>
    </div>
  );
}

export default function Giants() {
  const { t } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const copy = t.giants;

  return (
    <section id="giants" data-page-section data-guide-hidden aria-labelledby="giants-heading" className="relative">
      <h2 id="giants-heading" className="sr-only">
        {copy.title} {copy.titleHighlight}
      </h2>
      {reduced ? (
        <Still />
      ) : (
        <div id="giants-stage" data-guide-cover>
          <ScrollStage height={`${100 + STOPS.length * 58}svh`}>
            {({ progress }) => <Stage progress={progress} reduced={reduced} />}
          </ScrollStage>
        </div>
      )}
    </section>
  );
}
