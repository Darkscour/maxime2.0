"use client";

import { useClerk } from "@clerk/nextjs";
import { ExternalLink } from "lucide-react";

export function ManageAccountButton() {
  const { openUserProfile } = useClerk();

  return (
    <button
      type="button"
      onClick={() => openUserProfile()}
      className="inline-flex items-center gap-2 rounded-none border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--foreground)] hover:bg-[var(--surface)]"
    >
      Manage sign-in & security
      <ExternalLink className="h-3.5 w-3.5 text-[var(--foreground-muted)]" />
    </button>
  );
}
