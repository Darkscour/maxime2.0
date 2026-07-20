"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseJsonResponse } from "@/lib/safe-json";

export function LeaveTeamCard({
  teamName,
  membershipRole,
}: {
  teamName: string;
  membershipRole: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (membershipRole !== "player") return null;

  async function leave() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/player/leave-team", { method: "POST" });
      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error || "Could not leave team.");
        return;
      }
      setConfirming(false);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-none border border-[var(--foreground)] bg-[var(--surface)] p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-[var(--background)] ring-1 ring-inset ring-white/5">
          <LogOut className="h-5 w-5 text-[var(--foreground-muted)]" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-lg font-semibold text-[var(--foreground)]">Leave team</h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            You&apos;re on <span className="text-[var(--foreground)]">{teamName}</span>. Leaving
            removes you from the roster but keeps your player profile.
          </p>

          {error && (
            <p className="mt-3 rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}

          {!confirming ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="mt-4"
              onClick={() => setConfirming(true)}
            >
              Leave team
            </Button>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="primary"
                disabled={loading}
                onClick={leave}
              >
                {loading ? "Leaving…" : "Confirm leave"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={loading}
                onClick={() => {
                  setConfirming(false);
                  setError("");
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
