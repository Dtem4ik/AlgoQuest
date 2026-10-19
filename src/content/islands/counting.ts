import type { Island, Lesson } from "@/lib/types";

export const lesson169: Lesson = {
  id: "cd-169",
  title: "Majority Element",
  leetcode: { id: 169, slug: "majority-element", difficulty: "Easy" },
  xp: 15,
  interview: {
    brute:
      "Посчитать частоты в Map и вернуть число, которое встретилось больше n / 2 раз. O(n) по времени, но O(n) по памяти. Ещё вариант — отсортировать и взять nums[n / 2]: O(n log n).",
    optimal:
      "Голосование Бойера–Мура: держим кандидата и счётчик. Своё число — count++, чужое — count--, счётчик обнулился — берём нового кандидата. Большинство встречается больше n / 2 раз, поэтому переживёт все «стычки».",
    time: "O(n) — один проход",
    space: "O(1) — кандидат и счётчик",
  },
  exercises: [
    {
      type: "theory",
      title: "Считаем через Map",
      body: "Большинство — число, которое встречается больше n / 2 раз. Самое прямое решение: пройти по массиву и считать частоты в Map. Как только чья-то частота перевалила за половину — это ответ. Работает за O(n), но Map занимает O(n) памяти.",
      code: "const counts = new Map();\nfor (const num of nums) {\n  counts.set(num, (counts.get(num) ?? 0) + 1);\n  if (counts.get(num) > nums.length / 2) return num;\n}",
      mascot: "thinking",
    },
    {
      type: "fill-blank",
      code: "const counts = new Map();\nfor (const num of nums) {\n  counts.set(num, (counts.get(num) ?? 0) + 1);\n  if (counts.get(num) > nums.length ___ 2) return num;\n}",
      options: ["/", "*", "%", "-"],
      correct: 0,
      explanation: "Большинство — это больше половины: частота > n / 2.",
    },
    {
      type: "choice",
      question: "Сколько дополнительной памяти тратит решение через Map?",
      options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
      correct: 0,
      explanation:
        "В худшем случае в Map попадает почти каждое число массива. Можно ли без неё? Да — следующая идея.",
    },
    {
      type: "theory",
      title: "Голосование Бойера–Мура",
      body: "Представь битву: каждый чужой убивает одного нашего. Держим кандидата и счётчик. Встретили кандидата — count++, чужого — count--. Счётчик упал до нуля — кандидат погиб, берём следующее число. Наших больше половины, поэтому после всех стычек кандидатом останется именно большинство.",
      mascot: "thinking",
    },
    {
      type: "visualize",
      title: "nums = [2,2,1,1,1,2,2]",
      steps: [
        { array: [2, 2, 1, 1, 1, 2, 2], pointers: { i: -1 }, vars: { candidate: "—", count: 0 }, note: "Кандидата пока нет, count = 0" },
        { array: [2, 2, 1, 1, 1, 2, 2], pointers: { i: 0 }, highlight: { write: [0] }, vars: { candidate: 2, count: 1 }, note: "count = 0 → новый кандидат 2, count = 1" },
        { array: [2, 2, 1, 1, 1, 2, 2], pointers: { i: 1 }, highlight: { compare: [1] }, vars: { candidate: 2, count: 2 }, note: "2 — наш (= кандидат) → count++ = 2" },
        { array: [2, 2, 1, 1, 1, 2, 2], pointers: { i: 2 }, highlight: { skip: [2] }, vars: { candidate: 2, count: 1 }, note: "1 — чужой → убивает одного нашего, count-- = 1" },
        { array: [2, 2, 1, 1, 1, 2, 2], pointers: { i: 3 }, highlight: { skip: [3] }, vars: { candidate: 2, count: 0 }, note: "1 — чужой → убивает одного нашего, count-- = 0" },
        { array: [2, 2, 1, 1, 1, 2, 2], pointers: { i: 4 }, highlight: { write: [4] }, vars: { candidate: 1, count: 1 }, note: "count = 0 → новый кандидат 1, count = 1" },
        { array: [2, 2, 1, 1, 1, 2, 2], pointers: { i: 5 }, highlight: { skip: [5] }, vars: { candidate: 1, count: 0 }, note: "2 — чужой → убивает одного нашего, count-- = 0" },
        { array: [2, 2, 1, 1, 1, 2, 2], pointers: { i: 6 }, highlight: { write: [6], done: [0, 1, 5, 6] }, vars: { candidate: 2, count: 1 }, note: "count = 0 → новый кандидат 2, count = 1. Ответ: 2" },
      ],
    },
    {
      type: "predict-output",
      code: "majorityElement(nums)",
      input: "nums = [3, 3, 4]",
      options: ["3", "4", "null", "Ошибка"],
      correct: 0,
      explanation:
        "3 становится кандидатом, вторая 3 поднимает count до 2, а 4 опускает до 1 — но не до нуля. Кандидат 3 выжил.",
    },
    {
      type: "find-bug",
      code: [
        "function majorityElement(nums) {",
        "  let candidate = null, count = 0;",
        "  for (const num of nums) {",
        "    if (candidate === null) candidate = num;",
        "    count += num === candidate ? 1 : -1;",
        "  }",
        "  return candidate;",
        "}",
      ],
      bugLine: 3,
      fixed: "    if (count === 0) candidate = num;",
      explanation:
        "Кандидат должен меняться каждый раз, когда счётчик обнулился: старый кандидат «погиб». С проверкой candidate === null кандидат выбирается один раз — на [1, 3, 3] вернётся 1.",
    },
    {
      type: "order-lines",
      lines: [
        "function majorityElement(nums) {",
        "  let candidate = null, count = 0;",
        "  for (const num of nums) {",
        "    if (count === 0) candidate = num;",
        "    count += num === candidate ? 1 : -1;",
        "  }",
        "  return candidate;",
        "}",
      ],
      explanation: "O(n) по времени, O(1) по памяти. Порядок важен: сначала выбираем кандидата, потом голосуем.",
    },
  ],
};

