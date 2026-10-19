/** 161_000 → '2:41' */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function leetcodeUrl(slug: string): string {
  return `https://leetcode.com/problems/${slug}/`;
}

/** Русское склонение: plural(3, ["день", "дня", "дней"]) → "дня". */
export function plural(n: number, [one, few, many]: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/** Плашка стрика в итоге урока. */
export function streakLabel(days: number): string {
  if (days === 1) return "Стрик начался!";
  return `${days} ${plural(days, ["день", "дня", "дней"])} подряд!`;
}
