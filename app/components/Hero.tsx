"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { motion } from "framer-motion";
import AIScene from "./AIScene";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen overflow-hidden bg-transparent">
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

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1] mb-6 text-white">
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
        </motion.div>
      </div>

      {/* No bottom gradient - seamless transition to next section */}
    </section>
  );
}
