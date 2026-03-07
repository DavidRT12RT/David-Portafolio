"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { motion } from "framer-motion";

function AIIcon() {
  return (
    <svg
      className="w-5 h-5 text-green-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      />
    </svg>
  );
}

function FrontendIcon() {
  return (
    <svg
      className="w-5 h-5 text-zinc-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

function BackendIcon() {
  return (
    <svg
      className="w-5 h-5 text-zinc-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
      />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg
      className="w-5 h-5 text-zinc-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
      />
    </svg>
  );
}

const categoryIconMap: Record<string, () => React.ReactNode> = {
  ai: AIIcon,
  frontend: FrontendIcon,
  backend: BackendIcon,
  cloud: CloudIcon,
};

export default function Skills() {
  const { t } = useLanguage();

  const categories = Object.entries(t.skills.categories) as [
    string,
    { title: string; items: string[] },
  ][];

  return (
    <section id="skills" className="relative py-32 bg-transparent" aria-labelledby="skills-heading">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(34,197,94,0.05)_0%,_transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 id="skills-heading" className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4">
            {t.skills.title}{" "}
            <span className="text-green-500 italic">
              {t.skills.titleHighlight}
            </span>
          </h2>
          <p className="text-zinc-500 text-lg">{t.skills.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map(([key, category], index) => {
            const IconComponent = categoryIconMap[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-card p-8 rounded-2xl group ${
                  key === "ai" || key === "cloud" ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      key === "ai"
                        ? "bg-green-500/10"
                        : "bg-white/[0.03]"
                    }`}
                  >
                    <IconComponent />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {category.title}
                  </h3>
                  {key === "ai" && (
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      CORE
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.items.map((item, i) => (
                    <span
                      key={i}
                      className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 cursor-default ${
                        key === "ai"
                          ? "border-green-500/15 text-green-400 hover:bg-green-500/10 hover:border-green-500/30"
                          : "border-white/[0.06] text-zinc-500 hover:bg-white/[0.04] hover:border-white/[0.12] hover:text-zinc-300"
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
