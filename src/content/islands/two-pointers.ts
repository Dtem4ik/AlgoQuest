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

export const lesson26: Lesson = {
  id: "tp-26",
  title: "Remove Duplicates from Sorted Array",
  leetcode: { id: 26, slug: "remove-duplicates-from-sorted-array", difficulty: "Easy" },
  xp: 15,
  interview: {
    brute:
      "Сложить уникальные числа в Set или новый массив и переписать их обратно в nums. Работает, но тратит O(n) памяти.",
    optimal:
      "Те же read/write указатели, что в Remove Element. Массив отсортирован, поэтому дубли стоят рядом: число хорошее, если оно не равно последнему записанному nums[k - 1]. nums[0] всегда остаётся, поэтому k = 1.",
    time: "O(n) — один проход по массиву",
    space: "O(1) — только два указателя",
  },
  exercises: [
    {
      type: "theory",
      title: "Дубли стоят рядом",
      body: "Это Remove Element, только «хорошее» число теперь другое. Массив отсортирован, значит одинаковые числа идут подряд. Число хорошее, если оно не равно последнему записанному — nums[k - 1]. nums[0] всегда хороший, поэтому стартуем с k = 1 и i = 1.",
      mascot: "thinking",
    },
    {
      type: "visualize",
      title: "nums = [0,0,1,1,1,2,2,3,3,4]",
      steps: [
        { array: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4], pointers: { i: 1, k: 1 }, highlight: { done: [0] }, vars: { k: 1 }, note: "nums[0] всегда хороший: k = 1" },
        { array: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4], pointers: { i: 1, k: 1 }, highlight: { skip: [1], compare: [0] }, vars: { k: 1 }, note: "0 = nums[k-1] → лишний дубль, пропуск" },
        { array: [0, 1, 1, 1, 1, 2, 2, 3, 3, 4], pointers: { i: 2, k: 2 }, highlight: { write: [1], compare: [0] }, vars: { k: 2 }, note: "1 ≠ nums[k-1] = 0 → пишем в nums[1], k++" },
        { array: [0, 1, 1, 1, 1, 2, 2, 3, 3, 4], pointers: { i: 3, k: 2 }, highlight: { skip: [3], compare: [1] }, vars: { k: 2 }, note: "1 = nums[k-1] → лишний дубль, пропуск" },
        { array: [0, 1, 1, 1, 1, 2, 2, 3, 3, 4], pointers: { i: 4, k: 2 }, highlight: { skip: [4], compare: [1] }, vars: { k: 2 }, note: "1 = nums[k-1] → лишний дубль, пропуск" },
        { array: [0, 1, 2, 1, 1, 2, 2, 3, 3, 4], pointers: { i: 5, k: 3 }, highlight: { write: [2], compare: [1] }, vars: { k: 3 }, note: "2 ≠ nums[k-1] = 1 → пишем в nums[2], k++" },
        { array: [0, 1, 2, 1, 1, 2, 2, 3, 3, 4], pointers: { i: 6, k: 3 }, highlight: { skip: [6], compare: [2] }, vars: { k: 3 }, note: "2 = nums[k-1] → лишний дубль, пропуск" },
        { array: [0, 1, 2, 3, 1, 2, 2, 3, 3, 4], pointers: { i: 7, k: 4 }, highlight: { write: [3], compare: [2] }, vars: { k: 4 }, note: "3 ≠ nums[k-1] = 2 → пишем в nums[3], k++" },
        { array: [0, 1, 2, 3, 1, 2, 2, 3, 3, 4], pointers: { i: 8, k: 4 }, highlight: { skip: [8], compare: [3] }, vars: { k: 4 }, note: "3 = nums[k-1] → лишний дубль, пропуск" },
        { array: [0, 1, 2, 3, 4, 2, 2, 3, 3, 4], pointers: { i: 9, k: 5 }, highlight: { write: [4], compare: [3], done: [0, 1, 2, 3, 4] }, vars: { k: 5 }, note: "4 ≠ nums[k-1] = 3 → пишем в nums[4], k++. Ответ: k = 5" },
      ],
    },
    {
      type: "choice",
      question: "Почему k начинается с 1, а не с 0?",
      options: [
        "nums[0] всегда уникален и уже стоит на своём месте",
        "Так цикл работает быстрее",
        "Иначе k станет равен длине массива",
        "Это ошибка, правильно k = 0",
      ],
      correct: 0,
      explanation:
        "Первому числу не с чем сравниваться — оно точно остаётся. Поэтому первая свободная ячейка для записи — nums[1], а сравнение с nums[k - 1] начинаем со второго элемента.",
    },
    {
      type: "fill-blank",
      code: "let k = 1;\nfor (let i = 1; i < nums.length; i++) {\n  if (nums[i] !== nums[___]) {\n    nums[k] = nums[i];\n    k++;\n  }\n}",
      options: ["k - 1", "k", "k + 1", "0"],
      correct: 0,
      explanation: "Сравниваем с последним записанным хорошим числом — оно лежит в nums[k - 1].",
    },
    {
      type: "predict-output",
      code: "removeDuplicates(nums)",
      input: "nums = [1, 1, 1]",
      options: ["1", "3", "0", "2"],
      correct: 0,
      explanation:
        "Остаётся одна единица: k стартует с 1, а все следующие числа равны nums[k - 1]. Ответ k = 1.",
    },
    {
      type: "find-bug",
      code: [
        "function removeDuplicates(nums) {",
        "  let k = 0;",
        "  for (let i = 1; i < nums.length; i++) {",
        "    if (nums[i] !== nums[k - 1]) {",
        "      nums[k] = nums[i];",
        "      k++;",
        "    }",
        "  }",
        "  return k;",
        "}",
      ],
      bugLine: 1,
      fixed: "  let k = 1;",
      explanation:
        "При k = 0 первое сравнение идёт с nums[-1] — это undefined, и nums[1] затирает nums[0]. На [1, 2, 3] такой код вернёт 2. Первое число всегда хорошее, поэтому k = 1.",
    },
    {
      type: "order-lines",
      lines: [
        "function removeDuplicates(nums) {",
        "  let k = 1;",
        "  for (let i = 1; i < nums.length; i++) {",
        "    if (nums[i] !== nums[k - 1]) {",
        "      nums[k] = nums[i];",
        "      k++;",
        "    }",
        "  }",
        "  return k;",
        "}",
      ],
      explanation:
        "O(n) по времени, O(1) по памяти. Шаблон тот же, что в Remove Element, — поменялось только условие.",
    },
  ],
};

