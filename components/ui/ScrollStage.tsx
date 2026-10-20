"use client";

import * as React from "react";
import {
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

import { cn } from "@/lib/utils";

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

type StageContext = {
  progress: MotionValue<number>;
  reduced: boolean;
};

const Ctx = React.createContext<StageContext | null>(null);

export function useScrollStage(): StageContext {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useScrollStage must be used inside <ScrollStage>");
  return ctx;
}

export function useStageTransform<T>(input: number[], output: T[]): MotionValue<T> {
  const { progress } = useScrollStage();
  return useTransform(progress, input, output);
}

export function useStageStep(count: number): number {
  const { progress } = useScrollStage();
  const [step, setStep] = React.useState(() => toStep(progress.get(), count));
  React.useEffect(() => {
    const update = (p: number) => {
      const next = toStep(p, count);
      setStep((prev) => (prev === next ? prev : next));
    };
    update(progress.get());
    return progress.on("change", update);
  }, [progress, count]);
  return step;
}

function toStep(p: number, count: number) {
  return Math.min(count - 1, Math.max(0, Math.floor(p * count)));
}

export type ScrollStageProps = {
  height?: string | number;
  stageHeight?: string | number;
  top?: string | number;
  offset?: ScrollOffset;
  container?: React.RefObject<HTMLElement | null>;
  children: React.ReactNode | ((ctx: StageContext) => React.ReactNode);
  className?: string;
  stageClassName?: string;
};

export function ScrollStage({
  height = "300vh",
  stageHeight = "100vh",
  top = 0,
  offset = ["start start", "end end"],
  container,
  children,
  className,
  stageClassName,
}: ScrollStageProps) {
  const target = React.useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const { scrollYProgress: progress } = useScroll({ target, container, offset });
  const ctx = React.useMemo(() => ({ progress, reduced }), [progress, reduced]);

  return (
    <div ref={target} className={cn("relative w-full", className)} style={{ height }}>
      <div
        className={cn("sticky w-full overflow-hidden", stageClassName)}
        style={{ top, height: stageHeight }}
      >
        <Ctx.Provider value={ctx}>
          {typeof children === "function" ? children(ctx) : children}
        </Ctx.Provider>
      </div>
    </div>
  );
}

ScrollStage.displayName = "ScrollStage";
