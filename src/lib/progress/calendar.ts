import { addDays, type DayKey } from "./dates";

export type ActivityLevel = 0 | 1 | 2 | 3 | 4;

export interface CalendarDay {
  day: DayKey;
  xp: number;
  level: ActivityLevel;
  /** День ещё не наступил (хвост последней недели). */
  future: boolean;
}

/** Неделя — столбец календаря, дни с понедельника по воскресенье. */
export type CalendarWeek = CalendarDay[];

/**
 * Пороги фиксированные, а не относительные: урок даёт 10–20 XP,
 * так что 1 = один урок, 4 = четыре и больше. Цвет дня со временем не «плывёт».
 */
const LEVEL_THRESHOLDS: readonly [number, ActivityLevel][] = [
  [61, 4],
  [31, 3],
  [16, 2],
  [1, 1],
];

export function activityLevel(xp: number): ActivityLevel {
  return LEVEL_THRESHOLDS.find(([min]) => xp >= min)?.[1] ?? 0;
}

/** 0 — понедельник, 6 — воскресенье. */
export function weekdayIndex(day: DayKey): number {
  const [y, m, d] = day.split("-").map(Number) as [number, number, number];
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
}

/** Сетка последних `weeks` недель; последний столбец — текущая неделя. */
export function buildCalendar(
  activity: Record<DayKey, number>,
  today: DayKey,
  weeks: number,
): CalendarWeek[] {
  const monday = addDays(today, -weekdayIndex(today));
  const start = addDays(monday, -7 * (weeks - 1));
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const day = addDays(start, w * 7 + d);
      const xp = activity[day] ?? 0;
      return { day, xp, level: activityLevel(xp), future: day > today };
    }),
  );
}

const MONTHS = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

/** Подписи месяцев над столбцами: там, где неделя начинает новый месяц. */
export function monthLabels(weeks: CalendarWeek[]): (string | null)[] {
  let previous = "";
  return weeks.map((week) => {
    const month = week[0]?.day.slice(5, 7) ?? "";
    if (month === previous) return null;
    previous = month;
    return MONTHS[Number(month) - 1] ?? null;
  });
}

/** '2026-10-19' → '19 окт' */
export function formatDay(day: DayKey): string {
  const [, m, d] = day.split("-").map(Number) as [number, number, number];
  return `${d} ${MONTHS[m - 1] ?? ""}`;
}
