"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Mascot } from "@/components/mascot/Mascot";
import { Button, buttonClasses, type ButtonVariant } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatBadge } from "@/components/ui/StatBadge";
import { ArrayVisualizer } from "@/components/viz/ArrayVisualizer";
import { lesson27 } from "@/content/islands/two-pointers";
import { MASCOT_LINES, pickMascotLine } from "@/content/mascot-lines";
import { useHearts } from "@/hooks/useHearts";
import { useToday } from "@/hooks/useToday";
import { cn } from "@/lib/cn";
import { displayedStreak } from "@/lib/progress/streak";
import type { Exercise, MascotState, VizStep } from "@/lib/types";
import { useProgressHydrated, useProgressStore } from "@/store/progress";

const MASCOT_STATES: MascotState[] = ["idle", "happy", "sad", "thinking", "celebrate", "sleepy"];
const BUTTON_VARIANTS: ButtonVariant[] = ["primary", "secondary", "success", "danger", "xp", "ghost"];

const SWATCHES = [
  ["primary", "bg-primary"],
  ["success", "bg-success"],
  ["error", "bg-error"],
  ["xp", "bg-xp"],
  ["bg", "bg-bg"],
  ["surface", "bg-surface"],
  ["ink", "bg-ink"],
  ["muted", "bg-ink-muted"],
] as const;

const LESSON_27_STEPS =
  lesson27.exercises.find((e): e is Extract<Exercise, { type: "visualize" }> => e.type === "visualize")
    ?.steps ?? [];

// Длинная строка как массив символов: проверка сжатия ячеек и скролла.
const PALINDROME = [..."A man, a plan, a canal: Panama"];
const PALINDROME_STEPS: VizStep[] = [
  { array: PALINDROME, pointers: { l: 0, r: 29 }, highlight: { compare: [0, 29] }, note: "'A' и 'a' → в toLowerCase равны" },
  { array: PALINDROME, pointers: { l: 1, r: 28 }, highlight: { skip: [1] }, note: "Пробел — не буква и не цифра: l++ и continue" },
  { array: PALINDROME, pointers: { l: 2, r: 28 }, highlight: { compare: [2, 28] }, vars: { "s[l]": "m", "s[r]": "m" }, note: "'m' и 'm' → равны, сдвигаем оба" },
  { array: PALINDROME, pointers: { l: 17, r: 17 }, highlight: { done: [0, 2, 3, 4, 7, 9, 10, 11, 12, 15, 17, 18, 19, 20, 21, 24, 25, 26, 27, 28, 29] }, note: "Указатели встретились → палиндром" },
];

const SAMPLE_CODE = `function removeElement(nums, val) {
  let k = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      nums[k] = nums[i];
      k++;
    }
  }
  return k; // O(n) time, O(1) space
}`;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-black text-ink">{title}</h2>
      {children}
    </section>
  );
}

function MascotPlayground() {
  const [state, setState] = useState<MascotState>("idle");
  const [line, setLine] = useState<string>(MASCOT_LINES.idle[0] ?? "");
  const [reaction, setReaction] = useState(0);

  const select = (next: MascotState) => {
    setState(next);
    setLine(pickMascotLine(next));
    setReaction((r) => r + 1);
  };

  return (
    <Card className="space-y-4">
      <Mascot state={state} size={112} line={line} reactionKey={reaction} />
      <div className="flex flex-wrap gap-2">
        {MASCOT_STATES.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={s === state ? "primary" : "secondary"}
            onClick={() => select(s)}
          >
            {s}
          </Button>
        ))}
      </div>
      <p className="text-sm text-ink-muted">
        Повторный тап по тому же состоянию перезапускает реакцию (прыжок, вздрагивание).
      </p>
    </Card>
  );
}

