import { describe, expect, it } from "vitest";
import type { Island, Lesson } from "@/lib/types";
import { isIslandCompleted, lessonStatuses } from "./unlock";

const lesson = (id: string): Lesson => ({
  id,
  title: id,
  leetcode: { id: 1, slug: "x", difficulty: "Easy" },
  xp: 10,
  interview: { brute: "b", optimal: "o", time: "t", space: "s" },
  exercises: [{ type: "theory", title: "t", body: "b" }],
});

const island = (id: string, lessonIds: string[]): Island => ({
  id,
  title: id,
  emoji: "🏝",
  color: "#7C5CFF",
  summary: "s",
  lessons: lessonIds.map(lesson),
});

const islands = [island("one", ["a-1", "a-2"]), island("two", ["b-1"])];
const done = (perfect = false) => ({ completed: true, perfect, bestAccuracy: 100 });

describe("lessonStatuses", () => {
  it("opens only the first lesson for a new user", () => {
    expect(lessonStatuses(islands, {})).toEqual({
      "a-1": "available",
      "a-2": "locked",
      "b-1": "locked",
    });
  });

  it("marks completed/perfect and opens the next lesson across islands", () => {
    expect(lessonStatuses(islands, { "a-1": done(true), "a-2": done() })).toEqual({
      "a-1": "perfect",
      "a-2": "completed",
      "b-1": "available",
    });
  });
});

describe("lessons inserted later", () => {
  it("keeps completed lessons open after new ones appear before them", () => {
    const grown = [island("one", ["a-1", "a-2", "a-3"]), island("two", ["b-1"])];
    // b-1 пройден раньше, чем в остров один добавили a-3
    expect(lessonStatuses(grown, { "a-1": done(), "a-2": done(), "b-1": done(true) })).toEqual({
      "a-1": "completed",
      "a-2": "completed",
      "a-3": "available",
      "b-1": "perfect",
    });
  });
});

describe("isIslandCompleted", () => {
  it("requires every lesson", () => {
    expect(isIslandCompleted(islands[0]!, { "a-1": done() })).toBe(false);
    expect(isIslandCompleted(islands[0]!, { "a-1": done(), "a-2": done() })).toBe(true);
  });
});
