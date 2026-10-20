"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useTransform } from "motion/react";
import { useLanguage } from "@/app/context/LanguageContext";
import { ScrollStage, useScrollStage } from "@/components/ui/ScrollStage";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { colonnadeMode, goToWork, panelSize, pillarX } from "./gallery/colonnade-layout";
import RoomSign from "./RoomSign";
import { ArrowIcon } from "./icons";

const projectImages: string[][] = [
  ["/projects/solomon-consulting/1.png", "/projects/solomon-consulting/2.png"],
  ["/projects/kapli-web/1.png", "/projects/kapli-mobil/1.png", "/projects/kapli-mobil/2.png"],
  ["/projects/scaleflow_suite/1.png", "/projects/scaleflow_suite/2.png"],
  ["/projects/advance_inteligent_system/1.png", "/projects/advance_inteligent_system/2.png"],
];

const onResize = (callback: () => void) => {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};

/** The viewport the canvas lays the colonnade out in, so these controls land on its panels exactly. */
function useColonnadeViewport() {
  const width = useSyncExternalStore(onResize, () => window.innerWidth, () => 1440);
  const height = useSyncExternalStore(onResize, () => window.innerHeight, () => 900);
  return { mode: colonnadeMode(width, height), aspect: width / height, width, height };
}

type Viewport = ReturnType<typeof useColonnadeViewport>;

const fill = (template: string, n: number, total: number) =>
  template.replace("{n}", String(n)).replace("{total}", String(total));

/** One exhibit in the lightbox; keyed by project so its image position starts over each time. */
function LightboxBody({ index, onClose }: { index: number; onClose: () => void }) {
  const { t } = useLanguage();
  const [shown, setShown] = useState(0);
  const project = t.projects.items[index];
  const images = projectImages[index];

  const step = useCallback(
    (delta: number) => setShown((current) => (current + delta + images.length) % images.length),
    [images.length],
  );

  return (
    <div
      className="flex h-full flex-col"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1);
        if (event.key === "ArrowLeft") step(-1);
      }}
    >
      <div className="flex items-start justify-between gap-6 px-5 pb-3 pt-5 md:px-10 md:pt-7">
        <div>
          <h3 className="text-[clamp(1.2rem,2vw,1.6rem)] font-[460] leading-tight text-tone">{project.title}</h3>
          <p className="mt-1 text-[0.8125rem] tabular-nums text-tone-mute" aria-live="polite">
            {fill(t.ui.imageOf, shown + 1, images.length)}
          </p>
        </div>
        <button type="button" onClick={onClose} className="btn btn--solid min-h-10 shrink-0 px-4 text-[0.875rem]">
          {t.ui.close}
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <Image
          key={images[shown]}
          src={images[shown]}
          alt={`${project.title} — ${fill(t.ui.imageOf, shown + 1, images.length)}`}
          fill
          sizes="100vw"
          className="object-contain px-16 md:px-24"
        />
        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={t.ui.previous}
              className="btn btn--outline absolute left-3 top-1/2 size-12 -translate-y-1/2 bg-tone-ground/80 px-0 md:left-8 md:size-14"
            >
              <ArrowIcon className="size-5 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={t.ui.next}
              className="btn btn--outline absolute right-3 top-1/2 size-12 -translate-y-1/2 bg-tone-ground/80 px-0 md:right-8 md:size-14"
            >
              <ArrowIcon className="size-5" />
            </button>
          </>
        ) : null}
      </div>

      <p className="mx-auto max-w-[78ch] px-5 pb-6 pt-4 text-center text-[0.9375rem] leading-[1.6] text-tone-soft md:pb-8">
        {project.description}
      </p>
    </div>
  );
}

