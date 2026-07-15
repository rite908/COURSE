"use client";

import { useEffect, useState, useCallback } from "react";

const KEY = "twh-theme";
const EVENT = "twh-theme-change";

/** Dispatch a custom event so ALL useTheme() hooks update together */
function broadcast(isDark: boolean) {
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  window.dispatchEvent(new CustomEvent(EVENT, { detail: isDark }));
}

/** Returns { isDark, toggle } — shared across all components via custom event */
export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initial value from localStorage / OS preference
    const saved = localStorage.getItem(KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved ? saved === "dark" : prefersDark;
    setIsDark(initial);
    document.documentElement.setAttribute("data-theme", initial ? "dark" : "light");

    // Listen for changes from any component
    const handler = (e: Event) => setIsDark((e as CustomEvent<boolean>).detail);
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem(KEY, next ? "dark" : "light");
      broadcast(next);
      return next;
    });
  }, []);

  return { isDark, toggle };
}
