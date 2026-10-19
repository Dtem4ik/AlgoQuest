import type { HighlightKind, VizRow } from "@/lib/types";

/** Указатели, стоящие на каждой ячейке (в порядке объявления). Скрытые (-1) пропускаем. */
export function pointersByCell(step: VizRow): Map<number, string[]> {
  const cells = new Map<number, string[]>();
  for (const [name, index] of Object.entries(step.pointers)) {
    if (index < 0) continue;
    cells.set(index, [...(cells.get(index) ?? []), name]);
  }
  return cells;
}

export interface CellLook {
  /** Заливка ячейки; done рисуется отдельно обводкой и сочетается с заливкой. */
  fill: Exclude<HighlightKind, "done"> | null;
  done: boolean;
}

// Если ячейка попала в несколько списков, важнее то, что произошло с ней на этом шаге.
const FILL_PRIORITY = ["write", "compare", "skip"] as const;

export function cellLook(step: VizRow, index: number): CellLook {
  const fill = FILL_PRIORITY.find((kind) => step.highlight?.[kind]?.includes(index)) ?? null;
  return { fill, done: step.highlight?.done?.includes(index) ?? false };
}

/** Размер ячейки так, чтобы массив влез в ширину телефона; длинные строки скроллятся. */
export function cellSize(length: number, available = 343, gap = 4): number {
  const fit = Math.floor((available - gap * (length - 1)) / length);
  return Math.max(28, Math.min(48, fit));
}

/** Пробел в строках иначе не виден. */
export function formatCell(value: number | string): string {
  return value === " " ? "␣" : String(value);
}
