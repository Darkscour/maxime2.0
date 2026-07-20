"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/** Invite code row for the org plate. */
export function WorkspaceInviteCode({
  inviteCode,
  className,
  tone = "light",
}: {
  inviteCode: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  const [copied, setCopied] = useState(false);
  const dark = tone === "dark";

  async function copy() {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={cn(
        "desk-invite-row",
        dark && "!border-[color-mix(in_srgb,#f7f7f8_28%,transparent)]",
        className,
      )}
    >
      <span
        className={cn(
          "desk-kicker",
          dark
            ? "!text-[color-mix(in_srgb,#f7f7f8_55%,transparent)]"
            : "!text-[var(--foreground-muted)]",
        )}
      >
        Invite code
      </span>
      <button
        type="button"
        onClick={copy}
        className={cn(
          "inline-flex max-w-full items-center gap-2 text-left transition-colors",
          dark
            ? "text-[#f7f7f8] hover:text-[color-mix(in_srgb,#f7f7f8_80%,var(--accent))]"
            : "hover:text-[var(--accent)]",
        )}
        title="Copy invite code"
      >
        <span className={cn("desk-invite-code", dark && "!text-[#f7f7f8]")}>
          {inviteCode}
        </span>
        {copied ? (
          <Check className="h-3.5 w-3.5 shrink-0 text-[var(--success)]" />
        ) : (
          <Copy className="h-3.5 w-3.5 shrink-0 opacity-55" />
        )}
      </button>
      <span
        className={cn(
          "text-xs",
          dark
            ? "text-[color-mix(in_srgb,#f7f7f8_55%,transparent)]"
            : "text-[var(--foreground-muted)]",
        )}
      >
        Share with players
      </span>
    </div>
  );
}