export const lesson13: Lesson = {
  id: "cd-13",
  title: "Roman to Integer",
  leetcode: { id: 13, slug: "roman-to-integer", difficulty: "Easy" },
  xp: 15,
  interview: {
    brute:
      "Сначала заменить пары-вычитания (IV, IX, XL, XC, CD, CM) по таблице, потом сложить символы. Работает, но это лишний код и лишние проходы по строке.",
    optimal:
      "Объект-словарь значений и один проход: если текущий символ меньше следующего — вычитаем его, иначе прибавляем. На последнем символе value[s[i + 1]] — undefined, сравнение с ним даёт false, и мы прибавляем.",
    time: "O(n) — один проход по строке",
    space: "O(1) — словарь из 7 букв",
  },
  exercises: [
    {
      type: "theory",
      title: "Словарь и сосед справа",
      body: "Значения букв храним в объекте-словаре: value['X'] = 10. Обычно римские цифры просто складываются: XII = 10 + 1 + 1. Но если меньшая цифра стоит перед большей, её вычитают: IV = 5 - 1. Отсюда правило: если текущий символ меньше следующего — вычитаем, иначе прибавляем.",
      code: "const value = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };",
      mascot: "thinking",
    },
    {
      type: "visualize",
      title: 's = "MCMXCIV"',
      steps: [
        { array: ["M", "C", "M", "X", "C", "I", "V"], pointers: { i: -1 }, vars: { total: 0 }, note: "Идём слева направо и смотрим на соседа справа" },
        { array: ["M", "C", "M", "X", "C", "I", "V"], pointers: { i: 0 }, highlight: { compare: [1], write: [0] }, vars: { total: 1000 }, note: "M = 1000 ≥ C = 100 → прибавляем: total = 1000" },
        { array: ["M", "C", "M", "X", "C", "I", "V"], pointers: { i: 1 }, highlight: { compare: [1, 2] }, vars: { total: 900 }, note: "C = 100 < M = 1000 → вычитаем: total = 900" },
        { array: ["M", "C", "M", "X", "C", "I", "V"], pointers: { i: 2 }, highlight: { compare: [3], write: [2] }, vars: { total: 1900 }, note: "M = 1000 ≥ X = 10 → прибавляем: total = 1900" },
        { array: ["M", "C", "M", "X", "C", "I", "V"], pointers: { i: 3 }, highlight: { compare: [3, 4] }, vars: { total: 1890 }, note: "X = 10 < C = 100 → вычитаем: total = 1890" },
        { array: ["M", "C", "M", "X", "C", "I", "V"], pointers: { i: 4 }, highlight: { compare: [5], write: [4] }, vars: { total: 1990 }, note: "C = 100 ≥ I = 1 → прибавляем: total = 1990" },
        { array: ["M", "C", "M", "X", "C", "I", "V"], pointers: { i: 5 }, highlight: { compare: [5, 6] }, vars: { total: 1989 }, note: "I = 1 < V = 5 → вычитаем: total = 1989" },
        { array: ["M", "C", "M", "X", "C", "I", "V"], pointers: { i: 6 }, highlight: { write: [6] }, vars: { total: 1994 }, note: "V = 5, соседа нет (undefined) → прибавляем: total = 1994. Ответ: 1994" },
      ],
    },
    {
      type: "fill-blank",
      code: "for (let i = 0; i < s.length; i++) {\n  if (value[s[i]] ___ value[s[i + 1]]) total -= value[s[i]];\n  else total += value[s[i]];\n}",
      options: ["<", ">", "<=", "==="],
      correct: 0,
      explanation:
        "Вычитаем, только когда следующий символ строго больше. С <= строка II дала бы 0: первая I вычлась бы, хотя одинаковые цифры складываются.",
    },
    {
      type: "choice",
      question: "Почему на последнем символе код не ломается, хотя s[i + 1] не существует?",
      options: [
        "s[i + 1] — undefined, value[undefined] — тоже undefined, а сравнение с undefined даёт false → прибавляем",
        "Цикл не доходит до последнего символа",
        "JavaScript добавляет 0 в конец строки",
        "Последний символ всегда I",
      ],
      correct: 0,
      explanation:
        "Число < undefined — это false, поэтому последний символ всегда прибавляется. В JS это работает само, но на собесе стоит проговорить этот краевой случай вслух.",
    },
    {
      type: "predict-output",
      code: "romanToInt(s)",
      input: 's = "XIV"',
      options: ["14", "16", "4", "15"],
      correct: 0,
      explanation: "X = 10 прибавляем, I < V → вычитаем 1, V = 5 прибавляем: 10 - 1 + 5 = 14.",
    },
    {
      type: "find-bug",
      code: [
        "function romanToInt(s) {",
        "  const value = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };",
        "  let total = 0;",
        "  for (let i = 0; i < s.length; i++) {",
        "    if (value[s[i]] < value[s[i + 1]]) total += value[s[i]];",
        "    else total += value[s[i]];",
        "  }",
        "  return total;",
        "}",
      ],
      bugLine: 4,
      fixed: "    if (value[s[i]] < value[s[i + 1]]) total -= value[s[i]];",
      explanation:
        "В обеих ветках стоит +=, и код просто складывает все цифры: IV даст 6 вместо 4. Если меньший символ стоит перед большим, его нужно вычесть.",
    },
    {
      type: "order-lines",
      lines: [
        "function romanToInt(s) {",
        "  const value = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };",
        "  let total = 0;",
        "  for (let i = 0; i < s.length; i++) {",
        "    if (value[s[i]] < value[s[i + 1]]) total -= value[s[i]];",
        "    else total += value[s[i]];",
        "  }",
        "  return total;",
        "}",
      ],
      // Словарь и total не зависят друг от друга — объявлять можно в любом порядке.
      accept: [[0, 2, 1, 3, 4, 5, 6, 7, 8]],
      explanation: "O(n) по времени, O(1) по памяти: словарь фиксированного размера.",
    },
  ],
};

