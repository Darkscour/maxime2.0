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
      className="mt-3 flex w-full items-center justify-between gap-3 rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-left transition-colors hover:bg-cyan-400/10"
    >
      <code className="font-mono text-sm font-semibold text-cyan-200">{code}</code>
      {copied ? (
        <Check className="h-4 w-4 shrink-0 text-emerald-400" />
      ) : (
        <Copy className="h-4 w-4 shrink-0 text-cyan-400" />
      )}
    </button>
  );
}
