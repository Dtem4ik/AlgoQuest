"use client";

import { useState, type ReactNode } from "react";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useToday } from "@/hooks/useToday";
import { plural } from "@/lib/format";
import { displayedStreak, isStreakBroken } from "@/lib/progress/streak";
import type { MascotState } from "@/lib/types";
import { useProgressHydrated, useProgressStore } from "@/store/progress";
import { ActivityCalendar } from "./ActivityCalendar";
import { ThemePicker } from "./ThemePicker";

interface IslandInfo {
  id: string;
  title: string;
  emoji: string;
  lessonIds: string[];
}

function StatTile({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center rounded-2xl border-2 border-b-4 border-border bg-surface px-2 py-3">
      <span aria-hidden className="text-2xl">
        {icon}
      </span>
      <span className="text-2xl font-black tabular-nums">{value}</span>
      <span className="text-xs font-bold text-ink-muted">{label}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-black">{title}</h2>
      {children}
    </section>
  );
}

export function ProfileScreen({ islands }: { islands: IslandInfo[] }) {
  const hydrated = useProgressHydrated();
  const today = useToday();
  const progress = useProgressStore();
  const [resetOpen, setResetOpen] = useState(false);

  if (!hydrated || !today) {
    return <main className="flex-1" aria-busy="true" />;
  }

  const streak = displayedStreak(progress.streak, today);
  const broken = isStreakBroken(progress.streak, today);
  const doneToday = progress.streak.lastDay === today;
  const mascot: MascotState = broken ? "sleepy" : doneToday ? "happy" : "idle";
  const hint = doneToday
    ? "Сегодня урок уже есть — стрик в безопасности."
    : broken
      ? "Стрик прервался. Начни новый — один урок сегодня!"
      : streak > 0
        ? `Пройди урок сегодня, чтобы не потерять стрик: ${streak} ${plural(streak, ["день", "дня", "дней"])}.`
        : "Пройди первый урок — и стрик начнётся.";

  return (
    <main className="mx-auto w-full max-w-md flex-1 space-y-8 px-4 pt-8 pb-32">
      <header className="space-y-4">
        <h1 className="text-3xl font-black">Профиль</h1>
        <Mascot state={mascot} size={72} line={hint} />
      </header>

      <div className="flex gap-3">
        <StatTile icon="⚡" value={progress.xp} label="Всего XP" />
        <StatTile icon="🔥" value={streak} label="Стрик" />
        <StatTile icon="🏆" value={progress.streak.best} label="Лучший" />
      </div>

      <Section title="Активность">
        <Card>
          <ActivityCalendar activity={progress.activity} today={today} />
        </Card>
      </Section>

      <Section title="Паттерны">
        <div className="space-y-3">
          {islands.map((island) => {
            const records = island.lessonIds.map((id) => progress.lessons[id]);
            const done = records.filter((r) => r?.completed).length;
            const crowns = records.filter((r) => r?.perfect).length;
            const total = island.lessonIds.length;
            return (
              <Card key={island.id} className="flex items-center gap-4 p-4">
                <span aria-hidden className="text-3xl">
                  {island.emoji}
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate font-black">{island.title}</p>
                    <p className="shrink-0 text-sm font-bold text-ink-muted tabular-nums">
                      {done} / {total}
                      {crowns > 0 && ` · 👑 ${crowns}`}
                    </p>
                  </div>
                  <ProgressBar
                    value={done / total}
                    tone={done === total ? "success" : "primary"}
                    label={`${island.title}: пройдено ${done} из ${total}`}
                    className="h-3"
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section title="Тема">
        <ThemePicker />
      </Section>

      <Button variant="ghost" size="lg" className="text-error" onClick={() => setResetOpen(true)}>
        Сбросить прогресс
      </Button>

      <Dialog open={resetOpen} onClose={() => setResetOpen(false)} title="Сбросить весь прогресс?">
        <p className="font-semibold text-ink-muted">
          XP, стрик, календарь и пройденные уроки обнулятся. Это нельзя отменить.
        </p>
        <div className="space-y-3">
          <Button size="lg" onClick={() => setResetOpen(false)} autoFocus>
            Отмена
          </Button>
          <Button
            size="lg"
            variant="danger"
            onClick={() => {
              progress.reset();
              setResetOpen(false);
            }}
          >
            Сбросить
          </Button>
        </div>
      </Dialog>
    </main>
  );
}