export const lesson58: Lesson = {
  id: "cd-58",
  title: "Length of Last Word",
  leetcode: { id: 58, slug: "length-of-last-word", difficulty: "Easy" },
  xp: 10,
  interview: {
    brute:
      "s.trim().split(' ').pop().length — коротко, но trim и split создают новую строку и массив слов: O(n) по памяти.",
    optimal:
      "Идём с конца строки в две фазы: сначала пропускаем пробелы в хвосте, потом считаем буквы до следующего пробела или начала строки. Два цикла while и никаких новых строк.",
    time: "O(n) — в худшем случае проходим всю строку",
    space: "O(1) — индекс и счётчик",
  },
  exercises: [
    {
      type: "theory",
      title: "Две фазы с конца",
      body: "Последнее слово удобно искать с конца. Фаза 1: пропускаем пробелы в хвосте строки. Фаза 2: считаем буквы, пока не встретим пробел или не дойдём до начала. Каждая фаза — свой цикл while, и в обоих нужна проверка i >= 0.",
      mascot: "thinking",
    },
    {
      type: "visualize",
      title: 's = "go fly  "',
      steps: [
        { array: ["g", "o", " ", "f", "l", "y", " ", " "], pointers: { i: 7 }, vars: { i: 7, length: 0 }, note: "Начинаем с конца строки: i = s.length - 1" },
        { array: ["g", "o", " ", "f", "l", "y", " ", " "], pointers: { i: 7 }, highlight: { skip: [7] }, vars: { i: 7, length: 0 }, note: "Фаза 1: s[7] — пробел → i--" },
        { array: ["g", "o", " ", "f", "l", "y", " ", " "], pointers: { i: 6 }, highlight: { skip: [7, 6] }, vars: { i: 6, length: 0 }, note: "Фаза 1: s[6] — пробел → i--" },
        { array: ["g", "o", " ", "f", "l", "y", " ", " "], pointers: { i: 5 }, highlight: { skip: [7, 6], write: [5], done: [5] }, vars: { i: 5, length: 1 }, note: "Фаза 2: s[5] = 'y' — буква → length++ = 1, i--" },
        { array: ["g", "o", " ", "f", "l", "y", " ", " "], pointers: { i: 4 }, highlight: { skip: [7, 6], write: [4], done: [5, 4] }, vars: { i: 4, length: 2 }, note: "Фаза 2: s[4] = 'l' — буква → length++ = 2, i--" },
        { array: ["g", "o", " ", "f", "l", "y", " ", " "], pointers: { i: 3 }, highlight: { skip: [7, 6], write: [3], done: [5, 4, 3] }, vars: { i: 3, length: 3 }, note: "Фаза 2: s[3] = 'f' — буква → length++ = 3, i--" },
        { array: ["g", "o", " ", "f", "l", "y", " ", " "], pointers: { i: 2 }, highlight: { skip: [7, 6], done: [5, 4, 3] }, vars: { i: 2, length: 3 }, note: "s[2] — пробел → стоп. Ответ: length = 3" },
      ],
    },
    {
      type: "fill-blank",
      code: "let i = s.length - 1, length = 0;\nwhile (i >= 0 && s[i] ___ ' ') i--;",
      options: ["===", "!==", "<", ">"],
      correct: 0,
      explanation: "Фаза 1 пропускает пробелы: двигаемся, пока под i стоит пробел.",
    },
    {
      type: "choice",
      question: "Чем плох однострочник s.trim().split(' ').pop().length?",
      options: [
        "trim и split создают новую строку и массив — это O(n) памяти",
        "Он ошибается, если в конце строки пробелы",
        "Он работает за O(n²)",
        "pop() меняет исходную строку",
      ],
      correct: 0,
      explanation:
        "Однострочник правильный и читается легко — его можно назвать как первый вариант. Но интервьюер спросит про память, и тут выигрывает проход с конца.",
    },
    {
      type: "predict-output",
      code: "lengthOfLastWord(s)",
      input: 's = "a "',
      options: ["1", "0", "2", "Ошибка"],
      correct: 0,
      explanation: "Фаза 1 пропускает пробел в конце, фаза 2 считает одну букву a и упирается в начало строки (i = -1).",
    },
    {
      type: "find-bug",
      code: [
        "function lengthOfLastWord(s) {",
        "  let i = s.length - 1, length = 0;",
        "  while (i >= 0 && s[i] === ' ') i--;",
        "  while (s[i] !== ' ') {",
        "    length++;",
        "    i--;",
        "  }",
        "  return length;",
        "}",
      ],
      bugLine: 3,
      fixed: "  while (i >= 0 && s[i] !== ' ') {",
      explanation:
        "Если слово стоит в самом начале строки, i уходит в -1. s[-1] — undefined, а undefined !== ' ' — это true, и цикл никогда не остановится. Нужна проверка i >= 0.",
    },
    {
      type: "order-lines",
      lines: [
        "function lengthOfLastWord(s) {",
        "  let i = s.length - 1, length = 0;",
        "  while (i >= 0 && s[i] === ' ') i--;",
        "  while (i >= 0 && s[i] !== ' ') {",
        "    length++;",
        "    i--;",
        "  }",
        "  return length;",
        "}",
      ],
      // length++ и i-- независимы.
      accept: [[0, 1, 2, 3, 5, 4, 6, 7, 8]],
      explanation: "O(n) по времени, O(1) по памяти. Фазы нельзя поменять местами: сначала пробелы, потом буквы.",
    },
  ],
};

export const counting: Island = {
  id: "counting",
  title: "Подсчёт и словари",
  emoji: "🧮",
  color: "#0D9488",
  summary: [
    "Подсчёт через Map или объект: частоты за O(n), но и O(n) памяти.",
    "Бойер–Мур (169): кандидат + счётчик, каждый чужой гасит одного нашего — большинство выживает. O(1) памяти.",
    "Словарь-таблица (13): объект для мгновенного поиска значения, сосед справа решает знак.",
    "Скан с конца (58): две фазы — пропусти лишнее, потом считай. Без новых строк и массивов.",
  ].join("\n"),
  lessons: [lesson169, lesson13, lesson58],
};
