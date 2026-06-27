"use client";

import { useEffect } from "react";

/** Persist first-visit welcome state after the user actually lands on the overview (avoids Next.js prefetch marking it early). */
export function DashboardWelcomeMarker({ isFirstVisit }: { isFirstVisit: boolean }) {
  useEffect(() => {
    if (!isFirstVisit) return;
    void fetch("/api/dashboard/mark-welcomed", { method: "POST" });
  }, [isFirstVisit]);

  return null;
}
