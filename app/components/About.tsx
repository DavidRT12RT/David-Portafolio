"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { ScrollTextReveal } from "@/components/spaceui/scroll-text-reveal";
import { AnimatedCounter } from "@/components/arc/animated-counter/animated-counter";
import RoomSign from "./RoomSign";
import FigureFallback from "./FigureFallback";
import FigureCaption from "./FigureCaption";

export default function About() {
  const { t } = useLanguage();

  const ledger = [
    { value: 3, label: t.about.stats.years },
    { value: 15, label: t.about.stats.projects },
    { value: 20, label: t.about.stats.technologies },
    { value: 5, label: t.about.stats.ai },
  ];

  return (
    <section
      id="about"
      data-room="plato"
      data-page-section
      data-guide-side="right"
      aria-labelledby="about-heading"
      className="relative"
    >
      <FigureFallback figure="plato" side="right" />
      <FigureCaption figure="plato" />
      <div className="room-curtain mx-auto max-w-[90rem] px-5 pb-[12vh] md:px-10 md:pt-[26vh]">
        <div className="md:w-[54%]">
          <RoomSign
            id="about-heading"
            greek={t.rooms.about.greek}
            local={t.about.title}
            highlight={t.about.titleHighlight}
            note={t.about.subtitle}
          />

          <div className="lit-dim mt-14 max-w-[62ch] space-y-6 text-[1.0625rem] leading-[1.75]">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>
        </div>

        <ScrollTextReveal
          as="p"
          splitBy="word"
          inactiveOpacity={0.14}
          offset={["start 0.85", "end 0.45"]}
          className="mt-[16vh] max-w-[22ch] text-[clamp(1.85rem,3.6vw,3.4rem)] font-[320] leading-[1.14] tracking-[-0.015em] text-tone [font-variation-settings:'FLAR'_80] md:max-w-[24ch]"
        >
          {t.about.p3}
        </ScrollTextReveal>

        <dl className="mt-[14vh] border-t hairline md:w-[54%]">
          {ledger.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-6 border-b hairline py-4">
              <dt className="lit-dim text-[1rem]">{row.label}</dt>
              <dd className="text-[1.75rem] font-[380] tabular-nums text-tone">
                <AnimatedCounter value={row.value} suffix="+" animateOnView />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
