import { describe, expect, it } from "vitest";
import { acceptedSolutions } from "@/lib/engine/order-lines";
import type { Exercise, Lesson } from "@/lib/types";
import { islands } from "./index";
import { IS_ALNUM, REVERSE } from "./islands/two-pointers";

/**
 * Код из order-lines и find-bug реально выполняется на тест-кейсах:
 * order-lines (и каждый порядок из accept) — рабочее решение,
 * find-bug с исправленной строкой проходит, а с багом — нет.
 */

type Solution = (...args: never[]) => unknown;

interface Case {
  /** Аргументы; массивы клонируются перед каждым запуском. */
  args: unknown[];
  /** Проверка результата и (для задач «на месте») изменённых аргументов. */
  check: (result: unknown, args: unknown[]) => boolean;
}

interface LessonCases {
  /** Исходники хелперов, которые решение вызывает (isAlnum, reverse). */
  helpers?: string[];
  cases: Case[];
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Ответ k и «хорошая» часть nums[0..k). */
const keepCase = (nums: number[], args: unknown[], expected: number[], sorted = false): Case => ({
  args,
  check: (k, [mutated]) => {
    const head = (mutated as number[]).slice(0, expected.length);
    return k === expected.length && same(sorted ? head.sort((a, b) => a - b) : head, expected);
  },
});

const removeElement = (nums: number[], val: number) =>
  keepCase(nums, [nums, val], nums.filter((n) => n !== val).sort((a, b) => a - b), true);

/** Оставить не больше max копий каждого числа (массив отсортирован). */
const removeDuplicates = (nums: number[], max: number) =>
  keepCase(
    nums,
    [nums],
    nums.filter((n, i) => i < max || nums[i - max] !== n),
  );

const merge = (nums1: number[], m: number, nums2: number[], n: number): Case => ({
  args: [nums1, m, nums2, n],
  check: (_, [mutated]) =>
    same(mutated, [...nums1.slice(0, m), ...nums2].sort((a, b) => a - b)),
});

const palindrome = (s: string, expected: boolean): Case => ({
  args: [s],
  check: (result) => result === expected,
});

const rotate = (nums: number[], k: number): Case => ({
  args: [nums, k],
  check: (_, [mutated]) => {
    const shift = k % nums.length;
    return same(mutated, [...nums.slice(nums.length - shift), ...nums.slice(0, nums.length - shift)]);
  },
});

const CASES: Record<string, LessonCases> = {
  "tp-27": {
    cases: [
      removeElement([3, 2, 2, 3], 3),
      removeElement([0, 1, 2, 2, 3, 0, 4, 2], 2),
      removeElement([3, 3, 3], 3),
      removeElement([], 1),
      removeElement([1, 2, 3], 4),
    ],
  },
  "tp-26": {
    cases: [
      removeDuplicates([1, 1, 2], 1),
      removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4], 1),
      removeDuplicates([1, 2, 3], 1),
      removeDuplicates([1, 1, 1], 1),
      removeDuplicates([7], 1),
    ],
  },
  "tp-80": {
    cases: [
      removeDuplicates([1, 1, 1, 2, 2, 3], 2),
      removeDuplicates([0, 0, 1, 1, 1, 1, 2, 3, 3], 2),
      removeDuplicates([1, 1], 2),
      removeDuplicates([1], 2),
      removeDuplicates([1, 2, 3], 2),
    ],
  },
  "tp-88": {
    cases: [
      merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3),
      merge([4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3),
      merge([1], 1, [], 0),
      merge([0], 0, [1], 1),
      merge([2, 0], 1, [1], 1),
    ],
  },
  "tp-125": {
    helpers: [IS_ALNUM],
    cases: [
      palindrome("A man, a plan, a canal: Panama", true),
      palindrome("race a car", false),
      palindrome(" ", true),
      palindrome("0P", false),
      palindrome(".ab", false),
      palindrome("Taco cat!", true),
    ],
  },
  "tp-189": {
    helpers: [REVERSE],
    cases: [
      rotate([1, 2, 3, 4, 5, 6, 7], 3),
      rotate([-1, -100, 3, 99], 2),
      rotate([1, 2], 3),
      rotate([1, 2, 3], 0),
      rotate([1], 5),
    ],
  },
};

const MAX_ITERATIONS = 100_000;

/** Счётчик итераций в каждом while/for: зависший код (например, из find-bug) падает, а не вешает тесты. */
function guardLoops(source: string): string {
  return source
    .replace(/while \(/g, "while (__guard() && ")
    .replace(/for \(([^;]*);([^;]*);/g, "for ($1; __guard() && ($2);");
}

function compile(source: string, helpers: string[] = []): Solution {
  const name = /function\s+(\w+)/.exec(source)?.[1];
  if (!name) throw new Error("solution must declare a named function");
  const guard = `let __n = 0; const __guard = () => { if (++__n > ${MAX_ITERATIONS}) throw new Error("infinite loop"); return true; };`;
  const body = [guard, ...helpers, source].map(guardLoops).join("\n");
  return new Function(`${body}\nreturn ${name};`)() as Solution;
}

function passes(source: string, { helpers, cases }: LessonCases): boolean {
  const fn = compile(source, helpers);
  return cases.every(({ args, check }) => {
    const cloned = args.map((a) => (Array.isArray(a) ? [...a] : a));
    try {
      return check(fn(...(cloned as never[])), cloned);
    } catch {
      return false;
    }
  });
}

const lessons: Lesson[] = islands.flatMap((island) => island.lessons);

describe.each(lessons.map((lesson) => [lesson.id, lesson] as const))("%s", (id, lesson) => {
  const spec = CASES[id] ?? { cases: [] };

  it("has test cases", () => {
    expect(spec.cases.length).toBeGreaterThan(0);
  });

  const of = <T extends Exercise["type"]>(type: T) =>
    lesson.exercises.filter((e): e is Extract<Exercise, { type: T }> => e.type === type);

  it.each(of("order-lines").map((e, i) => [i, e] as const))(
    "order-lines #%i: every accepted order is a working solution",
    (_, e) => {
      for (const solution of acceptedSolutions(e.lines, e.accept)) {
        expect(passes(solution.join("\n"), spec)).toBe(true);
      }
    },
  );

  it.each(of("find-bug").map((e, i) => [i, e] as const))("find-bug #%i: fixed passes, buggy fails", (_, e) => {
    const fixed = e.code.map((line, i) => (i === e.bugLine ? e.fixed : line)).join("\n");
    expect(passes(fixed, spec)).toBe(true);
    expect(passes(e.code.join("\n"), spec)).toBe(false);
  });
});

describe("test harness", () => {
  it("stops infinite loops instead of hanging", () => {
    const hang = "function f(a) {\n  let i = 0;\n  while (i < 1) {}\n  for (let j = 0; j < 1; ) {}\n  return a;\n}";
    expect(passes(hang, { cases: [{ args: [1], check: () => true }] })).toBe(false);
  });
});

describe("test helpers", () => {
  it("expected values for in-place cases are computed correctly", () => {
    // Самопроверка ожиданий: эталонные реализации на тех же хелперах.
    const keep2 = removeDuplicates([1, 1, 1, 2, 2, 3], 2);
    expect(keep2.check(5, [[1, 1, 2, 2, 3, 3]])).toBe(true);
    expect(rotate([1, 2, 3, 4, 5, 6, 7], 3).check(undefined, [[5, 6, 7, 1, 2, 3, 4]])).toBe(true);
    expect(rotate([1, 2], 3).check(undefined, [[2, 1]])).toBe(true);
  });
});
