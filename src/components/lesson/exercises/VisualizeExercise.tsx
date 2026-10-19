"use client";

import { ArrayVisualizer } from "@/components/viz/ArrayVisualizer";
import type { Exercise } from "@/lib/types";

interface VisualizeExerciseProps {
  exercise: Extract<Exercise, { type: "visualize" }>;
  onComplete: () => void;
}

export function VisualizeExercise({ exercise, onComplete }: VisualizeExerciseProps) {
  return (
    <div className="space-y-5">
      <h2 className="font-mono text-base leading-snug font-bold break-words">{exercise.title}</h2>
      <ArrayVisualizer steps={exercise.steps} onComplete={onComplete} />
    </div>
  );
}
