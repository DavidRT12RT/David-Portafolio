"use client";

import { useEffect } from "react";
import { gallery, roomState, type RoomId } from "@/app/lib/gallery";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Walks the visitor's spotlight through the rooms: every element marked `data-room` gets a light
 * level from its position in the viewport, written to `--room-light` and shared with the gallery.
 */
export default function RoomDirector() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    gallery.reducedMotion = media.matches;
    const onMotionPref = () => (gallery.reducedMotion = media.matches);
    media.addEventListener("change", onMotionPref);

    let rooms: HTMLElement[] = [];
    const collect = () => {
      rooms = Array.from(document.querySelectorAll<HTMLElement>("[data-room]"));
    };
    collect();

    const lastLight = new WeakMap<HTMLElement, number>();
    let frame = 0;

    const measure = () => {
      frame = 0;
      const h = window.innerHeight;
      const readings = rooms.map((el) => {
        const rect = el.getBoundingClientRect();
        // Light rises while the room's top climbs from 80% to 30% of the viewport,
        // and falls while its bottom climbs from 70% to 20%.
        const enter = clamp01((h * 0.8 - rect.top) / (h * 0.5));
        const leave = clamp01((rect.bottom - h * 0.2) / (h * 0.5));
        const light = Math.min(enter, leave);
        const progress = clamp01((h - rect.top) / (h + rect.height));
        return { el, light, progress, top: rect.top, bottom: rect.bottom };
      });

      for (const { el, light, progress, top, bottom } of readings) {
        const id = el.dataset.room as RoomId | undefined;
        if (id) {
          const state = roomState(id);
          state.light = light;
          state.progress = progress;
          state.top = top;
          state.bottom = bottom;
          state.viewport = h;
        }
        const previous = lastLight.get(el);
        if (previous === undefined || Math.abs(previous - light) > 0.004) {
          el.style.setProperty("--room-light", light.toFixed(3));
          lastLight.set(el, light);
        }
      }
      gallery.invalidate();
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      gallery.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      gallery.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
      gallery.pointer.active = true;
      gallery.invalidate();
    };

    const onLeave = () => {
      gallery.pointer.active = false;
      gallery.invalidate();
    };

    const observer = new MutationObserver(() => {
      collect();
      schedule();
    });
    observer.observe(document.getElementById("main-content") ?? document.body, {
      childList: true,
      subtree: true,
    });
    const resizer = new ResizeObserver(schedule);
    resizer.observe(document.body);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    measure();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      resizer.disconnect();
      media.removeEventListener("change", onMotionPref);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}
