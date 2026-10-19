import type { Island } from "@/lib/types";

interface IslandHeaderProps {
  island: Island;
  number: number;
  /** null — прогресс ещё не загружен */
  completed: number | null;
}

export function IslandHeader({ island, number, completed }: IslandHeaderProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-3xl p-5 text-white shadow-[0_5px_0_rgb(0_0_0/0.18)]"
      style={{ backgroundColor: island.color }}
    >
      <div className="min-w-0">
        <p className="text-sm font-extrabold tracking-wide uppercase opacity-80">Остров {number}</p>
        <h2 className="text-2xl leading-tight font-black">{island.title}</h2>
        <p className="mt-1 text-sm font-bold opacity-90">
          Уроков: {completed ?? "–"} / {island.lessons.length}
        </p>
      </div>
      <span className="shrink-0 text-4xl" aria-hidden>
        {island.emoji}
      </span>
    </div>
  );
}
