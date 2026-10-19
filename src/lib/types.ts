export type MascotState =
  | "idle"
  | "happy"
  | "sad"
  | "thinking"
  | "celebrate"
  | "sleepy";

export type PointerName = string;

export type HighlightKind = "compare" | "write" | "skip" | "done";

/** Ряд ячеек с указателями и подсветкой. */
export interface VizRow {
  array: (number | string)[];
  /** имя → индекс (-1 = скрыть) */
  pointers: Record<PointerName, number>;
  highlight?: Partial<Record<HighlightKind, number[]>>;
}

export interface VizStep extends VizRow {
  /** Подпись основного массива (например, nums1), если рядов два. */
  label?: string;
  /** Второй массив под основным: nums2 в Merge Sorted Array, res в брутфорсе Rotate Array. */
  secondary?: VizRow & { label: string };
  vars?: Record<string, string | number>;
  note: string;
}

export type Exercise =
  | {
      type: "theory";
      title: string;
      body: string;
      code?: string;
      mascot?: MascotState;
    }
  | { type: "visualize"; title: string; steps: VizStep[] }
  | {
      type: "choice";
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    }
  | {
      type: "predict-output";
      code: string;
      input: string;
      options: string[];
      correct: number;
      explanation: string;
    }
  | {
      type: "fill-blank";
      /** ровно один `___` */
      code: string;
      options: string[];
      correct: number;
      explanation: string;
    }
  | {
      type: "order-lines";
      /** в правильном порядке, движок перемешивает */
      lines: string[];
      /** Другие верные порядки (индексы строк lines), если независимые строки можно поменять местами. */
      accept?: number[][];
      explanation: string;
    }
  | {
      type: "find-bug";
      code: string[];
      bugLine: number;
      fixed: string;
      explanation: string;
    };

export type ExerciseType = Exercise["type"];

/** Карточка «Как рассказать на собесе» в итоге урока. */
export interface InterviewNotes {
  brute: string;
  optimal: string;
  time: string;
  space: string;
}

export interface Lesson {
  id: string;
  title: string;
  leetcode: {
    id: number;
    slug: string;
    difficulty: "Easy" | "Medium" | "Hard";
  };
  xp: number;
  interview: InterviewNotes;
  exercises: Exercise[];
}

export interface Island {
  id: string;
  title: string;
  emoji: string;
  color: string;
  summary: string;
  lessons: Lesson[];
}
