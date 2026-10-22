"use client";

import { useCallback, useRef, type CSSProperties } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { useLanguage } from "@/app/context/LanguageContext";
import { ScrollStage } from "@/components/ui/ScrollStage";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import Painting, { type Direction, type PaintingFrame } from "./painting/Painting";
import { ARTWORKS } from "./painting/artworks";
import { circling, type Loop } from "./painting/birds";
import type { LayerMotion, Plume } from "./painting/painting-renderer";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";

const NAME_LINES = ["David Arcos", "Melgarejo"];
/** Points of the painting (0..1 from the top left): Athena on her column, and the harbour's far end. */
const ATHENA_X = 0.715;
const HARBOUR: [number, number] = [0.6, 0.48];

/**
 * The smoke Cole painted rising from the city's altars: three on the terrace below the round temple,
 * bending with the wind toward the left, and the two braziers between the pavilion's columns.
 */
const PLUMES: Plume[] = [
  { from: [0.077, 0.292], height: 0.075, width: 0.004, growth: 0.22, drift: -0.35, strength: 0.75, seed: 1.1 },
  { from: [0.174, 0.284], height: 0.08, width: 0.004, growth: 0.22, drift: -0.35, strength: 0.75, seed: 2.3 },
  { from: [0.1985, 0.212], height: 0.035, width: 0.002, growth: 0.18, drift: -0.3, strength: 0.6, seed: 3.7 },
  { from: [0.0685, 0.73], height: 0.12, width: 0.008, growth: 0.22, drift: -0.05, strength: 0.7, seed: 4.1 },
  { from: [0.158, 0.713], height: 0.11, width: 0.008, growth: 0.22, drift: -0.05, strength: 0.7, seed: 5.9 },
];

const CLOUDS = ARTWORKS.consummation.layers;
/** How much larger Cole's clouds grow once they have set off, and over how many seconds. */
const CLOUD_GROWTH = 1.3;
const CLOUD_GROWTH_SECONDS = 10;

/**
 * Cole's own clouds sail on the wind that bends the smoke, to the left: the high ones, nearer
 * overhead, fastest (about 12px a second on a wide screen), the low ones by the horizon slowest. Each
 * starts where and as large as he painted it, swells slowly to a third larger as it sets off, leaves
 * past the edge of the city and comes back from behind the column.
 */
function cloudDrift(time: number): LayerMotion[] {
  const settle = Math.min(1, time / CLOUD_GROWTH_SECONDS);
  const scale = 1 + (CLOUD_GROWTH - 1) * settle * settle * (3 - 2 * settle);
  return CLOUDS.map(({ rect: [x0, y0, x1, y1] }) => {
    const centre = (x0 + x1) / 2;
    const height = (y0 + y1) / 2;
    const speed = 0.0028 + 0.0056 * (1 - Math.min(1, height / 0.5));
    // The centre wraps once the cloud, at its largest, is wholly past the left edge, and comes back
    // wholly beyond the right.
    const reach = ((x1 - x0) * CLOUD_GROWTH) / 2 + 0.02;
    const range = 1 + 2 * reach;
    const along = (((centre + reach - speed * time) % range) + range) % range;
    return { dx: along - reach - centre, dy: 0, rotate: 0, scale };
  });
}

/**
 * Gulls circling Athena's column on level circles of their own, each at its own pace, some turning
 * one way and some the other: on the far side of a circle a gull passes behind the statue, on the
 * near side in front of it and larger. On wide screens the circles stay right of the name; on tall
 * ones, where the name stands above, they centre on the statue. Three more wheel far off over the
 * round temple.
 */
const GULLS: (Omit<Loop, "center"> & { offset: [number, number]; far?: boolean })[] = [
  { offset: [-0.01, -0.01], radius: 0.085, depth: [0.12, 0.46], size: [0.0144, 0.0204], period: 19, phase: 0.05, turn: 1, beat: 2.6, rhythm: 0.1 },
  { offset: [0.03, 0.03], radius: 0.1, depth: [0.14, 0.5], size: [0.0144, 0.0216], period: 23, phase: 0.42, turn: -1, beat: 2.4, rhythm: 0.47 },
  { offset: [-0.025, -0.045], radius: 0.06, depth: [0.11, 0.42], size: [0.0132, 0.018], period: 17, phase: 0.71, turn: 1, beat: 2.8, rhythm: 0.83 },
  { offset: [0.05, -0.03], radius: 0.075, depth: [0.13, 0.44], size: [0.0132, 0.0192], period: 21, phase: 0.27, turn: -1, beat: 2.5, rhythm: 0.29 },
  { offset: [0.0, 0.06], radius: 0.09, depth: [0.15, 0.52], size: [0.0156, 0.0228], period: 26, phase: 0.6, turn: 1, beat: 2.3, rhythm: 0.66 },
  { offset: [-0.6, -0.18], radius: 0.05, depth: [0.05, 0.08], size: [0.006, 0.0078], period: 24, phase: 0.2, turn: 1, beat: 2.9, rhythm: 0.12, far: true },
  { offset: [-0.64, -0.2], radius: 0.035, depth: [0.05, 0.08], size: [0.0054, 0.0072], period: 18, phase: 0.55, turn: -1, beat: 3, rhythm: 0.58, far: true },
  { offset: [-0.57, -0.21], radius: 0.04, depth: [0.05, 0.08], size: [0.0054, 0.0072], period: 21, phase: 0.85, turn: 1, beat: 2.7, rhythm: 0.91, far: true },
];

