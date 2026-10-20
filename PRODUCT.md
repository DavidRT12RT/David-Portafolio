# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally (confirmed by the owner):

- **Recruiters and hiring managers** evaluating David for a full-time role. They arrive from LinkedIn, GitHub or a shared link, usually skim, and need to judge seniority and specialty within seconds before writing to him or asking for a CV.
- **Founders, startups and clients** evaluating him for a project or consulting engagement. They need to trust that he ships production AI systems end to end, then contact him about a project.

## Product Purpose

Personal portfolio of David Arcos Melgarejo, Full Stack Developer & AI Engineer based in Monterrey, México. It presents who he is, his work history, his stack, selected projects and his delivery process. Success means the visitor contacts him (email `davidarcosm@hotmail.com`) or follows through to LinkedIn or GitHub.

## Positioning

A full-stack engineer who builds production AI systems, not demos: multi-agent architectures on the OpenAI Agents SDK, RAG with vector stores, YOLOv8 computer vision for real-time medical polyp detection, AI-driven ERP/CRM SaaS, deployed on AWS and Firebase. Delivered for ScaleFlow Tech, Kapli, Grupo KPA and others.

## Operating Context

- Single-page site with anchor navigation: `#about`, `#experience`, `#skills`, `#projects`, `#contact`.
- Bilingual ES/EN with browser-language detection and a persisted toggle (`app/context/LanguageContext.tsx`); Spanish is the default.
- Deployed on Vercel with Analytics and Speed Insights; canonical domain `https://davidarcosmelgarejo.com`; SEO metadata, sitemap, robots and Person JSON-LD live in `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`.

## Capabilities and Constraints

- Stack: Next.js 16 (app router), React 19, TypeScript, Tailwind CSS v4, motion 12, three / @react-three/fiber / drei.
- All copy lives in `app/translations/index.ts` (en/es). Existing text is preserved verbatim; the owner approved adding Greek section names as labels on top of it.
- Third-party components may come from componentry.dev, spaceui.one, skecher-ui.com, useplanes.com and uiarc.dev, free tiers only.
- 3D figures come from Statens Museum for Kunst (SMK) scans of its Royal Cast Collection, released under the Public Domain Mark 1.0.
- The paintings are public domain and always credited on screen: Thomas Cole's *The Course of Empire: The Consummation of Empire* (1836, New-York Historical Society) in the first room, Peter Paul Rubens' *The Battle of the Amazons* (c. 1618, Alte Pinakothek), Francisco Bayeu's *Olympus: The Fall of the Giants* (1764, Museo del Prado), Camillo Miola's *The Oracle* (1880, The J. Paul Getty Museum), Frederic Edwin Church's *The Parthenon* (1871, The Metropolitan Museum of Art, CC0) and Jacob Jordaens' *The Fall of the Giants* (1636–1638, Museo del Prado), the last animated from figures cut out of it.
- Technology logos are Simple Icons path data (CC0 1.0, simpleicons.org), struck as coins at runtime; each mark stays its owner's trademark. No on-screen credit line (owner's choice).

## Brand Commitments

- Name: "David Arcos Melgarejo". Role line: "Full Stack Developer & AI Engineer".
- Owner-pinned direction: Ancient Greek world; Apple-style scroll-driven storytelling; real 3D Greek sculptures as the figures.
- Owner revision, 2026-10-19: the first viewport is Cole's *The Consummation of Empire* full screen, with the name over its sky and depth, parallax and light effects; the whole page takes the painting's colours (hazy sky, sunlit marble, gilding, umber shade). Athena now stands in the painting, on her column, instead of as a 3D head.

## Evidence on Hand

- Project screenshots: `public/projects/solomon-consulting/`, `kapli-web/`, `kapli-mobil/`, `scaleflow_suite/`, `advance_inteligent_system/`.
- Work history, project descriptions and process steps in `app/translations/index.ts`.
- Stats already claimed in copy: 3+ years, 15+ projects, 20+ technologies, 5+ AI systems.
- Contact: email, GitHub `DavidRT12RT`, LinkedIn profile.
- Absent, never to be fabricated: testimonials, client logos, metrics beyond the stats above, a CV file.

## Product Principles

1. Proof over adjectives: real systems and shipped projects carry the case.
2. Both audiences in seconds: name, role, specialty and a way to make contact reachable from the first viewport.
3. Spectacle serves the content: motion never hides, delays or replaces facts; everything reads without animation.
4. Bilingual parity: Spanish and English get the same experience.
5. Performance is part of the craft: fast on phones, heavy 3D loaded lazily with graceful fallbacks.

## Accessibility & Inclusion

Keep the existing skip link and labelled landmarks, respect `prefers-reduced-motion`, keep content visible and keyboard-reachable without WebGL.
