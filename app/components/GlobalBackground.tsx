"use client";

import { useRef, useEffect, useCallback } from "react";

export default function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const scrollRef = useRef(0);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
      ctx.clearRect(0, 0, w, h);

      const scrollY = scrollRef.current;
      const spacing = 20;
      const cols = Math.ceil(w / spacing);
      const rows = Math.ceil(h / spacing);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing + spacing / 2;
          const y = row * spacing + spacing / 2;

          const worldY = y + scrollY;

          const sectionProgress = worldY / h;

          const wave1 =
            Math.sin(x * 0.008 + worldY * 0.006 - time * 0.4) * 0.5 + 0.5;
          const wave2 =
            Math.cos(x * 0.005 - worldY * 0.008 + time * 0.3) * 0.5 + 0.5;
          const wave3 =
            Math.sin((x + worldY) * 0.004 + time * 0.2) * 0.5 + 0.5;

          let intensity = wave1 * 0.35 + wave2 * 0.35 + wave3 * 0.3;

          const cx1 = w * (0.6 + Math.sin(time * 0.1) * 0.1);
          const cy1 = h * (0.3 + Math.cos(time * 0.08) * 0.1);
          const d1 = Math.sqrt((x - cx1) ** 2 + (y - cy1) ** 2);
          const blob1 = Math.max(0, 1 - d1 / (Math.min(w, h) * 0.4));

          const cx2 = w * (0.3 + Math.cos(time * 0.12) * 0.15);
          const cy2 = h * (0.7 + Math.sin(time * 0.09) * 0.1);
          const d2 = Math.sqrt((x - cx2) ** 2 + (y - cy2) ** 2);
          const blob2 = Math.max(0, 1 - d2 / (Math.min(w, h) * 0.35));

          intensity *= 0.3 + (blob1 + blob2) * 0.7;

          const fade =
            Math.sin(sectionProgress * Math.PI * 1.5 + time * 0.05) * 0.08 + 0.92;
          intensity *= fade;

          intensity = Math.max(0, Math.min(1, intensity));

          if (intensity < 0.05) continue;

          const radius = 0.8 + intensity * 1.2;
          const alpha = 0.03 + intensity * 0.12;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 210, 220, ${alpha})`;
          ctx.fill();
        }
      }
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    const startTime = performance.now();

    const animate = (now: number) => {
      const time = (now - startTime) / 1000;
      draw(ctx, window.innerWidth, window.innerHeight, time);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ background: "#000000" }}
    />
  );
}
