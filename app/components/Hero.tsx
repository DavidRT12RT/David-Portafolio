"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { motion } from "framer-motion";
import AIScene from "./AIScene";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen overflow-hidden bg-transparent" aria-labelledby="hero-title">
      <AIScene />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/20 z-[1]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col justify-center min-h-screen pb-10 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-lg"
        >
          <span className="inline-block px-4 py-1.5 text-sm font-mono rounded-full border border-[#333] text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors duration-300 mb-8">
            {t.hero.badge}
          </span>

          <h1 id="hero-title" className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1] mb-6 text-white">
            {t.hero.title1}
            <br />
            {t.hero.title2}
          </h1>

          <p className="text-base md:text-lg text-zinc-500 max-w-md mb-10 leading-relaxed font-mono">
            {t.hero.description}
          </p>

          <div className="flex items-center gap-0">
            <a
              href="#projects"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-mono border border-[#333] border-green-500/30 text-white bg-transparent hover:bg-green-500/10 hover:border-green-500 transition-all duration-300"
            >
              {t.hero.cta1}
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-mono border border-[#333] border-l-0 border-green-500/20 text-zinc-400 bg-transparent hover:bg-green-500/10 hover:border-green-500 hover:text-white transition-all duration-300"
            >
              {t.hero.cta2}
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-white/[0.06]">
            <a
              href="mailto:davidarcosm@hotmail.com"
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-green-400 transition-colors duration-300"
              aria-label="Email"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-mono">davidarcosm@hotmail.com</span>
            </a>
            <a
              href="https://github.com/DavidRT12RT"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-green-400 transition-colors duration-300"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/david-arcos-melgarejo-722008322/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-green-400 transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>

      {/* No bottom gradient - seamless transition to next section */}
    </section>
  );
}