/** A native modal dialog: it traps focus, closes on Escape and keeps the page inert behind it. */
function Lightbox({ index, onClose }: { index: number | null; onClose: () => void }) {
  const { t } = useLanguage();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (index !== null && !el.open) el.showModal();
    else if (index === null && el.open) el.close();
  }, [index]);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
      aria-label={index === null ? undefined : t.projects.items[index].title}
      className="on-shade fixed inset-0 m-0 h-[100svh] max-h-none w-screen max-w-none bg-tone-ground/96 p-0 text-tone backdrop:bg-black/70"
    >
      {index !== null ? <LightboxBody key={index} index={index} onClose={onClose} /> : null}
    </dialog>
  );
}

/** A panel's hit area and the label mounted on its column; both follow the colonnade as it slides. */
function Exhibit({
  index,
  count,
  focused,
  viewport,
  onOpen,
}: {
  index: number;
  count: number;
  focused: boolean;
  viewport: Viewport;
  onOpen: () => void;
}) {
  const { t } = useLanguage();
  const { progress } = useScrollStage();
  const project = t.projects.items[index];
  const { mode, aspect, width, height } = viewport;
  const panel = panelSize(mode, aspect);
  const center = useTransform(progress, (p) => pillarX(index, p, count, mode) * width);
  // The label hangs on its column below the capital, but never runs off a short screen: when the
  // description would reach the bottom edge it rises over the shaft instead of being cut.
  const label = useRef<HTMLDivElement>(null);
  const [labelHeight, setLabelHeight] = useState(0);
  useLayoutEffect(() => {
    const el = label.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setLabelHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const panelBottom = (panel.top + panel.height) * height;
  const labelTop = Math.max(
    panelBottom + 12,
    Math.min((mode === "portrait" ? 0.63 : 0.61) * height, height - labelHeight - 16),
  );

  return (
    <motion.div className="absolute top-0 h-full" style={{ left: center }}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${t.ui.viewScreens}: ${project.title}`}
        className="group absolute -translate-x-1/2"
        style={{ top: panel.top * height, width: panel.width * width, height: panel.height * height }}
      >
        <span className="btn btn--ink absolute bottom-3 left-1/2 min-h-9 -translate-x-1/2 px-4 text-[0.8125rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          {t.ui.viewScreens}
          <span className="tabular-nums text-tone-soft">{projectImages[index].length}</span>
        </span>
      </button>

      <div
        ref={label}
        className={`cartela absolute w-[min(80vw,23rem)] -translate-x-1/2 px-5 py-4 transition-opacity duration-500 md:w-[min(26vw,23rem)] ${
          focused ? "opacity-100" : "opacity-80"
        }`}
        style={{ top: labelTop }}
      >
        <h3 className="text-[1.0625rem] font-[480] leading-snug text-ink">{project.title}</h3>
        <p className="cartela__inv mt-2">{project.tags.join(" · ")}</p>
        <div
          className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)] ${
            focused ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <p className="pt-3 text-[0.875rem] leading-[1.55] text-ink-soft">{project.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** The colonnade's controls: exhibits, arrows and the counter, inside the pinned stage. */
function Colonnade({ onOpen }: { onOpen: (i: number) => void }) {
  const { t } = useLanguage();
  const { progress } = useScrollStage();
  const viewport = useColonnadeViewport();
  const reduced = usePrefersReducedMotion();
  const count = t.projects.items.length;
  const [focus, setFocus] = useState(0);
  useMotionValueEvent(progress, "change", (p) => setFocus(Math.round(p * (count - 1))));
  const panel = panelSize(viewport.mode, viewport.aspect);
  // The room's sign greets the visitor, then steps aside as the colonnade starts to move.
  const signOpacity = useTransform(progress, [0, 0.07], [1, 0]);
  // On phones the sign and the counter share the space above the first panel, so the counter takes
  // over as the sign steps aside; wide screens show both.
  const counterOpacity = useTransform(progress, [0.075, 0.13], [0, 1]);
  const portrait = viewport.mode === "portrait";
  const painting = t.paintings.parthenon;

  const go = (target: number) => goToWork(target, !reduced);

  return (
    // The controls come and go with the room's light like the columns they are laid on; bright
    // labels on dark shade read longer than the hazing stone, so they fade on the square of it.
    <div className="relative h-full w-full" style={{ opacity: "calc(var(--room-light) * var(--room-light))" }}>
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[max(9svh,5rem)] mx-auto max-w-[90rem] px-5 md:top-[12vh] md:px-10"
        style={{ opacity: signOpacity }}
      >
        <RoomSign
          id="projects-heading"
          greek={t.rooms.projects.greek}
          local={t.projects.title}
          highlight={t.projects.titleHighlight}
          note={t.projects.subtitle}
          noteClassName="max-md:hidden text-tone-soft"
          className="md:w-[32%]"
        />
      </motion.div>

      {t.projects.items.map((project, i) => (
        <Exhibit
          key={project.title}
          index={i}
          count={count}
          focused={i === focus}
          viewport={viewport}
          onOpen={() => onOpen(i)}
        />
      ))}

      <div
        className="pointer-events-none absolute inset-x-0 flex items-center justify-between px-3 md:px-10"
        style={{ top: `calc(${(panel.top + panel.height / 2) * viewport.height}px - 1.5rem)` }}
      >
        <button
          type="button"
          onClick={() => go(focus - 1)}
          disabled={focus === 0}
          aria-label={t.ui.previousWork}
          className="btn btn--outline pointer-events-auto size-12 bg-tone-ground/80 px-0 disabled:pointer-events-none disabled:opacity-0 md:size-14"
        >
          <ArrowIcon className="size-5 rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => go(focus + 1)}
          disabled={focus === count - 1}
          aria-label={t.ui.nextWork}
          className="btn btn--outline pointer-events-auto size-12 bg-tone-ground/80 px-0 disabled:pointer-events-none disabled:opacity-0 md:size-14"
        >
          <ArrowIcon className="size-5" />
        </button>
      </div>

      {/* The counter hangs in the focused work's shaft of light, on a slip of shade so it stays legible. */}
      <motion.p
        className="absolute inset-x-0 text-center"
        style={{ top: `calc(${panel.top * viewport.height}px - 2.5rem)`, opacity: portrait ? counterOpacity : 1 }}
        aria-live="polite"
      >
        <span className="inline-block bg-tone-ground/85 px-3 py-1 text-[0.8125rem] tabular-nums tracking-[0.12em] text-tone-soft">
          {fill(t.ui.workOf, focus + 1, count)}
        </span>
      </motion.p>

      {/* The view through the columns is a painting too, and is credited like the others. */}
      <motion.p
        style={{ opacity: counterOpacity }}
        className="absolute right-5 top-[4.75rem] max-w-[30ch] text-right text-[0.6875rem] leading-[1.45] text-tone-soft md:right-10 md:top-[5.5rem] md:max-w-[40ch] md:text-[0.75rem]"
      >
        {painting.artist}, <cite className="not-italic text-tone">{painting.title}</cite>, {painting.date} ·{" "}
        {painting.collection}
      </motion.p>
    </div>
  );
}

export default function Projects() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(null);
  const count = t.projects.items.length;

  return (
    <section id="projects" data-page-section data-guide-hidden aria-labelledby="projects-heading" className="relative">
      {/* The colonnade itself is drawn in the gallery canvas, in the shade of a portico that opens onto
          Church's Parthenon (PorticoView, beneath the canvas); this pinned stage drives both and carries
          the controls, so the carousel starts to move as soon as the room arrives. */}
      <div data-room="works" data-portico className="on-shade">
        <ScrollStage height={`${100 + (count - 1) * 70}svh`}>
          <Colonnade onOpen={setOpen} />
        </ScrollStage>
      </div>

      <Lightbox index={open} onClose={() => setOpen(null)} />
    </section>
  );
}