export const lesson80: Lesson = {
  id: "tp-80",
  title: "Remove Duplicates from Sorted Array II",
  leetcode: { id: 80, slug: "remove-duplicates-from-sorted-array-ii", difficulty: "Medium" },
  xp: 20,
  interview: {
    brute:
      "Посчитать, сколько раз встречается каждое число, и собрать новый массив, оставляя не больше двух копий. O(n) памяти.",
    optimal:
      "Read/write указатели. Число хорошее, если оно не равно nums[k - 2]: если совпало с числом за две позиции до k, две копии уже записаны. Старт k = 2, массив из n ≤ 2 элементов возвращаем как есть. Для N копий — сравнение с nums[k - N].",
    time: "O(n) — один проход по массиву",
    space: "O(1) — только два указателя",
  },
  exercises: [
    {
      type: "theory",
      title: "Не больше двух копий",
      body: "Теперь каждое число можно оставить дважды. Смотрим не на последнее записанное, а на предпоследнее — nums[k - 2]. Если nums[i] с ним совпадает, две копии уже есть, и это лишний дубль. Первые два числа всегда хорошие: k = 2, а если n ≤ 2 — сразу возвращаем n.",
      mascot: "thinking",
    },
    {
      type: "visualize",
      title: "nums = [1,1,1,2,2,3]",
      steps: [
        { array: [1, 1, 1, 2, 2, 3], pointers: { i: 2, k: 2 }, highlight: { done: [0, 1] }, vars: { k: 2 }, note: "Первые 2 числа всегда хорошие: k = 2" },
        { array: [1, 1, 1, 2, 2, 3], pointers: { i: 2, k: 2 }, highlight: { skip: [2], compare: [0] }, vars: { k: 2 }, note: "1 = nums[k-2] → лишний дубль, пропуск" },
        { array: [1, 1, 2, 2, 2, 3], pointers: { i: 3, k: 3 }, highlight: { write: [2], compare: [0] }, vars: { k: 3 }, note: "2 ≠ nums[k-2] = 1 → пишем в nums[2], k++" },
        { array: [1, 1, 2, 2, 2, 3], pointers: { i: 4, k: 4 }, highlight: { write: [3], compare: [1] }, vars: { k: 4 }, note: "2 ≠ nums[k-2] = 1 → пишем в nums[3], k++" },
        { array: [1, 1, 2, 2, 3, 3], pointers: { i: 5, k: 5 }, highlight: { write: [4], compare: [2], done: [0, 1, 2, 3, 4] }, vars: { k: 5 }, note: "3 ≠ nums[k-2] = 2 → пишем в nums[4], k++. Ответ: k = 5" },
      ],
    },
    {
      type: "fill-blank",
      code: "if (n <= 2) return n;\nlet k = 2;\nfor (let i = 2; i < n; i++) {\n  if (nums[i] !== nums[k - ___]) {\n    nums[k] = nums[i];\n    k++;\n  }\n}",
      options: ["2", "1", "3", "0"],
      correct: 0,
      explanation:
        "Сравниваем с числом за две позиции до k. Если оно такое же, две копии уже записаны.",
    },
    {
      type: "choice",
      question: "Почему сравниваем с nums[k - 2], а не с nums[i - 2]?",
      options: [
        "Ячейки до i могли быть перезаписаны, а nums[k - 2] — это то, что мы реально оставили",
        "nums[i - 2] может выйти за границы массива",
        "Разницы нет, это дело вкуса",
        "nums[k - 2] читается быстрее",
      ],
      correct: 0,
      explanation:
        "Мы пишем в тот же массив, и к моменту чтения в nums[i - 2] может лежать уже другое число. Хвост хорошей части — nums[k - 1], nums[k - 2] — мы контролируем сами. Поэтому и в задаче 26 правильнее думать через nums[k - 1], а не через nums[i - 1]: так решение обобщается.",
    },
    {
      type: "choice",
      question: "Нужно оставить не больше трёх копий. С чем сравниваем nums[i]?",
      options: ["nums[k - 3]", "nums[k - 1]", "nums[i - 3]", "nums[k + 3]"],
      correct: 0,
      explanation:
        "Обобщение: N копий → сравнение с nums[k - N] и старт k = N. Задача 26 — это N = 1, задача 80 — N = 2.",
    },
    {
      type: "predict-output",
      code: "removeDuplicates(nums)",
      input: "nums = [1, 1]",
      options: ["2", "1", "0", "Ошибка"],
      correct: 0,
      explanation:
        "n ≤ 2 → сразу возвращаем n. Два числа всегда допустимы, даже одинаковые.",
    },
    {
      type: "find-bug",
      code: [
        "function removeDuplicates(nums) {",
        "  const n = nums.length;",
        "  if (n <= 2) return n;",
        "  let k = 2;",
        "  for (let i = 2; i < n; i++) {",
        "    if (nums[i] !== nums[i - 2]) {",
        "      nums[k] = nums[i];",
        "      k++;",
        "    }",
        "  }",
        "  return k;",
        "}",
      ],
      bugLine: 5,
      fixed: "    if (nums[i] !== nums[k - 2]) {",
      explanation:
        "nums[i - 2] мог быть уже перезаписан. На [1, 1, 1, 2, 2, 3] такой код вернёт 4 вместо 5: вторая двойка сравнится с двойкой, которую мы сами туда записали.",
    },
    {
      type: "order-lines",
      lines: [
        "function removeDuplicates(nums) {",
        "  const n = nums.length;",
        "  if (n <= 2) return n;",
        "  let k = 2;",
        "  for (let i = 2; i < n; i++) {",
        "    if (nums[i] !== nums[k - 2]) {",
        "      nums[k] = nums[i];",
        "      k++;",
        "    }",
        "  }",
        "  return k;",
        "}",
      ],
      // let k = 2 можно объявить и раньше: до проверки n или даже до const n.
      accept: [
        [0, 1, 3, 2, 4, 5, 6, 7, 8, 9, 10, 11],
        [0, 3, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11],
      ],
      explanation:
        "O(n) по времени, O(1) по памяти. Для N копий меняются только две цифры: k = N и nums[k - N].",
    },
  ],
};

