"use client";

import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { useHearts } from "@/hooks/useHearts";
import { formatDuration } from "@/lib/format";
import { HEART_REGEN_MINUTES } from "@/lib/progress/hearts";

interface OutOfHeartsProps {
  onRetry: () => void;
  onLeave: () => void;
}

export function OutOfHearts({ onRetry, onLeave }: OutOfHeartsProps) {
  const hearts = useHearts();
  const canRetry = (hearts?.hearts ?? 0) > 0;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-4 py-10 text-center">
      <Mascot state="sleepy" size={140} />
      <div className="space-y-2">
        <h1 className="text-3xl font-black">Отдохни</h1>
        <p className="text-lg font-semibold text-ink-muted">
          Сердечки закончились, а ошибки — нормальная часть обучения. Новое сердечко появляется
          каждые {HEART_REGEN_MINUTES} минут.
        </p>
      </div>

      <p className="rounded-2xl bg-error-soft px-4 py-2 text-lg font-extrabold text-error-ink tabular-nums">
        {canRetry
          ? `❤️ × ${hearts?.hearts}: можно продолжать`
          : hearts?.msToNext != null
            ? `❤️ через ${formatDuration(hearts.msToNext)}`
            : "❤️ …"}
      </p>

      <div className="w-full space-y-3">
        <Button size="lg" disabled={!canRetry} onClick={onRetry}>
          Повторить урок
        </Button>
        <Button size="lg" variant="secondary" onClick={onLeave}>
          На карту
        </Button>
      </div>
    </main>
  );
}
