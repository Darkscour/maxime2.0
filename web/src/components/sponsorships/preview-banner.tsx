"use client";

import { Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PreviewModeBanner() {
  return (
    <div className="mb-6 rounded-none border border-[color-mix(in_srgb,var(--warning)_20%,var(--border))] bg-[color-mix(in_srgb,var(--warning)_6%,transparent)] px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--warning)]" />
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              Preview mode — sample sponsors for demonstration
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
              You can browse and filter freely. Sign in to apply, save leads,
              and track your outreach pipeline.
            </p>
          </div>
        </div>
        <Button href="/sign-up" variant="primary" size="sm" className="shrink-0">
          Create free account
        </Button>
      </div>
    </div>
  );
}

export function SignedInBanner({
  liveCount,
  dbConnected,
}: {
  liveCount: number;
  dbConnected: boolean;
}) {
  return (
    <div className="mb-6 rounded-none border border-[color-mix(in_srgb,var(--accent-2)_20%,var(--border))] bg-[color-mix(in_srgb,var(--accent-2)_6%,transparent)] px-4 py-4 sm:px-5">
      <div className="flex gap-3">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent-2)]" />
        <div>
          <p className="text-sm font-medium text-[var(--foreground)]">
            Team portal —{" "}
            {dbConnected
              ? `${liveCount} sponsors from your database`
              : "signed-in view"}
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
            This view is different from the public marketing demo. Apply and
            save leads here; pipeline tracking and AI pitch drafting are next.
          </p>
        </div>
      </div>
    </div>
  );
}
