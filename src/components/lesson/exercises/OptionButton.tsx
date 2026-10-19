"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export type OptionTone = "idle" | "selected" | "correct" | "wrong" | "dimmed";

/** Как подсветить вариант i до и после проверки. После ошибки показываем и верный ответ. */
export function optionTone(
  index: number,
  selected: number | null,
  correct: number,
  checked: boolean,
): OptionTone {
  if (!checked) return index === selected ? "selected" : "idle";
  if (index === correct) return "correct";
  if (index === selected) return "wrong";
  return "dimmed";
}

const TONES: Record<OptionTone, string> = {
  idle: "border-border bg-surface text-ink hover:bg-bg",
  selected: "border-primary bg-primary-soft text-primary",
  correct: "border-success bg-success-soft text-success-shade",
  wrong: "border-error bg-error-soft text-error-shade",
  dimmed: "border-border bg-surface text-ink opacity-50",
};

interface OptionButtonProps {
  label: string;
  index: number;
  tone: OptionTone;
  disabled: boolean;
  mono?: boolean;
  onClick: () => void;
}

export function OptionButton({ label, index, tone, disabled, mono = false, onClick }: OptionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={tone === "selected"}
      animate={tone === "wrong" ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border-2 border-b-4 px-4 py-3 text-left font-bold",
        "transition-colors duration-150 active:translate-y-0.5 active:border-b-2 disabled:active:translate-y-0",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary",
        TONES[tone],
      )}
    >
      <span
        aria-hidden
        className="flex size-7 shrink-0 items-center justify-center rounded-lg border-2 border-current/30 text-sm"
      >
        {index + 1}
      </span>
      <span className={cn("min-w-0 break-words", mono && "font-mono text-[15px]")}>{label}</span>
    </motion.button>
  );
}
