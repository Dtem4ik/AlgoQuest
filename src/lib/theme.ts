export type ThemePreference = "system" | "light" | "dark";

/** Ключ настроек в localStorage; его читают и store, и скрипт в <head>. */
export const SETTINGS_STORAGE_KEY = "algoquest-settings";

export const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Выполняется в <head> до отрисовки, чтобы тёмная тема не мигала белым при загрузке.
 * Формат совпадает с persist из zustand: { state: { theme } }.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=(JSON.parse(localStorage.getItem(${JSON.stringify(
  SETTINGS_STORAGE_KEY,
)})||"{}").state||{}).theme||"system";if(t==="dark"||(t==="system"&&matchMedia(${JSON.stringify(
  DARK_QUERY,
)}).matches))document.documentElement.classList.add("dark")}catch(e){}})()`;
