import type { Metadata } from "next";
import { Commissioner, Cormorant_SC } from "next/font/google";

//Vercel Speed Insights & Analytics
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "David Arcos Melgarejo — Full Stack Developer & AI Engineer",
    template: "%s | David Arcos Melgarejo",
  },
  description:
    "David Arcos Melgarejo — Full Stack Developer & AI Engineer. Especializado en agentes de IA, arquitecturas multi-agente, React, React Native, AWS, Firebase. Creador de sistemas inteligentes con OpenAI Agents SDK, RAG y YOLO. Portfolio y proyectos en Monterrey, México.",
  keywords: [
    "David Arcos",
    "David Arcos Melgarejo",
    "david-arcos",
    "davidarcos",
    "Full Stack Developer",
    "AI Engineer",
    "React Developer",
    "React Native",
    "OpenAI Agents SDK",
    "Multi-Agent AI",
    "RAG",
    "YOLO",
    "Computer Vision",
    "AWS",
    "Firebase",
    "NestJS",
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
  authors: [
    { name: "David Arcos Melgarejo", url: "https://davidarcosmelgarejo.com" },
  ],
  creator: "David Arcos Melgarejo",
  publisher: "David Arcos Melgarejo",
  applicationName: "David Arcos Portfolio",
  metadataBase: new URL("https://davidarcosmelgarejo.com"),
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    alternateLocale: "en_US",
    url: "https://davidarcosmelgarejo.com",
    siteName: "David Arcos Melgarejo — Portfolio",
    title: "David Arcos Melgarejo — Full Stack Developer & AI Engineer",
    description:
      "Full Stack Developer & AI Engineer. Construyo sistemas inteligentes con agentes de IA, arquitecturas multi-agente, React, AWS y más.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "David Arcos Melgarejo — Full Stack Developer & AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "David Arcos Melgarejo — Full Stack Developer & AI Engineer",
    description:
      "Construyo sistemas inteligentes con agentes de IA, arquitecturas multi-agente, React, AWS y más.",
    images: ["/og-image.jpg"],
  },
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
  "@type": "Person",
  "@id": "https://davidarcosmelgarejo.com/#person",
  name: "David Arcos Melgarejo",
  alternateName: ["David Arcos", "david-arcos", "davidarcos"],
  jobTitle: "Full Stack Developer & AI Engineer",
  url: "https://davidarcosmelgarejo.com",
  image: "https://davidarcosmelgarejo.com/og-image.jpg",
  email: "davidarcosm@hotmail.com",
  sameAs: [
    "https://github.com/DavidRT12RT",
    "https://www.linkedin.com/in/david-arcos-melgarejo-722008322/",
  ],
  knowsAbout: [
    "React",
    "React Native",
    "Next.js",
    "TypeScript",
    "Node.js",
    "NestJS",
    "Laravel",
    "AWS",
    "Firebase",
    "OpenAI Agents SDK",
    "Multi-Agent AI",
    "RAG",
    "YOLO",
    "Computer Vision",
    "Machine Learning",
  ],
  worksFor: {
    "@type": "Organization",
    name: "ScaleFlow Tech",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`no-js ${commissioner.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.replace('no-js','js')",
          }}
        />
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
