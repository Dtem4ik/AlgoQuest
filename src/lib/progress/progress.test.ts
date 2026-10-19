import { describe, expect, it } from "vitest";
import { applyLessonResult, INITIAL_PROGRESS, xpForLesson } from "./progress";

const now = new Date(2026, 9, 19, 12);

describe("xpForLesson", () => {
  it("gives full XP first time and half (floored) on replay", () => {
    expect(xpForLesson(15, false)).toBe(15);
    expect(xpForLesson(15, true)).toBe(7);
  });
});

describe("applyLessonResult", () => {
  it("records a first completion", () => {
    const { progress, xpEarned } = applyLessonResult(
      INITIAL_PROGRESS,
      { lessonId: "tp-27", baseXp: 15, accuracy: 80, perfect: false },
      now,
    );
    expect(xpEarned).toBe(15);
    expect(progress.xp).toBe(15);
    expect(progress.activity).toEqual({ "2026-10-19": 15 });
    expect(progress.streak).toEqual({ current: 1, best: 1, lastDay: "2026-10-19" });
    expect(progress.lessons["tp-27"]).toEqual({ completed: true, perfect: false, bestAccuracy: 80 });
  });

  it("halves XP on replay and keeps the best results", () => {
    const first = applyLessonResult(
      INITIAL_PROGRESS,
      { lessonId: "tp-27", baseXp: 15, accuracy: 100, perfect: true },
      now,
    ).progress;
    const { progress, xpEarned } = applyLessonResult(
      first,
      { lessonId: "tp-27", baseXp: 15, accuracy: 60, perfect: false },
      now,
    );
    expect(xpEarned).toBe(7);
    expect(progress.xp).toBe(22);
    expect(progress.activity["2026-10-19"]).toBe(22);
    expect(progress.lessons["tp-27"]).toEqual({ completed: true, perfect: true, bestAccuracy: 100 });
  });

  it("reports the streak only for the first lesson of the day", () => {
    const first = applyLessonResult(
      INITIAL_PROGRESS,
      { lessonId: "tp-27", baseXp: 15, accuracy: 100, perfect: true },
      now,
    );
    expect(first).toMatchObject({ streak: 1, streakExtended: true });
    const second = applyLessonResult(
      first.progress,
      { lessonId: "tp-26", baseXp: 15, accuracy: 100, perfect: true },
      now,
    );
    expect(second).toMatchObject({ streak: 1, streakExtended: false });
  });
});
