"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { MorphMenu } from "@/components/ui/morph-menu";

const ROOM_IDS = ["about", "experience", "skills", "projects", "contact"] as const;
/** Rooms the signage watches; the rooms without an entry of their own leave nothing reading "here" in them. */
const WATCHED = [...ROOM_IDS, "method", "oracle", "giants"];

/** Which room the visitor is standing in, for the signage's "you are here". */
function useCurrentRoom() {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    const rooms = WATCHED.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    rooms.forEach((room) => observer.observe(room));
    const onTop = () => window.scrollY < window.innerHeight * 0.5 && setCurrent(null);
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, []);
  return current;
}

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const current = useCurrentRoom();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Clear over the painting, so its sky runs to the top of the screen; a strip of sky once past it.
    const onScroll = () => {
      const hero = document.getElementById("top");
      setScrolled(hero ? hero.getBoundingClientRect().bottom <= 64 : window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = ROOM_IDS.map((id) => ({ id, href: `#${id}`, label: t.nav[id], greek: t.rooms[id].greek }));

  const languageToggle = (
    <button
      type="button"
      onClick={() => setLanguage(language === "en" ? "es" : "en")}
      aria-label={t.ui.switchLanguage}
      className="inline-flex h-11 items-center gap-1.5 px-2 text-[0.8125rem] font-medium tracking-[0.12em]"
    >
      <span className={language === "es" ? "text-tone" : "text-tone-mute"}>ES</span>
      <span aria-hidden="true" className="text-tone-line">
        /
      </span>
      <span className={language === "en" ? "text-tone" : "text-tone-mute"}>EN</span>
    </button>
  );

  return (
    <nav
      aria-label={t.ui.navLabel}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
        scrolled ? "border-b border-tone-line bg-tone-ground/92" : "border-b border-transparent"
      }`}
    >
      <a
        href="#main-content"
        className="btn btn--solid absolute -top-20 left-5 z-[60] transition-[top] duration-200 focus:top-3"
      >
        {t.ui.skip}
      </a>
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-6 px-5 md:px-10">
        <a
          href="#top"
          className="whitespace-nowrap text-[0.75rem] font-medium uppercase tracking-[0.08em] text-tone sm:text-[0.8125rem] sm:tracking-[0.18em]"
        >
          David Arcos Melgarejo
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {items.filter((item) => item.id !== "contact").map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                aria-current={current === item.id ? "location" : undefined}
                className={`relative py-2 text-[0.875rem] transition-colors duration-300 hover:text-tone ${
                  current === item.id ? "text-tone" : "text-tone-soft"
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-[width] duration-500 ${
                    current === item.id ? "w-full" : "w-0"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:gap-4">
          {languageToggle}
          <a
            href="#contact"
            aria-current={current === "contact" ? "location" : undefined}
            className={`btn btn--outline hidden min-h-10 md:inline-flex ${current === "contact" ? "border-tone-accent text-tone-accent" : ""}`}
          >
            {t.nav.contact}
          </a>
          <MorphMenu
            className="lg:hidden"
            title={t.ui.menuTitle}
            triggerLabel={t.ui.openMenu}
            closeLabel={t.ui.closeMenu}
            items={items.map((item) => ({
              id: item.id,
              href: item.href,
              title: item.label,
              description: <span lang="el">{item.greek}</span>,
            }))}
          />
        </div>
      </div>
    </nav>
  );
}
