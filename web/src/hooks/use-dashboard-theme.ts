"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "maxime-dashboard-theme";

export type DashboardTheme = "light" | "dark";

export function useDashboardTheme() {
  const [theme, setThemeState] = useState<DashboardTheme>("light");
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
    document.documentElement.dataset.dashboardTheme = theme;
    document.documentElement.style.colorScheme = theme;
    return () => {
      delete document.documentElement.dataset.dashboardTheme;
      document.documentElement.style.colorScheme = "";
    };
  }, [theme, ready]);

  const setTheme = useCallback((next: DashboardTheme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next: DashboardTheme = prev === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { theme, setTheme, toggle, ready };
}