function StorePanel() {
  const hydrated = useProgressHydrated();
  const progress = useProgressStore();
  const today = useToday();
  const hearts = useHearts();

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl bg-bg px-4 py-3">
        <StatBadge kind="streak" value={hydrated && today ? displayedStreak(progress.streak, today) : null} />
        <StatBadge kind="xp" value={hydrated ? progress.xp : null} />
        <StatBadge kind="hearts" value={hearts?.hearts ?? null} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button size="sm" variant="danger" onClick={() => progress.loseHeart()}>
          −1 ❤️
        </Button>
        <Button size="sm" variant="secondary" onClick={() => progress.refillHearts()}>
          Восстановить сердечки
        </Button>
        <Button
          size="sm"
          variant="success"
          onClick={() =>
            progress.completeLesson({ lessonId: "tp-27", baseXp: 15, accuracy: 100, perfect: true })
          }
        >
          Пройти tp-27
        </Button>
        <Button size="sm" variant="ghost" onClick={() => progress.reset()}>
          Сбросить
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-2xl bg-code-bg p-3 font-mono text-xs text-ink-muted">
        {hydrated
          ? JSON.stringify(
              {
                streak: progress.streak,
                heartsUpdatedAt: progress.heartsUpdatedAt,
                activity: progress.activity,
                lessons: progress.lessons,
              },
              null,
              2,
            )
          : "Загрузка…"}
      </pre>
    </Card>
  );
}

export function UiShowcase() {
  const [progress, setProgress] = useState(0.4);

  return (
    <main className="mx-auto w-full max-w-md space-y-10 px-4 py-8">
      <header className="space-y-2">
        <Link href="/" className="text-sm font-bold text-primary">
          ← На главную
        </Link>
        <h1 className="text-3xl font-black">Витрина UI</h1>
        <p className="text-ink-muted">Компоненты AlgoQuest. Страница для разработки.</p>
      </header>

      <Section title="Палитра">
        <div className="grid grid-cols-4 gap-3">
          {SWATCHES.map(([name, bg]) => (
            <div key={name} className="space-y-1 text-center">
              <div className={cn("aspect-square rounded-2xl border-2 border-border", bg)} />
              <span className="text-xs font-bold text-ink-muted">{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Типографика">
        <Card className="space-y-2">
          <p className="text-3xl font-black">Два указателя</p>
          <p className="text-xl font-extrabold">Remove Element · #27</p>
          <p>Обычный текст урока: i читает каждый элемент, k показывает, куда писать.</p>
          <p className="text-ink-muted">Вспомогательный текст</p>
          <p className="font-mono text-sm">nums[k] = nums[i]; // JetBrains Mono</p>
        </Card>
      </Section>

      <Section title="Кнопки">
        <div className="flex flex-wrap gap-3">
          {BUTTON_VARIANTS.map((v) => (
            <Button key={v} variant={v}>
              {v}
            </Button>
          ))}
          <Button disabled>disabled</Button>
          <Button size="sm">small</Button>
        </div>
        <Button size="lg">Проверить</Button>
        <Link href="/dev/ui" className={buttonClasses({ variant: "secondary", size: "lg" })}>
          Ссылка в виде кнопки
        </Link>
      </Section>

      <Section title="Прогресс">
        <ProgressBar value={progress} label="Прогресс урока" />
        <ProgressBar value={progress} tone="success" />
        <ProgressBar value={progress} tone="xp" />
        <div className="flex gap-3">
          <Button size="sm" variant="secondary" onClick={() => setProgress((p) => Math.max(0, p - 0.2))}>
            −20%
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setProgress((p) => Math.min(1, p + 0.2))}>
            +20%
          </Button>
        </div>
      </Section>

      <Section title="Статистика">
        <div className="flex items-center justify-between rounded-2xl border-2 border-border bg-surface px-4 py-3">
          <StatBadge kind="streak" value={7} />
          <StatBadge kind="xp" value={340} />
          <StatBadge kind="hearts" value={5} />
        </div>
        <div className="flex items-center justify-between rounded-2xl border-2 border-border bg-surface px-4 py-3">
          <StatBadge kind="streak" value={0} muted />
          <StatBadge kind="xp" value={null} />
          <StatBadge kind="hearts" value={0} muted />
        </div>
      </Section>

      <Section title="Код">
        <CodeBlock code={SAMPLE_CODE} showLineNumbers />
      </Section>

      <Section title="Визуализатор">
        <ArrayVisualizer steps={LESSON_27_STEPS} />
        <ArrayVisualizer steps={PALINDROME_STEPS} />
      </Section>

      <Section title="Бит — все состояния">
        <div className="grid grid-cols-3 gap-3">
          {MASCOT_STATES.map((s) => (
            <Card key={s} className="flex flex-col items-center gap-2 p-3">
              <Mascot state={s} size={72} />
              <span className="text-sm font-bold text-ink-muted">{s}</span>
            </Card>
          ))}
        </div>
        <MascotPlayground />
      </Section>

      <Section title="Store прогресса">
        <StorePanel />
      </Section>
    </main>
  );
}
