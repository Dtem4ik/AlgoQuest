import { describe, expect, it } from "vitest";
import { formatDuration, plural, streakLabel } from "./format";

describe("format", () => {
  it("formats durations as m:ss", () => {
    expect(formatDuration(161_000)).toBe("2:41");
    expect(formatDuration(5_400)).toBe("0:05");
  });

  it("declines Russian nouns", () => {
    const days = (n: number) => plural(n, ["день", "дня", "дней"]);
    expect([1, 2, 4, 5, 11, 12, 14, 21, 22, 25, 101, 111].map(days)).toEqual([
      "день", "дня", "дня", "дней", "дней", "дней", "дней", "день", "дня", "дней", "день", "дней",
    ]);
  });

  it("labels streaks", () => {
    expect(streakLabel(1)).toBe("Стрик начался!");
    expect(streakLabel(3)).toBe("3 дня подряд!");
    expect(streakLabel(7)).toBe("7 дней подряд!");
  });
});
