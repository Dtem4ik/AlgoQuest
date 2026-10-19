import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonScreen } from "@/components/lesson/LessonScreen";
import { getLesson, lessonIds } from "@/content";

export function generateStaticParams() {
  return lessonIds.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/lesson/[id]">): Promise<Metadata> {
  const lesson = getLesson((await params).id);
  return { title: lesson ? `${lesson.title} · AlgoQuest` : "AlgoQuest" };
}

export default async function LessonPage({ params }: PageProps<"/lesson/[id]">) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) notFound();

  const position = lessonIds.indexOf(id);
  return <LessonScreen lesson={lesson} prevLessonId={lessonIds[position - 1] ?? null} />;
}
