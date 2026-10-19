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
src/components/dev/      витрина /dev/ui
src/content/             данные: реплики маскота, позже islands/*.ts
src/lib/types.ts         модель данных из SPEC §7 (+ Lesson.interview)
src/lib/progress/        чистые функции: dates, hearts, streak, progress (+ тесты)
src/store/progress.ts    Zustand persist (ключ `algoquest-progress`), useProgressHydrated
src/hooks/useToday.ts    текущий день на клиенте (null на сервере)
```

## Договорённости

- **Логика отдельно от UI.** Правила (сердечки, стрик, XP, движок урока) — чистые функции в `src/lib/**` с тестами. Store и компоненты только вызывают их.
- **Время и случайность не трогаем при рендере.** Next с `cacheComponents` роняет пререндер на `new Date()`/`Date.now()` в рендере. Дату получаем через `useToday()`, `Date.now()` и `Math.random()` вызываем только в обработчиках событий и экшенах store.
- **Гидрация.** Данные из store показываем после `useProgressHydrated()`, до этого рендерим плейсхолдер (`StatBadge value={null}`).
- **Цвета** — только через токены (`bg-primary`, `text-ink-muted`, `bg-surface`...). Значения в `:root` и `.dark` в `globals.css`. Тёмная тема включается классом `.dark` на `<html>` (переключатель появится на Этапе 3).
- **Объёмная кнопка**: `shadow-[0_4px_0_var(--ledge)]` + `active:translate-y-1 active:shadow-none`. Цвет подложки задаётся переменной `--ledge` в варианте.
- **Анимации**: Framer Motion, 150–300ms, пружины. `MotionConfig reducedMotion="user"` стоит в `app/providers.tsx`. Бесконечные циклы дополнительно выключаем через `useReducedMotion()`.
- **Маскот**: PNG берётся, только если состояние есть в `AVAILABLE_PNG_STATES`, без сканирования файлов. Реплики лежат в `content/mascot-lines.ts`, `pickMascotLine` вызывается в обработчиках.
- **Прогресс**: XP за урок полный в первый раз и половина (floor) за повтор. Сердечки: максимум 5, +1 каждые 30 минут; таймер стартует при потере первого сердечка из полного запаса.
- UI на русском, код и термины на английском. В коде лигатуры отключены (`!==` видно как есть).
- Mobile-first: всё проверяем на ширине 375px, без горизонтального скролла.
