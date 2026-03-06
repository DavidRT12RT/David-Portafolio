"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectData {
  images: string[];
  tags: string[];
}

const projectImages: ProjectData[] = [
  {
    images: [
      "/projects/solomon-consulting/1.png",
      "/projects/solomon-consulting/2.png",
    ],
    tags: ["OpenAI Agents SDK", "Multi-Agent", "RAG", "React", "NestJS"],
  },
  {
    images: [
      "/projects/kapli-web/1.png",
      "/projects/kapli-mobil/1.png",
      "/projects/kapli-mobil/2.png",
    ],
    tags: ["React", "React Native", "Laravel", "AI Agents", "RAG"],
  },
  {
    images: [
      "/projects/scaleflow_suite/1.png",
      "/projects/scaleflow_suite/2.png",
    ],
    tags: ["React", "AWS", "Firebase", "OpenAI", "Multi-Agent"],
  },
  {
    images: [
      "/projects/advance_inteligent_system/1.png",
      "/projects/advance_inteligent_system/2.png",
    ],
    tags: ["YOLO", "Computer Vision", "LLM", "React", "Real-Time AI"],
  },
];

function BentoProjectCard({
  project,
  images,
  index,
  onProjectClick,
  isWide = false,
}: {
  project: { title: string; description: string; tags: string[] };
  images: ProjectData;
  index: number;
  onProjectClick?: () => void;
  isWide?: boolean;
}) {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group h-full"
    >
      <div
        className="bento-card rounded-2xl h-full w-full overflow-hidden cursor-pointer relative"
        onClick={onProjectClick}
      >
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={images.images[activeImg]}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
        </div>

        {images.images.length > 1 && (
          <div className="absolute top-3 right-3 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => { e.stopPropagation(); setActiveImg((prev) => (prev === 0 ? images.images.length - 1 : prev - 1)); }}
              className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white hover:bg-green-500/20 hover:border-green-500 transition-all flex items-center justify-center cursor-pointer"
              aria-label="Previous image"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveImg((prev) => (prev === images.images.length - 1 ? 0 : prev + 1)); }}
              className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white hover:bg-green-500/20 hover:border-green-500 transition-all flex items-center justify-center cursor-pointer"
              aria-label="Next image"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}

        <div className="relative z-10 h-full flex flex-col justify-end p-6">
          <h3 className={`font-medium text-white group-hover:text-green-400 transition-colors duration-300 leading-snug mb-2 ${isWide ? "text-lg" : "text-base"}`}>
            {project.title}
          </h3>
          {isWide && (
            <p className="text-zinc-400 text-sm leading-relaxed mb-3 line-clamp-2">
              {project.description}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {images.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-2.5 py-0.5 text-[10px] font-mono rounded-full border border-white/[0.08] text-zinc-400 bg-white/[0.03]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({
  project,
  images,
  index,
  onClose,
}: {
  project: { title: string; description: string; tags: string[] };
  images: ProjectData;
  index: number;
  onClose: () => void;
}) {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="glass-card relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-[#333] text-white hover:bg-white/20 hover:border-green-500 transition-all duration-300 flex items-center justify-center"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="relative aspect-video overflow-hidden bg-black/30">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={images.images[activeImg]}
                alt={project.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

          {images.images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <button
                onClick={() =>
                  setActiveImg((prev) =>
                    prev === 0 ? images.images.length - 1 : prev - 1,
                  )
                }
                className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-[#333] text-white hover:bg-white/20 hover:border-green-500 transition-all duration-300 flex items-center justify-center"
                aria-label="Previous image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  setActiveImg((prev) =>
                    prev === images.images.length - 1 ? 0 : prev + 1,
                  )
                }
                className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-[#333] text-white hover:bg-white/20 hover:border-green-500 transition-all duration-300 flex items-center justify-center"
                aria-label="Next image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-xs font-mono rounded-full bg-black backdrop-blur-sm border border-[#333] text-green-400">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {project.title}
          </h3>
          <p className="text-zinc-400 text-base leading-relaxed mb-6">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {images.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-4 py-1.5 text-sm font-mono rounded-full border border-white/[0.08] text-zinc-400 hover:border-green-500 hover:text-green-400 transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    if (selectedProject !== null) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedProject]);

  return (
    <section id="projects" className="relative py-24 md:py-32 bg-transparent overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_rgba(34,197,94,0.05)_0%,_transparent_50%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4">
            {t.projects.title}{" "}
            <span className="text-green-500 italic">
              {t.projects.titleHighlight}
            </span>
          </h2>
          <p className="text-zinc-500 text-lg">{t.projects.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[240px] md:auto-rows-auto md:grid-rows-[300px_280px]">
          <div className="md:col-span-7 h-full">
            <BentoProjectCard
              project={t.projects.items[0]}
              images={projectImages[0]}
              index={0}
              onProjectClick={() => setSelectedProject(0)}
              isWide
            />
          </div>
          <div className="md:col-span-5 h-full">
            <BentoProjectCard
              project={t.projects.items[1]}
              images={projectImages[1]}
              index={1}
              onProjectClick={() => setSelectedProject(1)}
            />
          </div>
          <div className="md:col-span-5 h-full">
            <BentoProjectCard
              project={t.projects.items[2]}
              images={projectImages[2]}
              index={2}
              onProjectClick={() => setSelectedProject(2)}
            />
          </div>
          <div className="md:col-span-7 h-full">
            <BentoProjectCard
              project={t.projects.items[3]}
              images={projectImages[3]}
              index={3}
              onProjectClick={() => setSelectedProject(3)}
              isWide
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject !== null && (
          <ProjectModal
            project={t.projects.items[selectedProject]}
            images={projectImages[selectedProject]}
            index={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
