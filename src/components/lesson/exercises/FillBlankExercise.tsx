"use client";

import { motion } from "framer-motion";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import type { Exercise } from "@/lib/types";
import type { OptionExerciseProps } from "./types";

type FillBlankExerciseProps = OptionExerciseProps<Extract<Exercise, { type: "fill-blank" }>>;

const tileSpring = { type: "spring", stiffness: 500, damping: 35 } as const;

export function FillBlankExercise({ exercise, selected, onSelect, checked }: FillBlankExerciseProps) {
  const isCorrect = selected === exercise.correct;
  const filled = selected === null ? null : exercise.options[selected];

  // Пропуск в коде: пустая выемка или вставленная плитка. Тап по плитке возвращает её назад.
  const slot =
    filled === undefined || filled === null ? (
      <span
        className="inline-block h-6 min-w-[4ch] translate-y-1 rounded-md border-2 border-dashed border-primary bg-primary-soft align-baseline"
        aria-label="Пропуск"
      />
    ) : (
      <motion.button
        type="button"
        layoutId={`tile-${selected}`}
        transition={tileSpring}
        disabled={checked}
        onClick={() => onSelect(null)}
        aria-label={`Убрать ${filled} из пропуска`}
        className={cn(
          "inline-block rounded-md border-2 px-1.5 font-bold",
          !checked && "border-primary bg-primary-soft text-primary",
          checked && isCorrect && "border-success bg-success-soft text-success-ink",
          checked && !isCorrect && "border-error bg-error-soft text-error-ink",
        )}
      >
        {filled}
      </motion.button>
    );

  return (
    <div className="space-y-5">
      <h2 className="text-2xl leading-tight font-black">Заполни пропуск</h2>
      <CodeBlock code={exercise.code} blank={slot} />

      <div className="flex flex-wrap justify-center gap-3" role="group" aria-label="Плитки">
        {exercise.options.map((option, i) =>
          i === selected ? (
            // место плитки в лотке остаётся пустым, пока она в коде
            <span
              key={option}
              aria-hidden
              className="rounded-xl bg-border px-4 py-2 font-mono text-[15px] font-bold text-transparent"
            >
              {option}
            </span>
          ) : (
            <motion.button
              key={option}
              type="button"
              layoutId={`tile-${i}`}
              transition={tileSpring}
              disabled={checked}
              onClick={() => onSelect(i)}
              className={cn(
                "rounded-xl border-2 border-b-4 border-border bg-surface px-4 py-2 font-mono text-[15px] font-bold",
                "active:translate-y-0.5 active:border-b-2 disabled:opacity-50",
                checked && i === exercise.correct && "border-success text-success-ink opacity-100!",
              )}
            >
              {option}
            </motion.button>
          ),
        )}
      </div>
    </div>
  );
}
