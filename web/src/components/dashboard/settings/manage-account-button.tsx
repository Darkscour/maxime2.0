"use client";

import { useClerk } from "@clerk/nextjs";
import { ExternalLink } from "lucide-react";

export function ManageAccountButton() {
  const { openUserProfile } = useClerk();

  return (
    <button
      type="button"
      onClick={() => openUserProfile()}
      className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-cyan-400/25 hover:bg-cyan-400/[0.06] hover:text-white"
    >
      Manage sign-in & security
      <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
    </button>
  );
}
