"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/format";
import {
  buildCalendar,
  formatDay,
  monthLabels,
  type ActivityLevel,
  type CalendarDay,
} from "@/lib/progress/calendar";
import type { DayKey } from "@/lib/progress/dates";

/** ~4 месяца: столько столбцов помещается в ширину телефона. */
const WEEKS = 18;
const WEEKDAYS = ["пн", "", "ср", "", "пт", "", ""];

// Последовательная шкала одного цвета: от пустого дня к насыщенному primary.
const LEVEL_STYLES: Record<ActivityLevel, string> = {
  0: "bg-border",
  1: "bg-[color-mix(in_oklab,var(--primary)_30%,var(--surface))]",
  2: "bg-[color-mix(in_oklab,var(--primary)_55%,var(--surface))]",
  3: "bg-[color-mix(in_oklab,var(--primary)_80%,var(--surface))]",
  4: "bg-primary",
};

const xpLabel = (xp: number) => (xp === 0 ? "без уроков" : `${xp} XP`);

interface ActivityCalendarProps {
  activity: Record<DayKey, number>;
  today: DayKey;
}

/** Календарь активности как на GitHub: столбец — неделя, яркость — XP за день. */
export function ActivityCalendar({ activity, today }: ActivityCalendarProps) {
  const id = useId();
  const weeks = buildCalendar(activity, today, WEEKS);
  const months = monthLabels(weeks);
  const days = weeks.flat().filter((d) => !d.future);
  const [selected, setSelected] = useState<DayKey>(today);

  const totalXp = days.reduce((sum, d) => sum + d.xp, 0);
  const activeDays = days.filter((d) => d.xp > 0).length;
  const current = days.find((d) => d.day === selected);

  // Стрелки двигают выбор: влево/вправо — на неделю, вверх/вниз — на день.
  const onKeyDown = (event: KeyboardEvent) => {
    const step = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 }[event.key];
    if (step === undefined) return;
    event.preventDefault();
    const index = days.findIndex((d) => d.day === selected);
    const next = days[Math.min(days.length - 1, Math.max(0, index + step))];
    if (next) setSelected(next.day);
  };

  const cellId = (day: CalendarDay) => `${id}-${day.day}`;

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        {/* подписи дней недели */}
        <div className="grid shrink-0 grid-rows-[auto_repeat(7,1fr)] gap-[3px] pt-px text-[10px] font-bold text-ink-muted">
          <span className="h-4" />
          {WEEKDAYS.map((label, i) => (
            <span key={i} className="flex items-center leading-none">
              {label}
            </span>
          ))}
        </div>

        <div
          role="grid"
          aria-label="Календарь активности"
          aria-activedescendant={current ? cellId(current) : undefined}
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="grid min-w-0 flex-1 grid-flow-col gap-[3px] rounded-md focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary"
          style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))`, gridTemplateRows: "auto repeat(7, auto)" }}
        >
          {weeks.map((week, w) => (
            <div key={week[0]?.day ?? w} role="row" className="contents">
              <span className="h-4 text-[10px] leading-4 font-bold whitespace-nowrap text-ink-muted" aria-hidden>
                {months[w]}
              </span>
              {week.map((day) =>
                day.future ? (
                  <span key={day.day} aria-hidden className="aspect-square" />
                ) : (
                  <span
                    key={day.day}
                    id={cellId(day)}
                    role="gridcell"
                    aria-label={`${formatDay(day.day)}: ${xpLabel(day.xp)}`}
                    aria-selected={day.day === selected}
                    onClick={() => setSelected(day.day)}
                    onMouseEnter={() => setSelected(day.day)}
                    className={cn(
                      "aspect-square cursor-pointer rounded-[3px]",
                      LEVEL_STYLES[day.level],
                      day.day === selected && "outline-2 outline-offset-1 outline-ink",
                    )}
                  />
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs font-bold text-ink-muted">
        <p aria-live="polite" className="text-sm text-ink">
          {current ? (
            <>
              {formatDay(current.day)}
              {current.day === today && " (сегодня)"}: <span className="text-primary">{xpLabel(current.xp)}</span>
            </>
          ) : null}
        </p>
        <div className="flex shrink-0 items-center gap-1" aria-hidden>
          Меньше
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <span key={level} className={cn("size-2.5 rounded-[2px]", LEVEL_STYLES[level])} />
          ))}
          Больше
        </div>
      </div>

      <p className="text-sm font-semibold text-ink-muted">
        За {WEEKS} недель: {totalXp} XP, {activeDays} {plural(activeDays, ["день", "дня", "дней"])} с уроками
      </p>
    </div>
  );
}
