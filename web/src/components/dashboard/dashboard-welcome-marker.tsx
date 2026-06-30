"use client";

import { useEffect } from "react";
import { fetchJson } from "@/lib/safe-json";

/** Persist first-visit welcome state after the user actually lands on the overview (avoids Next.js prefetch marking it early). */
export function DashboardWelcomeMarker({ isFirstVisit }: { isFirstVisit: boolean }) {
  useEffect(() => {
    if (!isFirstVisit) return;

    const controller = new AbortController();
    void fetchJson("/api/dashboard/mark-welcomed", {
      method: "POST",
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [isFirstVisit]);

  return null;
}
