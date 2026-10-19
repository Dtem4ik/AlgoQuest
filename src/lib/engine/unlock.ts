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
  return statusesInOrder(
    islands.flatMap((island) => island.lessons.map((lesson) => lesson.id)),
    records,
  );
}

/**
 * То же по упорядоченному списку id — для страницы урока, которой не нужен весь контент.
 * Пройденный урок открыт всегда, даже если перед ним позже добавили новые задачи.
 */
export function statusesInOrder(
  lessonIds: readonly string[],
  records: Record<string, LessonRecord>,
): Record<string, LessonStatus> {
  const statuses: Record<string, LessonStatus> = {};
  let frontierReached = false;

  for (const id of lessonIds) {
    const record = records[id];
    if (record?.completed) {
      statuses[id] = record.perfect ? "perfect" : "completed";
    } else if (!frontierReached) {
      statuses[id] = "available";
      frontierReached = true;
    } else {
      statuses[id] = "locked";
    }
  }
  return statuses;
}

export function isIslandCompleted(island: Island, records: Record<string, LessonRecord>): boolean {
  return island.lessons.every((lesson) => records[lesson.id]?.completed);
}
