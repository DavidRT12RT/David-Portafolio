import type { Metadata } from "next";
import { translations, type Language } from "@/app/translations";

export const SITE_URL = "https://www.david-arcos.com";

/** Each language's address, and the alternates every page announces so search engines pair them. */
const PATH: Record<Language, string> = { es: "/", en: "/en" };
const LOCALE: Record<Language, string> = { es: "es_MX", en: "en_US" };
export const ALTERNATES = { es: "/", en: "/en", "x-default": "/" };

/** The title, description, canonical address and sharing cards of the page in `lang`. */
export function pageMetadata(lang: Language): Metadata {
  const { title, description } = translations[lang].meta;
  const other: Language = lang === "es" ? "en" : "es";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: PATH[lang], languages: ALTERNATES },
    openGraph: {
      type: "website",
      locale: LOCALE[lang],
      alternateLocale: LOCALE[other],
      url: PATH[lang],
      siteName: "David Arcos Melgarejo — Portfolio",
      title,
      description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.jpg"] },
  };
}
