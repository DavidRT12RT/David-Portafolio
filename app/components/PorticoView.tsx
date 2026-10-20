"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import Painting, { type Direction } from "./painting/Painting";
import { ARTWORKS } from "./painting/artworks";

interface Box {
  top: number;
  height: number;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** How far the view reaches beyond its stage at each end, easing into the sky. */
const FEATHER = "24svh";
/** The Parthenon's west front in Church's painting, 0..1 from the top left. */
const TEMPLE: [number, number] = [0.55, 0.36];

/**
 * The view out of the portico. The camera arrives close on the temple's front and pulls back to the
 * whole Acropolis as the room's sign appears; while the colonnade slides past it pans the same way,
 * more slowly, so the columns stand in front of a distance; when the last work has been seen the
 * view recedes into the haze.
 */
const direction: Direction = (p, width, height) => {
  const tall = width / height < 1;
  const reveal = smooth(clamp01(p / 0.12));
  const walk = smooth(clamp01((p - 0.08) / 0.84));
  const across: [number, number] = tall ? [0.22 + 0.56 * walk, 0.42] : [0.38 + 0.24 * walk, 0.4];
  return {
    center: [lerp(TEMPLE[0], across[0], reveal), lerp(TEMPLE[1], across[1], reveal)],
    anchor: [0.5, 0.45],
    zoom: lerp(tall ? 1.55 : 1.9, tall ? 1.04 : 1.12, reveal),
    dolly: 0.22 * walk,
    dollyToward: TEMPLE,
    haze: clamp01((p - 0.93) / 0.07),
    mist: 0.3,
    light: [0.28, 0.3],
  };
};

function Band({ box }: { box: Box }) {
  const stage = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  // The same span of scroll as the works stage it sits beneath, so both move as one.
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start start", "end end"] });
  // Shade gathered behind the room's sign while it stands over the bright temple, leaving with it.
  const signShade = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <div
      className="absolute inset-x-0"
      style={{ top: `calc(${box.top}px - ${FEATHER})`, height: `calc(${box.height}px + 2 * ${FEATHER})` }}
    >
      <div ref={stage} className="absolute inset-x-0" style={{ top: FEATHER, height: box.height }} />
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Painting
          art={ARTWORKS.parthenon}
          progress={scrollYProgress}
          reduced={reduced}
          direct={direction}
          zoomMax={1.9}
        />
        <div className="portico-frame absolute inset-0" />
        <motion.div style={{ opacity: signShade }} className="portico-sign-shade absolute inset-0" />
      </div>
      <div className="portico-edge portico-edge--top absolute inset-x-0 top-0" style={{ height: FEATHER }} />
      <div className="portico-edge portico-edge--bottom absolute inset-x-0 bottom-0" style={{ height: FEATHER }} />
    </div>
  );
}

/**
 * The works' portico opens onto Frederic Church's Parthenon. The painting lies on the page beneath
 * the gallery canvas, so the Ionic columns stand in front of it; it follows the element marked
 * `data-portico` and holds still for the length of its stage, feathered into the sky at both ends.
 */
export default function PorticoView() {
  const [box, setBox] = useState<Box | null>(null);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = document.querySelector<HTMLElement>("[data-portico]");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const next = { top: rect.top + window.scrollY, height: rect.height };
      setBox((current) => (current && current.top === next.top && current.height === next.height ? current : next));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[-1]">
      {box ? <Band box={box} /> : null}
    </div>
  );
}
