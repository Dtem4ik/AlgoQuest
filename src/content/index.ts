import { parseContent } from "@/lib/content/schema";
import type { Island, Lesson } from "@/lib/types";
import { counting } from "./islands/counting";
import { twoPointers } from "./islands/two-pointers";

/**
 * Весь контент, провалидированный zod. Импортируется серверными страницами,
 * поэтому опечатка в данных роняет `next build`, а не прод.
 */
export const islands: Island[] = parseContent([twoPointers, counting]);

/** Острова, которые показываем на карте закрытыми с подписью «Скоро». */
export const upcomingIslands = [{ id: "sliding-window", title: "Скользящее окно", emoji: "🪟" }];

export function getLesson(id: string): Lesson | undefined {
  for (const island of islands) {
    const lesson = island.lessons.find((l) => l.id === id);
    if (lesson) return lesson;
  }
  return undefined;
}

export const lessonIds: string[] = islands.flatMap((island) => island.lessons.map((l) => l.id));
