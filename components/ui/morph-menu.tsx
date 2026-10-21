"use client";

// Adapted from Skecher UI's Morph Menu: the trigger morphs into the panel it opens.
// Restyled as a museum label listing the rooms, with real links.

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import useMeasure from "react-use-measure";

export type MorphMenuDirection = "bottom-left" | "bottom-right";

export type MorphMenuItem = {
  id: string;
  href: string;
  title: string;
  description?: ReactNode;
};

export type MorphMenuProps = {
  direction?: MorphMenuDirection;
  title: string;
  items: readonly MorphMenuItem[];
  menuWidth?: number;
  triggerLabel: string;
  closeLabel: string;
  footer?: ReactNode;
  className?: string;
};

const TRIGGER_SIZE = 44;

const DIRECTION_OFFSETS: Record<MorphMenuDirection, readonly [number, number]> = {
  "bottom-right": [0, 0],
  "bottom-left": [-1, 0],
};

const MORPH_SPRING = { type: "spring", duration: 0.32, bounce: 0 } as const;
const REDUCED_MORPH_TRANSITION = { duration: 0 } as const;
const CONTENT_TRANSITION = { duration: 0.2, ease: [0.23, 1, 0.32, 1] } as const;

export function MorphMenu({
  direction = "bottom-left",
  title,
  items,
  menuWidth = 300,
  triggerLabel,
  closeLabel,
  footer,
  className,
}: MorphMenuProps) {
  const instanceId = useId();
  const [open, setOpen] = useState(false);
  const [measureRef, bounds] = useMeasure();
  const root = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const morphTransition = shouldReduceMotion ? REDUCED_MORPH_TRANSITION : MORPH_SPRING;
  const contentTransform = shouldReduceMotion ? "none" : "translateY(4px)";
  const iconLayoutId = `${instanceId}-menu-icon`;
  const contentId = `${instanceId}-menu-content`;

  const width = bounds.width || TRIGGER_SIZE;
  const height = bounds.height || TRIGGER_SIZE;
  const [horizontalOffset, verticalOffset] = DIRECTION_OFFSETS[direction];
  const x = (width - TRIGGER_SIZE) * horizontalOffset;
  const y = (height - TRIGGER_SIZE) * verticalOffset;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const onPointer = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={root} className={`relative size-11 shrink-0 ${className ?? ""}`}>
      <motion.div
        initial={false}
        animate={{ width, height, transform: `translate3d(${x}px, ${y}px, 0)` }}
        transition={morphTransition}
        className={`absolute left-0 top-0 overflow-hidden transition-[background-color,border-color,box-shadow,color] duration-300 ${
          open ? "cartela" : "nav-clear__icon text-tone"
        }`}
      >
        <div ref={measureRef} style={{ width: open ? menuWidth : TRIGGER_SIZE }} className={open ? "relative" : "relative h-11"}>
          <AnimatePresence initial={false} mode="popLayout">
            {!open ? (
              <motion.div
                key="trigger"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={CONTENT_TRANSITION}
                className="size-11"
              >
                <button
                  type="button"
                  aria-expanded={false}
                  aria-controls={contentId}
                  aria-label={triggerLabel}
                  onClick={() => setOpen(true)}
                  className="flex size-full items-center justify-center"
                >
                  <motion.span layoutId={iconLayoutId} transition={morphTransition} className="block">
                    <Menu className="size-5" strokeWidth={1.5} />
                  </motion.span>
                </button>
              </motion.div>
            ) : (
              <motion.nav
                key="menu"
                id={contentId}
                aria-label={title}
                initial={{ opacity: 0, transform: contentTransform, filter: "blur(6px)" }}
                animate={{ opacity: 1, transform: "none", filter: "blur(0px)" }}
                exit={{ opacity: 0, transform: contentTransform, filter: "blur(6px)" }}
                transition={CONTENT_TRANSITION}
                className="w-full px-2 pb-3 pt-2 text-ink"
              >
                <div className="flex items-center justify-between pl-3">
                  <p className="text-[0.8125rem] font-medium uppercase tracking-[0.16em] text-gold-deep">{title}</p>
                  <button
                    type="button"
                    aria-label={closeLabel}
                    aria-expanded
                    onClick={() => setOpen(false)}
                    className="flex size-10 items-center justify-center text-ink"
                  >
                    <motion.span layoutId={iconLayoutId} transition={morphTransition} className="block">
                      <X className="size-5" strokeWidth={1.5} />
                    </motion.span>
                  </button>
                </div>

                <ul className="mt-1">
                  {items.map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-baseline justify-between gap-4 border-t border-ink/10 px-3 py-3 transition-colors duration-200 hover:bg-ink/5"
                      >
                        <span className="text-[1.0625rem] font-[460]">{item.title}</span>
                        {item.description ? (
                          <span className="text-[0.8125rem] text-ink-soft">{item.description}</span>
                        ) : null}
                      </a>
                    </li>
                  ))}
                </ul>
                {footer ? <div className="border-t border-ink/10 px-3 pt-3">{footer}</div> : null}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default MorphMenu;
