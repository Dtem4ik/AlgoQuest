"use client";

import { CodeBlock } from "@/components/ui/CodeBlock";
import type { Exercise } from "@/lib/types";
import { OptionButton, optionTone } from "./OptionButton";
import type { OptionExerciseProps } from "./types";

type PredictOutputExerciseProps = OptionExerciseProps<Extract<Exercise, { type: "predict-output" }>>;

export function PredictOutputExercise({ exercise, selected, onSelect, checked }: PredictOutputExerciseProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl leading-tight font-black">Что вернёт функция?</h2>
      <div className="space-y-2">
        <CodeBlock code={exercise.code} />
        <p className="rounded-2xl border-2 border-dashed border-border px-4 py-2 font-mono text-sm">
          <span className="font-sans font-extrabold text-ink-muted">Вход: </span>
          {exercise.input}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3" role="group" aria-label="Варианты ответа">
        {exercise.options.map((option, i) => (
          <OptionButton
            key={option}
            label={option}
            index={i}
            mono
            tone={optionTone(i, selected, exercise.correct, checked)}
            disabled={checked}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
}
