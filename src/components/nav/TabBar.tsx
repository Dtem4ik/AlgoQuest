"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

function MapIcon() {
  return (
    <svg viewBox="0 0 28 28" className="size-7" aria-hidden>
      <path d="M4 22c4-1 5-6 10-6s6 5 10 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 5" />
      <circle cx="8" cy="8" r="4" fill="currentColor" />
      <circle cx="20" cy="12" r="4" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

function ProfileIcon() {
  // Голова Бита: экран-лицо и антенна.
  return (
    <svg viewBox="0 0 28 28" className="size-7" aria-hidden>
      <line x1="14" y1="7" x2="14" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="3" r="2" fill="currentColor" />
      <circle cx="14" cy="16" r="10" fill="currentColor" />
      <rect x="7" y="11.5" width="14" height="9" rx="4" className="fill-surface" />
      <rect x="10" y="14" width="2.5" height="4" rx="1.25" fill="currentColor" />
      <rect x="15.5" y="14" width="2.5" height="4" rx="1.25" fill="currentColor" />
    </svg>
  );
}

const TABS: { href: string; label: string; icon: ReactNode }[] = [
  { href: "/", label: "Карта", icon: <MapIcon /> },
  { href: "/profile", label: "Профиль", icon: <ProfileIcon /> },
];

/** Нижняя панель вкладок, как в мобильных приложениях. */
export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Разделы"
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-border bg-surface/95 backdrop-blur"
    >
      <ul className="mx-auto flex max-w-md gap-3 px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-2xl border-2 py-1.5 text-xs font-extrabold tracking-wide uppercase transition-colors",
                  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  active
                    ? "border-primary/40 bg-primary-soft text-primary"
                    : "border-transparent text-ink-muted hover:bg-bg",
                )}
              >
                {tab.icon}
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
