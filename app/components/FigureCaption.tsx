"use client";

import { useLanguage } from "@/app/context/LanguageContext";

type FigureKey = "plato" | "homer" | "discobolus" | "athena" | "apollo";

/**
 * On phones the figure stands alone above its room, where the desktop guide does not reach: this
 * small museum label sits at its feet, and stays legible as the room's text slides up over the figure.
 */
export default function FigureCaption({ figure }: { figure: FigureKey }) {
  const { t } = useLanguage();
  const data = t.figures[figure];

  return (
    <div className="relative flex h-[58svh] items-end px-5 pb-4 md:hidden" aria-hidden="true">
      <p className="cartela max-w-[34ch] px-3 py-2 text-[0.75rem] leading-[1.45] text-ink-soft">
        <span className="font-medium text-ink">{data.title}</span> · {data.origin}{" "}
        <span className="tabular-nums">SMK · {data.inventory}</span>
      </p>
    </div>
  );
}
