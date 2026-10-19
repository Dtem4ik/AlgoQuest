"use client";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatBadge } from "@/components/ui/StatBadge";

interface LessonHeaderProps {
  progress: number;
  hearts: number;
  onExit: () => void;
}

export function LessonHeader({ progress, hearts, onExit }: LessonHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-md items-center gap-4 px-4">
        <button
          type="button"
          onClick={onExit}
          aria-label="Выйти из урока"
          className="-ml-2 flex size-10 shrink-0 items-center justify-center rounded-xl text-ink-muted hover:bg-border/60"
        >
          <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </button>
        <ProgressBar value={progress} label="Прогресс урока" />
        <StatBadge kind="hearts" value={hearts} muted={hearts === 0} className="shrink-0" />
      </div>
    </header>
  );
}
