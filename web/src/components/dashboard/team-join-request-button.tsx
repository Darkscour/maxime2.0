"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { parseJsonResponse } from "@/lib/safe-json";

export function TeamJoinRequestButton({
  teamId,
  teamName,
  disabled,
  disabledReason,
  initialPending,
  embedded = false,
}: {
  teamId: string;
  teamName: string;
  disabled?: boolean;
  disabledReason?: string;
  initialPending?: boolean;
  embedded?: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(initialPending ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function requestJoin() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/teams/join-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });
      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error || "Could not send request.");
        return;
      }
      setPending(true);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (disabled) {
    return (
      <p className={embedded ? "text-xs text-[var(--foreground-muted)]" : "mt-4 text-xs text-[var(--foreground-muted)]"}>
        {disabledReason ?? "Unavailable"}
      </p>
    );
  }

  return (
    <div className={embedded ? undefined : "mt-4"}>
      <Button
        type="button"
        size="sm"
        variant={pending ? "outline" : "primary"}
        disabled={loading || pending}
        onClick={requestJoin}
        className={embedded ? "gap-1.5" : undefined}
      >
        {loading ? "Sending…" : pending ? "Request sent" : "Request to join"}
      </Button>
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
      {pending && !error && !embedded && (
        <p className="mt-2 text-xs text-[var(--foreground-muted)]">
          {teamName} will be notified. You can still accept a direct invite if they send one.
        </p>
      )}
    </div>
  );
}
