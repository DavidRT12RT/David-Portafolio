import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        url: "/og-image.png",
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
    images: ["/og-image.png"],
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
  image: "https://davidarcosmelgarejo.com/og-image.png",
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
    <html lang="es" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
