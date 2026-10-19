import { z } from "zod";
import { indentLevels } from "@/lib/engine/order-lines";
import type { Exercise, Island, Lesson, MascotState, VizRow, VizStep } from "@/lib/types";

const BLANK = "___";

// Только проверка, без .trim(): схема не должна менять контент (отступы в коде важны).
const text = z.string().refine((s) => s.trim().length > 0, { message: "must not be blank" });

const mascotStateSchema: z.ZodType<MascotState> = z.enum([
  "idle",
  "happy",
  "sad",
  "thinking",
  "celebrate",
  "sleepy",
]);

const indexList = z.array(z.number().int().nonnegative());

const rowShape = {
  array: z.array(z.union([z.number(), z.string()])).min(1),
  pointers: z.record(z.string(), z.number().int()),
  highlight: z
    .object({ compare: indexList, write: indexList, skip: indexList, window: indexList, done: indexList })
    .partial()
    .optional(),
};

/** Указатели и подсветка не выходят за границы ряда. */
function checkRow(row: VizRow, ctx: z.RefinementCtx, where: string) {
  const n = row.array.length;
  for (const [name, index] of Object.entries(row.pointers)) {
    if (index < -1 || index >= n) {
      ctx.addIssue({ code: "custom", message: `${where}pointer "${name}" = ${index} is out of range` });
    }
  }
  for (const [kind, indices] of Object.entries(row.highlight ?? {})) {
    if (indices.some((i) => i >= n)) {
      ctx.addIssue({ code: "custom", message: `${where}highlight.${kind} is out of range` });
    }
  }
}

const vizStepSchema: z.ZodType<VizStep> = z
  .object({
    ...rowShape,
    label: text.optional(),
    secondary: z.object({ ...rowShape, label: text }).optional(),
    vars: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
    note: text,
  })
  .superRefine((step, ctx) => {
    checkRow(step, ctx, "");
    if (step.secondary) checkRow(step.secondary, ctx, "secondary ");
  });

/** 2–4 варианта без повторов и верный индекс в их пределах. */
const withOptions = <T extends { options: string[]; correct: number }>(
  value: T,
  ctx: z.RefinementCtx,
) => {
  if (new Set(value.options).size !== value.options.length) {
    ctx.addIssue({ code: "custom", message: "options must be unique" });
  }
  if (value.correct >= value.options.length) {
    ctx.addIssue({ code: "custom", message: `correct = ${value.correct} is out of range` });
  }
};

const options = z.array(text).min(2).max(4);
const correct = z.number().int().nonnegative();

const exerciseSchema: z.ZodType<Exercise> = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("theory"),
    title: text,
    body: text,
    code: text.optional(),
    mascot: mascotStateSchema.optional(),
  }),
  z.object({
    type: z.literal("visualize"),
    title: text,
    steps: z.array(vizStepSchema).min(2),
  }),
  z
    .object({
      type: z.literal("choice"),
      question: text,
      options,
      correct,
      explanation: text,
    })
    .superRefine(withOptions),
  z
    .object({
      type: z.literal("predict-output"),
      code: text,
      input: text,
      options,
      correct,
      explanation: text,
    })
    .superRefine(withOptions),
  z
    .object({
      type: z.literal("fill-blank"),
      code: text,
      options,
      correct,
      explanation: text,
    })
    .superRefine(withOptions)
    .refine((e) => e.code.split(BLANK).length === 2, {
      message: `code must contain exactly one ${BLANK}`,
    }),
  z
    .object({
      type: z.literal("order-lines"),
      lines: z.array(z.string().min(1)).min(2),
      accept: z.array(z.array(z.number().int().nonnegative())).optional(),
      before: z.array(z.string().min(1)).optional(),
      after: z.array(z.string().min(1)).optional(),
      explanation: text,
    })
    .refine(
      (e) =>
        (e.accept ?? []).every(
          (order) =>
            order.length === e.lines.length &&
            [...order].sort((a, b) => a - b).every((v, i) => v === i) &&
            order.some((v, i) => v !== i),
        ),
      { message: "accept must hold permutations of lines that differ from the main order" },
    )
    // Движок пересчитывает отступы сам, поэтому в данных они должны совпадать со скобками.
    .refine(
      (e) => {
        const full = [...(e.before ?? []), ...e.lines, ...(e.after ?? [])];
        const levels = indentLevels(full);
        return full.every((line, i) => line === " ".repeat(2 * (levels[i] ?? 0)) + line.trim());
      },
      { message: "order-lines indentation must be 2 spaces per brace level" },
    ),
  z
    .object({
      type: z.literal("find-bug"),
      code: z.array(z.string()).min(2),
      bugLine: z.number().int().nonnegative(),
      fixed: text,
      explanation: text,
    })
    .refine((e) => e.bugLine < e.code.length, { message: "bugLine is out of range" })
    .refine((e) => e.code[e.bugLine]?.trim() !== e.fixed.trim(), {
      message: "fixed must differ from the buggy line",
    }),
]);

const lessonSchema: z.ZodType<Lesson> = z.object({
  id: z.string().regex(/^[a-z]+-\d+$/, "id must look like 'tp-27'"),
  title: text,
  leetcode: z.object({
    id: z.number().int().positive(),
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be kebab-case"),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
  }),
  xp: z.number().int().min(10).max(20),
  interview: z.object({ brute: text, optimal: text, time: text, space: text }),
  exercises: z.array(exerciseSchema).min(1),
});

const islandSchema: z.ZodType<Island> = z.object({
  id: z.string().regex(/^[a-z]+(-[a-z]+)*$/, "id must be kebab-case"),
  title: text,
  emoji: text,
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "color must be #RRGGBB"),
  summary: text,
  lessons: z.array(lessonSchema).min(1),
});

const contentSchema = z.array(islandSchema).superRefine((islands, ctx) => {
  const seen = new Set<string>();
  for (const lesson of islands.flatMap((island) => island.lessons)) {
    if (seen.has(lesson.id)) {
      ctx.addIssue({ code: "custom", message: `duplicate lesson id "${lesson.id}"` });
    }
    seen.add(lesson.id);
  }
});

/** Валидирует контент; ошибка в данных роняет сборку с понятным сообщением. */
export function parseContent(islands: Island[]): Island[] {
  const result = contentSchema.safeParse(islands);
  if (!result.success) {
    throw new Error(`Invalid lesson content:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
