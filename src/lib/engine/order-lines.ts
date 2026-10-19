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

/** Порядок верный, если тексты строк совпадают (одинаковые `}` взаимозаменяемы). */
export function isCorrectOrder(lines: readonly string[], order: readonly number[]): boolean {
  if (order.length !== lines.length) return false;
  if (new Set(order).size !== order.length) return false;
  return order.every((index, position) => lines[index]?.trim() === lines[position]?.trim());
}

/** Перемешивание Фишера–Йейтса; никогда не возвращает уже собранное решение. */
export function shuffleOrder(lines: readonly string[], random: () => number): number[] {
  const identity = lines.map((_, i) => i);
  if (new Set(lines.map((l) => l.trim())).size < 2) return identity;

  for (let attempt = 0; attempt < 20; attempt++) {
    const order = [...identity];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [order[i], order[j]] = [order[j]!, order[i]!];
    }
    if (!isCorrectOrder(lines, order)) return order;
  }
  // На случай неудачного генератора: сдвиг на одну позицию точно ломает порядок.
  return [...identity.slice(1), 0];
}
