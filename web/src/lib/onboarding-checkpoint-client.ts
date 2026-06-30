"use client";

/** Persist the onboarding step for a target URL before navigating back. */
export async function recordOnboardingCheckpoint(dest: string) {
  const url = new URL(dest, window.location.origin);
  try {
    await fetch("/api/onboarding/checkpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pathname: url.pathname,
        search: url.search,
      }),
      keepalive: true,
    });
  } catch {
    // Navigation may abort the request — checkpoint is best-effort.
  }
}
