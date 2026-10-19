import type { Exercise } from "@/lib/types";

/** Упражнения с выбором одного варианта из списка. */
export type OptionExercise = Extract<Exercise, { type: "choice" | "predict-output" | "fill-blank" }>;

// Этап 2 добавит order-lines (порядок строк) и find-bug (номер строки).
export type GradedExercise = OptionExercise;

export type Answer = { type: "option"; index: number };

const GRADED_TYPES: ReadonlySet<Exercise["type"]> = new Set([
  "choice",
  "predict-output",
  "fill-blank",
]);

/** Требует ли упражнение ответа. theory и visualize только просматриваются. */
export function isGraded(exercise: Exercise): exercise is GradedExercise {
  return GRADED_TYPES.has(exercise.type);
}

export function checkAnswer(exercise: GradedExercise, answer: Answer): boolean {
  return answer.index === exercise.correct;
}
