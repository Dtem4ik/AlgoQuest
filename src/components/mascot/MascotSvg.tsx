"use client";

import { motion, type Transition } from "framer-motion";
import { useId, type ReactNode } from "react";
import type { MascotState } from "@/lib/types";

// Фирменные цвета Бита фиксированы и не зависят от темы.
const BODY = "#7C5CFF";
const BODY_LIGHT = "#A08BFF";
const BODY_SHADE = "#5A3EE0";
const SCREEN = "#1F1B3A";
const GLOW = "#8EF6FF";
const GOLD = "#FBBF24";
const CHEEK = "#FF8FB1";

// Вращение/масштаб SVG-элементов вокруг их собственного центра.
const selfOrigin = { transformBox: "fill-box", transformOrigin: "center" } as const;

const loop = (duration: number, extra: Transition = {}): Transition => ({
  duration,
  repeat: Infinity,
  ease: "easeInOut",
  ...extra,
});

interface PartProps {
  animated: boolean;
}

function Antenna({ state, animated }: PartProps & { state: MascotState }) {
  const wiggle = animated && state !== "sleepy";
  return (
    <motion.g
      style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
      animate={wiggle ? { rotate: [-6, 6, -6] } : { rotate: state === "sleepy" ? 14 : 0 }}
      transition={wiggle ? loop(state === "celebrate" ? 0.6 : 2.4) : { duration: 0.3 }}
    >
      <line x1="60" y1="30" x2="60" y2="12" stroke={BODY_SHADE} strokeWidth="4" strokeLinecap="round" />
      <motion.circle
        cx="60"
        cy="9"
        r="6"
        fill={GOLD}
        animate={
          animated && (state === "thinking" || state === "celebrate")
            ? { opacity: [1, 0.45, 1] }
            : { opacity: state === "sleepy" ? 0.5 : 1 }
        }
        transition={animated ? loop(0.9) : undefined}
      />
    </motion.g>
  );
}

function Blink({ animated, children }: PartProps & { children: ReactNode }) {
  return (
    <motion.g
      style={selfOrigin}
      animate={animated ? { scaleY: [1, 1, 0.1, 1] } : undefined}
      transition={animated ? loop(4, { times: [0, 0.9, 0.95, 1], ease: "linear" }) : undefined}
    >
      {children}
    </motion.g>
  );
}

function Star({ cx, cy, animated }: PartProps & { cx: number; cy: number }) {
  const r = 8;
  const points = Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? r : r * 0.45;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");
  return (
    <motion.polygon
      points={points}
      fill={GOLD}
      style={selfOrigin}
      animate={animated ? { scale: [1, 1.25, 1], rotate: [0, 15, 0] } : undefined}
      transition={animated ? loop(0.8) : undefined}
    />
  );
}

function Eyes({ state, animated }: PartProps & { state: MascotState }) {
  const stroke = { stroke: GLOW, strokeWidth: 4, strokeLinecap: "round", fill: "none" } as const;

  switch (state) {
    case "happy":
      return (
        <g>
          <path d="M41 69 Q47 58 53 69" {...stroke} />
          <path d="M67 69 Q73 58 79 69" {...stroke} />
        </g>
      );
    case "celebrate":
      return (
        <g>
          <Star cx={47} cy={65} animated={animated} />
          <Star cx={73} cy={65} animated={animated} />
        </g>
      );
    case "sleepy":
      return (
        <g>
          <path d="M41 66 Q47 71 53 66" {...stroke} />
          <path d="M67 66 Q73 71 79 66" {...stroke} />
        </g>
      );
    case "sad":
      return (
        <g>
          <path d="M40 58 L52 55" {...stroke} strokeWidth={3} />
          <path d="M68 55 L80 58" {...stroke} strokeWidth={3} />
          <Blink animated={animated}>
            <rect x="42" y="61" width="10" height="11" rx="5" fill={GLOW} />
            <rect x="68" y="61" width="10" height="11" rx="5" fill={GLOW} />
          </Blink>
          <motion.ellipse
            cx="44"
            cy="76"
            rx="2.5"
            ry="3.5"
            fill={GLOW}
            animate={animated ? { y: [0, 10], opacity: [0.9, 0] } : { opacity: 0.9 }}
            transition={animated ? loop(1.4, { ease: "easeIn", repeatDelay: 0.4 }) : undefined}
          />
        </g>
      );
    case "thinking":
      return (
        <Blink animated={animated}>
          <rect x="43" y="61" width="10" height="7" rx="3.5" fill={GLOW} />
          <rect x="70" y="56" width="10" height="14" rx="5" fill={GLOW} />
        </Blink>
      );
    case "idle":
      return (
        <Blink animated={animated}>
          <rect x="42" y="59" width="10" height="14" rx="5" fill={GLOW} />
          <rect x="68" y="59" width="10" height="14" rx="5" fill={GLOW} />
        </Blink>
      );
  }
}

