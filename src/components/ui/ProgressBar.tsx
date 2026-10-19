"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface ProgressBarProps {
  /** 0–1 */
  value: number;
  tone?: "primary" | "success" | "xp";
  className?: string;
  label?: string;
}

const tones = {
  primary: "bg-primary",
  success: "bg-success",
  xp: "bg-xp",
};

export function ProgressBar({ value, tone = "primary", className, label }: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
      className={cn("h-4 w-full overflow-hidden rounded-full bg-border", className)}
    >
      <motion.div
        className={cn("relative h-full rounded-full", tones[tone])}
        initial={false}
        animate={{ width: `${clamped * 100}%` }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        {/* блик сверху, как у объёмных кнопок */}
        <span className="absolute inset-x-2 top-1 h-1 rounded-full bg-white/35" />
      </motion.div>
    </div>
  );
}
