"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import type { LessonStatus } from "@/lib/engine/unlock";
import { xpForLesson } from "@/lib/progress/progress";
import type { Lesson } from "@/lib/types";

const DIFFICULTY_COLORS: Record<Lesson["leetcode"]["difficulty"], string> = {
  Easy: "text-success-shade",
  Medium: "text-xp-shade",
  Hard: "text-error",
};

interface LessonPopoverProps {
  lesson: Lesson;
  status: LessonStatus;
  /** Переход в урок. Карта при этом не размонтируется (Activity), поэтому поповер закрываем сами. */
  onStart: () => void;
}

export function LessonPopover({ lesson, status, onStart }: LessonPopoverProps) {
  const locked = status === "locked";
  const replay = status === "completed" || status === "perfect";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="space-y-3 rounded-3xl border-2 border-b-4 border-border bg-surface p-4 text-left"
      role="dialog"
      aria-label={lesson.title}
    >
      <div>
        <p className="text-lg leading-tight font-black">{lesson.title}</p>
        <p className="text-sm font-bold text-ink-muted">
          LeetCode #{lesson.leetcode.id} ·{" "}
          <span className={DIFFICULTY_COLORS[lesson.leetcode.difficulty]}>
            {lesson.leetcode.difficulty}
          </span>
        </p>
      </div>

      {locked ? (
        <p className="text-sm font-bold text-ink-muted">Сначала пройди предыдущие уроки 🔒</p>
      ) : (
        <Link href={`/lesson/${lesson.id}`} onClick={onStart} className={buttonClasses({ size: "lg" })}>
          {replay ? "Повторить" : "Начать"} · +{xpForLesson(lesson.xp, replay)} XP
        </Link>
      )}
    </motion.div>
  );
}
