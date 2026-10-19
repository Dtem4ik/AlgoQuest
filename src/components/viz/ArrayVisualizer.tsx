"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { VizRow, VizStep } from "@/lib/types";
import {
  cellLook,
  cellSize,
  focusIndex,
  formatCell,
  pointersByCell,
  type CellLook,
} from "@/lib/viz/steps";
import { useStepPlayer } from "./useStepPlayer";

// Цвета закреплены за привычными именами указателей, остальные берут из запасного списка.
const POINTER_COLORS: Record<string, string> = {
  i: "#7C5CFF",
  l: "#7C5CFF",
  k: "#EC4899",
  r: "#EC4899",
  j: "#0EA5E9",
};
const FALLBACK_COLORS = ["#F59E0B", "#14B8A6", "#64748B"];

function pointerColor(name: string, order: string[]): string {
  return (
    POINTER_COLORS[name] ??
    FALLBACK_COLORS[Math.max(0, order.indexOf(name)) % FALLBACK_COLORS.length] ??
    "#64748B"
  );
}

const FILL_STYLES: Record<NonNullable<CellLook["fill"]> | "none", string> = {
  none: "border-border bg-surface text-ink",
  compare: "border-xp bg-xp-soft text-ink",
  write: "border-success bg-success-soft text-success-ink",
  window: "border-primary/50 bg-primary-soft text-ink",
  skip: "border-border bg-disabled text-disabled-ink",
};

