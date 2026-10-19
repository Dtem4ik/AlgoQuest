"use client";

import { cn } from "@/lib/cn";
import type { ThemePreference } from "@/lib/theme";
import { useSettings } from "@/store/settings";

const OPTIONS: { value: ThemePreference; label: string; icon: string }[] = [
  { value: "system", label: "Система", icon: "📱" },
  { value: "light", label: "Светлая", icon: "☀️" },
  { value: "dark", label: "Тёмная", icon: "🌙" },
];

export function ThemePicker() {
  const theme = useSettings((s) => s.theme);
  const setTheme = useSettings((s) => s.setTheme);

  return (
    <div role="radiogroup" aria-label="Тема оформления" className="grid grid-cols-3 gap-1 rounded-2xl bg-bg p-1">
      {OPTIONS.map((option) => {
        const active = option.value === theme;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl py-2 text-sm font-extrabold transition-colors",
              "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary",
              active ? "bg-surface text-primary shadow-[0_2px_0_var(--border)]" : "text-ink-muted",
            )}
          >
            <span aria-hidden className="text-lg">
              {option.icon}
            </span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
