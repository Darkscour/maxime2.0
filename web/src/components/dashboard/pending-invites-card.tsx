"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Mail } from "lucide-react";
import type { PendingInviteRow } from "@/lib/player-watchlist-db";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseJsonResponse } from "@/lib/safe-json";

export function PendingInvitesCard({
  invites,
  onTeam,
  currentTeamName,
  compact = false,
}: {
  invites: PendingInviteRow[];
  onTeam: boolean;
  currentTeamName?: string | null;
  compact?: boolean;
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState("");

  if (invites.length === 0) return null;

  async function leaveTeam() {
    setError("");
    setLeaving(true);
    try {
      const res = await fetch("/api/player/leave-team", { method: "POST" });
      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error || "Could not leave team.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLeaving(false);
    }
  }

  async function accept(inviteId: string) {
    setError("");
    setLoadingId(inviteId);
    try {
      const res = await fetch(`/api/invites/${inviteId}/accept`, { method: "POST" });
      const data = await parseJsonResponse<{ error?: string; code?: string }>(res);
      if (res.status === 409 && data?.code === "ALREADY_ON_TEAM") {
        setError("Leave your current team first, then accept this invite.");
        return;
      }
      if (!res.ok) {
        setError(data?.error || "Could not accept invite.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoadingId(null);
    }
  }

  async function decline(inviteId: string) {
    setError("");
    setLoadingId(inviteId);
    try {
      const res = await fetch(`/api/invites/${inviteId}/decline`, { method: "POST" });
      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error || "Could not decline invite.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-none border border-[color-mix(in_srgb,var(--accent-2)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent-2)_8%,transparent)]",
        compact ? "p-4" : "p-6",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-none bg-[color-mix(in_srgb,var(--accent-2)_10%,transparent)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent-2)_30%,transparent)]",
            compact ? "h-9 w-9" : "h-10 w-10",
          )}
        >
          <Mail className={compact ? "h-4 w-4 text-[var(--accent-2)]" : "h-5 w-5 text-[var(--accent-2)]"} />
        </span>
        <div className="min-w-0 flex-1">
          <h2
            className={cn(
              "font-heading font-semibold text-[var(--foreground)]",
              compact ? "text-base" : "text-lg",
            )}
          >
            Team invites
          </h2>
          {!compact && (
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Accept or decline recruitment invites directly from your dashboard.
            </p>
          )}

          {onTeam && currentTeamName && (
            <div
              className={cn(
                "rounded-none border border-amber-400/20 bg-amber-400/5",
                compact ? "mt-3 px-3 py-2" : "mt-4 px-4 py-3",
              )}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-amber-100">
                    On <span className="font-medium">{currentTeamName}</span> — leave
                    before switching.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="mt-2 h-8"
                    disabled={leaving}
                    onClick={leaveTeam}
                  >
                    {leaving ? "Leaving…" : "Leave team"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-3 rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2 text-xs text-red-200">
              {error}
            </p>
          )}

          <ul className={cn("space-y-2", compact ? "mt-3" : "mt-4")}>
            {invites.map((invite) => (
              <li
                key={invite.id}
                className="rounded-none border border-[var(--border)] bg-[var(--background)] px-3 py-2.5"
              >
                <p className="text-sm font-medium text-[var(--foreground)]">{invite.teamName}</p>
                {invite.message && !compact && (
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--foreground-muted)]">
                    &ldquo;{invite.message}&rdquo;
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    className="h-8"
                    disabled={loadingId === invite.id || leaving}
                    onClick={() => accept(invite.id)}
                  >
                    {loadingId === invite.id ? "…" : "Accept"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8"
                    disabled={loadingId === invite.id}
                    onClick={() => decline(invite.id)}
                  >
                    Decline
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
