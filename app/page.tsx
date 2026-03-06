"use client";

import dynamic from "next/dynamic";
import { LanguageProvider } from "@/app/context/LanguageContext";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import Experience from "@/app/components/Experience";
import Skills from "@/app/components/Skills";
import Projects from "@/app/components/Projects";
import Contact from "@/app/components/Contact";
import Footer from "@/app/components/Footer";

const GlobalBackground = dynamic(
  () => import("@/app/components/GlobalBackground"),
  { ssr: false },
);

export default function Home() {
  return (
    <LanguageProvider>
      <GlobalBackground />
      <div className="relative z-[1]">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
