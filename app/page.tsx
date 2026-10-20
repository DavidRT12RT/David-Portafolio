"use client";

import dynamic from "next/dynamic";
import { LanguageProvider } from "@/app/context/LanguageContext";
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

export default function Home() {
  return (
    <LanguageProvider>
      <RoomDirector />
      <PorticoView />
      <GalleryCanvas />
      <div className="relative z-[1]">
        <header role="banner">
          <Navbar />
        </header>
        <main id="main-content" role="main">
          {/* Painting and figure take turns: Cole, Plato, Rubens, Homer, Bayeu, the discus thrower over the
              treasury's coins, Miola's oracle, Athena, the Parthenon behind the colonnade, Jordaens' giants
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
