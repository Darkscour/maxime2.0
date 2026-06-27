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
    const parsed = JSON.parse(raw) as Partial<T>;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    sessionStorage.removeItem(key);
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
  const [draftReady, setDraftReady] = useState(false);

  useEffect(() => {
    const saved = loadOnboardingDraft<T>(key);
    if (saved) {
      setValues((prev) => ({ ...prev, ...saved }));
    }
    setDraftReady(true);
  }, [key]);

  useEffect(() => {
    if (!draftReady) return;
    saveOnboardingDraft(key, values);
  }, [key, values, draftReady]);

  return [values, setValues, draftReady] as const;
}
