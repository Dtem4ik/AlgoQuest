/** День в формате 'YYYY-MM-DD' в локальной таймзоне пользователя. */
export type DayKey = string;

const DAY_MS = 24 * 60 * 60 * 1000;

const pad = (n: number) => String(n).padStart(2, "0");

export function toDayKey(date: Date): DayKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Сдвиг дня на n дней. Считаем в UTC, чтобы переход на летнее время не съедал сутки. */
export function addDays(day: DayKey, n: number): DayKey {
  const [y, m, d] = day.split("-").map(Number) as [number, number, number];
  const shifted = new Date(Date.UTC(y, m - 1, d) + n * DAY_MS);
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`;
}
