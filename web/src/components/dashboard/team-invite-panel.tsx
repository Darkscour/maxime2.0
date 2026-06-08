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
    <div className="mt-6 border-t border-white/5 pt-5">
      <div className="flex items-center gap-2 text-zinc-400">
        <UserPlus className="h-4 w-4 text-cyan-400" />
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Invite players
        </p>
      </div>
      <p className="mt-1 text-sm text-zinc-500">
        Share this code — players paste it during onboarding to join your roster.
      </p>
      <button
        type="button"
        onClick={copy}
        className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-left transition-colors hover:bg-cyan-400/10"
      >
        <code className="font-mono text-sm font-semibold text-cyan-200">{inviteCode}</code>
        {copied ? (
          <Check className="h-4 w-4 shrink-0 text-emerald-400" />
        ) : (
          <Copy className="h-4 w-4 shrink-0 text-cyan-400" />
        )}
      </button>
    </div>
  );
}
