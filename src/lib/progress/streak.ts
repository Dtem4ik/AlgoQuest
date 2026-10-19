import { addDays, type DayKey } from "./dates";

export interface Streak {
  current: number;
  best: number;
  /** Последний день с активностью; '' — активности ещё не было. */
  lastDay: DayKey;
}

export const EMPTY_STREAK: Streak = { current: 0, best: 0, lastDay: "" };

/** Отмечает активность в день `today`. */
export function applyActivity(streak: Streak, today: DayKey): Streak {
  if (streak.lastDay === today) return streak;

  const continues = streak.lastDay !== "" && addDays(streak.lastDay, 1) === today;
  const current = continues ? streak.current + 1 : 1;
  return { current, best: Math.max(streak.best, current), lastDay: today };
}

/** Стрик для показа: если вчера и сегодня не занимались, он уже сломан. */
export function displayedStreak(streak: Streak, today: DayKey): number {
  if (streak.lastDay === "") return 0;
  const alive = streak.lastDay === today || addDays(streak.lastDay, 1) === today;
  return alive ? streak.current : 0;
}

/** Стрик был, но прервался — повод показать сонного Бита. */
export function isStreakBroken(streak: Streak, today: DayKey): boolean {
  return streak.current > 0 && displayedStreak(streak, today) === 0;
}
