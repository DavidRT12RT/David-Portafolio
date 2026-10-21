"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { goToWork } from "./gallery/colonnade-layout";
import { COINS, METALS, type Coin, type CoinCategory } from "./treasury/coins";

// The coins are struck in WebGL on the client only; until then, and without WebGL, each lies flat in its well.
const CoinCabinet = dynamic(() => import("./treasury/CoinCabinet"), { ssr: false });

/** The cabinet's trays, in the order the craft is told everywhere else on the site. */
const TRAYS: CoinCategory[] = ["ai", "frontend", "backend", "cloud"];

/** The trays' places either side of the athlete, who stands in the middle column: read left to right. */
const PLACE: Record<CoinCategory, string> = {
  ai: "md:col-start-1 md:row-start-1",
  frontend: "md:col-start-3 md:row-start-1",
  backend: "md:col-start-1 md:row-start-2",
  cloud: "md:col-start-3 md:row-start-2",
};

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

/** The coin drawn flat in its metal: the emblem, or the name of a coin that carries only its name. */
function FlatCoin({ coin }: { coin: Coin }) {
  return (
    <span className="coin-flat">
      {coin.logo ? (
        <svg viewBox="0 0 24 24" className="w-[40%] translate-y-[4%]">
          <path d={coin.logo} fill="currentColor" />
        </svg>
      ) : (
        <span className="translate-y-[4%]" style={{ fontSize: `${Math.min(21, 115 / coin.name.length)}cqi` }}>
          {coin.name}
        </span>
      )}
    </span>
  );
}

const LABEL = "text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-tone-accent";

/**
 * The works a coin has paid for, each a way to its column in the colonnade. Nearly every coin has some,
 * so they read as one quiet line of links, named once for assistive technology.
 */
function Works({
  coin,
  names,
  label,
  reduced,
  align,
}: {
  coin: Coin;
  names: string[];
  label: string;
  reduced: boolean;
  align: "center" | "start";
}) {
  if (!coin.works.length) return null;
  return (
    <ul
      aria-label={label}
      className={`mt-1.5 flex flex-wrap gap-x-2.5 text-[0.8125rem] leading-snug ${align === "center" ? "justify-center" : ""}`}
    >
      {coin.works.map((index) => (
        <li key={index}>
          <button
            type="button"
            onClick={() => goToWork(index, !reduced)}
            className="inline-flex min-h-6 items-center text-tone-accent underline decoration-tone-line underline-offset-4 transition-colors duration-300 hover:text-tone hover:decoration-tone-accent"
          >
            {names[index]}
          </button>
        </li>
      ))}
    </ul>
  );
}

/** One part of the craft: its coins in their wells, struck on a canvas of their own while near. */
function Tray({ tray, reduced }: { tray: CoinCategory; reduced: boolean }) {
  const { t } = useLanguage();
  const copy = t.treasury;
  const details: Partial<Record<string, string>> = copy.details;
  const shelf = useRef<HTMLDivElement>(null);
  // The canvas (and three.js with it) is fetched only once the tray comes near; until then its coins lie flat.
  const [near, setNear] = useState(false);
  useEffect(() => {
    const element = shelf.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const category = t.skills.categories[tray];
  // The works by their first names (Solomon, Kapli, ScaleFlow, ADVANCE), short enough for a coin's label.
  const works = t.projects.items.map((work) => work.title.split(" — ")[0].split(" ")[0]);
  const coins = COINS.filter((coin) => coin.category === tray);
  const also = [...UNSTRUCK[tray].map((index) => category.items[index]), ...copy.extra[tray]].filter(Boolean);

  return (
    <div ref={shelf} className={`metal-${METALS[tray]} ${PLACE[tray]} relative border-t hairline pt-6`}>
      <h3 className="lit text-[1.125rem] font-[500] leading-snug">
        {category.title}
        <span className="mt-1.5 block text-[0.75rem] font-medium uppercase tracking-[0.16em] text-tone-accent">
          {copy.metals[METALS[tray]]}
        </span>
      </h3>
      <ul className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(6.25rem,1fr))] gap-x-3 gap-y-10 md:grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] md:gap-x-4">
        {coins.map((coin) =>
          coin.services ? (
            // A platform worked in depth gets a row of its own, its services beside the coin.
            <li key={coin.id} data-coin-item className="col-span-full grid grid-cols-subgrid items-start">
              <div className="flex justify-center">
                <span data-coin={coin.id} aria-hidden="true" className="coin-well w-[80%]">
                  <FlatCoin coin={coin} />
                </span>
              </div>
              <div className="col-start-2 col-end-[-1]">
                <p className="lit text-[0.9375rem] font-[460] leading-snug">{coin.name}</p>
                <p className={`${LABEL} mt-2`}>{copy.services}</p>
                <ul className="lit-dim mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[0.8125rem] leading-snug">
                  {coin.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
                <Works coin={coin} names={works} label={copy.inWorks} reduced={reduced} align="start" />
              </div>
            </li>
          ) : (
            <li key={coin.id} data-coin-item className="flex flex-col items-center text-center">
              <span data-coin={coin.id} aria-hidden="true" className="coin-well w-[80%]">
                <FlatCoin coin={coin} />
              </span>
              <p className="lit mt-5 text-[0.9375rem] font-[460] leading-snug">{coin.name}</p>
              {details[coin.id] ? (
                <p className="lit-dim mt-1 text-[0.8125rem] leading-snug">{details[coin.id]}</p>
              ) : null}
              <Works coin={coin} names={works} label={copy.inWorks} reduced={reduced} align="center" />
            </li>
          ),
        )}
      </ul>
      {also.length ? (
        <div className="mt-10">
          <p className={LABEL}>{copy.also}</p>
          <ul className="lit-dim mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.9375rem] leading-[1.5]">
            {also.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {near ? <CoinCabinet vitrine={shelf} reduced={reduced} /> : null}
    </div>
  );
}

/** ΤΕΧΝΗ's treasury: the stack struck as coins, in two vitrines that stand either side of the athlete. */
export default function Treasury() {
  const reduced = usePrefersReducedMotion();

  return (
    // The trays reach both edges of the room, so its guide steps aside while they fill the screen.
    <div
      data-guide-cover
      className="grid gap-y-16 md:grid-cols-[minmax(0,22rem)_1fr_minmax(0,22rem)] md:gap-x-10 md:gap-y-[16vh]"
    >
      {TRAYS.map((tray) => (
        <Tray key={tray} tray={tray} reduced={reduced} />
      ))}
    </div>
  );
}
