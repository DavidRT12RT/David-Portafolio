import type { Metadata } from "next";
import { Commissioner, Cormorant_SC } from "next/font/google";

//Vercel Speed Insights & Analytics
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import { SITE_URL } from "@/app/lib/seo";

// Commissioner, by the Greek type designer Kostas Bartsokas: plain for reading, flared for room signage.
const commissioner = Commissioner({
  variable: "--font-commissioner",
  subsets: ["latin", "latin-ext", "greek"],
  axes: ["FLAR", "VOLM", "slnt"],
  display: "swap",
});

// Cormorant SC, chosen by the owner for the name set in the sky of the first room's painting.
const cormorant = Cormorant_SC({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["600"],
  display: "swap",
});

// Shared by both languages; each page adds its own title, description, canonical address and cards.
export const metadata: Metadata = {
  title: {
    default: "David Arcos Melgarejo — Full Stack Developer & AI Engineer",
    template: "%s | David Arcos Melgarejo",
  },
  keywords: [
    "David Arcos",
    "David Arcos Melgarejo",
    "david-arcos",
    "davidarcos",
    "Full Stack Developer",
    "AI Engineer",
    "React Developer",
    "React Native",
    "Python",
    "FastAPI",
    "OpenAI Agents SDK",
    "Multi-Agent AI",
    "RAG",
    "MCP",
    "YOLO",
    "Computer Vision",
    "AWS",
    "Firebase",
    "Google Cloud",
    "Next.js",
    "TypeScript",
    "Machine Learning",
    "Desarrollador Full Stack",
    "Ingeniero de IA",
    "Monterrey",
    "México",
    "ScaleFlow",
    "Kapli",
    "Solomon AI",
  ],
  authors: [{ name: "David Arcos Melgarejo", url: SITE_URL }],
  creator: "David Arcos Melgarejo",
  publisher: "David Arcos Melgarejo",
  applicationName: "David Arcos Portfolio",
  metadataBase: new URL(SITE_URL),
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "David Arcos Melgarejo",
      alternateName: ["David Arcos", "david-arcos", "davidarcos"],
      jobTitle: "Full Stack Developer & AI Engineer",
      url: SITE_URL,
      image: `${SITE_URL}/og-image.jpg`,
      email: "davidarcosm@hotmail.com",
      address: { "@type": "PostalAddress", addressLocality: "Monterrey", addressCountry: "MX" },
      knowsLanguage: ["es", "en"],
      sameAs: ["https://github.com/DavidRT12RT", "https://www.linkedin.com/in/david-arcos-melgarejo-722008322/"],
      // The stack as the owner's repositories show it.
      knowsAbout: [
        "Python",
        "FastAPI",
        "TypeScript",
        "React",
        "React Native",
        "Next.js",
        "Node.js",
        "Laravel",
        "OpenAI Agents SDK",
        "Multi-Agent AI",
        "RAG",
        "Model Context Protocol",
        "YOLO",
        "Computer Vision",
        "PyTorch",
        "AWS",
        "Firebase",
        "Google Cloud",
        "Docker",
        "PostgreSQL",
      ],
      worksFor: { "@type": "Organization", name: "ScaleFlow Tech" },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "David Arcos Melgarejo — Portfolio",
      inLanguage: ["es", "en"],
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

// Before the first paint: scripts are on, and the English address reads as English to assistive
// technology (the markup is shared by both languages and says Spanish).
const BOOT = "var d=document.documentElement;d.classList.replace('no-js','js');if(/^\\/en(\\/|$)/.test(location.pathname))d.lang='en';";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`no-js ${commissioner.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased text-tone">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
