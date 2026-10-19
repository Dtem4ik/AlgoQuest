const OPENERS = /[{([]/g;
const CLOSERS = /[})\]]/g;
const LEADING_CLOSER = /^[})\]]/;

const count = (text: string, re: RegExp) => text.match(re)?.length ?? 0;

/**
 * Уровни вложенности строк по скобкам: строка, начинающаяся с закрывающей
 * скобки, сдвигается на уровень левее. Скобки внутри строковых литералов не учитываем.
 */
export function indentLevels(lines: readonly string[]): number[] {
  let depth = 0;
  return lines.map((line) => {
    const text = line.trim();
    const leadingClose = LEADING_CLOSER.test(text);
    if (leadingClose) depth = Math.max(0, depth - 1);
    const level = depth;
    const closes = count(text, CLOSERS) - (leadingClose ? 1 : 0);
    depth = Math.max(0, depth + count(text, OPENERS) - closes);
    return level;
  });
}

/** Все верные решения: основное и альтернативные порядки из accept. */
export function acceptedSolutions(lines: readonly string[], accept: readonly number[][] = []): string[][] {
  return [[...lines], ...accept.map((order) => order.map((i) => lines[i] ?? ""))];
}

/**
 * Решение, с которым совпал порядок пользователя, или null.
 * Сравниваем тексты строк, поэтому одинаковые `}` взаимозаменяемы.
 */
export function matchSolution(
  lines: readonly string[],
  accept: readonly number[][] | undefined,
  order: readonly number[],
): string[] | null {
  if (order.length !== lines.length || new Set(order).size !== order.length) return null;
  const texts = order.map((i) => lines[i]?.trim());
  return (
    acceptedSolutions(lines, accept).find((solution) =>
      solution.every((line, position) => line.trim() === texts[position]),
    ) ?? null
  );
}

export function isCorrectOrder(
  lines: readonly string[],
  order: readonly number[],
  accept?: readonly number[][],
): boolean {
  return matchSolution(lines, accept, order) !== null;
}

/** Перемешивание Фишера–Йейтса; никогда не возвращает уже собранное решение. */
export function shuffleOrder(
  lines: readonly string[],
  random: () => number,
  accept?: readonly number[][],
): number[] {
  const identity = lines.map((_, i) => i);
  if (new Set(lines.map((l) => l.trim())).size < 2) return identity;

  for (let attempt = 0; attempt < 20; attempt++) {
    const order = [...identity];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [order[i], order[j]] = [order[j]!, order[i]!];
    }
    if (!matchSolution(lines, accept, order)) return order;
  }
  // На случай неудачного генератора: сдвиг на одну позицию точно ломает порядок.
  return [...identity.slice(1), 0];
}