function Cell({ value, look, size }: { value: number | string; look: CellLook; size: number }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-xl border-2 border-b-4 font-mono font-bold transition-colors duration-200",
        FILL_STYLES[look.fill ?? "none"],
        // done — обводка внутри ячейки, чтобы не наезжать на соседей
        look.done && "border-primary shadow-[inset_0_0_0_2px_var(--primary)]",
      )}
      style={{ width: size, height: size, fontSize: size >= 36 ? 18 : 14, perspective: 200 }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={String(value)}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {formatCell(value)}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function Pointer({ id, name, color }: { id: string; name: string; color: string }) {
  return (
    <motion.div
      layoutId={id}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className="flex flex-col items-center leading-none"
      style={{ color }}
    >
      <svg viewBox="0 0 12 8" className="h-2 w-3" aria-hidden>
        <path d="M6 0L12 8H0z" fill="currentColor" />
      </svg>
      <span
        className="mt-0.5 rounded-md px-1.5 py-0.5 font-mono text-xs font-black text-white"
        style={{ backgroundColor: color }}
      >
        {name}
      </span>
    </motion.div>
  );
}

/** Зазор между ячейками (gap-1), px. */
const CELL_GAP = 4;

/** Высота стопки указателей под ячейкой, px. */
const POINTER_HEIGHT = 30;

/** Сколько указателей максимум оказывается на одной ячейке — под это резервируем высоту. */
function maxStack(rows: VizRow[]): number {
  return Math.max(1, ...rows.flatMap((row) => [...pointersByCell(row).values()].map((names) => names.length)));
}

interface RowSpec {
  key: string;
  label?: string;
  row: VizRow;
  stack: number;
}

interface ArrayRowProps {
  rowKey: string;
  label?: string;
  row: VizRow;
  size: number;
  stack: number;
  pointerOrder: string[];
}

function ArrayRow({ rowKey, label, row, size, stack, pointerOrder }: ArrayRowProps) {
  const pointers = pointersByCell(row);
  return (
    <div>
      {label && <p className="mb-1 font-mono text-xs font-black text-ink-muted">{label}</p>}
      <div className="flex gap-1">
        {row.array.map((value, i) => (
          <div key={i} className="flex flex-col items-center gap-1" style={{ width: size }}>
            <span className="font-mono text-[11px] font-bold text-ink-muted">{i}</span>
            <Cell value={value} look={cellLook(row, i)} size={size} />
            <div
              className="flex flex-col items-center gap-0.5 pt-1"
              style={{ minHeight: stack * POINTER_HEIGHT }}
            >
              {pointers.get(i)?.map((name) => (
                <Pointer
                  key={name}
                  id={`pointer-${rowKey}-${name}`}
                  name={name}
                  color={pointerColor(name, pointerOrder)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ArrayVisualizerProps {
  steps: VizStep[];
  /** Вызывается, когда показан последний шаг. */
  onComplete?: () => void;
}

export function ArrayVisualizer({ steps, onComplete }: ArrayVisualizerProps) {
  const groupId = useId();
  const player = useStepPlayer(steps.length);
  const scroller = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const step = steps[player.index] ?? steps[0];

  const atEnd = player.index === player.last;
  useEffect(() => {
    if (atEnd) onComplete?.();
  }, [atEnd, onComplete]);

  // Размер ячейки один на всю анимацию: по самому длинному ряду среди всех шагов.
  const size = cellSize(
    Math.max(...steps.flatMap((s) => [s.array.length, s.secondary?.array.length ?? 0])),
  );

  // Длинный массив не влезает в экран — держим текущие указатели в центре видимой части.
  const focus = step ? focusIndex(step) : null;
  useEffect(() => {
    const el = scroller.current;
    if (!el || focus === null || el.scrollWidth <= el.clientWidth) return;
    const left = focus * (size + CELL_GAP) + size / 2 - el.clientWidth / 2;
    el.scrollTo({ left: Math.max(0, left), behavior: reducedMotion ? "auto" : "smooth" });
  }, [focus, size, reducedMotion]);

  if (!step) return null;

  const rows: RowSpec[] = [
    { key: "main", label: step.label, row: step, stack: maxStack(steps.map((s) => s)) },
  ];
  if (step.secondary) {
    rows.push({
      key: "secondary",
      label: step.secondary.label,
      row: step.secondary,
      stack: maxStack(steps.flatMap((s) => (s.secondary ? [s.secondary] : []))),
    });
  }
  const pointerOrder = [
    ...Object.keys(steps[0]?.pointers ?? {}),
    ...Object.keys(steps[0]?.secondary?.pointers ?? {}),
  ];
  const vars = Object.entries(step.vars ?? {});

  return (
    <div className="space-y-4">
      {/* Массив скроллится сам, страница вбок не едет. */}
      <div
        ref={scroller}
        className="-mx-1 overflow-x-auto px-1 pt-1 pb-2"
        role="img"
        aria-label={step.note}
      >
        <LayoutGroup id={groupId}>
          <div className="mx-auto w-max space-y-2">
            {rows.map(({ key, label, row, stack }) => (
              <ArrayRow
                key={key}
                rowKey={key}
                label={label}
                row={row}
                size={size}
                stack={stack}
                pointerOrder={pointerOrder}
              />
            ))}
          </div>
        </LayoutGroup>
      </div>

      {/* Управление сразу под массивами, чтобы на высоких визуализациях не уезжало под футер. */}
      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" onClick={player.prev} disabled={player.index === 0}>
          Назад
        </Button>
        <Button size="sm" variant="secondary" onClick={player.toggleAuto} aria-pressed={player.playing}>
          {player.playing ? "Пауза" : "Авто"}
        </Button>
        <Button size="sm" className="flex-1" onClick={player.next} disabled={atEnd}>
          Шаг
        </Button>
        <span className="w-12 shrink-0 text-right text-sm font-extrabold text-ink-muted tabular-nums">
          {player.index + 1} / {steps.length}
        </span>
      </div>

      <div className="min-h-20 space-y-2 rounded-2xl bg-bg p-3">
        {vars.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {vars.map(([name, value]) => (
              <span
                key={name}
                className="rounded-lg border-2 border-border bg-surface px-2 py-0.5 font-mono text-sm font-bold"
              >
                {name} = {value}
              </span>
            ))}
          </div>
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={player.index}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="font-bold"
            aria-live="polite"
          >
            {step.note}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
