import type { OptionExercise } from "@/lib/engine/check";

export interface OptionExerciseProps<E extends OptionExercise> {
  exercise: E;
  /** Выбранный вариант; null — ничего не выбрано. */
  selected: number | null;
  onSelect: (index: number | null) => void;
  /** Ответ проверен: показываем верный/неверный и блокируем ввод. */
  checked: boolean;
}
