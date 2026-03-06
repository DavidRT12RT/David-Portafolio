"use client";

import { useRef, useEffect, useCallback } from "react";

export default function AIScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
      ctx.clearRect(0, 0, w, h);

      const spacing = 14;
      const cols = Math.ceil(w / spacing);
      const rows = Math.ceil(h / spacing);
      const cx = w * 0.58;
      const cy = h * 0.42;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing + spacing / 2;
          const y = row * spacing + spacing / 2;

          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxR = Math.min(w, h) * 0.45;

          if (dist > maxR * 1.2) continue;

          const angle = Math.atan2(dy, dx);
          const normDist = dist / maxR;

          const wave1 =
            Math.sin(normDist * 6 - time * 0.8 + angle * 2) * 0.5 + 0.5;
          const wave2 = Math.cos(normDist * 4 + time * 0.5 - angle) * 0.5 + 0.5;
          const wave3 = Math.sin(angle * 3 + time * 0.3) * 0.5 + 0.5;

          const lobe1Angle = time * 0.15;
          const lobe2Angle = time * 0.15 + Math.PI;
          const lobe1dx = x - (cx + Math.cos(lobe1Angle) * maxR * 0.3);
          const lobe1dy = y - (cy + Math.sin(lobe1Angle) * maxR * 0.15);
          const lobe1Dist = Math.sqrt(lobe1dx * lobe1dx + lobe1dy * lobe1dy);
          const lobe2dx = x - (cx + Math.cos(lobe2Angle) * maxR * 0.3);
          const lobe2dy = y - (cy + Math.sin(lobe2Angle) * maxR * 0.15);
          const lobe2Dist = Math.sqrt(lobe2dx * lobe2dx + lobe2dy * lobe2dy);

          const inLobe1 = lobe1Dist < maxR * 0.55;
          const inLobe2 = lobe2Dist < maxR * 0.55;

          const lobeShape = inLobe1 || inLobe2;
          const ringShape = normDist > 0.25 && normDist < 0.85;

          if (!lobeShape && !ringShape) continue;

          let intensity = wave1 * 0.4 + wave2 * 0.35 + wave3 * 0.25;

          if (lobeShape) {
            const lobeFade = inLobe1
              ? 1 - lobe1Dist / (maxR * 0.55)
              : 1 - lobe2Dist / (maxR * 0.55);
            intensity *= lobeFade * 1.2;
          }

          if (ringShape) {
            const ringFade = 1 - Math.abs(normDist - 0.55) / 0.3;
            intensity *= ringFade;
          }

          const edgeFade =
            normDist > (maxR * 0.9) / maxR
              ? Math.max(0, 1 - (normDist - 0.9) / 0.3)
              : 1;
          intensity *= edgeFade;

          intensity = Math.max(0, Math.min(1, intensity));

          if (intensity < 0.08) continue;

          const radius = 1 + intensity * 1.8;
          const alpha = 0.15 + intensity * 0.75;

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
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    let startTime = performance.now();

    const animate = (now: number) => {
      const time = (now - startTime) / 1000;
      const rect = canvas.getBoundingClientRect();
      draw(ctx, rect.width, rect.height, time);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      style={{ background: "transparent" }}
    />
  );
}
