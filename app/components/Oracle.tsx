"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useLanguage } from "@/app/context/LanguageContext";
import { ScrollStage } from "@/components/ui/ScrollStage";
import { CinematicText } from "@/components/ui/CinematicText";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import Painting, { type Direction, type Shot } from "./painting/Painting";
import type { Plume } from "./painting/painting-renderer";
import { ARTWORKS } from "./painting/artworks";
import RoomSign from "./RoomSign";

const ART = ARTWORKS.oracle;
const EASE = [0.16, 1, 0.3, 1] as const;

/** Points of Miola's painting, 0..1 from the top left. */
const SANCTUARY: [number, number] = [0.5, 0.5];
const CONSULTANTS: [number, number] = [0.72, 0.74];
const PYTHIA: [number, number] = [0.385, 0.22];
const SCRIBE: [number, number] = [0.25, 0.33];
const STELE: [number, number] = [0.955, 0.5];
/** The chasm beneath the tripod, where the vapour rises, and the view the camera holds over it. */
const CHASM: [number, number] = [0.355, 0.7];
const OVER_CHASM: [number, number] = [0.36, 0.58];

type Side = "left" | "right";

/**
 * The sanctuary under the room's sign, then one stop per part of the story, and the sanctuary again.
 * Each stop's text stands on `side`, the detail on the other; `vapour` is how much rises from the chasm.
 */
const STOPS: { center: [number, number]; zoom: number; tall: number; side: Side; spot: number; vapour: number }[] = [
  { center: SANCTUARY, zoom: 1, tall: 1, side: "left", spot: 0, vapour: 0.4 },
  { center: CONSULTANTS, zoom: 1.8, tall: 1.2, side: "left", spot: 0.5, vapour: 0.45 },
  { center: PYTHIA, zoom: 2.3, tall: 1.5, side: "right", spot: 0.55, vapour: 1 },
  { center: SCRIBE, zoom: 2, tall: 1.35, side: "right", spot: 0.5, vapour: 0.65 },
  { center: STELE, zoom: 2.2, tall: 1.4, side: "left", spot: 0.5, vapour: 0.4 },
  { center: SANCTUARY, zoom: 1.04, tall: 1, side: "left", spot: 0, vapour: 0.4 },
];
/** The vapour rising from the chasm, as tall as the Pythia's tripod and her face above it. */
const vapourAt = (strength: number): Plume => ({ from: CHASM, height: 0.62, width: 0.04, growth: 0.2, strength, seed: 1.7 });

/** Share of each stop's stretch of scroll the camera holds before it travels on. */
const HOLD = 0.55;

const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const mix = (a: [number, number], b: [number, number], t: number) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)] as [number, number];
const logLerp = (a: number, b: number, t: number) => Math.exp(lerp(Math.log(a), Math.log(b), t));

function shot(i: number, wide: boolean): Shot {
  const stop = STOPS[i];
  const whole = stop.tall === 1 && stop.zoom < 1.1;
  // Wide screens hold the detail on the side away from the text; tall ones hold it high, above it.
  const anchor: [number, number] = whole ? [0.5, 0.5] : wide ? (stop.side === "left" ? [0.66, 0.46] : [0.34, 0.46]) : [0.5, 0.34];
  return { center: stop.center, anchor, zoom: wide ? stop.zoom : stop.tall, spot: stop.spot, light: anchor };
}

/** Where the scroll stands: the stop, and how far through its stretch (0..1). */
function place(p: number) {
  const at = Math.min(STOPS.length, Math.max(0, p * STOPS.length));
  const index = Math.min(STOPS.length - 1, Math.floor(at));
  return { index, local: at - index };
}

/**
 * The oracle's flow. The camera holds each stop with a slow creep, then travels on, pulling back
 * mid-flight over long distances: from the consultants it drops to the chasm and rises with the
 * vapour to the Pythia's face, pans to the priest who writes her words down, sweeps across the
 * sanctuary to the inscribed stele, and pulls back to the whole, which recedes into the haze.
 */
