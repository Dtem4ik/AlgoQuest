import type { Exercise } from "@/lib/types";
import { isCorrectOrder, shuffleOrder } from "./order-lines";

/** Упражнения с выбором одного варианта из списка. */
export type OptionExercise = Extract<Exercise, { type: "choice" | "predict-output" | "fill-blank" }>;

export type GradedExercise = Extract<
  Exercise,
  { type: "choice" | "predict-output" | "fill-blank" | "order-lines" | "find-bug" }
>;

export type Answer =
  | { type: "option"; index: number }
  /** Индексы исходных строк в текущем порядке. */
  | { type: "order"; order: number[] }
  | { type: "line"; index: number };

/** Требует ли упражнение ответа. theory и visualize только просматриваются. */
export function isGraded(exercise: Exercise): exercise is GradedExercise {
  return exercise.type !== "theory" && exercise.type !== "visualize";
}

export function isOptionExercise(exercise: Exercise): exercise is OptionExercise {
  return (
    exercise.type === "choice" || exercise.type === "predict-output" || exercise.type === "fill-blank"
  );
}

export function checkAnswer(exercise: GradedExercise, answer: Answer): boolean {
  switch (exercise.type) {
    case "choice":
    case "predict-output":
    case "fill-blank":
      return answer.type === "option" && answer.index === exercise.correct;
    case "order-lines":
      return answer.type === "order" && isCorrectOrder(exercise.lines, answer.order);
    case "find-bug":
      return answer.type === "line" && answer.index === exercise.bugLine;
  }
}

/** Ответ, с которого начинается упражнение: для order-lines это перемешанные строки. */
export function initialAnswer(exercise: Exercise, random: () => number): Answer | null {
  return exercise.type === "order-lines"
    ? { type: "order", order: shuffleOrder(exercise.lines, random) }
    : null;
}
