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

describe("isIslandCompleted", () => {
  it("requires every lesson", () => {
    expect(isIslandCompleted(islands[0]!, { "a-1": done() })).toBe(false);
    expect(isIslandCompleted(islands[0]!, { "a-1": done(), "a-2": done() })).toBe(true);
  });
});
