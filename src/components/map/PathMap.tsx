"use client";

import { Fragment, useState } from "react";
import { Mascot } from "@/components/mascot/Mascot";
import { Card } from "@/components/ui/Card";
import { useToday } from "@/hooks/useToday";
import { isIslandCompleted, lessonStatuses } from "@/lib/engine/unlock";
import { isStreakBroken } from "@/lib/progress/streak";
import type { Island } from "@/lib/types";
import { useLessonVisits } from "@/store/lesson-visits";
import { useProgressHydrated, useProgressStore } from "@/store/progress";
import { IslandHeader } from "./IslandHeader";
import { IslandSparkles } from "./IslandSparkles";
import { LessonNode } from "./LessonNode";
import { LessonPopover } from "./LessonPopover";
import { PathTrail, TRAIL_HEIGHT } from "./PathTrail";

/** Извилистая дорожка: кружки по очереди уходят вправо и влево. */
const OFFSETS = [0, 56, 0, -56];
const NODE_SIZE = 72;
// Сверху место под плашку «Старт» над первым кружком.
const PAD_TOP = 60;

interface UpcomingIsland {
  id: string;
  title: string;
  emoji: string;
}

interface PathMapProps {
  islands: Island[];
  upcoming: UpcomingIsland[];
}

export function PathMap({ islands, upcoming }: PathMapProps) {
  const hydrated = useProgressHydrated();
  const today = useToday();
  const records = useProgressStore((s) => s.lessons);
  const streak = useProgressStore((s) => s.streak);
  const startVisit = useLessonVisits((s) => s.startVisit);
  const [openId, setOpenId] = useState<string | null>(null);

  const statuses = hydrated ? lessonStatuses(islands, records) : null;
  const sleepy = hydrated && today !== null && isStreakBroken(streak, today);

  return (
    <div className="relative mx-auto w-full max-w-md space-y-10 px-4 pt-6 pb-32">
      {openId && (
        <button
          type="button"
          aria-label="Закрыть"
          className="fixed inset-0 z-20 cursor-default"
          onClick={() => setOpenId(null)}
        />
      )}

      {islands.map((island, islandIndex) => {
        // Сквозной номер урока, чтобы дорожка не «прыгала» на стыке островов.
        const firstIndex = islands
          .slice(0, islandIndex)
          .reduce((sum, prev) => sum + prev.lessons.length, 0);
        const completed = hydrated
          ? island.lessons.filter((l) => records[l.id]?.completed).length
          : null;
        const offsets = island.lessons.map(
          (_, i) => OFFSETS[(firstIndex + i) % OFFSETS.length] ?? 0,
        );

        return (
          <section key={island.id} className="space-y-10">
            <IslandHeader island={island} number={islandIndex + 1} completed={completed} />

            {/* Подложка-остров в цвете паттерна: на ней тропинка и кружки уроков. */}
            <div
              className="relative rounded-[44px] px-2 pb-10"
              style={{
                paddingTop: PAD_TOP,
                background: `color-mix(in oklab, ${island.color} 10%, var(--surface))`,
                boxShadow: `inset 0 0 0 2px color-mix(in oklab, ${island.color} 20%, transparent), 0 6px 0 color-mix(in oklab, ${island.color} 14%, transparent)`,
              }}
            >
              <IslandSparkles
                color={island.color}
                offsets={offsets}
                rowHeight={NODE_SIZE + TRAIL_HEIGHT}
                top={PAD_TOP}
                skip={island.lessons.findIndex((l) => statuses?.[l.id] === "available")}
              />
              <div className="relative flex flex-col items-center">
                {island.lessons.map((lesson, i) => {
                  const offset = offsets[i] ?? 0;
                  const next = offsets[i + 1];
                  const status = statuses?.[lesson.id] ?? null;
                  return (
                    <Fragment key={lesson.id}>
                      <LessonNode
                        lesson={lesson}
                        status={status}
                        offset={offset}
                        open={openId === lesson.id}
                        onToggle={() => setOpenId((id) => (id === lesson.id ? null : lesson.id))}
                        companion={
                          status === "available" ? (
                            <Mascot state={sleepy ? "sleepy" : "idle"} size={64} />
                          ) : undefined
                        }
                        popover={
                          status && (
                            <LessonPopover
                              lesson={lesson}
                              status={status}
                              onStart={() => {
                                setOpenId(null);
                                startVisit(lesson.id);
                              }}
                            />
                          )
                        }
                      />
                      {next !== undefined && (
                        <PathTrail
                          from={offset}
                          to={next}
                          walked={status === "completed" || status === "perfect"}
                          color={island.color}
                        />
                      )}
                    </Fragment>
                  );
                })}
              </div>
            </div>

            {hydrated && isIslandCompleted(island, records) && (
              <Card className="space-y-2">
                <p className="text-lg font-black">📜 Шпаргалка: {island.title}</p>
                <ul className="list-disc space-y-1 pl-5 font-semibold text-ink-muted">
                  {island.summary.split("\n").map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </Card>
            )}
          </section>
        );
      })}

      {upcoming.map((island, i) => (
        <div
          key={island.id}
          className="flex items-center justify-between rounded-3xl border-2 border-dashed border-border p-5 text-disabled-ink"
        >
          <div>
            <p className="text-sm font-extrabold tracking-wide uppercase">
              Остров {islands.length + i + 1} · скоро
            </p>
            <p className="text-2xl font-black">{island.title}</p>
          </div>
          <span className="text-4xl grayscale" aria-hidden>
            {island.emoji}
          </span>
        </div>
      ))}
    </div>
  );
}
