"use client";

import { useEffect, useState, useCallback } from "react";

const KEY   = "twh-theme";
const EVENT = "twh-theme-change";

function broadcast(isDark: boolean) {
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  window.dispatchEvent(new CustomEvent(EVENT, { detail: isDark }));
}

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved       = localStorage.getItem(KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial     = saved ? saved === "dark" : prefersDark;
    setIsDark(initial);
    broadcast(initial);

    const handler = (e: Event) => setIsDark((e as CustomEvent<boolean>).detail);
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  const toggle = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem(KEY, next ? "dark" : "light");
      broadcast(next);
      return next;
    });
  }, []);

  return { isDark, toggle };
}
