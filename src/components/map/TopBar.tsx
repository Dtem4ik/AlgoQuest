"use client";

import { StatBadge } from "@/components/ui/StatBadge";
import { useHearts } from "@/hooks/useHearts";
import { useToday } from "@/hooks/useToday";
import { displayedStreak } from "@/lib/progress/streak";
import { useProgressHydrated, useProgressStore } from "@/store/progress";

export function TopBar() {
  const hydrated = useProgressHydrated();
  const today = useToday();
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const hearts = useHearts();

  const streakValue = hydrated && today ? displayedStreak(streak, today) : null;

  return (
    <header className="sticky top-0 z-20 border-b-2 border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-md items-center justify-between px-5">
        <StatBadge kind="streak" value={streakValue} muted={streakValue === 0} />
        <StatBadge kind="xp" value={hydrated ? xp : null} />
        <StatBadge kind="hearts" value={hearts?.hearts ?? null} muted={hearts?.hearts === 0} />
      </div>
    </header>
  );
}
