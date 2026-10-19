import type { Metadata } from "next";
import { TabBar } from "@/components/nav/TabBar";
import { ProfileScreen } from "@/components/profile/ProfileScreen";
import { islands } from "@/content";

export const metadata: Metadata = { title: "Профиль · AlgoQuest" };

export default function ProfilePage() {
  // В клиент отдаём только то, что нужно профилю, а не весь контент уроков.
  const summary = islands.map(({ id, title, emoji, lessons }) => ({
    id,
    title,
    emoji,
    lessonIds: lessons.map((lesson) => lesson.id),
  }));

  return (
    <>
      <ProfileScreen islands={summary} />
      <TabBar />
    </>
  );
}
