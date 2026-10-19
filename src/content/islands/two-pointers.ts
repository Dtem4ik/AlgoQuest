import type { Island, Lesson } from "@/lib/types";

export const lesson27: Lesson = {
  id: "tp-27",
  title: "Remove Element",
  leetcode: { id: 27, slug: "remove-element", difficulty: "Easy" },
  xp: 15,
  interview: {
    brute:
      "Завести новый массив и сложить туда все числа, которые не равны val. Работает, но тратит O(n) памяти, а задача просит менять массив на месте.",
    optimal:
      "Два указателя read/write: i читает каждый элемент, k показывает, куда писать следующий хороший. Хорошее число копируем в nums[k] и делаем k++. Ответ — k.",
    time: "O(n) — один проход по массиву",
    space: "O(1) — только два указателя",
  },
  exercises: [
    {
      type: "theory",
      title: "Читатель и писатель",
      body: "Нужно выкинуть все val из массива на месте. Заводим два указателя: i читает каждый элемент, k показывает, куда записать следующий хороший. i двигается всегда, k — только когда нашли хорошее число.",
      mascot: "thinking",
    },
    {
      type: "visualize",
      title: "nums = [0,1,2,2,3,0,4,2], val = 2",
      steps: [
        { array: [0, 1, 2, 2, 3, 0, 4, 2], pointers: { i: 0, k: 0 }, vars: { k: 0 }, note: "Старт: k = 0" },
        { array: [0, 1, 2, 2, 3, 0, 4, 2], pointers: { i: 0, k: 1 }, highlight: { write: [0] }, vars: { k: 1 }, note: "0 ≠ 2 → пишем в nums[0], k++" },
        { array: [0, 1, 2, 2, 3, 0, 4, 2], pointers: { i: 1, k: 2 }, highlight: { write: [1] }, vars: { k: 2 }, note: "1 ≠ 2 → пишем в nums[1], k++" },
        { array: [0, 1, 2, 2, 3, 0, 4, 2], pointers: { i: 2, k: 2 }, highlight: { skip: [2] }, vars: { k: 2 }, note: "2 = val → пропуск" },
        { array: [0, 1, 2, 2, 3, 0, 4, 2], pointers: { i: 3, k: 2 }, highlight: { skip: [3] }, vars: { k: 2 }, note: "2 = val → пропуск" },
        { array: [0, 1, 3, 2, 3, 0, 4, 2], pointers: { i: 4, k: 3 }, highlight: { write: [2] }, vars: { k: 3 }, note: "3 ≠ 2 → пишем в nums[2], k++" },
        { array: [0, 1, 3, 0, 3, 0, 4, 2], pointers: { i: 5, k: 4 }, highlight: { write: [3] }, vars: { k: 4 }, note: "0 ≠ 2 → пишем в nums[3], k++" },
        { array: [0, 1, 3, 0, 4, 0, 4, 2], pointers: { i: 6, k: 5 }, highlight: { write: [4] }, vars: { k: 5 }, note: "4 ≠ 2 → пишем в nums[4], k++" },
        { array: [0, 1, 3, 0, 4, 0, 4, 2], pointers: { i: 7, k: 5 }, highlight: { skip: [7], done: [0, 1, 2, 3, 4] }, vars: { k: 5 }, note: "2 = val → пропуск. Ответ: k = 5" },
      ],
    },
    {
      type: "choice",
      question: "Когда сдвигается указатель k?",
      options: [
        "На каждом шаге цикла",
        "Только когда nums[i] === val",
        "Только когда nums[i] !== val, после записи",
        "Никогда",
      ],
      correct: 2,
      explanation: "i читает всегда, k пишет. Хорошее число записываем в nums[k] и делаем k++.",
    },
    {
      type: "fill-blank",
      code: "for (let i = 0; i < nums.length; i++) {\n  if (nums[i] ___ val) {\n    nums[k] = nums[i];\n    k++;\n  }\n}",
      options: ["!==", "===", "<", ">"],
      correct: 0,
      explanation: "Записываем только числа, которые НЕ равны val.",
    },
    {
      type: "predict-output",
      code: "removeElement(nums, val)",
      input: "nums = [3, 3, 3], val = 3",
      options: ["3", "0", "-1", "Ошибка"],
      correct: 1,
      explanation:
        "Все числа равны val, k++ ни разу не сработал. Краевой случай — проговаривай такие на собесе.",
    },
    {
      type: "find-bug",
      code: [
        "function removeElement(nums, val) {",
        "  let k = 0;",
        "  for (let i = 0; i < nums.length; i++) {",
        "    if (nums[i] !== val) {",
        "      nums[i] = nums[k];",
        "      k++;",
        "    }",
        "  }",
        "  return k;",
        "}",
      ],
      bugLine: 4,
      fixed: "      nums[k] = nums[i];",
      explanation:
        "Пишет k, читает i: nums[k] = nums[i]. Перепутанное присваивание тащит старые значения назад, и хорошие числа не собираются в начале массива.",
    },
    {
      type: "order-lines",
      lines: [
        "function removeElement(nums, val) {",
        "  let k = 0;",
        "  for (let i = 0; i < nums.length; i++) {",
        "    if (nums[i] !== val) {",
        "      nums[k] = nums[i];",
        "      k++;",
        "    }",
        "  }",
        "  return k;",
        "}",
      ],
      explanation: "O(n) по времени, O(1) по памяти.",
    },
  ],
};

export const twoPointers: Island = {
  id: "two-pointers",
  title: "Два указателя",
  emoji: "👉👈",
  color: "#7C5CFF",
  summary: [
    "Read/write: i читает каждый элемент, k пишет только хорошие. Фильтрация на месте за O(n) по времени и O(1) по памяти.",
    "Хорошее число определяет условие: !== val, !== nums[k-1], !== nums[k-2].",
    "Ответ — k: длина «хорошей» части массива.",
  ].join("\n"),
  lessons: [lesson27],
};
