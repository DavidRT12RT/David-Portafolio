"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useLanguage } from "@/app/context/LanguageContext";
import { ScrollStage } from "@/components/ui/ScrollStage";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import Painting, { type Direction, type Shot } from "./painting/Painting";
import { ARTWORKS } from "./painting/artworks";
import RoomSign from "./RoomSign";

const ART = ARTWORKS.olympus;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The six details of Bayeu's Olympus the method walks, one per step (0..1 from the top left), and
 * how close the camera comes on wide and on tall screens: the giants storming, Minerva, Mercury,
 * Jupiter with the thunderbolt, the giants falling, and at last the whole of Olympus.
 */
const DETAILS: { point: [number, number]; zoom: number; tall: number }[] = [
  { point: [0.42, 0.8], zoom: 2.1, tall: 1.2 },
  { point: [0.646, 0.66], zoom: 2.3, tall: 1.3 },
  { point: [0.325, 0.34], zoom: 2.4, tall: 1.5 },
  { point: [0.43, 0.5], zoom: 2, tall: 1.2 },
  { point: [0.69, 0.88], zoom: 2, tall: 1.6 },
  { point: [0.5, 0.5], zoom: 1, tall: 1 },
];
/** The establishing view, then one shot per step. */
const SHOTS = DETAILS.length + 1;

const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function shot(index: number, wide: boolean): Shot {
  if (index === 0) return { center: [0.5, 0.5], anchor: [0.5, 0.5], zoom: 1, spot: 0, mist: 0.5, light: [0.45, 0.42] };
  const detail = DETAILS[index - 1];
  const whole = detail.zoom === 1;
  // Wide screens hold the detail right of centre, clear of the step's text on the left; tall ones
  // hold it low, under the text at the top, where details near the painting's foot can still reach.
  const anchor: [number, number] = whole ? [0.5, 0.5] : wide ? [0.66, 0.46] : [0.5, 0.62];
  return {
    center: detail.point,
    anchor,
    zoom: wide ? detail.zoom : detail.tall,
    spot: whole ? 0 : 0.85,
    mist: 0.5,
    light: anchor,
  };
}

/**
 * Each step holds its detail for half its stretch of scroll, then the camera travels to the next,
 * pulling back a little mid-flight when the two details lie far apart.
 */
const direction: Direction = (p, width, height) => {
  const wide = width / height >= 1;
  const at = Math.min(SHOTS, Math.max(0, p * SHOTS));
  const index = Math.min(SHOTS - 1, Math.floor(at));
  const from = shot(index, wide);
  // After the last step the whole of Olympus recedes into the haze, and the last room comes up.
  if (index === SHOTS - 1) return { ...from, haze: Math.min(1, Math.max(0, (at - index - 0.4) / 0.55)) };
  const t = smoother(Math.min(1, Math.max(0, (at - index - 0.5) / 0.5)));
  if (t === 0) return from;
  const to = shot(index + 1, wide);
  const travel = Math.hypot(to.center[0] - from.center[0], to.center[1] - from.center[1]);
  const dip = 1 - 0.28 * Math.min(1, travel / 0.4) * Math.sin(Math.PI * t);
  const mix = (a: [number, number], b: [number, number]) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)] as [number, number];
  return {
    center: mix(from.center, to.center),
    anchor: mix(from.anchor, to.anchor),
    zoom: Math.exp(lerp(Math.log(from.zoom), Math.log(to.zoom), t)) * dip,
    spot: lerp(from.spot ?? 0, to.spot ?? 0, t),
    mist: 0.5,
    light: mix(from.light, to.light),
  };
};

/** Which caption the stage shows: 0 the room's sign, 1..6 the steps. */
function useShot(progress: MotionValue<number>) {
  const [index, setIndex] = useState(0);
  useMotionValueEvent(progress, "change", (p) => {
    const next = Math.min(SHOTS - 1, Math.max(0, Math.floor(p * SHOTS)));
    setIndex((current) => (current === next ? current : next));
  });
  return index;
}