export const lesson88: Lesson = {
  id: "tp-88",
  title: "Merge Sorted Array",
  leetcode: { id: 88, slug: "merge-sorted-array", difficulty: "Easy" },
  xp: 15,
  interview: {
    brute:
      "Скопировать nums2 в хвост nums1 и отсортировать: nums1.sort((a, b) => a - b). Это O((m + n) log(m + n)). Без компаратора sort сломается — он сортирует числа как строки.",
    optimal:
      "Три указателя с конца: i = m - 1, j = n - 1, k = m + n - 1. Большее из nums1[i] и nums2[j] пишем в nums1[k]. Идём с конца, потому что там пустые ячейки и мы не затираем непрочитанное. Цикл while (j >= 0): когда nums2 кончился, остаток nums1 уже на месте.",
    time: "O(m + n) — один проход",
    space: "O(1) — три указателя",
  },
  exercises: [
    {
      type: "theory",
      title: "Сливаем с конца",
      body: "В nums1 длиной m + n сначала идут m настоящих чисел, потом n нулей-заглушек. Ставим три указателя с конца: i = m - 1 (последнее число nums1), j = n - 1 (последнее nums2), k = m + n - 1 (куда писать). Большее из nums1[i] и nums2[j] пишем в nums1[k] и сдвигаем указатели. Цикл идёт, пока не кончится nums2: while (j >= 0).",
      mascot: "thinking",
    },
    {
      type: "visualize",
      title: "nums1 = [1,2,3,0,0,0], m = 3; nums2 = [2,5,6], n = 3",
      steps: [
        { array: [1, 2, 3, 0, 0, 0], pointers: { i: 2, k: 5 }, label: "nums1", secondary: { label: "nums2", array: [2, 5, 6], pointers: { j: 2 } }, vars: { i: 2, j: 2, k: 5 }, note: "Три указателя с конца: i и j — последние настоящие числа, k — последняя ячейка nums1" },
        { array: [1, 2, 3, 0, 0, 0], pointers: { i: 2, k: 5 }, label: "nums1", highlight: { compare: [2] }, secondary: { label: "nums2", array: [2, 5, 6], pointers: { j: 2 }, highlight: { compare: [2] } }, vars: { i: 2, j: 2, k: 5 }, note: "nums1[i] = 3 ≤ nums2[j] = 6 → пишем nums2[j] в nums1[k]" },
        { array: [1, 2, 3, 0, 0, 6], pointers: { i: 2, k: 4 }, label: "nums1", highlight: { write: [5] }, secondary: { label: "nums2", array: [2, 5, 6], pointers: { j: 1 }, highlight: { skip: [2] } }, vars: { i: 2, j: 1, k: 4 }, note: "nums1[5] = 6, j--, k--" },
        { array: [1, 2, 3, 0, 0, 6], pointers: { i: 2, k: 4 }, label: "nums1", highlight: { compare: [2] }, secondary: { label: "nums2", array: [2, 5, 6], pointers: { j: 1 }, highlight: { skip: [2], compare: [1] } }, vars: { i: 2, j: 1, k: 4 }, note: "nums1[i] = 3 ≤ nums2[j] = 5 → пишем nums2[j] в nums1[k]" },
        { array: [1, 2, 3, 0, 5, 6], pointers: { i: 2, k: 3 }, label: "nums1", highlight: { write: [4] }, secondary: { label: "nums2", array: [2, 5, 6], pointers: { j: 0 }, highlight: { skip: [2, 1] } }, vars: { i: 2, j: 0, k: 3 }, note: "nums1[4] = 5, j--, k--" },
        { array: [1, 2, 3, 0, 5, 6], pointers: { i: 2, k: 3 }, label: "nums1", highlight: { compare: [2] }, secondary: { label: "nums2", array: [2, 5, 6], pointers: { j: 0 }, highlight: { skip: [2, 1], compare: [0] } }, vars: { i: 2, j: 0, k: 3 }, note: "nums1[i] = 3 > nums2[j] = 2 → большее пишем в nums1[k]" },
        { array: [1, 2, 3, 3, 5, 6], pointers: { i: 1, k: 2 }, label: "nums1", highlight: { write: [3] }, secondary: { label: "nums2", array: [2, 5, 6], pointers: { j: 0 }, highlight: { skip: [2, 1] } }, vars: { i: 1, j: 0, k: 2 }, note: "nums1[3] = 3, i--, k--" },
        { array: [1, 2, 3, 3, 5, 6], pointers: { i: 1, k: 2 }, label: "nums1", highlight: { compare: [1] }, secondary: { label: "nums2", array: [2, 5, 6], pointers: { j: 0 }, highlight: { skip: [2, 1], compare: [0] } }, vars: { i: 1, j: 0, k: 2 }, note: "nums1[i] = 2 ≤ nums2[j] = 2 → пишем nums2[j] в nums1[k]" },
        { array: [1, 2, 2, 3, 5, 6], pointers: { i: 1, k: 1 }, label: "nums1", highlight: { write: [2], done: [0, 1, 2, 3, 4, 5] }, secondary: { label: "nums2", array: [2, 5, 6], pointers: { j: -1 }, highlight: { skip: [2, 1, 0] } }, vars: { i: 1, j: -1, k: 1 }, note: "nums1[2] = 2, j--, k--. j < 0 → цикл окончен, nums1 отсортирован" },
      ],
    },
    {
      type: "choice",
      question: "Почему заполняем nums1 с конца, а не с начала?",
      options: [
        "С начала мы затёрли бы ещё не прочитанные числа nums1",
        "С конца лучше асимптотика",
        "Так требует условие задачи",
        "С начала нельзя сравнивать числа",
      ],
      correct: 0,
      explanation:
        "В конце nums1 лежат нули-заглушки, туда писать безопасно. Если писать с начала, число из nums2 затрёт число nums1, которое мы ещё не прочитали.",
    },
    {
      type: "fill-blank",
      code: "while (j ___ 0) {\n  if (i >= 0 && nums1[i] > nums2[j]) {\n    nums1[k] = nums1[i];\n    i--;\n  } else {\n    nums1[k] = nums2[j];\n    j--;\n  }\n  k--;\n}",
      options: [">=", ">", "<", "==="],
      correct: 0,
      explanation:
        "Работаем, пока в nums2 есть числа, включая nums2[0]. Если nums2 кончился, оставшиеся числа nums1 уже стоят на своих местах.",
    },
    {
      type: "choice",
      question: "Зачем в условии проверка i >= 0?",
      options: [
        "Когда числа nums1 кончились, i = -1, и без проверки мы читаем несуществующий nums1[-1]",
        "Чтобы цикл работал быстрее",
        "Чтобы не выйти за границы nums2",
        "Чтобы k не стал отрицательным",
      ],
      correct: 0,
      explanation:
        "При i < 0 все числа nums1 уже разложены — остаётся переносить nums2. В JS nums1[-1] — это undefined, а undefined > число даёт false, так что код сработал бы и без проверки. Но это случайность языка: в Java или C++ это выход за границы массива. Явная проверка показывает интервьюеру, что ты думаешь о краевых случаях.",
    },
    {
      type: "theory",
      title: "Брутфорс и ловушка sort",
      body: "Самое простое решение: скопировать nums2 в хвост nums1 и отсортировать. Это O((m + n) log(m + n)) — хуже, чем O(m + n). И осторожно: sort() без компаратора сравнивает элементы как строки.",
      code: "for (let j = 0; j < n; j++) nums1[m + j] = nums2[j];\nnums1.sort((a, b) => a - b);",
      mascot: "idle",
    },
    {
      type: "predict-output",
      code: "[10, 9, 1].sort()",
      input: "sort без компаратора",
      options: ["[1, 10, 9]", "[1, 9, 10]", "[10, 9, 1]", "[9, 10, 1]"],
      correct: 0,
      explanation:
        "Без компаратора sort() превращает числа в строки и сравнивает посимвольно: '1' < '10' < '9'. Для чисел всегда пиши sort((a, b) => a - b).",
    },
    {
      type: "find-bug",
      code: [
        "function merge(nums1, m, nums2, n) {",
        "  let i = m - 1, j = n - 1, k = m + n - 1;",
        "  while (j >= 0) {",
        "    if (i >= 0 && nums1[i] < nums2[j]) {",
        "      nums1[k] = nums1[i];",
        "      i--;",
        "    } else {",
        "      nums1[k] = nums2[j];",
        "      j--;",
        "    }",
        "    k--;",
        "  }",
        "}",
      ],
      bugLine: 3,
      fixed: "    if (i >= 0 && nums1[i] > nums2[j]) {",
      explanation:
        "Заполняем с конца, значит в nums1[k] должно попасть БОЛЬШЕЕ из двух чисел. Со знаком < в конец уезжает меньшее, и массив получается неотсортированным.",
    },
    {
      type: "order-lines",
      lines: [
        "function merge(nums1, m, nums2, n) {",
        "  let i = m - 1, j = n - 1, k = m + n - 1;",
        "  while (j >= 0) {",
        "    if (i >= 0 && nums1[i] > nums2[j]) {",
        "      nums1[k] = nums1[i];",
        "      i--;",
        "    } else {",
        "      nums1[k] = nums2[j];",
        "      j--;",
        "    }",
        "    k--;",
        "  }",
        "}",
      ],
      explanation: "O(m + n) по времени, O(1) по памяти. Функция ничего не возвращает — меняет nums1 на месте.",
    },
  ],
};

