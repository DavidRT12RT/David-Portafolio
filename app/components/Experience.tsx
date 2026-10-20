"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { useLanguage } from "@/app/context/LanguageContext";
import { ScrollStage } from "@/components/ui/ScrollStage";
import Painting, { type Direction } from "./painting/Painting";
import { ARTWORKS } from "./painting/artworks";
import RoomSign from "./RoomSign";
import FigureFallback from "./FigureFallback";
import FigureCaption from "./FigureCaption";

/**
 * The journey opens on Rubens' battle: the camera rides with the charge across the bridge, left to
 * right, held on the clash above the river, then the battle recedes into the haze and Homer, the poet
 * of such battles, is waiting with the history.
 */
const opening: Direction = (p, width, height) => {
  const tall = width / height < 1;
  const e = p * p * (3 - 2 * p);
  return {
    center: tall ? [0.24 + 0.5 * e, 0.4] : [0.34 + 0.3 * e, 0.36],
    anchor: [0.5, 0.42],
    zoom: tall ? 1.05 : 1.22,
    dolly: 0.4 * e,
    dollyToward: [0.5, 0.3],
    haze: Math.min(1, Math.max(0, (p - 0.6) / 0.36)),
    mist: 0.4,
    light: [0.62, 0.3],
  };
};

function Opening({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const { t } = useLanguage();
  const painting = t.paintings.amazons;
  const signOpacity = useTransform(progress, [0.35, 0.6], [1, 0]);
  const signY = useTransform(progress, [0, 0.6], ["0svh", "-6svh"]);
  const scrimOpacity = useTransform(progress, [0.4, 0.85], [1, 0]);

  return (
    <div className="on-shade relative h-full w-full">
      <Painting art={ARTWORKS.amazons} progress={progress} reduced={reduced} direct={opening} zoomMax={1.3} />
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { opacity: scrimOpacity }}
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(28,16,9,0.88)_0%,rgba(28,16,9,0.5)_36%,rgba(28,16,9,0)_64%)]"
      />
      <motion.div
        style={reduced ? undefined : { opacity: signOpacity, y: signY }}
        className="absolute inset-x-0 bottom-[11svh] mx-auto max-w-[90rem] px-5 md:bottom-[12vh] md:px-10"
      >
        <RoomSign
          id="experience-heading"
          greek={t.rooms.experience.greek}
          local={t.experience.title}
          highlight={t.experience.titleHighlight}
          note={t.experience.subtitle}
          className="md:w-[46%]"
        />
      </motion.div>
      <motion.p
        style={reduced ? undefined : { opacity: signOpacity }}
        className="absolute bottom-5 right-5 max-w-[34ch] text-right text-[0.75rem] leading-[1.45] text-tone-soft md:bottom-8 md:right-10 md:max-w-[40ch]"
      >
        {painting.artist}, <cite className="not-italic text-tone">{painting.title}</cite>, {painting.date} ·{" "}
        {painting.collection}
      </motion.p>
    </div>
  );
}

export default function Experience() {
  const { t } = useLanguage();
  const route = useRef<HTMLOListElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: route, offset: ["start 0.7", "end 0.55"] });
  const travelled = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.6 });

  return (
    <section
      id="experience"
      data-room="homer"
      data-page-section
      data-guide-side="left"
      aria-labelledby="experience-heading"
      className="relative"
    >
      {/* The battle holds the screen for a moment of scroll, then gives way to the history. */}
      <div data-guide-cover>
        <ScrollStage height={reduced ? "100svh" : "190svh"}>
          {({ progress }) => <Opening progress={progress} reduced={reduced} />}
        </ScrollStage>
      </div>

      <FigureFallback figure="homer" side="left" />
      <FigureCaption figure="homer" />
      <div className="room-curtain mx-auto max-w-[90rem] px-5 pb-[14vh] md:px-10 md:pt-[16vh]">
        <div className="md:ml-[44%] md:w-[52%]">
          <ol ref={route} className="relative pl-8 md:pl-10">
            {/* The voyage: a hairline route that fills as the visitor reads down the history. */}
            <span aria-hidden="true" className="absolute bottom-2 left-[3px] top-3 w-px bg-tone-line" />
            <motion.span
              aria-hidden="true"
              className="absolute bottom-2 left-[3px] top-3 w-px origin-top bg-gold"
              style={{ scaleY: reduced ? 1 : travelled }}
            />

            {t.experience.jobs.map((job) => (
              <li key={`${job.company}-${job.period}`} className="relative border-t hairline py-10 first:border-t-0 first:pt-2">
                <span
                  aria-hidden="true"
                  className="absolute -left-8 top-[3.05rem] size-[7px] rounded-full border border-tone-accent bg-tone-ground md:-left-10 [li:first-child>&]:top-[0.9rem]"
                />
                <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-6">
                  <h3 className="lit text-[1.375rem] font-[460] leading-tight">{job.role}</h3>
                  <p className="shrink-0 text-[0.8125rem] uppercase tracking-[0.1em] text-tone-accent tabular-nums">
                    {job.period}
                  </p>
                </div>
                <p className="mt-1 text-[1rem] text-tone-soft">
                  {job.company}
                  {job.location ? <span className="text-tone-mute"> · {job.location}</span> : null}
                </p>
                <p className="lit-dim mt-4 max-w-[64ch] text-[1rem] leading-[1.75]">{job.description}</p>
                <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-[0.8125rem] text-tone-mute">
                  {job.tags.map((tag, i) => (
                    <li key={tag} className="flex items-center gap-3">
                      {i > 0 ? <span aria-hidden="true" className="text-tone-line">/</span> : null}
                      {tag}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
