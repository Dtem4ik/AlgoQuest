"use client";

import { AnimatePresence, motion, useReducedMotion, type TargetAndTransition } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/cn";
import type { MascotState } from "@/lib/types";
import { AVAILABLE_PNG_STATES } from "./available-png-states";
import { MascotSvg } from "./MascotSvg";

const STATE_LABELS: Record<MascotState, string> = {
  idle: "спокоен",
  happy: "радуется",
  sad: "грустит",
  thinking: "думает",
  celebrate: "празднует",
  sleepy: "спит",
};

// Реакция всего тела: общая для SVG и PNG.
const BODY_MOTION: Record<MascotState, TargetAndTransition> = {
  idle: {
    rotate: [0, -3, 0, 3, 0],
    y: [0, -2, 0, -2, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
  happy: {
    y: [0, -18, 0, -8, 0],
    scaleY: [1, 1.04, 0.94, 1.02, 1],
    transition: { duration: 0.7, ease: "easeOut" },
  },
  sad: {
    x: [0, -6, 6, -4, 4, 0],
    y: 2,
    transition: { duration: 0.45, ease: "easeInOut" },
  },
  thinking: {
    rotate: 6,
    y: [0, -2, 0],
    transition: {
      rotate: { type: "spring", stiffness: 200, damping: 14 },
      y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  },
  celebrate: {
    y: [0, -16, 0],
    rotate: [0, -6, 6, 0],
    transition: { duration: 0.6, repeat: Infinity, repeatDelay: 0.2, ease: "easeOut" },
  },
  sleepy: {
    y: 4,
    scale: [1, 1.03, 1],
    transition: {
      y: { duration: 0.3 },
      scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  },
};

interface MascotProps {
  state: MascotState;
  /** Ширина в px. */
  size?: number;
  /** Реплика в облачке справа. */
  line?: string;
  /**
   * Смена значения перезапускает реакцию, даже если состояние то же
   * (например, два правильных ответа подряд — два прыжка).
   */
  reactionKey?: string | number;
  className?: string;
}

export function Mascot({ state, size = 96, line, reactionKey, className }: MascotProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const usePng = AVAILABLE_PNG_STATES.includes(state);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <motion.div
        key={`${state}-${reactionKey ?? ""}`}
        role="img"
        aria-label={`Бит ${STATE_LABELS[state]}`}
        className="shrink-0"
        style={{ width: size, transformOrigin: "50% 100%" }}
        animate={reducedMotion ? undefined : BODY_MOTION[state]}
      >
        {usePng ? (
          <Image src={`/mascot/${state}.png`} alt="" width={size} height={size} priority />
        ) : (
          <MascotSvg state={state} animated={!reducedMotion} size={size} />
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {line && (
          <motion.p
            key={line}
            initial={{ opacity: 0, scale: 0.9, x: -6 }}
            animate={{ opacity: 1, scale: 1, x: 0, transition: { duration: 0.18, ease: "easeOut" } }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
            className={cn(
              "relative rounded-2xl border-2 border-border bg-surface px-4 py-3 text-base font-bold text-ink",
              // хвостик облачка
              "before:absolute before:top-1/2 before:-left-2 before:size-3.5 before:-translate-y-1/2 before:rotate-45",
              "before:border-b-2 before:border-l-2 before:border-border before:bg-surface",
            )}
            aria-live="polite"
          >
            {line}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
