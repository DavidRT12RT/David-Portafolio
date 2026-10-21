"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LanguageProvider } from "@/app/context/LanguageContext";
import type { Language } from "@/app/translations";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import Experience from "@/app/components/Experience";
import Skills from "@/app/components/Skills";
import Projects from "@/app/components/Projects";
import Method from "@/app/components/Method";
import Oracle from "@/app/components/Oracle";
import Giants from "@/app/components/Giants";
import Footer from "@/app/components/Footer";
import RoomDirector from "@/app/components/gallery/RoomDirector";
import RoomIndex from "@/app/components/RoomIndex";
import PorticoView from "@/app/components/PorticoView";

// The gallery's figures live in one WebGL canvas behind the page, loaded on the client only.
const GalleryCanvas = dynamic(() => import("@/app/components/gallery/GalleryCanvas"), {
  ssr: false,
});

/**
 * The first room is Cole's painting alone, so the figures' canvas (and three.js with it) waits until
 * the visitor first moves: the painting and the name reach the screen without it. Arriving already
 * scrolled, or through a link to a room, wakes it at once.
 */
function useVisitorMoved() {
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    let idle = 0;
    const wake = () => {
      if (idle) return;
      const go = () => setMoved(true);
      // Safari has no idle callback; a short timeout does the same job there.
      const canIdle = typeof (window as Partial<Window>).requestIdleCallback === "function";
      idle = canIdle ? window.requestIdleCallback(go, { timeout: 1200 }) : window.setTimeout(go, 200);
    };
    const events = ["scroll", "wheel", "pointerdown", "pointermove", "touchstart", "keydown"] as const;
    events.forEach((name) => window.addEventListener(name, wake, { once: true, passive: true }));
    const now = window.scrollY > 0 || window.location.hash.length > 1 ? requestAnimationFrame(wake) : 0;
    return () => {
      cancelAnimationFrame(now);
      events.forEach((name) => window.removeEventListener(name, wake));
    };
  }, []);
  return moved;
}

export default function Home({ language }: { language: Language }) {
  const moved = useVisitorMoved();

  return (
    <LanguageProvider initial={language}>
      <RoomDirector />
      <PorticoView />
      {moved ? <GalleryCanvas /> : null}
      <div className="relative z-[1]">
        <header role="banner">
          <Navbar />
        </header>
        <main id="main-content" role="main">
          {/* Painting and figure take turns: Cole, Plato, Rubens, Homer, Bayeu, the discus thrower over the
              treasury's coins, Miola's oracle, the Parthenon behind the colonnade, Jordaens' giants
              in motion, and Apollo in the last room. */}
          <Hero />
          <About />
          <Experience />
          <Method />
          <Skills />
          <Oracle />
          <Projects />
          <Giants />
        </main>
        <Footer />
      </div>
      <RoomIndex />
    </LanguageProvider>
  );
}
