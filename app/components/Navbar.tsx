"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { LANGUAGE_PATH, useLanguage } from "@/app/context/LanguageContext";
import { gallery } from "@/app/lib/gallery";
import { MorphMenu } from "@/components/ui/morph-menu";

/** Below this luminance marble lettering reads better than umber ink: both contrast equally with it. */
const CROSSOVER = 0.19;

const colors = new Map<string, [number, number]>();
let swatch: CanvasRenderingContext2D | null = null;

/** A computed colour's relative luminance and alpha, in whatever syntax the browser serialises it. */
function readColor(color: string): [number, number] {
  const known = colors.get(color);
  if (known) return known;
  swatch ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!swatch) return [1, 0];
  swatch.clearRect(0, 0, 1, 1);
  swatch.fillStyle = color;
  swatch.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = swatch.getImageData(0, 0, 1, 1).data;
  const linear = (c: number) => (c / 255 <= 0.04045 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4);
  const read: [number, number] = [0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b), a / 255];
  colors.set(color, read);
  return read;
}

/** How much of an element shows: its opacity times its ancestors'. */
function shown(element: Element) {
  let alpha = 1;
  for (let node: Element | null = element; node && alpha > 0; node = node.parentElement) {
    alpha *= Number(getComputedStyle(node).opacity);
  }
  return alpha;
}

/** The luminance a painting shows now: its tone, dissolved into the ground by its haze and its fade. */
function paintingLuminance(painting: Element, ground: number) {
  const visible = shown(painting) * (1 - (gallery.paintings.get(painting) ?? 0));
  if (visible < 0.05) return null;
  const [tone] = readColor(getComputedStyle(painting).backgroundColor);
  return ground + (tone - ground) * visible;
}

interface Behind {
  /** Marble reads better than ink here. */
  shaded: boolean;
  /** A flat ground decided it (a floor, or the page's own), not a painting. */
  flat: boolean;
}

/**
 * What lies beneath a point of the bar. The first thing there with a ground of its own decides, a
 * painting by how much of it still shows. With nothing there, a shaded room whose own painting hasn't
 * dissolved here keeps the marble its text uses: the works' portico stands before a view the pointer
 * can't reach. Past that, a painting lying under the page, then the page's ground.
 */
function readBehind(bar: HTMLElement, x: number, y: number): Behind {
  const ground = readColor(getComputedStyle(document.documentElement).backgroundColor)[0];
  const tried = new Set<Element>();
  let first: Element | null = null;
  for (const element of document.elementsFromPoint(x, y)) {
    if (bar.contains(element)) continue;
    if (element === document.body || element === document.documentElement) break;
    const painting = element.closest("[data-painting]");
    if (painting) {
      if (tried.has(painting)) continue;
      tried.add(painting);
      const luminance = paintingLuminance(painting, ground);
      if (luminance !== null) return { shaded: luminance < CROSSOVER, flat: false };
      continue;
    }
    const [luminance, alpha] = readColor(getComputedStyle(element).backgroundColor);
    if (alpha >= 0.5 && alpha * shown(element) >= 0.5) return { shaded: luminance < CROSSOVER, flat: true };
    if (!first && shown(element) >= 0.5) first = element;
  }
  const room = first?.closest(".on-shade");
  if (room && ![...tried].some((painting) => room.contains(painting))) return { shaded: true, flat: false };
  for (const painting of document.querySelectorAll("[data-painting]")) {
    const rect = painting.getBoundingClientRect();
    if (tried.has(painting) || rect.top > y || rect.bottom < y || rect.left > x || rect.right < x) continue;
    const luminance = paintingLuminance(painting, ground);
    if (luminance !== null) return { shaded: luminance < CROSSOVER, flat: false };
  }
  return { shaded: ground < CROSSOVER, flat: true };
}

interface Tone {
  /** The groups standing over shade, by their `data-tone-probe`. */
  shade: Record<string, boolean>;
  /** The flat ground the whole bar stands on, whose haze can veil what scrolls beneath; none over a painting. */
  veil: "light" | "shade" | null;
}

/**
 * How the navbar reads against what lies beneath it. It has no ground of its own, so each group of its
 * lettering (marked `data-tone-probe`) takes the marble tones over a dark painting or floor and umber
 * over the sky, on its own, since a room can be dark at one end of the bar and light at the other.
 * Paintings fade and dissolve into the haze as their rooms end, so it reads what shows rather than
 * which room the visitor is in.
 */
