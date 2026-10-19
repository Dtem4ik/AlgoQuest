"use client";

import { motion } from "framer-motion";
import { CodeLine } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import type { Exercise } from "@/lib/types";

interface FindBugExerciseProps {
  exercise: Extract<Exercise, { type: "find-bug" }>;
  selected: number | null;
  onSelect: (line: number) => void;
  checked: boolean;
}

function lineStyle(index: number, selected: number | null, bugLine: number, checked: boolean): string {
  if (!checked) {
    return index === selected
      ? "bg-primary-soft border-primary"
      : "border-transparent hover:bg-primary-soft/50";
  }
  if (index === bugLine) return "bg-error-soft border-error";
  if (index === selected) return "border-error border-dashed";
  return "border-transparent opacity-60";
}

export function FindBugExercise({ exercise, selected, onSelect, checked }: FindBugExerciseProps) {
  const { code, bugLine, fixed } = exercise;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl leading-tight font-black">Найди строку с ошибкой</h2>

      <div className="overflow-x-auto rounded-2xl bg-code-bg py-3 text-[13px] leading-6">
        <div className="w-max min-w-full" role="radiogroup" aria-label="Строки кода">
          {code.map((line, i) => (
            <div key={i}>
              <button
                type="button"
                role="radio"
                aria-checked={i === selected}
                disabled={checked}
                onClick={() => onSelect(i)}
                className={cn(
                  "flex w-full items-center border-l-4 py-1 pr-4 text-left transition-colors duration-150",
                  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary",
                  lineStyle(i, selected, bugLine, checked),
                )}
              >
                <span className="w-9 shrink-0 pr-3 text-right font-mono text-ink-muted/60 select-none">
                  {checked && i === bugLine ? "−" : i + 1}
                </span>
                <CodeLine code={line} className={cn(checked && i === bugLine && "line-through decoration-error/60")} />
              </button>

              {checked && i === bugLine && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center border-l-4 border-success bg-success-soft py-1 pr-4"
                >
                  <span className="w-9 shrink-0 pr-3 text-right font-mono font-bold text-success-shade select-none">
                    +
                  </span>
                  <CodeLine code={fixed} />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
