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
      description="We couldn't complete your sign-in. This is usually caused by a temporary database issue. Wait a moment and try again — your account has not been affected."
      primaryHref="/dashboard"
      primaryLabel="Go to dashboard"
      retryHref="/auth/continue?intent=sign-in"
      secondaryHref="/?browse=1"
      secondaryLabel="View homepage"
      reset={reset}
    />
  );
}
