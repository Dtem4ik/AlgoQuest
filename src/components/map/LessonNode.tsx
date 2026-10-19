"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { LessonStatus } from "@/lib/engine/unlock";
import type { Lesson } from "@/lib/types";

const STATUS_STYLES: Record<LessonStatus, string> = {
  locked: "bg-disabled text-disabled-ink [--ledge:var(--surface-shade)]",
  available: "bg-primary text-white [--ledge:var(--primary-shade)]",
  completed: "bg-success text-white [--ledge:var(--success-shade)]",
  perfect: "bg-xp text-ink [--ledge:var(--xp-shade)]",
};

const STATUS_LABELS: Record<LessonStatus, string> = {
  locked: "закрыт",
  available: "доступен",
  completed: "пройден",
  perfect: "пройден идеально",
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-9" aria-hidden>
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NodeIcon({ status, lesson }: { status: LessonStatus; lesson: Lesson }) {
  switch (status) {
    case "locked":
      return <span className="text-2xl grayscale">🔒</span>;
    case "available":
      return <span className="text-2xl font-black">{lesson.leetcode.id}</span>;
    case "completed":
      return <CheckIcon />;
    case "perfect":
      return <span className="text-3xl">👑</span>;
  }
}

interface LessonNodeProps {
  lesson: Lesson;
  /** null — прогресс ещё не загружен */
  status: LessonStatus | null;
  /** Сдвиг по горизонтали для извилистой дорожки, px. */
  offset: number;
  open: boolean;
  onToggle: () => void;
  /** Маскот рядом с текущим уроком. */
  companion?: ReactNode;
  popover?: ReactNode;
}

export function LessonNode({ lesson, status, offset, open, onToggle, companion, popover }: LessonNodeProps) {
  const available = status === "available";

  return (
    <div className={cn("relative flex w-full flex-col items-center", open && "z-30")}>
      <div className="relative" style={{ transform: `translateX(${offset}px)` }}>
        {available && (
          <>
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-primary"
              animate={{ scale: [1, 1.45], opacity: [0.45, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              aria-hidden
              className="absolute -top-11 left-1/2 -translate-x-1/2 rounded-xl border-2 border-border bg-surface px-3 py-1 text-sm font-black whitespace-nowrap text-primary uppercase"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              Старт
            </motion.span>
          </>
        )}

        <button
          type="button"
          onClick={onToggle}
          disabled={status === null}
          aria-expanded={open}
          aria-label={`${lesson.title}, ${status ? STATUS_LABELS[status] : "загрузка"}`}
          className={cn(
            // Идеальный круг: объём — внутренним ободком снизу, а не подложкой под кругом,
            // иначе кружок выглядит овалом. Белое кольцо и мягкая тень — как у монеты.
            "relative flex size-[72px] items-center justify-center rounded-full ring-4 ring-surface",
            "shadow-[inset_0_-6px_0_var(--ledge),0_8px_16px_-6px_rgb(31_27_58/0.35)]",
            "transition-[transform,box-shadow] duration-100",
            "active:translate-y-0.5 active:shadow-[inset_0_-2px_0_var(--ledge),0_4px_8px_-4px_rgb(31_27_58/0.35)]",
            "focus-visible:outline-3 focus-visible:outline-offset-6 focus-visible:outline-primary",
            status ? STATUS_STYLES[status] : "animate-pulse bg-border [--ledge:var(--surface-shade)]",
          )}
        >
          {/* иконка чуть выше центра, чтобы компенсировать нижний ободок */}
          <span className="-mt-1 flex items-center justify-center">
            {status && <NodeIcon status={status} lesson={lesson} />}
          </span>
        </button>

        {companion && (
          <div
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2",
              offset > 0 ? "right-full mr-6" : "left-full ml-6",
            )}
          >
            {companion}
          </div>
        )}
      </div>

      {open && popover && (
        <div className="absolute top-full left-1/2 mt-4 w-[min(300px,calc(100vw-32px))] -translate-x-1/2">
          {/* стрелка поповера указывает на кружок с учётом сдвига */}
          <span
            aria-hidden
            className="absolute -top-2 size-4 rotate-45 border-t-2 border-l-2 border-border bg-surface"
            style={{ left: `calc(50% + ${offset}px - 8px)` }}
          />
          {popover}
        </div>
      )}
    </div>
  );
}
