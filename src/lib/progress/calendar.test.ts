import { describe, expect, it } from "vitest";
import { activityLevel, buildCalendar, formatDay, monthLabels, weekdayIndex } from "./calendar";

describe("activityLevel", () => {
  it("maps XP to fixed levels", () => {
    expect([0, 1, 15, 16, 30, 31, 60, 61, 200].map(activityLevel)).toEqual([0, 1, 1, 2, 2, 3, 3, 4, 4]);
  });
});

describe("weekdayIndex", () => {
  it("starts the week on Monday", () => {
    expect(weekdayIndex("2026-10-19")).toBe(0); // понедельник
    expect(weekdayIndex("2026-10-25")).toBe(6); // воскресенье
  });
});

describe("buildCalendar", () => {
  // 2026-10-21 — среда
  const weeks = buildCalendar({ "2026-10-21": 15, "2026-10-19": 45, "2026-10-12": 90 }, "2026-10-21", 3);

  it("builds full Monday-first weeks ending with the current one", () => {
    expect(weeks).toHaveLength(3);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
    expect(weeks[0]?.[0]?.day).toBe("2026-10-05");
    expect(weeks[2]?.[0]?.day).toBe("2026-10-19");
  });

  it("fills XP and levels, flags future days", () => {
    const current = weeks[2]!;
    expect(current[0]).toEqual({ day: "2026-10-19", xp: 45, level: 3, future: false });
    expect(current[2]).toEqual({ day: "2026-10-21", xp: 15, level: 1, future: false });
    expect(current[3]?.future).toBe(true);
    expect(weeks[1]?.[0]?.level).toBe(4);
  });

  it("labels a month once, where it starts", () => {
    const long = buildCalendar({}, "2026-11-04", 6);
    expect(monthLabels(long)).toEqual(["сен", "окт", null, null, null, "ноя"]);
  });
});

describe("formatDay", () => {
  it("formats a short Russian date", () => {
    expect(formatDay("2026-10-09")).toBe("9 окт");
  });
});
