"use client";

import { useHomeTheme } from "@/hooks/use-home-theme";

/** Applies stored home light/dark tokens on auth + marketing sibling routes. */
export function HomeThemeSync() {
  useHomeTheme();
  return null;
}
