import { describe, expect, it } from "vitest";
import { islands } from "@/content";
import { twoPointers } from "@/content/islands/two-pointers";
import type { Exercise, Island } from "@/lib/types";
import { parseContent } from "./schema";

const withExercise = (exercise: Exercise): Island[] => [
  {
    ...twoPointers,
    lessons: [{ ...twoPointers.lessons[0]!, exercises: [exercise] }],
  },
];

describe("content", () => {
  it("all shipped content is valid", () => {
    expect(islands.length).toBeGreaterThan(0);
  });

  it("returns content unchanged (no trimming of code indentation)", () => {
    expect(parseContent([twoPointers])).toEqual([twoPointers]);
  });

  it("rejects an out-of-range correct answer", () => {
    expect(() =>
      parseContent(
        withExercise({ type: "choice", question: "?", options: ["a", "b"], correct: 2, explanation: "x" }),
      ),
    ).toThrow(/out of range/);
  });

  it("requires exactly one blank in fill-blank", () => {
    expect(() =>
      parseContent(
        withExercise({ type: "fill-blank", code: "a ___ b ___", options: ["1", "2"], correct: 0, explanation: "x" }),
      ),
    ).toThrow(/exactly one ___/);
  });

  it("rejects pointers outside the array", () => {
    expect(() =>
      parseContent(
        withExercise({
          type: "visualize",
          title: "t",
          steps: [
            { array: [1, 2], pointers: { i: 0 }, note: "ok" },
            { array: [1, 2], pointers: { i: 2 }, note: "bad" },
          ],
        }),
      ),
    ).toThrow(/pointer "i"/);
  });

  it("requires order-lines indentation to follow the braces", () => {
    expect(() =>
      parseContent(
        withExercise({ type: "order-lines", lines: ["if (a) {", "x();", "}"], explanation: "e" }),
      ),
    ).toThrow(/2 spaces per brace level/);
  });

  it("requires find-bug to actually fix the line", () => {
    expect(() =>
      parseContent(
        withExercise({ type: "find-bug", code: ["a", "b"], bugLine: 1, fixed: " b", explanation: "e" }),
      ),
    ).toThrow(/fixed must differ/);
  });

  it("rejects duplicate lesson ids", () => {
    expect(() => parseContent([twoPointers, { ...twoPointers, id: "copy" }])).toThrow(/duplicate lesson id/);
  });
});
