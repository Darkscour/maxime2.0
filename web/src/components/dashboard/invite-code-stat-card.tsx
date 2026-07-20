"use client";

import { useState } from "react";
import { Check, Copy, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Compact invite-code stat card for the dashboard overview grid. */
export function InviteCodeStatCard({
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
    <div
      className={cn(
        "rounded-none border border-[var(--foreground)] bg-[var(--surface)] p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">Invite link</p>
          <button
            type="button"
            onClick={copy}
            className="group mt-2 flex w-full items-center gap-2 text-left"
          >
            <code className="font-mono text-sm font-semibold text-[var(--accent)] truncate">
              {inviteCode}
            </code>
            {copied ? (
              <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4 shrink-0 text-[var(--accent)] opacity-70 group-hover:opacity-100" />
            )}
          </button>
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">Share with players</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-[var(--surface-2)] ring-1 ring-inset ring-[var(--border)]">
          <UserPlus className="h-4 w-4 text-[var(--accent)]" />
        </span>
      </div>
    </div>
  );
}
