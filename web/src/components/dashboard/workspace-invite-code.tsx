"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/** Subtle invite code inline with the workspace header — not a standalone callout. */
export function WorkspaceInviteCode({
  inviteCode,
  className,
}: {
  inviteCode: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <p className={cn("mt-3 text-sm text-zinc-500", className)}>
      <span>Invite code </span>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1 font-mono text-zinc-400 transition-colors hover:text-zinc-300"
        title="Copy invite code"
      >
        {inviteCode}
        {copied ? (
          <Check className="h-3 w-3 text-emerald-400/80" />
        ) : (
          <Copy className="h-3 w-3 opacity-60" />
        )}
      </button>
      <span className="text-zinc-600"> · share with players</span>
    </p>
  );
}
