"use client";

import { useEffect, useState, useCallback } from "react";

// ── Module-level store shared across ALL useTheme() instances ─────────────
let _isDark = true;
const _subscribers = new Set<(v: boolean) => void>();

function applyTheme(dark: boolean) {
  _isDark = dark;
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }
  // Only persist "light" — dark is the default, no need to store it
  try {
    if (dark) localStorage.removeItem("twh-theme-pref");
    else localStorage.setItem("twh-theme-pref", "light");
  } catch {}
  _subscribers.forEach(fn => fn(dark));
}

// ─────────────────────────────────────────────────────────────────────────
export function useTheme() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Subscribe FIRST so applyTheme below updates this instance too
    _subscribers.add(setIsDark);

    // Read saved / OS preference and broadcast to everyone
    let saved: string | null = null;
    try { saved = localStorage.getItem("twh-theme-pref"); } catch {}
    // "twh-theme-pref" only exists when user explicitly chose light; default = dark
    const init = saved !== "light";
    applyTheme(init);

    return () => { _subscribers.delete(setIsDark); };
  }, []);

  const toggle = useCallback(() => {
    applyTheme(!_isDark);          // flip module variable → notify all
  }, []);

  return { isDark, toggle };
}
