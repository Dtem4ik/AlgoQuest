"use client";

import { motion, useReducedMotion } from "framer-motion";

const CLOUD_PATH =
  "M20 44c-9 0-16-6-16-14s7-14 16-14c2-9 10-16 20-16 9 0 17 6 19 14 2-1 4-1 6-1 9 0 16 7 16 15s-7 16-16 16H20z";

const CLOUDS = [
  { top: "9%", side: "left", width: 110, drift: 28, duration: 19 },
  { top: "38%", side: "right", width: 140, drift: -34, duration: 23 },
  { top: "71%", side: "left", width: 96, drift: 24, duration: 17 },
] as const;

/** Декоративный фон карты: цветные пятна, точечная сетка и медленно плывущие облака. */
export function MapBackdrop() {
  const reducedMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="map-dots absolute inset-0" />
      <div className="absolute -top-28 -left-24 size-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute top-1/3 -right-28 size-96 rounded-full bg-xp/20 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 size-80 rounded-full bg-success/15 blur-3xl" />

      {CLOUDS.map((cloud, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 82 44"
          width={cloud.width}
          className="absolute fill-surface opacity-80 drop-shadow-sm dark:opacity-20"
          style={{ top: cloud.top, [cloud.side]: -cloud.width / 3 }}
          animate={reducedMotion ? undefined : { x: [0, cloud.drift, 0] }}
          transition={{ duration: cloud.duration, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d={CLOUD_PATH} />
        </motion.svg>
      ))}
    </div>
  );
}