export const IS_ALNUM = [
  "function isAlnum(c) {",
  "  c = c.toLowerCase();",
  "  return (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9');",
  "}",
].join("\n");

export const lesson125: Lesson = {
  id: "tp-125",
  title: "Valid Palindrome",
  leetcode: { id: 125, slug: "valid-palindrome", difficulty: "Easy" },
  xp: 15,
  interview: {
    brute:
      "Очистить строку: s.toLowerCase().replace(/[^a-z0-9]/g, '') и сравнить с её развёрнутой копией. Просто, но O(n) по памяти.",
    optimal:
      "Два указателя навстречу по исходной строке. Не буквы и не цифры пропускаем через continue, буквы сравниваем в toLowerCase(). Разошлись — false, встретились — true.",
    time: "O(n) — каждый символ смотрим один раз",
    space: "O(1) — два указателя, без копии строки",
  },
  exercises: [
    {
      type: "theory",
      title: "Указатели навстречу",
      body: "l стартует слева, r — справа, и они идут навстречу, пока l < r. Символы, которые не буквы и не цифры, пропускаем: двигаем указатель и делаем continue. Буквы сравниваем в toLowerCase(), чтобы 'T' и 't' считались равными.",
      mascot: "thinking",
    },
    {
      type: "visualize",
      title: 's = "Taco cat!"',
      steps: [
        { array: ["T", "a", "c", "o", " ", "c", "a", "t", "!"], pointers: { l: 0, r: 8 }, vars: { l: 0, r: 8 }, note: "l — в начале, r — в конце. Идём навстречу" },
        { array: ["T", "a", "c", "o", " ", "c", "a", "t", "!"], pointers: { l: 0, r: 8 }, highlight: { skip: [8] }, vars: { l: 0, r: 8 }, note: "'!' — не буква и не цифра → r--, continue" },
        { array: ["T", "a", "c", "o", " ", "c", "a", "t", "!"], pointers: { l: 0, r: 7 }, highlight: { compare: [0, 7] }, vars: { l: 0, r: 7 }, note: "'T' и 't' → в toLowerCase 't' = 't', l++ и r--" },
        { array: ["T", "a", "c", "o", " ", "c", "a", "t", "!"], pointers: { l: 1, r: 6 }, highlight: { compare: [1, 6], done: [0, 7] }, vars: { l: 1, r: 6 }, note: "'a' и 'a' → в toLowerCase 'a' = 'a', l++ и r--" },
        { array: ["T", "a", "c", "o", " ", "c", "a", "t", "!"], pointers: { l: 2, r: 5 }, highlight: { compare: [2, 5], done: [0, 7, 1, 6] }, vars: { l: 2, r: 5 }, note: "'c' и 'c' → в toLowerCase 'c' = 'c', l++ и r--" },
        { array: ["T", "a", "c", "o", " ", "c", "a", "t", "!"], pointers: { l: 3, r: 4 }, highlight: { skip: [4], done: [0, 7, 1, 6, 2, 5] }, vars: { l: 3, r: 4 }, note: "' ' — не буква и не цифра → r--, continue" },
        { array: ["T", "a", "c", "o", " ", "c", "a", "t", "!"], pointers: { l: 3, r: 3 }, highlight: { done: [0, 1, 2, 5, 6, 7] }, vars: { l: 3, r: 3 }, note: "l ≥ r → указатели встретились, return true" },
      ],
    },
    {
      type: "theory",
      title: "Хелпер isAlnum",
      body: "Буква это или цифра, можно проверить сравнением символов: строки в JS сравниваются по кодам, поэтому c >= 'a' && c <= 'z' значит «c — маленькая латинская буква». Есть и вариант с regex: /[a-z0-9]/i.test(c).",
      code: IS_ALNUM,
      mascot: "idle",
    },
    {
      type: "fill-blank",
      code: "function isAlnum(c) {\n  c = c.toLowerCase();\n  return (c >= 'a' && c <= 'z') || (c >= '0' && c <= ___);\n}",
      options: ["'9'", "'z'", "9", "'0'"],
      correct: 0,
      explanation:
        "Цифры — тоже символы, от '0' до '9'. Сравниваем со строкой '9', а не с числом 9.",
    },
    {
      type: "choice",
      question: "Чем плох вариант s.toLowerCase().replace(/[^a-z0-9]/g, '')?",
      options: [
        "Он создаёт новую строку — это O(n) по памяти",
        "Он работает за O(n²)",
        "Он не учитывает цифры",
        "Ничем, он лучше двух указателей",
      ],
      correct: 0,
      explanation:
        "Регулярку проще читать, но она копирует строку. Два указателя по исходной строке — O(1) памяти. На собесе стоит назвать оба варианта.",
    },
    {
      type: "predict-output",
      code: "isPalindrome(s)",
      input: 's = " "',
      options: ["true", "false", "Ошибка", "undefined"],
      correct: 0,
      explanation:
        "Без небуквенных символов строка пустая, а пустая строка — палиндром. Здесь l = r = 0, условие l < r сразу ложно, и мы возвращаем true.",
    },
    {
      type: "find-bug",
      code: [
        "function isPalindrome(s) {",
        "  let l = 0, r = s.length - 1;",
        "  while (l < r) {",
        "    if (!isAlnum(s[l])) { l++; break; }",
        "    if (!isAlnum(s[r])) { r--; continue; }",
        "    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;",
        "    l++; r--;",
        "  }",
        "  return true;",
        "}",
      ],
      bugLine: 3,
      fixed: "    if (!isAlnum(s[l])) { l++; continue; }",
      explanation:
        "break выходит из цикла целиком, и функция сразу вернёт true — например, для \".ab\", хотя это не палиндром. Нужен continue: пропустить символ и продолжить сравнение.",
    },
    {
      type: "order-lines",
      lines: [
        "function isPalindrome(s) {",
        "  let l = 0, r = s.length - 1;",
        "  while (l < r) {",
        "    if (!isAlnum(s[l])) { l++; continue; }",
        "    if (!isAlnum(s[r])) { r--; continue; }",
        "    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;",
        "    l++; r--;",
        "  }",
        "  return true;",
        "}",
      ],
      // Пропуски слева и справа независимы, их можно поменять местами.
      accept: [[0, 1, 2, 4, 3, 5, 6, 7, 8, 9]],
      explanation: "O(n) по времени, O(1) по памяти. Хелпер isAlnum — из урока выше.",
    },
  ],
};