function MethodStage({ progress, reduced, stage }: { progress: MotionValue<number>; reduced: boolean; stage: () => HTMLElement | null }) {
  const { t } = useLanguage();
  const steps = t.contact.steps;
  const painting = t.paintings.olympus;
  const index = useShot(progress);
  const step = index > 0 ? steps[index - 1] : null;
  const railOpacity = useTransform(progress, [0, 0.6 / SHOTS, 1 / SHOTS, (SHOTS - 0.6) / SHOTS, (SHOTS - 0.3) / SHOTS], [0, 0, 1, 1, 0]);
  // The words and the painting's shade leave with the painting.
  const leave = useTransform(progress, [(SHOTS - 0.6) / SHOTS, (SHOTS - 0.25) / SHOTS], [1, 0]);

  // A step's place on the rail jumps the scroll to where its detail is held.
  const go = (i: number) => {
    const el = stage();
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (span * (i + 1 + 0.25)) / SHOTS, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className="on-shade relative h-full w-full">
      <Painting art={ART} progress={progress} reduced={reduced} direct={direction} zoomMax={2.4} />

      {/* The painting's own shade, deepened where the words stand: left on wide screens, low on tall. */}
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { opacity: leave }}
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(28,16,9,0.9)_0%,rgba(28,16,9,0.55)_34%,rgba(28,16,9,0)_58%)] md:bg-[linear-gradient(to_right,rgba(28,16,9,0.8)_0%,rgba(28,16,9,0.46)_30%,rgba(28,16,9,0)_56%)]"
      />
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { opacity: leave }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] bg-[linear-gradient(to_top,rgba(28,16,9,0.7),rgba(28,16,9,0))] md:h-[30%]"
      />

      {/* Every step, in order, for screen readers; the captions below are the same words, shown one at a time. */}
      <ol className="sr-only">
        {steps.map((s) => (
          <li key={s.number}>
            <h3>
              {s.number}. {s.title}
            </h3>
            <p>{s.description}</p>
          </li>
        ))}
      </ol>

      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { opacity: leave }}
        className="absolute inset-x-0 top-[5.25rem] mx-auto max-w-[90rem] px-5 md:top-1/2 md:-translate-y-1/2 md:px-10"
      >
        <div className="max-w-[34rem] md:w-[36%]">
          <AnimatePresence mode="wait" initial={false}>
            {step ? (
              <motion.div
                key={step.number}
                initial={reduced ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduced ? undefined : { opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <p className="text-[clamp(3.5rem,7vw,6rem)] font-[250] leading-none tabular-nums text-tone-accent [font-variation-settings:'FLAR'_100]">
                  {step.number}
                </p>
                <p className="mt-4 text-[clamp(1.6rem,2.4vw,2.25rem)] font-[440] leading-tight text-tone">{step.title}</p>
                <p className="mt-3 max-w-[40ch] text-[1rem] leading-[1.65] text-tone-soft md:text-[1.0625rem]">
                  {step.description}
                </p>
                <p className="mt-5 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-tone-accent">
                  {t.ui.methodDetail} · <span className="normal-case tracking-[0.02em]">{step.detail}</span>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="sign"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <RoomSign
                  id="method-sign"
                  as="div"
                  greek={t.rooms.method.greek}
                  local={t.contact.title}
                  highlight={t.contact.titleHighlight}
                  note={t.contact.subtitle}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* The way, step by step: the rail along the foot of the painting. */}
      <motion.ol
        style={reduced ? undefined : { opacity: railOpacity }}
        className="absolute inset-x-0 bottom-0 mx-auto grid max-w-[90rem] grid-cols-6 gap-x-2 px-5 pb-5 md:gap-x-6 md:px-10 md:pb-8"
      >
        {steps.map((s, i) => {
          const active = index === i + 1;
          return (
            <li key={s.number} className="border-t border-tone-line pt-3 md:pt-4">
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={active ? "step" : undefined}
                aria-label={`${s.number}. ${s.title}`}
                className={`block text-left text-[0.8125rem] leading-snug transition-colors duration-500 hover:text-tone ${
                  active ? "text-tone" : "text-tone-mute"
                }`}
              >
                <span className={`block tabular-nums text-[0.75rem] ${active ? "text-tone-accent" : ""}`}>{s.number}</span>
                <span className="hidden md:inline">{s.title}</span>
              </button>
            </li>
          );
        })}
      </motion.ol>

      <motion.p
        style={reduced ? undefined : { opacity: leave }}
        className="absolute bottom-[4.75rem] right-5 max-w-[30ch] text-right text-[0.6875rem] leading-[1.45] text-tone-soft md:bottom-[6.5rem] md:right-10 md:max-w-[40ch] md:text-[0.75rem]"
      >
        {painting.artist}, <cite className="not-italic text-tone">{painting.title}</cite>, {painting.date} ·{" "}
        {painting.collection}
      </motion.p>
    </div>
  );
}

/** Reduced motion: the painting held whole, the six steps read as a list beneath it. */
function MethodStill() {
  const { t } = useLanguage();
  const steps = t.contact.steps;
  const painting = t.paintings.olympus;
  const still = useMotionValue(0);
  return (
    <div className="on-shade bg-shade" data-guide-cover>
      <div className="relative h-[70svh]">
        <Painting art={ART} progress={still} reduced direct={WHOLE} />
      </div>
      <div className="mx-auto max-w-[90rem] px-5 pb-16 pt-12 md:px-10">
        <div aria-hidden="true">
          <RoomSign
            id="method-sign"
            as="div"
            greek={t.rooms.method.greek}
            local={t.contact.title}
            highlight={t.contact.titleHighlight}
            note={t.contact.subtitle}
          />
        </div>
        <ol className="mt-12 grid gap-9 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="border-t hairline pt-5">
              <p className="tabular-nums text-[0.8125rem] text-tone-accent">{step.number}</p>
              <h3 className="mt-1 text-[1.25rem] font-[460] text-tone">{step.title}</h3>
              <p className="mt-2 text-[1rem] leading-[1.7] text-tone-soft">{step.description}</p>
              <p className="mt-3 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-tone-accent">
                {t.ui.methodDetail} · <span className="normal-case tracking-[0.02em]">{step.detail}</span>
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

const WHOLE: Direction = () => shot(0, true);

export default function Method() {
  const { t } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const count = t.contact.steps.length;

  return (
    <section id="method" data-page-section aria-labelledby="method-heading" className="relative">
      <h2 id="method-heading" className="sr-only">
        {t.contact.title} {t.contact.titleHighlight}
      </h2>
      {reduced ? (
        <MethodStill />
      ) : (
        // The camera walks the painting from the giants up to Olympus, one detail per step.
        <div id="method-stage" data-guide-cover>
          <ScrollStage height={`${100 + (count + 1) * 52}svh`}>
            {({ progress }) => (
              <MethodStage
                progress={progress}
                reduced={reduced}
                stage={() => document.getElementById("method-stage")}
              />
            )}
          </ScrollStage>
        </div>
      )}
    </section>
  );
}
