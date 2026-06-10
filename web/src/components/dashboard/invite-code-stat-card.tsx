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
        "rounded-2xl border border-white/5 bg-[var(--surface)] p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Invite link</p>
          <button
            type="button"
            onClick={copy}
            className="group mt-2 flex w-full items-center gap-2 text-left"
          >
            <code className="font-mono text-sm font-semibold text-cyan-200 truncate">
              {inviteCode}
            </code>
            {copied ? (
              <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4 shrink-0 text-cyan-400 opacity-70 group-hover:opacity-100" />
            )}
          </button>
          <p className="mt-1 text-xs text-zinc-500">Share with players</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-inset ring-white/10">
          <UserPlus className="h-4 w-4 text-cyan-400" />
        </span>
      </div>
    </div>
  );
}
