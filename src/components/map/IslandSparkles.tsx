"use client";

import { motion, useReducedMotion } from "framer-motion";

interface IslandSparklesProps {
  color: string;
  /** Сдвиги кружков: искры ставим на противоположную сторону от кружка. */
  offsets: number[];
  /** Шаг по вертикали между кружками, px. */
  rowHeight: number;
  top: number;
  /** Ряд, где стоит Бит, — там искру не рисуем. */
  skip?: number;
}

/** Мерцающие искры по краям острова — немного жизни на подложке. */
export function IslandSparkles({ color, offsets, rowHeight, top, skip }: IslandSparklesProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {offsets.map((offset, i) =>
        i === skip ? null : (
          <motion.span
            key={i}
            className="absolute text-lg leading-none"
            style={{
              color,
              top: top + i * rowHeight + (i % 2 ? 6 : 26),
              [offset > 0 ? "left" : "right"]: i % 2 ? 22 : 34,
              fontSize: i % 3 === 0 ? 22 : 15,
            }}
            animate={
              reducedMotion
                ? { opacity: 0.45 }
                : { opacity: [0.2, 0.6, 0.2], scale: [0.85, 1.1, 0.85] }
            }
            transition={{
              duration: 2.6 + (i % 3) * 0.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          >
            ✦
          </motion.span>
        ),
      )}
    </div>
  );
}
