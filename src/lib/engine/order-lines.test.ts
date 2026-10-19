import { describe, expect, it } from "vitest";
import { lesson27 } from "@/content/islands/two-pointers";
import type { Exercise } from "@/lib/types";
import { checkAnswer, initialAnswer } from "./check";
import { indentLevels, isCorrectOrder, matchSolution, shuffleOrder } from "./order-lines";

const solution = lesson27.exercises.find(
  (e): e is Extract<Exercise, { type: "order-lines" }> => e.type === "order-lines",
)!.lines;

/** Детерминированный генератор для тестов (mulberry32). */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("indentLevels", () => {
  it("restores the indentation of a real solution", () => {
    const original = solution.map((l) => (l.length - l.trimStart().length) / 2);
    expect(indentLevels(solution.map((l) => l.trim()))).toEqual(original);
  });

  it("handles `} else {` and never goes negative", () => {
    expect(indentLevels(["if (a) {", "x();", "} else {", "y();", "}", "}"])).toEqual([0, 1, 0, 1, 0, 0]);
  });

  it("ignores balanced brackets inside a line", () => {
    expect(indentLevels(["nums[k] = nums[i];", "f(a, [1, 2]);"])).toEqual([0, 0]);
  });
});

describe("isCorrectOrder", () => {
  it("accepts swapped identical closing braces", () => {
    const lines = ["a {", "b {", "}", "}"];
    expect(isCorrectOrder(lines, [0, 1, 3, 2])).toBe(true);
    expect(isCorrectOrder(lines, [1, 0, 2, 3])).toBe(false);
  });

  it("compares trimmed text and rejects malformed orders", () => {
    expect(isCorrectOrder(["  a", "b"], [0, 1])).toBe(true);
    expect(isCorrectOrder(["a", "b"], [0])).toBe(false);
    expect(isCorrectOrder(["a", "b"], [0, 0])).toBe(false);
  });
});

describe("accept (alternative orders)", () => {
  const lines = ["a", "b", "c"];
  const accept = [[0, 2, 1]];

  it("accepts the listed alternative and reports which solution matched", () => {
    expect(isCorrectOrder(lines, [0, 2, 1], accept)).toBe(true);
    expect(matchSolution(lines, accept, [0, 2, 1])).toEqual(["a", "c", "b"]);
    expect(isCorrectOrder(lines, [1, 0, 2], accept)).toBe(false);
  });

  it("never shuffles into an accepted alternative", () => {
    for (let seed = 1; seed <= 100; seed++) {
      expect(isCorrectOrder(lines, shuffleOrder(lines, seeded(seed), accept), accept)).toBe(false);
    }
  });
});

describe("shuffleOrder", () => {
  it("returns a permutation that is never already solved", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const order = shuffleOrder(solution, seeded(seed));
      expect([...order].sort((a, b) => a - b)).toEqual(solution.map((_, i) => i));
      expect(isCorrectOrder(solution, order)).toBe(false);
    }
  });

  it("falls back to a rotation when the generator is stuck", () => {
    expect(shuffleOrder(["a", "b", "c"], () => 0.999)).not.toEqual([0, 1, 2]);
    expect(isCorrectOrder(["a", "b", "c"], shuffleOrder(["a", "b", "c"], () => 0.999))).toBe(false);
  });
});

describe("answers for order-lines and find-bug", () => {
  const order: Extract<Exercise, { type: "order-lines" }> = {
    type: "order-lines",
    lines: ["a", "b", "c"],
    explanation: "e",
  };
  const bug: Extract<Exercise, { type: "find-bug" }> = {
    type: "find-bug",
    code: ["x", "y"],
    bugLine: 1,
    fixed: "z",
    explanation: "e",
  };

  it("checks orders and lines, and rejects answers of another type", () => {
    expect(checkAnswer(order, { type: "order", order: [0, 1, 2] })).toBe(true);
    expect(checkAnswer(order, { type: "order", order: [1, 0, 2] })).toBe(false);
    expect(checkAnswer(bug, { type: "line", index: 1 })).toBe(true);
    expect(checkAnswer(bug, { type: "line", index: 0 })).toBe(false);
    expect(checkAnswer(bug, { type: "option", index: 1 })).toBe(false);
  });

  it("starts order-lines shuffled and everything else empty", () => {
    const start = initialAnswer(order, seeded(7));
    expect(start?.type).toBe("order");
    expect(start?.type === "order" && isCorrectOrder(order.lines, start.order)).toBe(false);
    expect(initialAnswer(bug, seeded(7))).toBeNull();
  });
});
