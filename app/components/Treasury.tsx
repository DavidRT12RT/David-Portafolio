"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { goToWork } from "./gallery/colonnade-layout";
import { COINS, METALS, type Coin, type CoinCategory } from "./treasury/coins";

// The coins are struck in WebGL on the client only; until then, and without WebGL, each lies flat in its well.
const CoinCabinet = dynamic(() => import("./treasury/CoinCabinet"), {
  ssr: false,
});

/** The cabinet's trays, in the order the craft is told everywhere else on the site. */
const TRAYS: CoinCategory[] = ["ai", "frontend", "backend", "cloud"];

/**
 * The stack's entries no coin carries (practices rather than products), by their place in each
 * category's list, so they stay in the room beneath their tray.
 */
const UNSTRUCK: Record<CoinCategory, number[]> = {
  ai: [1, 2, 3, 4, 5, 7, 8, 9],
  frontend: [],
  backend: [4, 5],
  cloud: [5],
};

/** The coin drawn flat in its metal: the emblem, or the legend of a coin that carries only its name. */
function FlatCoin({ coin }: { coin: Coin }) {
  return (
    <span className="coin-flat">
      {coin.logo ? (
        <svg viewBox="0 0 24 24" className="w-[40%] translate-y-[4%]">
          <path d={coin.logo} fill="currentColor" />
        </svg>
      ) : (
        <span className="translate-y-[4%]">{coin.name}</span>
      )}
    </span>
  );
}

/** ΤΕΧΝΗ's treasury: the stack struck as coins in a vitrine in the shade, below the athlete. */
export default function Treasury() {
  const { t } = useLanguage();
  const copy = t.treasury;
  const details: Partial<Record<string, string>> = copy.details;
  const reduced = usePrefersReducedMotion();
  const vitrine = useRef<HTMLDivElement>(null);
  // The works by their short names, as the colonnade's plates carry them.
  const works = t.projects.items.map((work) => work.title.split(" — ")[0]);

  return (
    // The vitrine holds the whole width, so the room's guide steps aside while it fills the screen.
    <div data-room="treasury" data-guide-cover className="treasury-ground on-shade relative">
      <div className="mx-auto max-w-[90rem] px-5 pb-[24vh] pt-[30vh] md:px-10 md:pb-[26vh] md:pt-[32vh]">
        <p className="lit-dim max-w-[52ch] text-[clamp(1.125rem,1.5vw,1.375rem)] font-[340] leading-[1.55] md:ml-[15.5rem]">
          {copy.intro}
        </p>

        <div ref={vitrine} className="relative mt-14 border-b hairline md:mt-20">
          {TRAYS.map((tray) => {
            const category = t.skills.categories[tray];
            const also = UNSTRUCK[tray].map((index) => category.items[index]).filter(Boolean);
            return (
              <div
                key={tray}
                className={`metal-${METALS[tray]} border-t hairline pb-12 pt-8 md:grid md:grid-cols-[13rem_minmax(0,1fr)] md:gap-x-10 md:pb-14 md:pt-11`}
              >
                <h3 className="lit text-[1.125rem] font-[500] leading-snug">
                  {category.title}
                  <span className="mt-1.5 block text-[0.75rem] font-medium uppercase tracking-[0.16em] text-tone-accent">
                    {copy.metals[METALS[tray]]}
                  </span>
                </h3>
                <ul className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(6.25rem,1fr))] gap-x-3 gap-y-10 md:mt-0 md:grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] md:gap-x-6">
                  {COINS.filter((coin) => coin.category === tray).map((coin) => (
                    <li key={coin.id} data-coin-item className="flex flex-col items-center text-center">
                      <span data-coin={coin.id} aria-hidden="true" className="coin-well w-[80%]">
                        <FlatCoin coin={coin} />
                      </span>
                      <p className="lit mt-5 text-[0.9375rem] font-[460] leading-snug">{coin.name}</p>
                      {details[coin.id] ? (
                        <p className="lit-dim mt-1 text-[0.8125rem] leading-snug">{details[coin.id]}</p>
                      ) : null}
                      {coin.works.length ? (
                        <div className="mt-2 text-[0.8125rem] leading-snug">
                          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-tone-accent">
                            {copy.inWorks}
                          </p>
                          <ul className="mt-0.5 flex flex-col items-center">
                            {coin.works.map((index) => (
                              <li key={index}>
                                <button
                                  type="button"
                                  onClick={() => goToWork(index, !reduced)}
                                  className="inline-flex min-h-6 items-center text-tone-soft underline decoration-tone-line underline-offset-4 transition-colors duration-300 hover:text-tone-accent hover:decoration-tone-accent"
                                >
                                  {works[index]}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {also.length ? (
                  <div className="mt-10 md:col-start-2">
                    <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-tone-accent">
                      {copy.also}
                    </p>
                    <ul className="lit-dim mt-2 flex flex-wrap gap-x-6 gap-y-1.5 text-[0.9375rem] leading-[1.5]">
                      {also.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            );
          })}
          <CoinCabinet vitrine={vitrine} reduced={reduced} />
        </div>
      </div>
    </div>
  );
}
