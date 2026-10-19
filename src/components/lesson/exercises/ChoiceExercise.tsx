"use client";

import type { Exercise } from "@/lib/types";
import { OptionButton, optionTone } from "./OptionButton";
import type { OptionExerciseProps } from "./types";

type ChoiceExerciseProps = OptionExerciseProps<Extract<Exercise, { type: "choice" }>>;

export function ChoiceExercise({ exercise, selected, onSelect, checked }: ChoiceExerciseProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl leading-tight font-black">{exercise.question}</h2>
      <div className="space-y-3" role="group" aria-label="Варианты ответа">
        {exercise.options.map((option, i) => (
          <OptionButton
            key={option}
            label={option}
            index={i}
            tone={optionTone(i, selected, exercise.correct, checked)}
            disabled={checked}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
}
