import { describe, expect, it } from "vitest";
import type { Exercise, Lesson } from "@/lib/types";
import { islands } from "./index";

/**
 * Код из order-lines и find-bug реально выполняется на тест-кейсах:
 * order-lines — рабочее решение, find-bug с исправленной строкой проходит, а с багом — нет.
 */

type Solution = (...args: never[]) => unknown;

interface Case {
  /** Аргументы; массивы клонируются перед каждым запуском. */
  args: unknown[];
  /** Проверка результата и (для задач «на месте») изменённых аргументов. */
  check: (result: unknown, args: unknown[]) => boolean;
}

const removeElementCase = (nums: number[], val: number): Case => {
  const expected = nums.filter((n) => n !== val);
  return {
    args: [nums, val],
    check: (k, [mutated]) =>
      k === expected.length &&
      JSON.stringify((mutated as number[]).slice(0, expected.length).sort((a, b) => a - b)) ===
        JSON.stringify([...expected].sort((a, b) => a - b)),
  };
};

const CASES: Record<string, Case[]> = {
  "tp-27": [
    removeElementCase([3, 2, 2, 3], 3),
    removeElementCase([0, 1, 2, 2, 3, 0, 4, 2], 2),
    removeElementCase([3, 3, 3], 3),
    removeElementCase([], 1),
    removeElementCase([1, 2, 3], 4),
  ],
};

function compile(source: string): Solution {
  const name = /function\s+(\w+)/.exec(source)?.[1];
  if (!name) throw new Error("solution must declare a named function");
  return new Function(`${source}\nreturn ${name};`)() as Solution;
}

function passes(fn: Solution, cases: Case[]): boolean {
  return cases.every(({ args, check }) => {
    const cloned = args.map((a) => (Array.isArray(a) ? [...a] : a));
    return check(fn(...(cloned as never[])), cloned);
  });
}

const lessons: Lesson[] = islands.flatMap((island) => island.lessons);

describe.each(lessons.map((lesson) => [lesson.id, lesson] as const))("%s", (id, lesson) => {
  const cases = CASES[id];

  it("has test cases", () => {
    expect(cases?.length).toBeGreaterThan(0);
  });

  const of = <T extends Exercise["type"]>(type: T) =>
    lesson.exercises.filter((e): e is Extract<Exercise, { type: T }> => e.type === type);

  it.each(of("order-lines").map((e, i) => [i, e] as const))("order-lines #%i is a working solution", (_, e) => {
    expect(passes(compile(e.lines.join("\n")), cases ?? [])).toBe(true);
  });

  it.each(of("find-bug").map((e, i) => [i, e] as const))("find-bug #%i: fixed passes, buggy fails", (_, e) => {
    const fixed = e.code.map((line, i) => (i === e.bugLine ? e.fixed : line)).join("\n");
    expect(passes(compile(fixed), cases ?? [])).toBe(true);
    expect(passes(compile(e.code.join("\n")), cases ?? [])).toBe(false);
  });
});
