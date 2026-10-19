# AlgoQuest — заметки для Claude

Игровой тренажёр алгоритмов (LeetCode Top Interview 150). Полное ТЗ — `SPEC.md`, работаем строго по этапам из раздела 9: перед этапом показать план и дождаться «ок».

@AGENTS.md

## Стек

Next.js 16 (App Router, `cacheComponents` + `partialPrefetching` включены), React 19, TypeScript strict + `noUncheckedIndexedAccess`, Tailwind v4 (CSS-first, без `tailwind.config`), Framer Motion, Zustand + persist, prism-react-renderer, Vitest. Новые зависимости — только после согласования.

## Команды

- `npm run dev` / `npm run build` / `npm run lint`
- `npm run typecheck` — `next typegen && tsc --noEmit` (типы `LayoutProps`/`PageProps` генерирует Next)
- `npm test` — Vitest, тесты лежат рядом с кодом: `src/**/*.test.ts`

После каждого этапа обязательно: build, lint, typecheck, test без ошибок.

## Структура

```
src/app/                 маршруты; globals.css — токены темы
src/components/ui/       Button (+ buttonClasses для Link), Card, ProgressBar, StatBadge, CodeBlock
src/components/mascot/   Mascot (реакции тела, PNG/SVG), MascotSvg, available-png-states.ts
src/components/ui/Dialog шторка-модалка (выход из урока)
src/components/map/      TopBar, PathMap (дорожка), LessonNode, LessonPopover, IslandHeader
src/components/lesson/   LessonScreen (гейт: гидрация, замок, runKey) → LessonRun (прогон урока),
                         LessonHeader, LessonFooter (Проверить / плашка), ExerciseView (switch по type),
                         exercises/*, OutOfHearts, LessonSummary (+ конфетти), InterviewCard
src/components/dev/      витрина /dev/ui
src/content/islands/*.ts контент, по файлу на остров; content/index.ts валидирует zod и отдаёт getLesson/lessonIds
src/content/*.ts         реплики маскота, подсказки к упражнениям
src/lib/types.ts         модель данных из SPEC §7 (+ Lesson.interview)
src/lib/content/schema.ts zod-схема контента (типы сверены через z.ZodType<T>)
src/lib/engine/          движок урока: lesson.ts (очередь, фазы), check.ts (Answer, проверка), order-lines.ts
                         (перемешивание, отступы), unlock.ts (статусы на карте)
src/lib/viz/steps.ts     хелперы визуализатора: указатели по ячейкам, подсветка, размер ячейки
src/components/viz/      ArrayVisualizer (ячейки, указатели-стрелки через layoutId, Назад/Авто/Шаг), useStepPlayer
src/lib/progress/        чистые функции: dates, hearts, streak, progress (+ тесты)
src/store/progress.ts    Zustand persist (ключ `algoquest-progress`), useProgressHydrated
src/hooks/               useToday (день), useNow (часы раз в секунду), useHearts (сердечки с регеном)
```

## Урок