function useToneBehind(bar: RefObject<HTMLElement | null>) {
  const [tone, setTone] = useState<Tone>({ shade: {}, veil: null });
  useEffect(() => {
    let timer = 0;
    const check = () => {
      timer = 0;
      const nav = bar.current;
      if (!nav) return;
      const shade: Tone["shade"] = {};
      let flat = true;
      for (const group of nav.querySelectorAll<HTMLElement>("[data-tone-probe]")) {
        const rect = group.getBoundingClientRect();
        // Groups hidden at this width have no box.
        if (!rect.width || !group.dataset.toneProbe) continue;
        const behind = readBehind(nav, rect.left + rect.width / 2, rect.top + rect.height / 2);
        shade[group.dataset.toneProbe] = behind.shaded;
        flat &&= behind.flat;
      }
      const tones = new Set(Object.values(shade));
      const veil = flat && tones.size === 1 ? (tones.has(true) ? "shade" : "light") : null;
      setTone((current) => {
        const same =
          current.veil === veil &&
          Object.keys({ ...current.shade, ...shade }).every((key) => current.shade[key] === shade[key]);
        return same ? current : { shade, veil };
      });
    };
    // Often enough to follow a scroll, without reading the page every frame.
    const schedule = () => {
      if (!timer) timer = window.setTimeout(check, 80);
    };
    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [bar]);
  return tone;
}

const ROOM_IDS = ["about", "experience", "skills", "projects", "contact"] as const;
/** Rooms the signage watches; the rooms without an entry of their own leave nothing reading "here" in them. */
const WATCHED = [...ROOM_IDS, "method", "oracle", "giants"];

/** Which room the visitor is standing in, for the signage's "you are here". */
function useCurrentRoom() {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    const rooms = WATCHED.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    rooms.forEach((room) => observer.observe(room));
    const onTop = () => window.scrollY < window.innerHeight * 0.5 && setCurrent(null);
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, []);
  return current;
}

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const current = useCurrentRoom();
  const bar = useRef<HTMLElement>(null);
  const tone = useToneBehind(bar);
  // Each group's own tone, and the cushion of its ground that keeps it legible over what passes beneath.
  const clear = (group: string) => `nav-clear ${tone.shade[group] ? "on-shade" : ""}`;

  const items = ROOM_IDS.map((id) => ({ id, href: `#${id}`, label: t.nav[id], greek: t.rooms[id].greek }));

  // Real links to each language's address, so search engines find both; a click swaps the text in place.
  const languageLink = (lang: "es" | "en", name: string) => (
    <a
      href={LANGUAGE_PATH[lang]}
      hrefLang={lang}
      lang={lang}
      aria-current={language === lang ? "true" : undefined}
      onClick={(event) => {
        event.preventDefault();
        if (language !== lang) setLanguage(lang);
      }}
      className={`inline-flex h-11 items-center px-1 transition-colors duration-300 hover:text-tone ${language === lang ? "text-tone" : "text-tone-mute"}`}
    >
      {lang.toUpperCase()}
      <span className="sr-only"> — {name}</span>
    </a>
  );

  const languageToggle = (
    <div
      role="group"
      aria-label={t.ui.languageLabel}
      className="inline-flex items-center gap-1 px-1 text-[0.8125rem] font-medium tracking-[0.12em]"
    >
      {languageLink("es", "Español")}
      <span aria-hidden="true" className="text-tone-line transition-colors duration-500">
        /
      </span>
      {languageLink("en", "English")}
    </div>
  );

  return (
    <nav ref={bar} aria-label={t.ui.navLabel} className="fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden="true"
        className={`nav-veil ${tone.veil ? "nav-veil--on" : ""} ${tone.veil === "shade" ? "on-shade" : ""}`}
      />
      <a
        href="#main-content"
        className="btn btn--solid absolute -top-20 left-5 z-[60] transition-[top] duration-200 focus:top-3"
      >
        {t.ui.skip}
      </a>
      <div className="relative mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-6 px-5 md:px-10">
        <a
          href="#top"
          data-tone-probe="brand"
          className={`${clear("brand")} whitespace-nowrap text-[0.75rem] font-medium uppercase tracking-[0.08em] text-tone transition-colors duration-500 sm:text-[0.8125rem] sm:tracking-[0.18em]`}
        >
          David Arcos Melgarejo
        </a>

        <ul data-tone-probe="rooms" className={`${clear("rooms")} hidden items-center gap-8 lg:flex`}>
          {items.filter((item) => item.id !== "contact").map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                aria-current={current === item.id ? "location" : undefined}
                className={`relative py-2 text-[0.875rem] transition-colors duration-300 hover:text-tone ${
                  current === item.id ? "text-tone" : "text-tone-soft"
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-[width] duration-500 ${
                    current === item.id ? "w-full" : "w-0"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div data-tone-probe="controls" className={`${clear("controls")} flex items-center gap-2 md:gap-4`}>
          {languageToggle}
          <a
            href="#contact"
            aria-current={current === "contact" ? "location" : undefined}
            className={`btn btn--outline hidden min-h-10 md:inline-flex ${current === "contact" ? "border-tone-accent text-tone-accent" : ""}`}
          >
            {t.nav.contact}
          </a>
          <MorphMenu
            className="lg:hidden"
            title={t.ui.menuTitle}
            triggerLabel={t.ui.openMenu}
            closeLabel={t.ui.closeMenu}
            items={items.map((item) => ({
              id: item.id,
              href: item.href,
              title: item.label,
              description: <span lang="el">{item.greek}</span>,
            }))}
          />
        </div>
      </div>
    </nav>
  );
}
