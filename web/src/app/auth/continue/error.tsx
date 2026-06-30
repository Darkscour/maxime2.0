"use client";

import { RouteErrorRecovery } from "@/components/auth/route-error-recovery";

export default function AuthContinueError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorRecovery
      title="Couldn't finish sign-in"
      description="Your Clerk session is active, but Maxime could not finish loading your account. Try again, or view the homepage without restarting the sign-in redirect."
      secondaryHref="/?browse=1"
      secondaryLabel="View homepage"
      reset={reset}
    />
  );
}
