import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/ui/CodeBlock";
import type { Exercise } from "@/lib/types";

interface TheoryExerciseProps {
  exercise: Extract<Exercise, { type: "theory" }>;
}

export function TheoryExercise({ exercise }: TheoryExerciseProps) {
  return (
    <Card className="space-y-4">
      <h2 className="text-2xl leading-tight font-black">{exercise.title}</h2>
      <p className="text-lg leading-relaxed font-semibold">{exercise.body}</p>
      {exercise.code && <CodeBlock code={exercise.code} />}
    </Card>
  );
}