const direction: Direction = (p, width, height) => {
  const wide = width / height >= 1;
  const { index, local } = place(p);
  const from = shot(index, wide);
  const last = index === STOPS.length - 1;

  if (last || local < HOLD) {
    const creep = 1 + 0.04 * smoother(clamp01(local / HOLD));
    return {
      ...from,
      zoom: from.zoom * creep,
      mist: 0.3,
      plumes: [vapourAt(STOPS[index].vapour)],
      // The whole recedes until the stage lets go, so the works' portico rises as the haze completes.
      haze: last ? clamp01((local - 0.45) / 0.55) : 0,
    };
  }

  const t = (local - HOLD) / (1 - HOLD);
  const to = shot(index + 1, wide);
  const start = from.zoom * 1.04;
  let center: [number, number];
  let zoom: number;
  let vapour = lerp(STOPS[index].vapour, STOPS[index + 1].vapour, smoother(t));
  if (index === 1) {
    // Down to the chasm, a breath over it, then up the column of vapour to her face.
    const overZoom = wide ? 1.6 : 1.15;
    if (t < 0.5) {
      const u = smoother(t / 0.5);
      center = mix(from.center, OVER_CHASM, u);
      zoom = logLerp(start, overZoom, u);
    } else {
      const u = smoother((t - 0.5) / 0.5);
      center = mix(OVER_CHASM, to.center, u);
      zoom = logLerp(overZoom, to.zoom, u);
    }
    vapour = 0.5 + 0.7 * Math.sin(Math.PI * clamp01(t * 1.2));
  } else {
    const u = smoother(t);
    center = mix(from.center, to.center, u);
    const travel = Math.hypot(to.center[0] - from.center[0], to.center[1] - from.center[1]);
    const dip = 1 - (index === 3 ? 0.36 : 0.24) * Math.min(1, travel / 0.4) * Math.sin(Math.PI * u);
    zoom = logLerp(start, to.zoom, u) * dip;
  }
  const u = smoother(t);
  return {
    center,
    anchor: mix(from.anchor, to.anchor, u),
    zoom,
    spot: lerp(from.spot ?? 0, to.spot ?? 0, u),
    light: mix(from.light, to.light, u),
    mist: 0.3,
    plumes: [vapourAt(vapour)],
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

function Stage({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const { t } = useLanguage();
  const copy = t.oracle;
  const painting = t.paintings.oracle;
  const caption = useCaption(progress);
  const step = caption > 0 ? copy.story[caption - 1] : null;
  const side = caption > 0 ? STOPS[caption].side : "left";
  // The shade and the credit leave with the painting as the sanctuary recedes into the haze.
  const leaveFrom = (STOPS.length - 1 + 0.4) / STOPS.length;
  const leave = useTransform(progress, [leaveFrom, leaveFrom + 0.06], [1, 0]);

  return (
    <div className="on-shade relative h-full w-full">
      <Painting art={ART} progress={progress} reduced={reduced} direct={direction} zoomMax={2.4} />

      {/* Shade taken from the painting's own umber, wherever the words stand: one side on wide
          screens, the foot on tall ones, and the room's sign low on the left. */}
      <motion.div aria-hidden="true" style={reduced ? undefined : { opacity: leave }} className="pointer-events-none absolute inset-0">
        <div
          className={`absolute inset-0 transition-opacity duration-700 max-md:hidden bg-[linear-gradient(to_right,rgba(28,16,9,0.84)_0%,rgba(28,16,9,0.5)_30%,rgba(28,16,9,0)_56%)] ${
            caption > 0 && side === "left" ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-0 transition-opacity duration-700 max-md:hidden bg-[linear-gradient(to_left,rgba(28,16,9,0.84)_0%,rgba(28,16,9,0.5)_30%,rgba(28,16,9,0)_56%)] ${
            caption > 0 && side === "right" ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-0 transition-opacity duration-700 bg-[linear-gradient(to_top,rgba(28,16,9,0.9)_0%,rgba(28,16,9,0.56)_38%,rgba(28,16,9,0)_66%)] ${
            caption === 0 ? "opacity-100" : "opacity-0 max-md:opacity-100"
          } ${caption < 0 ? "max-md:opacity-60" : ""}`}
        />
        <div className="absolute inset-x-0 top-0 h-[22%] bg-[linear-gradient(to_bottom,rgba(28,16,9,0.6),rgba(28,16,9,0))] md:hidden" />
      </motion.div>

      {/* The whole story, in order, for screen readers; the captions below show it a part at a time. */}
      <div className="sr-only">
        <p>{copy.intro}</p>
        <ol>
          {copy.story.map((part) => (
            <li key={part.title}>
              <h3>{part.title}</h3>
              <p>{part.text}</p>
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
            <div aria-hidden="true" className="md:w-[50%]">
              <RoomSign
                id="oracle-sign"
                as="div"
                greek={t.rooms.oracle.greek}
                local={copy.title}
                highlight={copy.titleHighlight}
                note={copy.subtitle}
              />
              <p className="mt-5 max-w-[58ch] text-[0.9375rem] leading-[1.65] text-tone-soft md:text-[1rem]">
                {copy.intro}
              </p>
            </div>
          </motion.div>
        ) : step ? (
          <motion.div
            key={step.title}
            aria-hidden="true"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute inset-x-0 bottom-[3.5rem] mx-auto max-w-[90rem] px-5 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:px-10"
          >
            <div className={`md:w-[36%] ${side === "right" ? "md:ml-auto" : ""}`}>
              <p className="text-[clamp(1.6rem,2.4vw,2.25rem)] font-[440] leading-tight text-tone [font-variation-settings:'FLAR'_60]">
                {step.title}
              </p>
              <CinematicText
                as="p"
                delay={0.1}
                stagger={0.018}
                blur={8}
                className="mt-4 max-w-[46ch] text-[1.0625rem] leading-[1.6] text-tone-soft md:text-[clamp(1.0625rem,1.3vw,1.25rem)]"
              >
                {step.text}
              </CinematicText>
              <p className="mt-5 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-tone-accent">
                {t.ui.methodDetail} · <span className="normal-case tracking-[0.02em]">{step.detail}</span>
              </p>
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

/** Reduced motion: the painting held whole, the story read as a list beneath it. */
function Still() {
  const { t } = useLanguage();
  const copy = t.oracle;
  const painting = t.paintings.oracle;
  const still = useMotionValue(0);
  return (
    <div className="on-shade bg-shade" data-guide-cover>
      <div className="relative h-[70svh]">
        <Painting art={ART} progress={still} reduced direct={WHOLE} />
      </div>
      <div className="mx-auto max-w-[90rem] px-5 pb-16 pt-12 md:px-10">
        <div aria-hidden="true">
          <RoomSign
            id="oracle-sign"
            as="div"
            greek={t.rooms.oracle.greek}
            local={copy.title}
            highlight={copy.titleHighlight}
            note={copy.subtitle}
          />
        </div>
        <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-tone-soft">{copy.intro}</p>
        <ol className="mt-12 grid gap-9 md:grid-cols-2 lg:grid-cols-3">
          {copy.story.map((part) => (
            <li key={part.title} className="border-t hairline pt-5">
              <h3 className="text-[1.25rem] font-[460] text-tone">{part.title}</h3>
              <p className="mt-2 text-[1rem] leading-[1.7] text-tone-soft">{part.text}</p>
              <p className="mt-3 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-tone-accent">
                {t.ui.methodDetail} · <span className="normal-case tracking-[0.02em]">{part.detail}</span>
              </p>
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

export default function Oracle() {
  const { t } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const copy = t.oracle;

  return (
    <section id="oracle" data-page-section aria-labelledby="oracle-heading" className="relative">
      <h2 id="oracle-heading" className="sr-only">
        {copy.title} {copy.titleHighlight}
      </h2>
      {reduced ? (
        <Still />
      ) : (
        <div id="oracle-stage" data-guide-cover>
          <ScrollStage height={`${100 + STOPS.length * 58}svh`}>
            {({ progress }) => <Stage progress={progress} reduced={reduced} />}
          </ScrollStage>
        </div>
      )}
    </section>
  );
}
