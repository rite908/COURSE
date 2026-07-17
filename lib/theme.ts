"use client";

import { useEffect, useState, useCallback } from "react";

// ── Module-level store shared across ALL useTheme() instances ─────────────
let _isDark = false;
const _subscribers = new Set<(v: boolean) => void>();

function applyTheme(dark: boolean) {
  _isDark = dark;
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }
  try { localStorage.setItem("twh-theme", dark ? "dark" : "light"); } catch {}
  // Notify every subscribed component → triggers re-render
  _subscribers.forEach(fn => fn(dark));
}

// ─────────────────────────────────────────────────────────────────────────
export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Subscribe FIRST so applyTheme below updates this instance too
    _subscribers.add(setIsDark);

    // Read saved / OS preference and broadcast to everyone
    let saved: string | null = null;
    try { saved = localStorage.getItem("twh-theme"); } catch {}
    const sys  = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const init = saved ? saved === "dark" : sys;
    applyTheme(init);

    return () => { _subscribers.delete(setIsDark); };
  }, []);

  const toggle = useCallback(() => {
    applyTheme(!_isDark);          // flip module variable → notify all
  }, []);

  return { isDark, toggle };
}
