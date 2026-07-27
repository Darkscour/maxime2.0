"use client";

import { Moon, Sun } from "lucide-react";
import type { DashboardTheme } from "@/hooks/use-dashboard-theme";

export function DashboardThemeToggle({
  theme,
  onToggle,
}: {
  theme: DashboardTheme;
  onToggle: () => void;
}) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      className="md-top-icon-btn"
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
