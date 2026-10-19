"use client";

import { useEffect } from "react";
import { DARK_QUERY } from "@/lib/theme";
import { useSettings } from "@/store/settings";

/** Держит класс .dark на <html> в соответствии с настройкой и системной темой. */
export function ThemeController() {
  const theme = useSettings((s) => s.theme);

  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && media.matches);
      document.documentElement.classList.toggle("dark", dark);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  return null;
}
