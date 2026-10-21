"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { translations, Language, Translations } from "@/app/translations";

/** Each language has its own address, so search engines index both and links share the right one. */
export const LANGUAGE_PATH: Record<Language, string> = { es: "/", en: "/en" };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * The page's language comes from its address (`/` or `/en`), so the server and the first client render
 * agree. Switching swaps the text in place, without reloading the rooms, and moves the address along.
 */
export function LanguageProvider({ children, initial }: { children: ReactNode; initial: Language }) {
  const [language, setLanguage] = useState<Language>(initial);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    document.documentElement.lang = lang;
    document.title = translations[lang].meta.title;
    window.history.replaceState(window.history.state, "", `${LANGUAGE_PATH[lang]}${window.location.hash}`);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
