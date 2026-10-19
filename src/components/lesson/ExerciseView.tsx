"use client";

import type { Answer } from "@/lib/engine/check";
import type { Exercise } from "@/lib/types";
import { ChoiceExercise } from "./exercises/ChoiceExercise";
import { FillBlankExercise } from "./exercises/FillBlankExercise";
import { FindBugExercise } from "./exercises/FindBugExercise";
import { OrderLinesExercise } from "./exercises/OrderLinesExercise";
import { PredictOutputExercise } from "./exercises/PredictOutputExercise";
import { TheoryExercise } from "./exercises/TheoryExercise";
import { VisualizeExercise } from "./exercises/VisualizeExercise";

interface ExerciseViewProps {
  exercise: Exercise;
  answer: Answer | null;
  onAnswer: (answer: Answer | null) => void;
  /** Ответ проверен: показываем результат, ввод заблокирован. */
  checked: boolean;
  /** Визуализация досмотрена до последнего шага. */
  onVisualized: () => void;
}

/** Рендерит упражнение по его type и переводит ввод в общий формат Answer. */
export function ExerciseView({ exercise, answer, onAnswer, checked, onVisualized }: ExerciseViewProps) {
  const optionProps = {
    selected: answer?.type === "option" ? answer.index : null,
    onSelect: (index: number | null) => onAnswer(index === null ? null : { type: "option", index }),
    checked,
  };

  switch (exercise.type) {
    case "theory":
      return <TheoryExercise exercise={exercise} />;
    case "visualize":
      return <VisualizeExercise exercise={exercise} onComplete={onVisualized} />;
    case "choice":
      return <ChoiceExercise exercise={exercise} {...optionProps} />;
    case "predict-output":
      return <PredictOutputExercise exercise={exercise} {...optionProps} />;
    case "fill-blank":
      return <FillBlankExercise exercise={exercise} {...optionProps} />;
    case "order-lines":
      return (
        <OrderLinesExercise
          exercise={exercise}
          order={answer?.type === "order" ? answer.order : exercise.lines.map((_, i) => i)}
          onReorder={(order) => onAnswer({ type: "order", order })}
          checked={checked}
        />
      );
    case "find-bug":
      return (
        <FindBugExercise
          exercise={exercise}
          selected={answer?.type === "line" ? answer.index : null}
          onSelect={(index) => onAnswer({ type: "line", index })}
          checked={checked}
        />
      );
  }
}
