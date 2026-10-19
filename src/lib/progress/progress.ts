import { toDayKey, type DayKey } from "./dates";
import { MAX_HEARTS } from "./hearts";
import { applyActivity, EMPTY_STREAK, type Streak } from "./streak";

export interface LessonRecord {
  completed: boolean;
  perfect: boolean;
  bestAccuracy: number;
}

export interface Progress {
  xp: number;
  hearts: number;
  heartsUpdatedAt: number;
  streak: Streak;
  /** день → XP */
  activity: Record<DayKey, number>;
  lessons: Record<string, LessonRecord>;
}

export const INITIAL_PROGRESS: Progress = {
  xp: 0,
  hearts: MAX_HEARTS,
  heartsUpdatedAt: 0,
  streak: EMPTY_STREAK,
  activity: {},
  lessons: {},
};

export interface LessonResult {
  lessonId: string;
  baseXp: number;
  /** 0–100 */
  accuracy: number;
  perfect: boolean;
}

/** XP за урок: полный при первом прохождении, половина за повтор. */
export function xpForLesson(baseXp: number, alreadyCompleted: boolean): number {
  return alreadyCompleted ? Math.floor(baseXp / 2) : baseXp;
}

export interface LessonReward {
  xpEarned: number;
  /** Стрик после урока. */
  streak: number;
  /** Первый урок за сегодня — стрик вырос (или начался). */
  streakExtended: boolean;
}

export function applyLessonResult(
  progress: Progress,
  result: LessonResult,
  now: Date,
): { progress: Progress } & LessonReward {
  const prev = progress.lessons[result.lessonId];
  const xpEarned = xpForLesson(result.baseXp, prev?.completed ?? false);
  const today = toDayKey(now);
  const streak = applyActivity(progress.streak, today);

  return {
    xpEarned,
    streak: streak.current,
    streakExtended: progress.streak.lastDay !== today,
    progress: {
      ...progress,
      xp: progress.xp + xpEarned,
      streak,
      activity: {
        ...progress.activity,
        [today]: (progress.activity[today] ?? 0) + xpEarned,
      },
      lessons: {
        ...progress.lessons,
        [result.lessonId]: {
          completed: true,
          perfect: (prev?.perfect ?? false) || result.perfect,
          bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, result.accuracy),
        },
      },
    },
  };
}
