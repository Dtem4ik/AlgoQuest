import { describe, expect, it } from "vitest";
import type { Lesson } from "@/lib/types";
import { checkAnswer, isGraded } from "./check";
import {
  acknowledge,
  advance,
  currentExercise,
  lessonProgress,
  lessonScore,
  startLesson,
  submitAnswer,
  type LessonState,
} from "./lesson";

const lesson: Lesson = {
  id: "tp-1",
  title: "Test",
  leetcode: { id: 1, slug: "test", difficulty: "Easy" },
  xp: 10,
  interview: { brute: "b", optimal: "o", time: "t", space: "s" },
  exercises: [
    { type: "theory", title: "T", body: "body" },
    { type: "choice", question: "Q1", options: ["a", "b"], correct: 0, explanation: "e" },
    { type: "choice", question: "Q2", options: ["a", "b"], correct: 1, explanation: "e" },
  ],
};

const answer = (state: LessonState, correct: boolean) => advance(submitAnswer(state, correct));

describe("check", () => {
  it("knows which exercises are graded", () => {
    expect(lesson.exercises.map(isGraded)).toEqual([false, true, true]);
  });

  it("compares the chosen option", () => {
    const ex = lesson.exercises[2];
    if (!ex || !isGraded(ex)) throw new Error("fixture");
    expect(checkAnswer(ex, { type: "option", index: 1 })).toBe(true);
    expect(checkAnswer(ex, { type: "option", index: 0 })).toBe(false);
  });
});

describe("lesson engine", () => {
  it("starts with all exercises queued", () => {
    const s = startLesson(lesson, 5);
    expect(s.queue).toEqual([0, 1, 2]);
    expect(s.phase).toBe("answering");
    expect(currentExercise(lesson, s)?.index).toBe(0);
  });

  it("starts in out-of-hearts when there are no hearts", () => {
    expect(startLesson(lesson, 0).phase).toBe("out-of-hearts");
  });

  it("acknowledges theory without feedback", () => {
    const s = acknowledge(startLesson(lesson, 5));
    expect(s.queue).toEqual([1, 2]);
    expect(s.done).toBe(1);
    expect(s.phase).toBe("answering");
  });

  it("shows feedback, then drops a correct exercise", () => {
    const s = acknowledge(startLesson(lesson, 5));
    const checked = submitAnswer(s, true);
    expect(checked.phase).toBe("feedback");
    expect(checked.lastCorrect).toBe(true);
    const next = advance(checked);
    expect(next.queue).toEqual([2]);
    expect(lessonProgress(next)).toBeCloseTo(2 / 3);
  });

  it("moves a wrong exercise to the back and takes a heart", () => {
    const s = acknowledge(startLesson(lesson, 5));
    const checked = submitAnswer(s, false);
    expect(checked.hearts).toBe(4);
    expect(checked.lastCorrect).toBe(false);
    const next = advance(checked);
    expect(next.queue).toEqual([2, 1]);
    expect(next.done).toBe(1);
    expect(next.phase).toBe("answering");
  });

  it("ignores actions in the wrong phase", () => {
    const s = startLesson(lesson, 5);
    expect(advance(s)).toBe(s);
    const checked = submitAnswer(acknowledge(s), true);
    expect(submitAnswer(checked, false)).toBe(checked);
    expect(acknowledge(checked)).toBe(checked);
  });

  it("finishes when the queue is empty and scores the run", () => {
    let s = acknowledge(startLesson(lesson, 5));
    s = answer(s, false); // Q1 wrong → back of the queue
    s = answer(s, true); // Q2
    s = answer(s, true); // Q1 again
    expect(s.phase).toBe("finished");
    expect(lessonProgress(s)).toBe(1);
    expect(lessonScore(lesson, s)).toEqual({ accuracy: 50, perfect: false });
  });

  it("counts a repeatedly missed exercise once in accuracy", () => {
    let s = acknowledge(startLesson(lesson, 5));
    s = answer(s, true); // Q1
    s = answer(s, false); // Q2
    s = answer(s, false); // Q2
    s = answer(s, true); // Q2
    expect(s.mistakes).toBe(2);
    expect(lessonScore(lesson, s)).toEqual({ accuracy: 50, perfect: false });
  });

  it("gives a perfect score with no mistakes", () => {
    let s = acknowledge(startLesson(lesson, 5));
    s = answer(s, true);
    s = answer(s, true);
    expect(lessonScore(lesson, s)).toEqual({ accuracy: 100, perfect: true });
  });

  it("runs out of hearts after the feedback of the last heart", () => {
    let s = acknowledge(startLesson(lesson, 1));
    s = submitAnswer(s, false);
    expect(s.phase).toBe("feedback");
    expect(s.hearts).toBe(0);
    expect(advance(s).phase).toBe("out-of-hearts");
  });

  it("finishes with a single heart when every answer is correct", () => {
    let s = acknowledge(startLesson(lesson, 1));
    s = answer(s, true);
    s = answer(s, true);
    expect(s.phase).toBe("finished");
  });
});
