"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mascot } from "@/components/mascot/Mascot";
import { buttonClasses } from "@/components/ui/Button";
import { statusesInOrder } from "@/lib/engine/unlock";
import type { Lesson } from "@/lib/types";
import { useLessonVisits } from "@/store/lesson-visits";
import { useProgressHydrated, useProgressStore } from "@/store/progress";
import { LessonRun } from "./LessonRun";

interface LessonScreenProps {
  lesson: Lesson;
  /** Все уроки по порядку карты: по ним считается, открыт ли этот урок. */
  lessonIds: string[];
}

export function LessonScreen({ lesson, lessonIds }: LessonScreenProps) {
  const router = useRouter();
  const hydrated = useProgressHydrated();
  const records = useProgressStore((s) => s.lessons);
  const unlocked = statusesInOrder(lessonIds, records)[lesson.id] !== "locked";
  // Смена ключа монтирует новый прогон урока: при новом заходе с карты или «Повторить урок».
  const visit = useLessonVisits((s) => s.visits[lesson.id] ?? 0);
  const [retry, setRetry] = useState(0);

  // Карта загружена заранее — уход из урока мгновенный, без «зависшего» экрана.
  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  if (!hydrated) {
    return <div className="flex-1" aria-busy="true" />;
  }

  if (!unlocked) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
        <Mascot state="thinking" size={120} />
        <div className="space-y-2">
          <h1 className="text-3xl font-black">Урок пока закрыт 🔒</h1>
          <p className="text-lg font-semibold text-ink-muted">Сначала пройди предыдущие уроки на карте.</p>
        </div>
        <Link href="/" className={buttonClasses({ size: "lg" })}>
          На карту
        </Link>
      </main>
    );
  }

  return (
    <LessonRun
      key={`${visit}:${retry}`}
      lesson={lesson}
      onRetry={() => setRetry((r) => r + 1)}
      onLeave={() => router.push("/")}
    />
  );
}
