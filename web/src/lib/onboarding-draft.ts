"use client";

import { useEffect, useState } from "react";

const PREFIX = "maxime:onboarding:draft:";

export function onboardingDraftKey(step: "team" | "player", tier?: string) {
  return tier ? `${PREFIX}${step}:${tier}` : `${PREFIX}${step}`;
}

export function loadOnboardingDraft<T extends object>(key: string): Partial<T> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<T>;
  } catch {
    return null;
  }
}

export function saveOnboardingDraft<T extends object>(key: string, values: T) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify(values));
  } catch {
    // ignore quota errors
  }
}

export function clearOnboardingDraft(key: string) {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(key);
}

/** Persist onboarding form fields across back navigation within the same session. */
export function useOnboardingDraft<T extends object>(key: string, initial: T) {
  const [values, setValues] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadOnboardingDraft<T>(key);
    if (saved) {
      setValues((prev) => ({ ...prev, ...saved }));
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    saveOnboardingDraft(key, values);
  }, [key, values, hydrated]);

  return [values, setValues, hydrated] as const;
}
