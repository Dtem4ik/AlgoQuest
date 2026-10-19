import { describe, expect, it } from "vitest";
import { addDays, toDayKey } from "./dates";
import { applyActivity, displayedStreak, EMPTY_STREAK, isStreakBroken } from "./streak";

describe("dates", () => {
  it("formats local day with zero padding", () => {
    expect(toDayKey(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
  });

  it("adds days across month and year boundaries", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2025-12-31", 1)).toBe("2026-01-01");
    expect(addDays("2024-03-01", -1)).toBe("2024-02-29");
  });
});

describe("applyActivity", () => {
  it("starts a streak from scratch", () => {
    expect(applyActivity(EMPTY_STREAK, "2026-10-19")).toEqual({
      current: 1,
      best: 1,
      lastDay: "2026-10-19",
    });
  });

  it("is idempotent within a day", () => {
    const s = { current: 3, best: 5, lastDay: "2026-10-19" };
    expect(applyActivity(s, "2026-10-19")).toBe(s);
  });

  it("continues on the next day and updates best", () => {
    expect(applyActivity({ current: 5, best: 5, lastDay: "2026-10-18" }, "2026-10-19")).toEqual({
      current: 6,
      best: 6,
      lastDay: "2026-10-19",
    });
  });

  it("resets after a gap but keeps best", () => {
    expect(applyActivity({ current: 4, best: 7, lastDay: "2026-10-16" }, "2026-10-19")).toEqual({
      current: 1,
      best: 7,
      lastDay: "2026-10-19",
    });
  });
});

describe("displayedStreak / isStreakBroken", () => {
  const s = { current: 4, best: 4, lastDay: "2026-10-18" };

  it("is alive today and the day after", () => {
    expect(displayedStreak(s, "2026-10-18")).toBe(4);
    expect(displayedStreak(s, "2026-10-19")).toBe(4);
    expect(isStreakBroken(s, "2026-10-19")).toBe(false);
  });

  it("is broken after a missed day", () => {
    expect(displayedStreak(s, "2026-10-20")).toBe(0);
    expect(isStreakBroken(s, "2026-10-20")).toBe(true);
  });

  it("is not 'broken' when there was never a streak", () => {
    expect(displayedStreak(EMPTY_STREAK, "2026-10-20")).toBe(0);
    expect(isStreakBroken(EMPTY_STREAK, "2026-10-20")).toBe(false);
  });
});
