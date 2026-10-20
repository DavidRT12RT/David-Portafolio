import { COLONNADE } from "./figures";

// One layout for the works room, shared by the WebGL colonnade and the DOM controls laid over it,
// so a panel's hit area and its plaque always sit on the column the canvas draws.

export type ColonnadeMode = "desktop" | "portrait";

/** The canvas switches to the portrait arrangement at the same aspect ratio. */
export function colonnadeMode(width: number, height: number): ColonnadeMode {
  return width / Math.max(height, 1) < 0.95 ? "portrait" : "desktop";
}

/** 0 when the stage's top meets the viewport top, 1 when its bottom meets the viewport bottom. */
export function pinnedProgress(top: number, bottom: number, viewport: number) {
  const span = bottom - top - viewport;
  if (!Number.isFinite(span) || span <= 0) return 0;
  return Math.min(1, Math.max(0, -top / span));
}

/** Centre of pillar `index` as a share of the viewport width. */
export function pillarX(index: number, progress: number, count: number, mode: ColonnadeMode) {
  return 0.5 + (index - progress * (count - 1)) * COLONNADE[mode].gap;
}

/** Top edge of the stylobate (the stepped base all columns stand on), as a share of the viewport height. */
export const STYLOBATE_TOP = 0.88;

/** Scrolls to the point of the works stage where work `index` stands at the centre of the colonnade. */
export function goToWork(index: number, smooth: boolean) {
  const el = document.querySelector<HTMLElement>("[data-portico]");
  if (!el) return;
  const count = COLONNADE.plates.length;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const span = el.offsetHeight - window.innerHeight;
  window.scrollTo({ top: top + (span * index) / (count - 1), behavior: smooth ? "smooth" : "auto" });
}

/** Panel size as shares of the viewport: width of its width, height of its height. */
export function panelSize(mode: ColonnadeMode, viewportAspect: number) {
  const width = COLONNADE[mode].panel;
  return { width, height: (width * viewportAspect) / COLONNADE.aspect, top: COLONNADE[mode].panelTop };
}
