"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "maxime-home-theme";

export type HomeTheme = "light" | "dark";

export function useHomeTheme() {
  const [theme, setThemeState] = useState<HomeTheme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      setThemeState(stored);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.homeTheme = theme;
    document.documentElement.style.colorScheme = theme;
    return () => {
      delete document.documentElement.dataset.homeTheme;
      document.documentElement.style.colorScheme = "";
    };
  }, [theme, ready]);

  const setTheme = useCallback((next: HomeTheme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next: HomeTheme = prev === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { theme, setTheme, toggle, ready };
}
