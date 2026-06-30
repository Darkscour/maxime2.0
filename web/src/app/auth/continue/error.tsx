"use client";

import { RouteErrorRecovery } from "@/components/auth/route-error-recovery";

export default function AuthContinueError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Do NOT auto-redirect — any redirect here risks an infinite loop if the
  // error is persistent (e.g. DB down). Show a manual recovery UI instead.
  void error;
  return (
    <RouteErrorRecovery
      title="Couldn't finish sign-in"
      description="We ran into an error routing your session. Click 'Go to dashboard' if you already have an account, or try again."
      primaryHref="/dashboard"
      primaryLabel="Go to dashboard"
      retryHref="/auth/continue?intent=sign-in"
      secondaryHref="/?browse=1"
      secondaryLabel="View homepage"
      reset={reset}
    />
  );
}
