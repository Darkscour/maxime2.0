"use client";

import { RouteErrorRecovery } from "@/components/auth/route-error-recovery";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorRecovery
      title="Couldn't load dashboard"
      description="This page took too long to load or was interrupted. Try again."
      reset={reset}
    />
  );
}
