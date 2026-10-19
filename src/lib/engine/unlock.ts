import type { LessonRecord } from "@/lib/progress/progress";
import type { Island } from "@/lib/types";

export type LessonStatus = "locked" | "available" | "completed" | "perfect";

/**
 * Уроки открываются линейно по всем островам: пройденные остаются доступными
 * для повтора, первый непройденный — доступен, всё после него закрыто.
 */
export function lessonStatuses(
  islands: Island[],
  records: Record<string, LessonRecord>,
): Record<string, LessonStatus> {
  const statuses: Record<string, LessonStatus> = {};
  let frontierReached = false;

  for (const lesson of islands.flatMap((island) => island.lessons)) {
    const record = records[lesson.id];
    if (record?.completed) {
      statuses[lesson.id] = record.perfect ? "perfect" : "completed";
    } else if (!frontierReached) {
      statuses[lesson.id] = "available";
      frontierReached = true;
    } else {
      statuses[lesson.id] = "locked";
    }
  }
  return statuses;
}

export function isIslandCompleted(island: Island, records: Record<string, LessonRecord>): boolean {
  return island.lessons.every((lesson) => records[lesson.id]?.completed);
}
