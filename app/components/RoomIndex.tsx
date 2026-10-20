"use client";

import { useEffect, useState } from "react";
import { SectionScrollspy, type SectionMeta } from "@/components/spaceui/section-scrollspy";
import { useLanguage } from "@/app/context/LanguageContext";

type FigureKey = "plato" | "homer" | "discobolus" | "athena" | "apollo";
type RoomKey = "about" | "experience" | "skills" | "projects" | "method" | "oracle" | "giants" | "contact";

const FIGURE_KEYS: FigureKey[] = ["plato", "homer", "discobolus", "athena", "apollo"];

/** The guide's label for the room the visitor stands in: the room's Greek name, then its figure. */
function GuideCard({ section }: { section: SectionMeta }) {
  const { t } = useLanguage();
  const roomKey = (section.element.id || "contact") as RoomKey;
  const sign = t.rooms[roomKey] ?? null;
  // A room's figure may stand in only part of it (the athlete above ΤΕΧΝΗ's vitrine).
  const figureKey = (section.element.dataset.room ??
    section.element.querySelector<HTMLElement>("[data-room]")?.dataset.room) as FigureKey | undefined;
  const figure = figureKey && FIGURE_KEYS.includes(figureKey) ? t.figures[figureKey] : null;

  return (
    <div className="w-78.75 bg-marble px-3.5 py-3 text-[0.8125rem] leading-[1.45] text-ink">
      <p className="flex items-baseline justify-between gap-3">
        <span className="font-medium">{section.title}</span>
        {sign ? (
          <span lang="el" className="text-[0.75rem] font-medium tracking-[0.12em] text-gold-deep">
            {sign.greek}
          </span>
        ) : null}
      </p>
      {sign ? (
        <p className="text-ink-soft">
          <span lang="el-Latn" className="translit">
            {sign.translit}
          </span>
          , {sign.gloss}
        </p>
      ) : null}
      {figure ? (
        <div className="mt-2 border-t border-ink/15 pt-2">
          <p className="font-medium">{figure.title}</p>
          <p className="text-ink-soft">{figure.medium}</p>
          <p className="text-ink-soft">{figure.origin}</p>
          <p className="cartela__inv mt-1.5">SMK · {figure.inventory}</p>
        </div>
      ) : null}
    </div>
  );
}

/** "You are here": the room's label and a draggable floor plan, shown once the visitor leaves the entrance. */
export default function RoomIndex() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Out of the way in the entrance, at the very end where the credits line sits, and while two
    // rooms share the screen, so the next room's heading never slides in under it.
    const onScroll = () => {
      const h = window.innerHeight;
      const end = document.documentElement.scrollHeight - h;
      const settled = Array.from(document.querySelectorAll<HTMLElement>("[data-page-section]")).some((room) => {
        if (room.hasAttribute("data-guide-hidden")) return false;
        const rect = room.getBoundingClientRect();
        return rect.top <= h * 0.3 && rect.bottom >= h;
      });
      // A painting holding the screen has the room to itself.
      const covered = Array.from(document.querySelectorAll<HTMLElement>("[data-guide-cover]")).some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < h * 0.6 && rect.bottom > h * 0.4;
      });
      setVisible(window.scrollY > h * 0.75 && window.scrollY < end - 160 && settled && !covered);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <SectionScrollspy portal visible={visible} renderCard={(section) => <GuideCard section={section} />} />;
}
