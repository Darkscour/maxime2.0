"use client";

import { Info, Sparkles } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";

export function PreviewModeBanner() {
  return (
    <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <div>
            <p className="text-sm font-medium text-amber-100">
              Preview mode — sample sponsors for demonstration
            </p>
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              You can browse and filter freely. Sign in to apply, save leads,
              and track your outreach pipeline.
            </p>
          </div>
        </div>
        <SignUpButton mode="modal" appearance={clerkAuthAppearance}>
          <Button variant="primary" size="sm" className="shrink-0">
            Create free account
          </Button>
        </SignUpButton>
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
    <div className="mb-6 rounded-xl border border-violet-400/20 bg-violet-400/[0.06] px-4 py-4 sm:px-5">
      <div className="flex gap-3">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" />
        <div>
          <p className="text-sm font-medium text-violet-100">
            Team portal —{" "}
            {dbConnected
              ? `${liveCount} sponsors from your database`
              : "signed-in view"}
          </p>
          <p className="mt-1 text-sm leading-6 text-zinc-400">
            This view is different from the public marketing demo. Apply and
            save leads here; pipeline tracking and AI pitch drafting are next.
          </p>
        </div>
      </div>
    </div>
  );
}
