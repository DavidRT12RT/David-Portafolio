"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { motion } from "framer-motion";

export default function About() {
  const { t } = useLanguage();

  const stats = [
    { value: "3+", label: t.about.stats.years },
    { value: "15+", label: t.about.stats.projects },
    { value: "20+", label: t.about.stats.technologies },
    { value: "5+", label: t.about.stats.ai },
  ];

  return (
    <section id="about" className="relative py-32 bg-transparent overflow-hidden" aria-labelledby="about-heading">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(34,197,94,0.05)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(34,197,94,0.03)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 id="about-heading" className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4">
            {t.about.title}{" "}
            <span className="text-green-500 italic">
              {t.about.titleHighlight}
            </span>
          </h2>
          <p className="text-zinc-500 text-lg">{t.about.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-zinc-400 text-lg leading-relaxed">
              {t.about.p1}
            </p>
            <p className="text-zinc-400 text-lg leading-relaxed">
              {t.about.p2}
            </p>
            <p className="text-zinc-600 text-lg leading-relaxed italic border-l-2 border-green-700 pl-4">
              {t.about.p3}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl h-full group">
                <span className="text-5xl font-bold text-white/[0.06] group-hover:text-green-500/20 transition-colors duration-500 block mb-6 font-mono">
                  {stat.value}
                </span>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
