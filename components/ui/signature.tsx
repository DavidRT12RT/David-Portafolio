"use client";

// Adapted from Componentry's Signature: glyph outlines are traced, then filled behind the stroke.
// Here it carves the maker's mark in a glyphic Greek face instead of a script.

import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { parse as parseFont } from "opentype.js";
import { cn } from "@/lib/utils";

interface SignatureProps {
  text: string;
  /** Font file with every glyph the text needs (TTF/OTF). */
  fontUrl: string;
  color?: string;
  fontSize?: number;
  /** Seconds each glyph takes to be traced. */
  duration?: number;
  delay?: number;
  className?: string;
  /** Accessible text; the drawing itself is decorative. */
  label?: string;
}

export function Signature({
  text,
  fontUrl,
  color = "currentColor",
  fontSize = 48,
  duration = 1.1,
  delay = 0,
  className,
  label,
}: SignatureProps) {
  const reduced = useReducedMotion();
  const [paths, setPaths] = useState<string[]>([]);
  const [width, setWidth] = useState(text.length * fontSize * 0.62);
  const height = fontSize * 1.18;
  const baseline = fontSize * 0.95;
  const pad = fontSize * 0.06;
  const maskId = `signature-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    let cancelled = false;
    fetch(fontUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Signature font ${response.status}`);
        return response.arrayBuffer();
      })
      .then((buffer) => {
        const font = parseFont(buffer);
        if (cancelled) return;
        let x = pad;
        const next: string[] = [];
        for (const char of text) {
          const glyph = font.charToGlyph(char);
          next.push(glyph.getPath(x, baseline, fontSize).toPathData(2));
          x += (glyph.advanceWidth ?? font.unitsPerEm) * (fontSize / font.unitsPerEm);
        }
        setPaths(next.filter(Boolean));
        setWidth(x + pad);
      })
      .catch(() => setPaths([]));
    return () => {
      cancelled = true;
    };
  }, [text, fontUrl, fontSize, baseline, pad]);

  const variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };
  const trace = (i: number) => ({
    pathLength: { delay: delay + i * 0.14, duration, ease: [0.65, 0, 0.35, 1] as const },
    opacity: { delay: delay + i * 0.14, duration: 0.01 },
  });

  return (
    <motion.svg
      key={paths.length}
      role="img"
      aria-label={label ?? text}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={cn("max-w-full overflow-visible", className)}
      initial={reduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="white"
              strokeWidth={fontSize * 0.2}
              fill="none"
              variants={variants}
              transition={trace(i)}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </mask>
      </defs>

      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={1.25}
          fill="none"
          variants={variants}
          transition={trace(i)}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
      ))}

      <g mask={`url(#${maskId})`}>
        {paths.map((d, i) => (
          <path key={i} d={d} fill={color} />
        ))}
      </g>
    </motion.svg>
  );
}
