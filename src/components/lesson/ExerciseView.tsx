"use client";

import type { Exercise } from "@/lib/types";
import { ChoiceExercise } from "./exercises/ChoiceExercise";
import { FillBlankExercise } from "./exercises/FillBlankExercise";
import { PredictOutputExercise } from "./exercises/PredictOutputExercise";
import { TheoryExercise } from "./exercises/TheoryExercise";
import { UpcomingExercise } from "./exercises/UpcomingExercise";

interface ExerciseViewProps {
  exercise: Exercise;
  selected: number | null;
  onSelect: (index: number | null) => void;
  checked: boolean;
}

/** Рендерит упражнение по его type. */
export function ExerciseView({ exercise, selected, onSelect, checked }: ExerciseViewProps) {
  const answerProps = { selected, onSelect, checked };

  switch (exercise.type) {
    case "theory":
      return <TheoryExercise exercise={exercise} />;
    case "choice":
      return <ChoiceExercise exercise={exercise} {...answerProps} />;
    case "predict-output":
      return <PredictOutputExercise exercise={exercise} {...answerProps} />;
    case "fill-blank":
      return <FillBlankExercise exercise={exercise} {...answerProps} />;
    case "visualize":
    case "order-lines":
    case "find-bug":
      return <UpcomingExercise exercise={exercise} />;
  }
}
