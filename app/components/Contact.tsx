"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { motion } from "framer-motion";

function DiscoveryPreview() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
      <div className="relative w-full max-w-[220px] space-y-2">
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            </div>
            <div className="h-2 w-16 bg-white/10 rounded" />
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 w-full bg-white/[0.06] rounded" />
            <div className="h-1.5 w-3/4 bg-white/[0.06] rounded" />
          </div>
        </div>
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-white/10 border border-white/[0.08] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            </div>
            <div className="h-2 w-20 bg-white/10 rounded" />
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 w-full bg-white/[0.06] rounded" />
            <div className="h-1.5 w-1/2 bg-white/[0.06] rounded" />
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <div className="h-6 flex-1 rounded-md bg-green-500/10 border border-green-500/20" />
          <div className="h-6 flex-1 rounded-md bg-white/[0.04] border border-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}

function ArchitecturePreview() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-bl from-green-500/5 to-transparent" />
      <div className="relative flex flex-col items-center gap-3">
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-lg px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm bg-green-400" />
          <div className="h-2 w-12 bg-white/10 rounded" />
        </div>
        <div className="flex gap-1">
          <div className="w-px h-5 bg-white/10" />
          <div className="w-px h-5 bg-white/10 mx-6" />
          <div className="w-px h-5 bg-white/10" />
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/[0.04] border border-white/[0.06] rounded-md px-3 py-1.5 flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-sm ${i === 2 ? "bg-green-400" : "bg-zinc-500"}`} />
              <div className="h-1.5 w-8 bg-white/[0.08] rounded" />
            </div>
          ))}
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="bg-white/[0.04] border border-green-500/10 rounded-lg px-5 py-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400/60" />
            <div className="h-1.5 w-14 bg-white/[0.08] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DevelopmentPreview() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-3 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 to-transparent" />
      <div className="relative w-full max-w-[230px] bg-white/[0.03] border border-white/[0.06] rounded-lg overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06]">
          <div className="w-2 h-2 rounded-full bg-red-400/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
          <div className="w-2 h-2 rounded-full bg-green-400/60" />
          <div className="ml-3 h-1.5 w-16 bg-white/[0.08] rounded" />
        </div>
        <div className="p-3 font-mono text-[9px] space-y-1">
          <div className="flex gap-2">
            <span className="text-zinc-600 select-none">1</span>
            <span className="text-purple-400/80">const</span>
            <span className="text-blue-300/80">agent</span>
            <span className="text-white/40">=</span>
            <span className="text-green-400/80">new</span>
            <span className="text-yellow-300/70">Agent</span>
            <span className="text-white/30">{"({"}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-zinc-600 select-none">2</span>
            <span className="text-white/30 pl-3">model:</span>
            <span className="text-green-300/70">&quot;gpt-4o&quot;</span>
            <span className="text-white/20">,</span>
          </div>
          <div className="flex gap-2">
            <span className="text-zinc-600 select-none">3</span>
            <span className="text-white/30 pl-3">tools:</span>
            <span className="text-white/20">[</span>
            <span className="text-yellow-300/60">rag</span>
            <span className="text-white/20">],</span>
          </div>
          <div className="flex gap-2">
            <span className="text-zinc-600 select-none">4</span>
            <span className="text-white/30">{"});"}</span>
          </div>
          <div className="flex gap-2 mt-1">
            <span className="text-zinc-600 select-none">5</span>
            <span className="h-2.5 w-0.5 bg-green-400 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AIPreview() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tl from-green-500/5 to-transparent" />
      <div className="relative w-full max-w-[220px] space-y-2">
        <div className="flex gap-2 items-start">
          <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg rounded-tl-sm p-2.5 flex-1">
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-white/[0.08] rounded" />
              <div className="h-1.5 w-4/5 bg-white/[0.08] rounded" />
              <div className="h-1.5 w-3/5 bg-white/[0.06] rounded" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-start justify-end">
          <div className="bg-green-500/10 border border-green-500/15 rounded-lg rounded-tr-sm p-2.5 flex-1">
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-green-400/15 rounded" />
              <div className="h-1.5 w-2/3 bg-green-400/15 rounded" />
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-zinc-500/60" />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <div className="w-0.5 h-2.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
              <div className="w-0.5 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
          <div className="h-1.5 w-10 bg-white/[0.05] rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function TestingPreview() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
      <div className="relative w-full max-w-[220px] space-y-1.5">
        {[
          { pass: true, w: "w-24" },
          { pass: true, w: "w-28" },
          { pass: true, w: "w-20" },
          { pass: true, w: "w-32" },
          { pass: true, w: "w-16" },
        ].map((test, i) => (
          <div key={i} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.05] rounded-md px-2.5 py-1.5">
            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${test.pass ? "bg-green-500/20" : "bg-red-500/20"}`}>
              <svg className={`w-2.5 h-2.5 ${test.pass ? "text-green-400" : "text-red-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={test.pass ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
              </svg>
            </div>
            <div className={`h-1.5 ${test.w} bg-white/[0.06] rounded`} />
            <div className="ml-auto text-[8px] text-green-400/60 font-mono">pass</div>
          </div>
        ))}
        <div className="flex items-center justify-between pt-1">
          <div className="text-[8px] text-green-400/80 font-mono">5/5 passed</div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <div className="text-[8px] text-zinc-500 font-mono">0 failed</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeployPreview() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-bl from-green-500/5 to-transparent" />
      <div className="relative w-full max-w-[220px] space-y-2">
        {[
          { label: "Build", status: "done" },
          { label: "Test", status: "done" },
          { label: "Deploy", status: "done" },
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div className="flex-1">
              <div className="h-1.5 bg-green-500/20 rounded-full" />
            </div>
            <div className="text-[8px] text-green-400/80 font-mono">{step.label}</div>
          </div>
        ))}
        <div className="mt-2 bg-white/[0.04] border border-green-500/10 rounded-lg p-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <div className="text-[9px] text-green-400/90 font-mono">Production</div>
            </div>
            <div className="text-[8px] text-zinc-500 font-mono">v2.1.0</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const previewComponents = [
  DiscoveryPreview,
  ArchitecturePreview,
  DevelopmentPreview,
  AIPreview,
  TestingPreview,
  DeployPreview,
];

const stepIcons = [
  <svg key="discover" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
  <svg key="arch" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0l4.179 2.25L12 17.25 2.25 12l4.179-2.25m11.142 0l4.179 2.25L12 22.5l-9.75-5.25 4.179-2.25" /></svg>,
  <svg key="dev" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
  <svg key="ai" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>,
  <svg key="test" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  <svg key="deploy" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>,
];

export default function Contact() {
  const { t } = useLanguage();

  return (
    <section
      id="contact"
      className="relative pt-24 md:pt-32 pb-16 bg-transparent overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(34,197,94,0.05)_0%,_transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4">
            {t.contact.title}{" "}
            <span className="text-green-500 italic">
              {t.contact.titleHighlight}
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.contact.steps.map((step, index) => {
            const Preview = previewComponents[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group"
              >
                <div className="bento-card rounded-2xl overflow-hidden h-full flex flex-col">
                  <div className="h-44 md:h-48 relative">
                    <Preview />
                  </div>
                  <div className="p-5 pt-4 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-zinc-400 group-hover:text-green-400 group-hover:border-green-500/20 transition-colors duration-300">
                        {stepIcons[index]}
                      </div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-green-400 transition-colors duration-300">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-zinc-500 text-xs leading-relaxed pl-[38px]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.a
          href="mailto:davidarcosm@hotmail.com"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 block w-full max-w-md mx-auto"
        >
          <div className="bento-card rounded-2xl p-6 md:p-8 flex items-center gap-4 hover:border-green-500/20 transition-colors duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 group-hover:bg-green-500/20 transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-500 mb-0.5">{t.contact.emailCta}</p>
              <p className="text-white font-medium truncate group-hover:text-green-400 transition-colors duration-300">
                davidarcosm@hotmail.com
              </p>
            </div>
            <svg className="w-5 h-5 text-zinc-500 group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </motion.a>
      </div>
    </section>
  );
}
