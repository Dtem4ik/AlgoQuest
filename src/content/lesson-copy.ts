import type { ExerciseType } from "@/lib/types";

/** Что говорит Бит, пока пользователь решает упражнение. */
export const EXERCISE_PROMPTS: Record<ExerciseType, string> = {
  theory: "Сначала немного теории",
  visualize: "Смотри, как это работает",
  choice: "Выбери правильный ответ",
  "predict-output": "Прогони код в голове",
  "fill-blank": "Тапни плитку, чтобы вставить её в код",
  "order-lines": "Собери решение по строкам",
  "find-bug": "Найди строку с ошибкой",
};
