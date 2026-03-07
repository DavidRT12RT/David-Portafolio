"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Language, Translations } from "@/app/translations";

const STORAGE_KEY = "david-portfolio-lang";

function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return "es";
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (stored === "en" || stored === "es") return stored;
  const browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || "es";
  return browserLang.startsWith("es") ? "es" : "en";
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const detected = detectBrowserLanguage();
    setLanguage(detected);
    setMounted(true);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang === "es" ? "es-MX" : "en-US";
    }
  };

  useEffect(() => {
    if (mounted && typeof document !== "undefined") {
      document.documentElement.lang = language === "es" ? "es-MX" : "en-US";
    }
  }, [language, mounted]);

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
