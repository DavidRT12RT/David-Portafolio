"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { ScrollStage } from "@/components/ui/ScrollStage";
import { gallery } from "@/app/lib/gallery";
import RoomSign from "./RoomSign";
import FigureFallback from "./FigureFallback";
import FigureCaption from "./FigureCaption";
import Treasury from "./Treasury";
import { METALS } from "./treasury/coins";

type CategoryKey = "ai" | "frontend" | "backend" | "cloud";

/**
 * Each part of the stack is pinned to the part of the athlete that carries it: the mind to the head,
 * the visible gesture to the hand with the discus, the core to the torso, the foundation to the base.
 * Callouts sit on the same side as their point so no line crosses the figure.
 */
const CALLOUTS: { key: CategoryKey; anchor: string; side: "left" | "right" }[] = [
  { key: "ai", anchor: "head", side: "right" },
  { key: "frontend", anchor: "hand", side: "left" },
  { key: "backend", anchor: "torso", side: "left" },
  { key: "cloud", anchor: "base", side: "left" },
];

/** A part of the craft named at its place on the figure, with the metal its coins are struck in below. */
function Category({
  title,
  metal,
  innerRef,
  align,
}: {
  title: string;
  metal: string;
  innerRef?: (el: HTMLDivElement | null) => void;
  align: "left" | "right";
}) {
  return (
    <div ref={innerRef} className={align === "right" ? "md:text-right" : ""}>
      <p className="lit text-[1.125rem] font-[500] tracking-[0.01em]">{title}</p>
      <p className="mt-1.5 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-tone-accent">{metal}</p>
    </div>
  );
}

export default function Skills() {
  const { t } = useLanguage();
  const categories = t.skills.categories;
  const svg = useRef<SVGSVGElement>(null);
  const blocks = useRef<Partial<Record<CategoryKey, HTMLDivElement | null>>>({});
  const paths = useRef<Partial<Record<CategoryKey, SVGPathElement | null>>>({});
  const dots = useRef<Partial<Record<CategoryKey, SVGCircleElement | null>>>({});

  // Leader lines from each category to its point on the figure, re-drawn whenever the figure moves.
  useEffect(() => {
    const update = () => {
      const frame = svg.current;
      if (!frame) return;
      const box = frame.getBoundingClientRect();
      for (const { key, anchor, side } of CALLOUTS) {
        const path = paths.current[key];
        const dot = dots.current[key];
        const block = blocks.current[key];
        const point = gallery.anchors[`discobolus.${anchor}`];
        if (!path || !dot || !block) continue;
        const shown = Boolean(point?.visible);
        path.style.opacity = shown ? "1" : "0";
        dot.style.opacity = shown ? "1" : "0";
        if (!point || !shown) continue;
        const r = block.getBoundingClientRect();
        const sx = (side === "left" ? r.right + 20 : r.left - 20) - box.left;
        const sy = r.top + 13 - box.top;
        const ax = point.x - box.left;
        const ay = point.y - box.top;
        const elbow = sx + (ax - sx) * 0.42;
        path.setAttribute("d", `M ${sx} ${sy} H ${elbow} L ${ax} ${ay}`);
        dot.setAttribute("cx", String(ax));
        dot.setAttribute("cy", String(ay));
      }
    };
    gallery.anchorListeners.add(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      gallery.anchorListeners.delete(update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      id="skills"
      data-page-section
      data-guide-side="right"
      aria-labelledby="skills-heading"
      className="relative"
    >
      {/* The athlete's part of the room, measured on its own so his turn and light keep their pace. */}
      <div data-room="discobolus" className="relative">
        <FigureFallback figure="discobolus" side="center" />
        <FigureCaption figure="discobolus" />
        <div className="room-curtain mx-auto max-w-[90rem] px-5 md:px-10 md:pt-[24vh]">
          <RoomSign
            id="skills-heading"
            greek={t.rooms.skills.greek}
            local={t.skills.title}
            highlight={t.skills.titleHighlight}
            note={t.skills.subtitle}
            className="md:w-[44%]"
          />
        </div>

        {/* Desktop: the room pins while the athlete turns on his base, each part of the craft at its place. */}
        <div className="hidden md:block">
          <ScrollStage height="230vh">
            <div className="relative mx-auto grid h-full max-w-[90rem] grid-cols-[minmax(0,22rem)_1fr_minmax(0,25rem)] px-10 py-[11vh]">
              {(["left", "right"] as const).map((column) => (
                <div
                  key={column}
                  className={column === "left" ? "col-start-1 flex flex-col justify-between" : "col-start-3 self-start"}
                >
                  {CALLOUTS.filter((c) => c.side === column).map(({ key, side }) => (
                    <Category
                      key={key}
                      title={categories[key].title}
                      metal={t.treasury.metals[METALS[key]]}
                      align={side}
                      innerRef={(el) => {
                        blocks.current[key] = el;
                      }}
                    />
                  ))}
                </div>
              ))}
              <svg
                ref={svg}
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                aria-hidden="true"
              >
                {CALLOUTS.map(({ key }) => (
                  <g key={key}>
                    <path
                      ref={(el) => {
                        paths.current[key] = el;
                      }}
                      fill="none"
                      stroke="var(--color-gold)"
                      strokeOpacity={0.55}
                      strokeWidth={1}
                      style={{
                        opacity: 0,
                        transition: "opacity 0.6s var(--ease-out-expo)",
                      }}
                    />
                    <circle
                      ref={(el) => {
                        dots.current[key] = el;
                      }}
                      r={3.5}
                      fill="var(--tone-ground)"
                      stroke="var(--color-gold)"
                      strokeWidth={1}
                      style={{
                        opacity: 0,
                        transition: "opacity 0.6s var(--ease-out-expo)",
                      }}
                    />
                  </g>
                ))}
              </svg>
            </div>
          </ScrollStage>
        </div>
      </div>

      {/* Then the stack itself, struck as coins in the treasury's vitrine. */}
      <Treasury />
    </section>
  );
}
