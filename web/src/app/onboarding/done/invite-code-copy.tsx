"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function InviteCodeCopy({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="mt-3 flex w-full items-center justify-between gap-3 rounded-none border border-[var(--foreground)] bg-[var(--surface)] px-4 py-3 text-left transition-colors hover:bg-[var(--background)]"
    >
      <code className="font-mono text-sm font-semibold text-[var(--foreground)]">
        {code}
      </code>
      {copied ? (
        <Check className="h-4 w-4 shrink-0 text-[var(--success)]" />
      ) : (
        <Copy className="h-4 w-4 shrink-0 text-[var(--accent)]" />
      )}
    </button>
  );
}