export const REVERSE = [
  "function reverse(nums, l, r) {",
  "  while (l < r) {",
  "    const temp = nums[l];",
  "    nums[l] = nums[r];",
  "    nums[r] = temp;",
  "    l++;",
  "    r--;",
  "  }",
  "}",
].join("\n");

export const lesson189: Lesson = {
  id: "tp-189",
  title: "Rotate Array",
  leetcode: { id: 189, slug: "rotate-array", difficulty: "Medium" },
  xp: 20,
  interview: {
    brute:
      "Новый массив: res[(i + k) % n] = nums[i], потом копируем res обратно в nums. O(n) по времени и O(n) по памяти.",
    optimal:
      "Сначала k = k % n. Потом три разворота на месте: весь массив, первые k, остальные. Разворот — два указателя навстречу и swap (через temp или деструктуризацию).",
    time: "O(n) — каждый элемент меняется местами не больше двух раз",
    space: "O(1) — всё на месте",
  },
  exercises: [
    {
      type: "theory",
      title: "Брутфорс: новый массив",
      body: "Сдвиг вправо на k: элемент с индексом i переезжает на (i + k) % n. Остаток от деления на n заворачивает хвост массива в начало. Пишем всё в новый массив res и копируем обратно — работает, но тратит O(n) памяти.",
      mascot: "thinking",
    },
    {
      type: "visualize",
      title: "nums = [1,2,3,4,5,6,7], k = 3 → res",
      steps: [
        { array: [1, 2, 3, 4, 5, 6, 7], pointers: { i: -1 }, label: "nums", secondary: { label: "res", array: ["", "", "", "", "", "", ""], pointers: { t: -1 } }, vars: { k: 3 }, note: "res — новый массив длины n = 7. Каждый nums[i] едет на (i + k) % n" },
        { array: [1, 2, 3, 4, 5, 6, 7], pointers: { i: 0 }, label: "nums", highlight: { compare: [0] }, secondary: { label: "res", array: ["", "", "", 1, "", "", ""], pointers: { t: 3 }, highlight: { write: [3] } }, vars: { i: 0, "(i + k) % n": 3 }, note: "(0 + 3) % 7 = 3 → res[3] = 1" },
        { array: [1, 2, 3, 4, 5, 6, 7], pointers: { i: 1 }, label: "nums", highlight: { compare: [1] }, secondary: { label: "res", array: ["", "", "", 1, 2, "", ""], pointers: { t: 4 }, highlight: { write: [4] } }, vars: { i: 1, "(i + k) % n": 4 }, note: "(1 + 3) % 7 = 4 → res[4] = 2" },
        { array: [1, 2, 3, 4, 5, 6, 7], pointers: { i: 2 }, label: "nums", highlight: { compare: [2] }, secondary: { label: "res", array: ["", "", "", 1, 2, 3, ""], pointers: { t: 5 }, highlight: { write: [5] } }, vars: { i: 2, "(i + k) % n": 5 }, note: "(2 + 3) % 7 = 5 → res[5] = 3" },
        { array: [1, 2, 3, 4, 5, 6, 7], pointers: { i: 3 }, label: "nums", highlight: { compare: [3] }, secondary: { label: "res", array: ["", "", "", 1, 2, 3, 4], pointers: { t: 6 }, highlight: { write: [6] } }, vars: { i: 3, "(i + k) % n": 6 }, note: "(3 + 3) % 7 = 6 → res[6] = 4" },
        { array: [1, 2, 3, 4, 5, 6, 7], pointers: { i: 4 }, label: "nums", highlight: { compare: [4] }, secondary: { label: "res", array: [5, "", "", 1, 2, 3, 4], pointers: { t: 0 }, highlight: { write: [0] } }, vars: { i: 4, "(i + k) % n": 0 }, note: "(4 + 3) % 7 = 0 → res[0] = 5" },
        { array: [1, 2, 3, 4, 5, 6, 7], pointers: { i: 5 }, label: "nums", highlight: { compare: [5] }, secondary: { label: "res", array: [5, 6, "", 1, 2, 3, 4], pointers: { t: 1 }, highlight: { write: [1] } }, vars: { i: 5, "(i + k) % n": 1 }, note: "(5 + 3) % 7 = 1 → res[1] = 6" },
        { array: [1, 2, 3, 4, 5, 6, 7], pointers: { i: 6 }, label: "nums", highlight: { compare: [6] }, secondary: { label: "res", array: [5, 6, 7, 1, 2, 3, 4], pointers: { t: 2 }, highlight: { write: [2], done: [0, 1, 2, 3, 4, 5, 6] } }, vars: { i: 6, "(i + k) % n": 2 }, note: "(6 + 3) % 7 = 2 → res[2] = 7. Готово, но res занял O(n) памяти" },
      ],
    },
    {
      type: "predict-output",
      code: "(i + k) % n",
      input: "i = 5, k = 3, n = 7",
      options: ["1", "8", "0", "5"],
      correct: 0,
      explanation: "5 + 3 = 8, а 8 % 7 = 1. Элемент из конца массива уехал в начало.",
    },
    {
      type: "theory",
      title: "Три разворота",
      body: "Можно без лишней памяти. Сначала k = k % n: сдвиг на n возвращает массив на место. Потом три разворота: весь массив → первые k → остальные. Разворот — это два указателя навстречу и swap. Swap можно сделать через temp или деструктуризацией: [nums[l], nums[r]] = [nums[r], nums[l]].",
      code: REVERSE,
      mascot: "thinking",
    },
    {
      type: "visualize",
      title: "nums = [1,2,3,4,5,6,7], k = 3",
      steps: [
        { array: [1, 2, 3, 4, 5, 6, 7], pointers: { l: -1, r: -1 }, vars: { k: 3 }, note: "k = k % n = 3. План: развернуть весь → первые k → остальные" },
        { array: [7, 2, 3, 4, 5, 6, 1], pointers: { l: 0, r: 6 }, highlight: { write: [0, 6] }, vars: { l: 0, r: 6 }, note: "Весь массив: swap nums[0] и nums[6]" },
        { array: [7, 6, 3, 4, 5, 2, 1], pointers: { l: 1, r: 5 }, highlight: { write: [1, 5] }, vars: { l: 1, r: 5 }, note: "Весь массив: swap nums[1] и nums[5]" },
        { array: [7, 6, 5, 4, 3, 2, 1], pointers: { l: 2, r: 4 }, highlight: { write: [2, 4] }, vars: { l: 2, r: 4 }, note: "Весь массив: swap nums[2] и nums[4]" },
        { array: [5, 6, 7, 4, 3, 2, 1], pointers: { l: 0, r: 2 }, highlight: { write: [0, 2] }, vars: { l: 0, r: 2 }, note: "Первые k = 3: swap nums[0] и nums[2]" },
        { array: [5, 6, 7, 1, 3, 2, 4], pointers: { l: 3, r: 6 }, highlight: { write: [3, 6], done: [0, 1, 2] }, vars: { l: 3, r: 6 }, note: "Остальные: swap nums[3] и nums[6]" },
        { array: [5, 6, 7, 1, 2, 3, 4], pointers: { l: 4, r: 5 }, highlight: { write: [4, 5], done: [0, 1, 2, 3, 4, 5, 6] }, vars: { l: 4, r: 5 }, note: "Остальные: swap nums[4] и nums[5]. Итог: [5, 6, 7, 1, 2, 3, 4]" },
      ],
    },
    {
      type: "choice",
      question: "Зачем нужна строка k = k % n?",
      options: [
        "k может быть больше n, а сдвиг на n возвращает массив на место",
        "Чтобы k стал чётным",
        "Чтобы избежать отрицательных индексов",
        "Это микрооптимизация скорости",
      ],
      correct: 0,
      explanation:
        "Например, n = 7 и k = 10: сдвиг на 10 — то же самое, что на 3. Без % n разворот «первых k» вылез бы за границы массива.",
    },
    {
      type: "fill-blank",
      code: "while (l < r) {\n  [nums[l], nums[r]] = [nums[r], ___];\n  l++;\n  r--;\n}",
      options: ["nums[l]", "nums[r]", "l", "r"],
      correct: 0,
      explanation:
        "Справа собирается пара [nums[r], nums[l]], слева она раскладывается по местам. Swap без temp.",
    },
    {
      type: "find-bug",
      code: [
        "function rotate(nums, k) {",
        "  const n = nums.length;",
        "  k = k % n;",
        "  reverse(nums, 0, n - 1);",
        "  reverse(nums, 0, k);",
        "  reverse(nums, k, n - 1);",
        "}",
      ],
      bugLine: 4,
      fixed: "  reverse(nums, 0, k - 1);",
      explanation:
        "reverse принимает индексы включительно. Первые k элементов — это индексы от 0 до k - 1. С k элемент nums[k] развернётся дважды, и массив сдвинется неправильно.",
    },
    {
      type: "order-lines",
      lines: [
        "function rotate(nums, k) {",
        "  const n = nums.length;",
        "  k = k % n;",
        "  reverse(nums, 0, n - 1);",
        "  reverse(nums, 0, k - 1);",
        "  reverse(nums, k, n - 1);",
        "}",
      ],
      // k % n не нужен первому развороту, а два последних разворота не зависят друг от друга.
      accept: [
        [0, 1, 2, 3, 5, 4, 6],
        [0, 1, 3, 2, 4, 5, 6],
        [0, 1, 3, 2, 5, 4, 6],
      ],
      explanation: "O(n) по времени, O(1) по памяти. Хелпер reverse — из теории выше.",
    },
  ],
};

export const twoPointers: Island = {
  id: "two-pointers",
  title: "Два указателя",
  emoji: "👉👈",
  color: "#7C5CFF",
  summary: [
    "Read/write (27, 26, 80): i читает всё, k пишет только хорошие. Меняется лишь условие: !== val, !== nums[k - 1], !== nums[k - N].",
    "С конца (88): когда пишем в тот же массив, начинаем с пустого хвоста, чтобы не затереть непрочитанное.",
    "Навстречу (125, 189): l и r идут друг к другу — проверка палиндрома, разворот массива.",
    "Почти всегда O(n) по времени и O(1) по памяти — в этом и смысл паттерна.",
  ].join("\n"),
  lessons: [lesson27, lesson26, lesson80, lesson88, lesson125, lesson189],
};
