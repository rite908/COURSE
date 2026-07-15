"use client";

import { useEffect, useState, useCallback } from "react";

const KEY = "twh-theme";

/** Returns [isDark, toggle] — synced to localStorage and document attribute */
export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Read saved preference
    const saved = localStorage.getItem(KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved ? saved === "dark" : prefersDark;
    setIsDark(initial);
    document.documentElement.setAttribute("data-theme", initial ? "dark" : "light");
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem(KEY, next ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  return { isDark, toggle };
}
