"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import RoomSign from "./RoomSign";
import FigureFallback from "./FigureFallback";
import FigureCaption from "./FigureCaption";
import Treasury from "./Treasury";

export default function Skills() {
  const { t } = useLanguage();

  return (
    <section id="skills" data-page-section aria-labelledby="skills-heading" className="relative">
      <div className="mx-auto max-w-[90rem] px-5 pb-12 pt-[14vh] md:px-10 md:pb-[6vh] md:pt-[24vh]">
        <div className="grid gap-8 md:grid-cols-2 md:items-end md:gap-16">
          <RoomSign
            id="skills-heading"
            greek={t.rooms.skills.greek}
            local={t.skills.title}
            highlight={t.skills.titleHighlight}
            note={t.skills.subtitle}
          />
          <p className="lit-dim max-w-[52ch] text-[clamp(1.0625rem,1.4vw,1.25rem)] font-[340] leading-[1.6]">
            {t.treasury.intro}
          </p>
        </div>
      </div>

      {/* The athlete's part of the room: he rises in with the trays, holds while they pass him on both
          sides, turning on his base, and leaves with them. */}
      <div data-room="discobolus" className="relative">
        <FigureFallback figure="discobolus" side="center" />
        <FigureCaption figure="discobolus" />
        <div className="room-curtain mx-auto max-w-[90rem] px-5 md:px-10 md:pb-[20vh] md:pt-[8vh]">
          <Treasury />
        </div>
      </div>
    </section>
  );
}
