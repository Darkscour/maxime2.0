"use client";

import { useState } from "react";
import { Check, Copy, UserPlus } from "lucide-react";

export function TeamInvitePanel({ inviteCode }: { inviteCode: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-6 border-t border-[var(--border)] pt-5">
      <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
        <UserPlus className="h-4 w-4 text-[var(--accent)]" />
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
          Invite players
        </p>
      </div>
      <p className="mt-1 text-sm text-[var(--foreground-muted)]">
        Share this code — players paste it during onboarding to join your roster.
      </p>
      <button
        type="button"
        onClick={copy}
        className="mt-3 flex w-full items-center justify-between gap-3 rounded-none border border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-4 py-3 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]"
      >
        <code className="font-mono text-sm font-semibold text-[var(--accent)]">{inviteCode}</code>
        {copied ? (
          <Check className="h-4 w-4 shrink-0 text-[var(--success)]" />
        ) : (
          <Copy className="h-4 w-4 shrink-0 text-[var(--accent)]" />
        )}
      </button>
    </div>
  );
}
