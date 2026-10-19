"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export type FooterMode =
  | { kind: "check"; disabled: boolean }
  | { kind: "acknowledge"; label: string; disabled?: boolean }
  | {
      kind: "feedback";
      correct: boolean;
      explanation: string;
      /** Верный ответ, показываем после ошибки. */
      correctAnswer?: string;
      /** Ответ — фрагмент кода (моноширинный шрифт). */
      answerIsCode: boolean;
    };

interface LessonFooterProps {
  mode: FooterMode;
  onCheck: () => void;
  onContinue: () => void;
}

function FeedbackIcon({ correct }: { correct: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full text-white",
        correct ? "bg-success" : "bg-error",
      )}
    >
      <svg viewBox="0 0 24 24" className="size-6">
        <path
          d={correct ? "M5 12.5l4.5 4.5L19 7.5" : "M7 7l10 10M17 7L7 17"}
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Shell({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("border-t-2 border-border", className)}>
      <div className="mx-auto w-full max-w-md space-y-4 px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        {children}
      </div>
    </div>
  );
}

export function LessonFooter({ mode, onCheck, onContinue }: LessonFooterProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30">
      <AnimatePresence mode="popLayout" initial={false}>
        {mode.kind === "feedback" ? (
          <motion.div
            key="feedback"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
          >
            <Shell
              className={cn(
                "border-transparent",
                mode.correct ? "bg-success-soft text-success-shade" : "bg-error-soft text-error-shade",
              )}
            >
              <div role="status" className="max-h-[40dvh] space-y-2 overflow-y-auto">
                <div className="flex items-center gap-3">
                  <FeedbackIcon correct={mode.correct} />
                  <p className="text-2xl font-black">{mode.correct ? "Верно!" : "Не совсем"}</p>
                </div>
                {mode.correctAnswer !== undefined && (
                  <p className="font-extrabold">
                    Правильный ответ:{" "}
                    <span className={cn(mode.answerIsCode && "font-mono")}>{mode.correctAnswer}</span>
                  </p>
                )}
                <p className="font-semibold text-ink">{mode.explanation}</p>
              </div>
              <Button
                size="lg"
                variant={mode.correct ? "success" : "danger"}
                onClick={onContinue}
                autoFocus
              >
                Дальше
              </Button>
            </Shell>
          </motion.div>
        ) : (
          <motion.div key="action" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Shell className="bg-bg">
              {mode.kind === "check" ? (
                <Button size="lg" disabled={mode.disabled} onClick={onCheck}>
                  Проверить
                </Button>
              ) : (
                <Button size="lg" disabled={mode.disabled} onClick={onContinue}>
                  {mode.label}
                </Button>
              )}
            </Shell>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
