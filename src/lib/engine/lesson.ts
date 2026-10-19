import type { Exercise, Lesson } from "@/lib/types";
import { isGraded } from "./check";

/**
 * answering     — пользователь решает текущее упражнение;
 * feedback      — ответ проверен, показана плашка «Верно / Не совсем»;
 * finished      — очередь пуста, урок пройден;
 * out-of-hearts — сердечки кончились.
 */
export type LessonPhase = "answering" | "feedback" | "finished" | "out-of-hearts";

export interface LessonState {
  /** Индексы упражнений урока; голова очереди — текущее упражнение. */
  queue: number[];
  total: number;
  /** Сколько упражнений уже пройдено (ушло из очереди). */
  done: number;
  hearts: number;
  phase: LessonPhase;
  lastCorrect: boolean | null;
  mistakes: number;
  /** Упражнения, на которых ошиблись хотя бы раз. */
  missed: number[];
}

export function startLesson(lesson: Lesson, hearts: number): LessonState {
  return {
    queue: lesson.exercises.map((_, i) => i),
    total: lesson.exercises.length,
    done: 0,
    hearts,
    phase: hearts > 0 ? "answering" : "out-of-hearts",
    lastCorrect: null,
    mistakes: 0,
    missed: [],
  };
}

export function currentExercise(
  lesson: Lesson,
  state: LessonState,
): { index: number; exercise: Exercise } | null {
  const index = state.queue[0];
  if (index === undefined) return null;
  const exercise = lesson.exercises[index];
  return exercise ? { index, exercise } : null;
}

/** Результат проверки ответа: показываем плашку, при ошибке забираем сердечко. */
export function submitAnswer(state: LessonState, correct: boolean): LessonState {
  if (state.phase !== "answering") return state;
  const index = state.queue[0];
  if (index === undefined) return state;

  if (correct) {
    return { ...state, phase: "feedback", lastCorrect: true };
  }
  return {
    ...state,
    phase: "feedback",
    lastCorrect: false,
    hearts: Math.max(0, state.hearts - 1),
    mistakes: state.mistakes + 1,
    missed: state.missed.includes(index) ? state.missed : [...state.missed, index],
  };
}

function nextPhase(state: LessonState): LessonState {
  if (state.queue.length === 0) return { ...state, phase: "finished" };
  if (state.hearts === 0) return { ...state, phase: "out-of-hearts" };
  return { ...state, phase: "answering", lastCorrect: null };
}

/** «Дальше» после плашки: верное уходит из очереди, ошибочное — в её конец. */
export function advance(state: LessonState): LessonState {
  if (state.phase !== "feedback") return state;
  const [head, ...rest] = state.queue;
  if (head === undefined) return state;

  if (state.lastCorrect) {
    return nextPhase({ ...state, queue: rest, done: state.done + 1 });
  }
  return nextPhase({ ...state, queue: [...rest, head] });
}

/** «Понятно» на упражнении без ответа (theory, visualize). */
export function acknowledge(state: LessonState): LessonState {
  if (state.phase !== "answering") return state;
  const [, ...rest] = state.queue;
  return nextPhase({ ...state, queue: rest, done: state.done + 1 });
}

export function lessonProgress(state: LessonState): number {
  return state.total === 0 ? 1 : state.done / state.total;
}

export interface LessonScore {
  /** Доля упражнений, решённых с первой попытки, 0–100. */
  accuracy: number;
  perfect: boolean;
}

export function lessonScore(lesson: Lesson, state: LessonState): LessonScore {
  const graded = lesson.exercises.filter(isGraded).length;
  const accuracy =
    graded === 0 ? 100 : Math.round(((graded - state.missed.length) / graded) * 100);
  return { accuracy, perfect: state.mistakes === 0 };
}
