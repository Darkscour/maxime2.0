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
      description="Your account is signed in, but routing took too long or failed. Try again."
      reset={reset}
    />
  );
}
