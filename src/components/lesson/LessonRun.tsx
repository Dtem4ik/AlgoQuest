"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { EXERCISE_PROMPTS } from "@/content/lesson-copy";
import { pickMascotLine } from "@/content/mascot-lines";
import { checkAnswer, initialAnswer, isGraded, isOptionExercise, type Answer } from "@/lib/engine/check";
import {
  acknowledge,
  advance,
  currentExercise,
  lessonProgress,
  lessonScore,
  startLesson,
  submitAnswer,
  type LessonState,
} from "@/lib/engine/lesson";
import { regenHearts } from "@/lib/progress/hearts";
import type { Lesson, MascotState } from "@/lib/types";
import { useProgressStore } from "@/store/progress";
import { ExerciseView } from "./ExerciseView";
import { LessonFooter, type FooterMode } from "./LessonFooter";
import { LessonHeader } from "./LessonHeader";
import { LessonSummary, type LessonOutcome } from "./LessonSummary";
import { OutOfHearts } from "./OutOfHearts";

interface Reaction {
  state: MascotState;
  line: string;
}

interface LessonRunProps {
  lesson: Lesson;
  /** Начать урок заново (после «Отдохни»). */
  onRetry: () => void;
  /** Уйти на карту. */
  onLeave: () => void;
}

/** Один прогон урока. Монтируется только на клиенте после загрузки прогресса. */
export function LessonRun({ lesson, onRetry, onLeave }: LessonRunProps) {
  const loseHeart = useProgressStore((s) => s.loseHeart);
  const completeLesson = useProgressStore((s) => s.completeLesson);

  const [startedAt] = useState(() => Date.now());
  const [engine, setEngine] = useState<LessonState>(() =>
    startLesson(lesson, regenHearts(useProgressStore.getState(), Date.now()).hearts),
  );
  const [answer, setAnswer] = useState<Answer | null>(() => {
    const first = lesson.exercises[0];
    return first ? initialAnswer(first, Math.random) : null;
  });
  /** Визуализация досмотрена до конца — можно идти дальше. */
  const [visualized, setVisualized] = useState(false);
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [outcome, setOutcome] = useState<LessonOutcome | null>(null);
  const [exitOpen, setExitOpen] = useState(false);
  /** Номер показа упражнения: меняется только при переходе к следующему. */
  const [turn, setTurn] = useState(0);

  const current = currentExercise(lesson, engine);

  const moveOn = (next: LessonState) => {
    setEngine(next);
    const upcoming = currentExercise(lesson, next);
    setAnswer(upcoming ? initialAnswer(upcoming.exercise, Math.random) : null);
    setVisualized(false);
    setReaction(null);
    setTurn((t) => t + 1);
    if (next.phase === "finished") {
      const score = lessonScore(lesson, next);
      const xpEarned = completeLesson({
        lessonId: lesson.id,
        baseXp: lesson.xp,
        accuracy: score.accuracy,
        perfect: score.perfect,
      });
      setOutcome({
        ...score,
        xpEarned,
        durationMs: Date.now() - startedAt,
        mascotLine: pickMascotLine("celebrate"),
      });
    }
  };

  const handleContinue = () => {
    moveOn(engine.phase === "feedback" ? advance(engine) : acknowledge(engine));
  };

  const handleCheck = () => {
    if (!current || !isGraded(current.exercise) || answer === null) return;
    const correct = checkAnswer(current.exercise, answer);
    if (!correct) loseHeart();
    setEngine(submitAnswer(engine, correct));
    const state = correct ? "happy" : "sad";
    setReaction({ state, line: pickMascotLine(state) });
  };

  if (engine.phase === "finished" && outcome) {
    return <LessonSummary lesson={lesson} outcome={outcome} onContinue={onLeave} />;
  }
  if (engine.phase === "out-of-hearts") {
    return <OutOfHearts onRetry={onRetry} onLeave={onLeave} />;
  }
  if (!current) return null;

  const { exercise } = current;
  const checked = engine.phase === "feedback";

  let footer: FooterMode;
  if (checked && isGraded(exercise)) {
    footer = {
      kind: "feedback",
      correct: engine.lastCorrect === true,
      explanation: exercise.explanation,
      // order-lines и find-bug показывают верный ответ прямо в упражнении
      correctAnswer:
        engine.lastCorrect || !isOptionExercise(exercise) ? undefined : exercise.options[exercise.correct],
      answerIsCode: exercise.type !== "choice",
    };
  } else if (isGraded(exercise)) {
    footer = { kind: "check", disabled: answer === null };
  } else {
    const waiting = exercise.type === "visualize" && !visualized;
    footer = {
      kind: "acknowledge",
      label: exercise.type === "theory" ? "Понятно" : waiting ? "Досмотри до конца" : "Дальше",
      disabled: waiting,
    };
  }

  const mascotState: MascotState =
    reaction?.state ?? (exercise.type === "theory" ? (exercise.mascot ?? "thinking") : "idle");

  return (
    <>
      <LessonHeader
        progress={lessonProgress(engine)}
        hearts={engine.hearts}
        onExit={() => setExitOpen(true)}
      />

      <main className="mx-auto w-full max-w-md flex-1 px-4 pt-2 pb-64">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            // новый ключ на каждый показ, в том числе на повтор после ошибки
            key={turn}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <Mascot
              state={mascotState}
              size={64}
              line={reaction?.line ?? EXERCISE_PROMPTS[exercise.type]}
            />
            <ExerciseView
              exercise={exercise}
              answer={answer}
              onAnswer={setAnswer}
              checked={checked}
              onVisualized={() => setVisualized(true)}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      <LessonFooter mode={footer} onCheck={handleCheck} onContinue={handleContinue} />

      <Dialog open={exitOpen} onClose={() => setExitOpen(false)} title="Выйти из урока?">
        <p className="font-semibold text-ink-muted">Прогресс этого урока не сохранится.</p>
        <div className="space-y-3">
          <Button size="lg" onClick={() => setExitOpen(false)} autoFocus>
            Продолжить урок
          </Button>
          <Button size="lg" variant="ghost" className="text-error" onClick={onLeave}>
            Выйти
          </Button>
        </div>
      </Dialog>
    </>
  );
}
