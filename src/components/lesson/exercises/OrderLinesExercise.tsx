"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
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
import { indentLevels } from "@/lib/engine/order-lines";
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
        <span
          className="min-w-0 flex-1 overflow-x-auto text-[13px] transition-[padding] duration-200"
          style={{ paddingLeft: 10 + level * INDENT_PX }}
        >
          <CodeLine code={text} />
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

  const texts = order.map((index) => exercise.lines[index]?.trim() ?? "");
  const levels = indentLevels(texts);
  const ids = order.map((index) => `line-${index}`);
  const solved = texts.every((text, i) => text === exercise.lines[i]?.trim());

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    onReorder(arrayMove(order, from, to));
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl leading-tight font-black">Собери решение</h2>
      <p className="-mt-3 text-sm font-bold text-ink-muted">
        Перетаскивай строки. Отступы расставятся сами.
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
                    : texts[position] === exercise.lines[position]?.trim()
                      ? "correct"
                      : "wrong"
                }
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>

      {checked && !solved && (
        <div className="space-y-2">
          <p className="font-extrabold text-success-shade">Правильный порядок:</p>
          <CodeBlock code={exercise.lines.join("\n")} />
        </div>
      )}
    </div>
  );
}
