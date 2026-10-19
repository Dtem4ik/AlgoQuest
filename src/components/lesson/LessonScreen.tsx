"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mascot } from "@/components/mascot/Mascot";
import { buttonClasses } from "@/components/ui/Button";
import type { Lesson } from "@/lib/types";
import { useProgressHydrated, useProgressStore } from "@/store/progress";
import { LessonRun } from "./LessonRun";

interface LessonScreenProps {
  lesson: Lesson;
  /** Предыдущий урок на карте; пока он не пройден, этот закрыт. */
  prevLessonId: string | null;
}

export function LessonScreen({ lesson, prevLessonId }: LessonScreenProps) {
  const router = useRouter();
  const hydrated = useProgressHydrated();
  const unlocked = useProgressStore((s) => !prevLessonId || s.lessons[prevLessonId]?.completed === true);
  // Смена ключа монтирует новый прогон урока с чистым состоянием.
  const [runKey, setRunKey] = useState(0);

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
      key={runKey}
      lesson={lesson}
      onRetry={() => setRunKey((k) => k + 1)}
      onLeave={() => {
        // Next сохраняет состояние скрытых маршрутов (Activity), поэтому
        // сбрасываем прогон, чтобы при возвращении урок начался заново.
        setRunKey((k) => k + 1);
        router.push("/");
      }}
    />
  );
}
