"use client";

import confetti from "canvas-confetti";
import { useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { formatDuration, leetcodeUrl } from "@/lib/format";
import type { Lesson } from "@/lib/types";
import { InterviewCard } from "./InterviewCard";

export interface LessonOutcome {
  xpEarned: number;
  accuracy: number;
  perfect: boolean;
  durationMs: number;
  mascotLine: string;
}

const CONFETTI_COLORS = ["#7C5CFF", "#22C55E", "#FBBF24", "#F43F5E", "#8EF6FF"];

function StatTile({ label, value, className }: { label: string; value: string; className: string }) {
  return (
    <div className={cn("flex-1 overflow-hidden rounded-2xl border-2", className)}>
      <p className="py-1 text-xs font-extrabold tracking-wide text-white uppercase">{label}</p>
      <p className="bg-surface py-3 text-xl font-black tabular-nums">{value}</p>
    </div>
  );
}

interface LessonSummaryProps {
  lesson: Lesson;
  outcome: LessonOutcome;
  onContinue: () => void;
}

export function LessonSummary({ lesson, outcome, onContinue }: LessonSummaryProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const fire = (originX: number, angle: number) =>
      confetti({
        particleCount: 70,
        angle,
        spread: 70,
        origin: { x: originX, y: 0.65 },
        colors: CONFETTI_COLORS,
        disableForReducedMotion: true,
      });
    fire(0, 60);
    fire(1, 120);
    return () => {
      confetti.reset();
    };
  }, [reducedMotion]);

  return (
    <>
      <main className="mx-auto w-full max-w-md flex-1 space-y-6 px-4 pt-10 pb-36 text-center">
        <Mascot state="celebrate" size={130} className="justify-center" />
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-primary">
            {outcome.perfect ? "Идеально! 👑" : "Урок пройден!"}
          </h1>
          <p className="text-lg font-bold text-ink-muted">{outcome.mascotLine}</p>
        </div>

        <div className="flex gap-3">
          <StatTile label="XP" value={`+${outcome.xpEarned}`} className="border-xp bg-xp" />
          <StatTile label="Точность" value={`${outcome.accuracy}%`} className="border-success bg-success" />
          <StatTile label="Время" value={formatDuration(outcome.durationMs)} className="border-primary bg-primary" />
        </div>

        <InterviewCard notes={lesson.interview} />

        <a
          href={leetcodeUrl(lesson.leetcode.slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-extrabold text-primary underline-offset-4 hover:underline"
        >
          Решить #{lesson.leetcode.id} на LeetCode ↗
        </a>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-border bg-bg">
        <div className="mx-auto w-full max-w-md px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <Button size="lg" onClick={onContinue} autoFocus>
            Дальше
          </Button>
        </div>
      </div>
    </>
  );
}
