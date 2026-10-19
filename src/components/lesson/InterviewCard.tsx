import { Card } from "@/components/ui/Card";
import type { InterviewNotes } from "@/lib/types";

export function InterviewCard({ notes }: { notes: InterviewNotes }) {
  return (
    <Card className="space-y-4 text-left">
      <h2 className="text-xl font-black">🎤 Как рассказать на собесе</h2>
      <ol className="space-y-3">
        <li>
          <p className="text-sm font-extrabold tracking-wide text-ink-muted uppercase">1. Брутфорс</p>
          <p className="font-semibold">{notes.brute}</p>
        </li>
        <li>
          <p className="text-sm font-extrabold tracking-wide text-ink-muted uppercase">2. Оптимум</p>
          <p className="font-semibold">{notes.optimal}</p>
        </li>
        <li>
          <p className="text-sm font-extrabold tracking-wide text-ink-muted uppercase">3. Сложность</p>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <p className="rounded-xl bg-primary-soft p-2 text-sm font-bold">
              <span className="block text-primary">Время</span>
              {notes.time}
            </p>
            <p className="rounded-xl bg-primary-soft p-2 text-sm font-bold">
              <span className="block text-primary">Память</span>
              {notes.space}
            </p>
          </div>
        </li>
      </ol>
    </Card>
  );
}
