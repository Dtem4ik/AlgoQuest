"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type ScreenReaderInstructions,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CodeBlock, CodeLine } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { indentLevels, matchSolution } from "@/lib/engine/order-lines";
import type { Exercise } from "@/lib/types";

const INDENT_PX = 16;

type LineTone = "idle" | "correct" | "wrong";

const TONES: Record<LineTone, string> = {
  idle: "border-border bg-surface",
  correct: "border-success bg-success-soft",
  wrong: "border-error bg-error-soft",
};

interface SortableLineProps {
  id: string;
  text: string;
  level: number;
  tone: LineTone;
  disabled: boolean;
}

function SortableLine({ id, text, level, tone, disabled }: SortableLineProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn("relative list-none", isDragging && "z-10")}
    >
      <div
        {...attributes}
        {...listeners}
        aria-label={`Строка: ${text}`}
        className={cn(
          "flex min-h-11 touch-manipulation items-center gap-2 rounded-xl border-2 border-b-4 py-1.5 pr-2 select-none",
          "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary",
          !disabled && "cursor-grab active:cursor-grabbing",
          isDragging && "scale-[1.02] border-primary shadow-lg",
          TONES[tone],
        )}
      >
        {/* Длинные строки переносятся с висячим отступом, а не скроллятся внутри карточки. */}
        <span
          className="min-w-0 flex-1 text-[12px] leading-5 transition-[padding] duration-200"
          style={{ paddingLeft: 10 + level * INDENT_PX }}
        >
          <CodeLine code={text} wrap />
        </span>
        {!disabled && (
          <svg viewBox="0 0 12 18" className="h-4 w-3 shrink-0 text-ink-muted/50" aria-hidden>
            {[3, 9, 15].flatMap((y) => [3, 9].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="currentColor" />))}
          </svg>
        )}
      </div>
    </li>
  );
}

const SCREEN_READER_INSTRUCTIONS: ScreenReaderInstructions = {
  draggable:
    "Чтобы взять строку, нажми пробел или Enter. Стрелками вверх и вниз перемещай её, пробелом или Enter ставь на место, Escape — отмена.",
};

/** Объявления для скринридера на русском, с текстом строки вместо внутреннего id. */
function announcements(ids: string[], texts: string[]): Announcements {
  const line = (id: UniqueIdentifier) => `«${texts[ids.indexOf(String(id))] ?? ""}»`;
  const position = (id: UniqueIdentifier) => `${ids.indexOf(String(id)) + 1} из ${ids.length}`;
  return {
    onDragStart: ({ active }) => `Взята строка ${line(active.id)}, позиция ${position(active.id)}.`,
    onDragOver: ({ active, over }) =>
      over ? `Строка ${line(active.id)} над позицией ${position(over.id)}.` : undefined,
    onDragEnd: ({ active, over }) =>
      over
        ? `Строка ${line(active.id)} поставлена на позицию ${position(over.id)}.`
        : `Строка ${line(active.id)} отпущена.`,
    onDragCancel: ({ active }) => `Перетаскивание отменено, строка ${line(active.id)} на месте.`,
  };
}

/** Неподвижная часть решения: видна для контекста, но не перетаскивается. */
function FixedLines({ lines }: { lines: string[] }) {
  return (
    <div className="-my-2 rounded-xl border-2 border-dashed border-border px-3 py-2 text-[12px] leading-5 opacity-70">
      {lines.map((line, i) => (
        <div key={i}>
          <CodeLine code={line} wrap />
        </div>
      ))}
    </div>
  );
}

interface OrderLinesExerciseProps {
  exercise: Extract<Exercise, { type: "order-lines" }>;
  /** Индексы исходных строк в текущем порядке. */
  order: number[];
  onReorder: (order: number[]) => void;
  checked: boolean;
}

export function OrderLinesExercise({ exercise, order, onReorder, checked }: OrderLinesExerciseProps) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    // Короткое удержание, чтобы список не мешал прокрутке страницы пальцем.
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const before = exercise.before ?? [];
  const after = exercise.after ?? [];
  const texts = order.map((index) => exercise.lines[index]?.trim() ?? "");
  // Отступы ядра считаются с учётом неподвижной шапки над ним.
  const levels = indentLevels([...before, ...texts]).slice(before.length);
  const ids = order.map((index) => `line-${index}`);
  // Сверяем с тем верным порядком, который собрал пользователь (их может быть несколько).
  const matched = matchSolution(exercise.lines, exercise.accept, order);
  const reference = matched ?? exercise.lines;

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    onReorder(arrayMove(order, from, to));
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl leading-tight font-black">
        {before.length > 0 ? "Собери ядро решения" : "Собери решение"}
      </h2>
      <p className="-mt-3 text-sm font-bold text-ink-muted">
        Перетаскивай строки. Отступы расставятся сами.
        {before.length > 0 && " Серые строки уже на месте."}
      </p>

      {before.length > 0 && <FixedLines lines={before} />}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        accessibility={{
          announcements: announcements(ids, texts),
          screenReaderInstructions: SCREEN_READER_INSTRUCTIONS,
        }}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <ol className="space-y-1.5" aria-label="Строки решения">
            {order.map((index, position) => (
              <SortableLine
                key={ids[position]}
                id={ids[position] ?? ""}
                text={texts[position] ?? ""}
                level={levels[position] ?? 0}
                disabled={checked}
                tone={
                  !checked
                    ? "idle"
                    : texts[position] === reference[position]?.trim()
                      ? "correct"
                      : "wrong"
                }
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>

      {after.length > 0 && <FixedLines lines={after} />}

      {checked && !matched && (
        <div className="space-y-2">
          <p className="font-extrabold text-success-ink">Правильный порядок:</p>
          <CodeBlock code={[...before, ...exercise.lines, ...after].join("\n")} />
        </div>
      )}
    </div>
  );
}
