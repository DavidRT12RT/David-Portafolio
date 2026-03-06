"use client";

import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: t.nav.about, href: "#about" },
    { label: t.nav.experience, href: "#experience" },
    { label: t.nav.skills, href: "#skills" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.contact, href: "#contact" },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="text-lg font-bold tracking-tight text-white">
          David <span className="text-green-500">Arcos</span> Melgarejo
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-400 hover:text-white hover:text-green-400 transition-colors duration-300 relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-green-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 text-xs font-mono rounded-full border border-[#333] text-zinc-400 hover:text-white hover:border-green-500 transition-all duration-300"
          >
            {language === "en" ? "ES" : "EN"}
          </button>

          <a
            href="#contact"
            className="hidden md:inline-flex px-5 py-2 text-sm font-mono border border-green-500/30 text-white bg-transparent hover:bg-green-500/10 hover:border-green-500 transition-all duration-300"
          >
            {t.nav.contact}
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span
                className={`block h-px bg-white transition-all duration-300 ${
                  isOpen ? "rotate-45 translate-y-[3.5px]" : ""
                }`}
              />
              <span
                className={`block h-px bg-white transition-all duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/[0.06] bg-black/80 backdrop-blur-xl"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 hover:text-green-400 transition-colors duration-300 py-2 border-b border-white/[0.06] last:border-0"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
