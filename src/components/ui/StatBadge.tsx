"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

export type StatKind = "streak" | "xp" | "hearts";

const config: Record<StatKind, { icon: string; label: string; color: string }> = {
  streak: { icon: "🔥", label: "Стрик", color: "text-xp-shade" },
  xp: { icon: "⚡", label: "XP", color: "text-primary" },
  hearts: { icon: "❤️", label: "Сердечки", color: "text-error" },
};

interface StatBadgeProps {
  kind: StatKind;
  /** null — данные ещё не загружены */
  value: number | null;
  /** Бейдж «погашен» (например, стрик сломан). */
  muted?: boolean;
  className?: string;
}

export function StatBadge({ kind, value, muted = false, className }: StatBadgeProps) {
  const { icon, label, color } = config[kind];
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-lg font-extrabold tabular-nums",
        muted ? "text-disabled-ink" : color,
        className,
      )}
    >
      <span className="sr-only">
        {label}: {value ?? "загрузка"}
      </span>
      <span className={cn("text-xl", muted && "grayscale")} aria-hidden>
        {icon}
      </span>
      <span className="relative inline-flex min-w-[1.5ch] overflow-hidden" aria-hidden>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value ?? "empty"}
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {value ?? "–"}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
