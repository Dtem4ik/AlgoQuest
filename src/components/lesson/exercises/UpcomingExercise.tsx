import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/ui/CodeBlock";
import type { Exercise } from "@/lib/types";

interface UpcomingExerciseProps {
  exercise: Extract<Exercise, { type: "visualize" | "order-lines" | "find-bug" }>;
}

// Временная заглушка: эти типы упражнений появятся на Этапе 2.
export function UpcomingExercise({ exercise }: UpcomingExerciseProps) {
  return (
    <Card className="space-y-4">
      <p className="text-sm font-extrabold tracking-wide text-primary uppercase">Скоро</p>
      {exercise.type === "visualize" && (
        <>
          <h2 className="text-2xl leading-tight font-black">{exercise.title}</h2>
          <p className="font-semibold text-ink-muted">Здесь будет пошаговая анимация алгоритма.</p>
        </>
      )}
      {exercise.type === "order-lines" && (
        <>
          <h2 className="text-2xl leading-tight font-black">Полное решение</h2>
          <p className="font-semibold text-ink-muted">
            Скоро строки нужно будет собрать самому. А пока — посмотри на решение целиком.
          </p>
          <CodeBlock code={exercise.lines.join("\n")} />
          <p className="font-semibold">{exercise.explanation}</p>
        </>
      )}
      {exercise.type === "find-bug" && (
        <>
          <h2 className="text-2xl leading-tight font-black">Найди баг</h2>
          <CodeBlock code={exercise.code.join("\n")} />
        </>
      )}
    </Card>
  );
}