function gulls(time: number, tall: boolean) {
  // The flock's centre: right of the name on wide screens, on the statue on tall ones.
  const centre: [number, number] = tall ? [ATHENA_X, 0.3] : [0.805, 0.3];
  return GULLS.filter((gull) => !(tall && gull.far)).map((gull) =>
    circling({ ...gull, center: [centre[0] + gull.offset[0], centre[1] + gull.offset[1]] }, time, ARTWORKS.consummation.aspect),
  );
}

/**
 * Wide screens show the whole city with the sky above it; tall ones centre Athena's column and keep
 * the top of the sky, so she stands clear below the name. Scrolling pushes the camera into the harbour
 * while the city recedes into the haze, the distance first. The city is alive meanwhile: its altars
 * smoke, Cole's clouds sail across its sky and gulls circle Athena.
 */
const direction: Direction = (p, width, height, time) => {
  const tall = width / height < 1;
  return {
    plumes: PLUMES,
    // The moving harbour is built (the depth map marks the water) but hidden: the owner prefers
    // Cole's own still water. Set to 1 to bring it back.
    water: 0,
    layers: cloudDrift(time),
    birds: time > 0 ? gulls(time, tall) : [],
    center: tall ? [ATHENA_X, 0] : [0.5, 0.28],
    anchor: tall ? [0.5, 0] : [0.5, 0.28],
    zoom: 1,
    dolly: p * p * (3 - 2 * p),
    dollyToward: HARBOUR,
    haze: Math.min(1, Math.max(0, (p - 0.36) / 0.52)),
    mist: 1,
    light: [0.36, 0.28],
  };
};

