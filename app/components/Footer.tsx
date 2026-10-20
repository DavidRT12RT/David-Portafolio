"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { Signature } from "@/components/ui/signature";
import { CinematicText } from "@/components/ui/CinematicText";
import RoomSign from "./RoomSign";
import FigureFallback from "./FigureFallback";
import FigureCaption from "./FigureCaption";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";

const skillTags = [
  "React",
  "Next.js",
  "React Native",
  "TypeScript",
  "Node.js",
  "AWS",
  "AI Agents",
  "OpenAI SDK",
  "Firebase",
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      id="contact"
      data-room="apollo"
      data-page-section
      data-guide-side="right"
      data-room-title={t.nav.contact}
      className="relative"
      aria-labelledby="footer-cta"
    >
      <FigureFallback figure="apollo" side="right" />
      <FigureCaption figure="apollo" />
      <div className="room-curtain mx-auto max-w-[90rem] px-5 md:px-10 md:pt-[26vh]">
        <div className="md:w-[52%]">
          <RoomSign
            id="footer-cta"
            greek={t.rooms.contact.greek}
            local={
              <CinematicText as="span" delay={0.1} stagger={0.06} blur={10}>
                {`${t.footer.cta1} ${t.footer.cta2}`}
              </CinematicText>
            }
            highlight={t.footer.ctaHighlight}
          />

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <a href="mailto:davidarcosm@hotmail.com" className="btn btn--solid">
              <MailIcon className="size-4" />
              {t.footer.emailLabel}
            </a>
            <a
              href="https://github.com/DavidRT12RT"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline"
            >
              <GitHubIcon className="size-4" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/david-arcos-melgarejo-722008322/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline"
            >
              <LinkedInIcon className="size-4" />
              LinkedIn
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-3 gap-y-1 text-[0.875rem] text-tone-mute">
            {skillTags.map((tag, i) => (
              <li key={tag} className="flex items-center gap-3">
                {i > 0 ? <span aria-hidden="true" className="text-tone-line">/</span> : null}
                {tag}
              </li>
            ))}
          </ul>

          <figure className="mt-[12vh]">
            <Signature
              text="ΔΑΥΙΔ ΕΠΟΙΕΙ"
              label="ΔΑΥΙΔ ΕΠΟΙΕΙ"
              fontUrl="/fonts/commissioner-signature.ttf"
              fontSize={52}
              color="var(--tone-strong)"
              className="text-tone"
            />
            <figcaption className="mt-3 max-w-[40ch] text-[0.875rem] leading-[1.5] text-tone-mute">
              {t.ui.signatureGloss}
            </figcaption>
          </figure>
        </div>

        {/* The credits sit on their own strip of wall, clear of Apollo's base. */}
        <div className="relative mt-[10vh] flex flex-col gap-1.5 border-t hairline bg-tone-ground py-6 text-[0.8125rem] text-tone-mute">
          <p>
            <span className="text-tone-soft">David Arcos Melgarejo</span> &copy; {new Date().getFullYear()}{" "}
            {t.footer.rights}
          </p>
          <p>{t.ui.paintingCredit}</p>
        </div>
      </div>
    </footer>
  );
}
