import Link from "next/link";
import { Mascot } from "@/components/mascot/Mascot";
import { buttonClasses } from "@/components/ui/Button";

// Заглушка до Этапа 1, где здесь появится карта пути.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-8 px-4 py-12 text-center">
      <Mascot state="idle" size={140} />
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-primary">AlgoQuest</h1>
        <p className="text-lg font-bold text-ink-muted">
          Алгоритмы для собеседований — короткими игровыми уроками.
        </p>
      </div>
      <Link href="/dev/ui" className={buttonClasses({ size: "lg" })}>
        Витрина UI
      </Link>
    </main>
  );
}