function HeroStage({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const { t } = useLanguage();
  const painting = t.paintings.consummation;
  const name = useRef<HTMLDivElement>(null);
  const glint = useRef<HTMLSpanElement>(null);
  const low = useRef<HTMLDivElement>(null);

  // As the visitor scrolls on, the name rises into the sky and the city behind it recedes into the haze.
  // With reduced motion the stage does not pin, so none of this is bound to scroll.
  const nameY = useTransform(progress, [0, 0.6], ["0svh", "-9svh"]);
  const nameOpacity = useTransform(progress, [0.12, 0.5], [1, 0]);
  const lowY = useTransform(progress, [0, 0.3], ["0svh", "5svh"]);
  const lowOpacity = useTransform(progress, [0, 0.26], [1, 0]);
  const scrimOpacity = useTransform(progress, [0.25, 0.85], [1, 0]);

  // The name stands nearer than the city: it turns and slides against the painting's parallax, and
  // the sun glints across its letters wherever the light is.
  const onFrame = useCallback(({ look, sun }: PaintingFrame) => {
    const block = name.current;
    if (block) {
      block.style.transform = `perspective(1100px) rotateY(${(look[0] * 4).toFixed(3)}deg) rotateX(${(-look[1] * 3).toFixed(3)}deg) translate3d(${(-look[0] * 14).toFixed(2)}px, ${(look[1] * 9).toFixed(2)}px, 0)`;
    }
    const text = glint.current;
    if (text) {
      const rect = text.getBoundingClientRect();
      text.style.setProperty("--glint-x", `${(((sun[0] - rect.left) / Math.max(rect.width, 1)) * 100).toFixed(1)}%`);
      text.style.setProperty("--glint-y", `${(((sun[1] - rect.top) / Math.max(rect.height, 1)) * 100).toFixed(1)}%`);
    }
    if (low.current) {
      low.current.style.transform = `translate3d(${(-look[0] * 6).toFixed(2)}px, ${(look[1] * 4).toFixed(2)}px, 0)`;
    }
  }, []);

  // The entrance runs in CSS, so the name arrives with the first paint rather than after the scripts.
  const lines = NAME_LINES.map((line, i) => (
    <span key={line} className="hero-rise block" style={{ "--delay": `${0.1 + i * 0.16}s` } as CSSProperties}>
      {line}
    </span>
  ));

  return (
    <div className="relative h-full w-full">
      <Painting
        art={ARTWORKS.consummation}
        progress={progress}
        reduced={reduced}
        direct={direction}
        onFrame={onFrame}
        priority
      />

      {/* Umber from the painting's own foreground, deepened just enough for the lower lines to read. */}
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { opacity: scrimOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[linear-gradient(to_top,rgba(28,16,9,0.9)_0%,rgba(28,16,9,0.72)_52%,rgba(28,16,9,0)_100%)] md:h-[52%] md:bg-[linear-gradient(to_top,rgba(28,16,9,0.86)_0%,rgba(28,16,9,0.5)_42%,rgba(28,16,9,0)_100%)]"
      />

      <motion.div
        style={reduced ? undefined : { y: nameY, opacity: nameOpacity }}
        className="absolute inset-x-0 top-[10svh] px-5 text-center md:top-[13vh]"
      >
        <div ref={name} className="will-change-transform">
          <div className="relative">
            <h1 id="hero-title" className="hero-name" data-reveal>
              {lines}
            </h1>
            {/* The same letters again, transparent but for the glint of light that crosses them; beside
                the heading rather than in it, so the name is read once. */}
            <span
              ref={glint}
              aria-hidden="true"
              className="hero-name hero-name__glint hero-fade pointer-events-none absolute inset-0"
              style={{ "--delay": "1.4s", "--duration": "1.6s" } as CSSProperties}
            >
              {NAME_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </span>
          </div>
          <p
            data-reveal
            className="hero-fade mt-5 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-gold-ink md:text-[0.8125rem]"
            style={{ "--delay": "0.75s", "--duration": "1.2s" } as CSSProperties}
          >
            {t.hero.badge}
          </p>
        </div>
      </motion.div>

      <motion.div
        style={reduced ? undefined : { y: lowY, opacity: lowOpacity }}
        className="on-shade absolute inset-x-0 bottom-0"
      >
        <div
          ref={low}
          data-reveal
          className="mx-auto flex max-w-[90rem] flex-col items-center px-5 pb-[max(1.5rem,5svh)] text-center md:px-10 md:pb-[7vh]"
        >
          <div className="hero-lift flex flex-col items-center" style={{ "--delay": "0.9s" } as CSSProperties}>
            <p className="max-w-[44ch] text-[clamp(1.2rem,1.7vw,1.6rem)] font-[380] leading-[1.25] text-tone [font-variation-settings:'FLAR'_70]">
              {t.hero.title1} {t.hero.title2}
            </p>
            {/* A phone keeps the painting for the name, the line and the doors: the paragraph waits for
                the About room, which says it at length, and stays for screen readers. */}
            <p className="mt-3 max-w-[60ch] text-[0.9375rem] leading-[1.6] text-tone-soft max-md:sr-only">
              {t.hero.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href="#projects" className="btn btn--solid">
                {t.hero.cta1}
              </a>
              <a href="#contact" className="btn btn--outline">
                {t.hero.cta2}
              </a>
              <span className="flex items-center gap-1">
                <a
                  href="mailto:davidarcosm@hotmail.com"
                  aria-label="Email"
                  className="flex size-11 items-center justify-center text-tone-soft transition-colors duration-300 hover:text-tone"
                >
                  <MailIcon className="size-[1.15rem]" />
                </a>
                <a
                  href="https://github.com/DavidRT12RT"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex size-11 items-center justify-center text-tone-soft transition-colors duration-300 hover:text-tone"
                >
                  <GitHubIcon className="size-[1.05rem]" />
                </a>
                <a
                  href="https://www.linkedin.com/in/david-arcos-melgarejo-722008322/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex size-11 items-center justify-center text-tone-soft transition-colors duration-300 hover:text-tone"
                >
                  <LinkedInIcon className="size-[1.05rem]" />
                </a>
              </span>
            </div>
          </div>

          <p className="mt-6 text-[0.75rem] leading-[1.45] text-tone-soft md:absolute md:bottom-[2.25vh] md:right-10 md:mt-0 md:max-w-[40ch] md:text-right">
            {painting.artist}, <cite className="not-italic text-tone">{painting.title}</cite> ({painting.series}),{" "}
            {painting.date} · {painting.collection}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const reduced = usePrefersReducedMotion();

  return (
    <section id="top" data-room="hero" aria-labelledby="hero-title" className="relative">
      {/* The painting holds still for a moment of scroll while the camera pushes in and the city recedes. */}
      <ScrollStage height={reduced ? "100svh" : "165svh"} stageHeight="100svh">
        {({ progress }) => <HeroStage progress={progress} reduced={reduced} />}
      </ScrollStage>
    </section>
  );
}