- **Фазы движка:** `answering → feedback → (answering | finished | out-of-hearts)`. Ошибка: −1 сердечко, упражнение уходит в конец очереди. Упражнения без ответа (theory, пока и visualize) проходятся через `acknowledge`.
- **Точность** — доля оцениваемых упражнений, решённых с первой попытки; «идеально» — без ошибок вообще.
- **Сердечки в уроке** живут в состоянии движка (старт = store с учётом регена), store дублирует `loseHeart`.
- Страница урока серверная: `generateStaticParams` + `notFound()`. `dynamicParams` с cacheComponents недоступен.
- **Ответы** — общий тип `Answer` (`option` | `order` | `line`) в `lib/engine/check.ts`. Стартовый ответ даёт `initialAnswer` (для order-lines перемешивание, вызывается в обработчике события). `visualize` пропускает дальше только после последнего шага.
- **order-lines**: порядок проверяется по тексту строк (одинаковые `}` взаимозаменяемы), отступы считает `indentLevels` по скобкам. Схема требует, чтобы отступы в данных были 2 пробела на уровень. Если независимые строки можно переставить, все другие рабочие порядки перечисляем в `accept` (индексы строк). Перемешивание никогда не выдаёт ни один из верных порядков.
- **Визуализатор**: `VizStep` может иметь второй ряд `secondary` (nums2, res) и подпись `label`. Шаги для новых уроков пишем, честно прогоняя алгоритм, а не руками; итог шага должен совпадать с тем, что вернёт решение.
- **Контент проверяется исполнением**: `src/content/solutions.test.ts` запускает order-lines (и каждый порядок из `accept`) на тест-кейсах, а find-bug проверяет в обе стороны (с фиксом проходит, с багом падает). Хелперы (`IS_ALNUM`, `REVERSE`) подставляются из того же контента. Для каждого нового урока нужно добавить кейсы в `CASES`, иначе тест упадёт. В циклы вставляется счётчик итераций, поэтому зависший код роняет тест, а не вешает его.

## Договорённости

- **Логика отдельно от UI.** Правила (сердечки, стрик, XP, движок урока) — чистые функции в `src/lib/**` с тестами. Store и компоненты только вызывают их.
- **Время и случайность не трогаем при рендере.** Next с `cacheComponents` роняет пререндер на `new Date()`/`Date.now()` в рендере. Дату получаем через `useToday()`, `Date.now()` и `Math.random()` вызываем только в обработчиках событий и экшенах store.
- **Activity.** Next с cacheComponents не размонтирует скрытые маршруты, а прячет их с сохранением состояния. Поэтому при уходе со страницы локальное состояние сбрасываем сами: `runKey` в LessonScreen, закрытие поповера в PathMap. На страницах, которые прячутся, не используем exit-анимации (`AnimatePresence`) для данных из store: в скрытом маршруте они замирают, и старое значение остаётся висеть рядом с новым (так было со StatBadge).
- **Обработчики передаём в JSX-пропсы напрямую.** Если положить колбэк в объект, React Compiler (`react-hooks/purity`) сочтёт, что он может вызываться при рендере, и запретит в нём `Date.now()`.
- **Гидрация.** Данные из store показываем после `useProgressHydrated()`, до этого рендерим плейсхолдер (`StatBadge value={null}`).
- **zod-схема только проверяет** (`refine`), но не трансформирует (`.trim()` и т.п. запрещены): иначе ломаются отступы в коде. Это закреплено тестом.
- **Цвета** — только через токены (`bg-primary`, `text-ink-muted`, `bg-surface`...). Значения в `:root` и `.dark` в `globals.css`. Тёмная тема включается классом `.dark` на `<html>` (переключатель появится на Этапе 3).
- **Объёмная кнопка**: `shadow-[0_4px_0_var(--ledge)]` + `active:translate-y-1 active:shadow-none`. Цвет подложки задаётся переменной `--ledge` в варианте.
- **Анимации**: Framer Motion, 150–300ms, пружины. `MotionConfig reducedMotion="user"` стоит в `app/providers.tsx`. Бесконечные циклы дополнительно выключаем через `useReducedMotion()`.
- **Маскот**: PNG берётся, только если состояние есть в `AVAILABLE_PNG_STATES`, без сканирования файлов. Реплики лежат в `content/mascot-lines.ts`, `pickMascotLine` вызывается в обработчиках.
- **Прогресс**: XP за урок полный в первый раз и половина (floor) за повтор. Сердечки: максимум 5, +1 каждые 5 минут (`HEART_REGEN_MINUTES`); таймер стартует при потере первого сердечка из полного запаса.
- UI на русском, код и термины на английском. В коде лигатуры отключены (`!==` видно как есть).
- Mobile-first: всё проверяем на ширине 375px, без горизонтального скролла.