function Mouth({ state }: { state: MascotState }) {
  const stroke = { stroke: GLOW, strokeWidth: 3, strokeLinecap: "round", fill: "none" } as const;
  switch (state) {
    case "happy":
      return <path d="M51 79 Q60 90 69 79 Z" fill={GLOW} />;
    case "celebrate":
      return <path d="M49 78 Q60 92 71 78 Z" fill={GLOW} />;
    case "sad":
      return <path d="M53 86 Q60 80 67 86" {...stroke} />;
    case "thinking":
      return <path d="M54 83 L66 80" {...stroke} />;
    case "sleepy":
      return <ellipse cx="60" cy="83" rx="3" ry="2.5" {...stroke} strokeWidth={2.5} />;
    case "idle":
      return <path d="M54 81 Q60 86 66 81" {...stroke} />;
  }
}

function Arms({ state, animated }: PartProps & { state: MascotState }) {
  const raised = state === "celebrate" || state === "happy";
  const wave = animated && state === "celebrate";
  return (
    <g fill={BODY_SHADE}>
      <motion.ellipse
        cx="17"
        cy="78"
        rx="7"
        ry="12"
        style={{ transformBox: "fill-box", transformOrigin: "50% 20%" }}
        animate={wave ? { rotate: [110, 145, 110] } : { rotate: raised ? 125 : state === "sad" ? -12 : 0 }}
        transition={wave ? loop(0.5) : { type: "spring", stiffness: 300, damping: 18 }}
      />
      <motion.ellipse
        cx="103"
        cy="78"
        rx="7"
        ry="12"
        style={{ transformBox: "fill-box", transformOrigin: "50% 20%" }}
        animate={
          wave
            ? { rotate: [-110, -145, -110] }
            : { rotate: raised || state === "thinking" ? -125 : state === "sad" ? 12 : 0 }
        }
        transition={wave ? loop(0.5) : { type: "spring", stiffness: 300, damping: 18 }}
      />
    </g>
  );
}

function Extras({ state, animated }: PartProps & { state: MascotState }) {
  if (state === "sleepy") {
    return (
      <g fill={BODY_LIGHT} fontFamily="var(--font-nunito), sans-serif" fontWeight={900}>
        {[0, 1, 2].map((i) => (
          <motion.text
            key={i}
            x={92 + i * 7}
            y={30 - i * 8}
            fontSize={10 + i * 3}
            animate={animated ? { y: [0, -8], opacity: [0, 1, 0] } : { opacity: 0.8 }}
            transition={animated ? loop(2.4, { delay: i * 0.5, ease: "easeOut" }) : undefined}
          >
            z
          </motion.text>
        ))}
      </g>
    );
  }
  if (state === "thinking") {
    return (
      <g fill={BODY_LIGHT}>
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={94 + i * 8}
            cy={30 - i * 8}
            r={2.5 + i}
            animate={animated ? { opacity: [0.2, 1, 0.2] } : { opacity: 1 }}
            transition={animated ? loop(1.2, { delay: i * 0.2 }) : undefined}
          />
        ))}
      </g>
    );
  }
  return null;
}

interface MascotSvgProps {
  state: MascotState;
  animated: boolean;
  size: number;
}

export function MascotSvg({ state, animated, size }: MascotSvgProps) {
  const gradientId = useId();
  const cheeks = state === "happy" || state === "celebrate";

  return (
    <svg
      viewBox="0 0 120 128"
      width={size}
      height={(size * 128) / 120}
      aria-hidden
      className="overflow-visible"
    >
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={BODY_LIGHT} />
          <stop offset="60%" stopColor={BODY} />
          <stop offset="100%" stopColor={BODY_SHADE} />
        </radialGradient>
      </defs>

      <Extras state={state} animated={animated} />
      <Antenna state={state} animated={animated} />

      {/* ножки */}
      <ellipse cx="44" cy="118" rx="12" ry="7" fill={BODY_SHADE} />
      <ellipse cx="76" cy="118" rx="12" ry="7" fill={BODY_SHADE} />

      <Arms state={state} animated={animated} />

      {/* корпус */}
      <circle cx="60" cy="74" r="44" fill={`url(#${gradientId})`} />
      <ellipse cx="38" cy="46" rx="10" ry="5" fill="#fff" opacity="0.35" transform="rotate(-30 38 46)" />

      {/* экран-лицо */}
      <rect x="27" y="48" width="66" height="46" rx="18" fill={SCREEN} />
      <rect x="27" y="48" width="66" height="46" rx="18" fill="none" stroke={BODY_SHADE} strokeWidth="3" />

      {cheeks && (
        <g fill={CHEEK} opacity="0.7">
          <ellipse cx="37" cy="81" rx="5" ry="3" />
          <ellipse cx="83" cy="81" rx="5" ry="3" />
        </g>
      )}

      <Eyes state={state} animated={animated} />
      <Mouth state={state} />
    </svg>
  );
}
