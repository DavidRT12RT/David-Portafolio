"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { motion } from "framer-motion";

export default function Experience() {
  const { t } = useLanguage();

  return (
    <section id="experience" className="relative py-32 bg-transparent">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_left,_rgba(34,197,94,0.04)_0%,_transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-16">
            {t.experience.title}{" "}
            <span className="text-green-500 italic">
              {t.experience.titleHighlight}
            </span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-white/[0.06]" />

          <div className="space-y-12">
            {t.experience.jobs.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 md:pl-20"
              >
                <div className="absolute left-0 md:left-8 top-3 w-2 h-2 rounded-full bg-green-500 -translate-x-[3.5px]" />

                <div className="glass-card p-6 md:p-8 rounded-2xl group">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                        {job.role}
                      </h3>
                      <p className="text-green-500 font-medium">
                        {job.company}
                        {job.location && (
                          <span className="text-zinc-600">
                            {" "}
                            — {job.location}
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="text-sm text-zinc-500 font-mono mt-2 md:mt-0">
                      {job.period}
                    </span>
                  </div>

                  <p className="text-zinc-400 leading-relaxed mb-4">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 text-xs font-mono rounded-full border border-white/[0.06] text-zinc-500 hover:border-green-700 hover:text-green-400 transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
