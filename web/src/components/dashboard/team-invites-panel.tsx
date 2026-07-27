"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import type { PendingInviteRow } from "@/lib/player-watchlist-db";
import { Button } from "@/components/ui/button";
import { DeskEmpty } from "@/components/dashboard/desk-ui";
import { parseJsonResponse } from "@/lib/safe-json";

export function TeamInvitesPanel({
  invites,
  onTeam,
  currentTeamName,
}: {
  invites: PendingInviteRow[];
  onTeam: boolean;
  currentTeamName?: string | null;
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState("");

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
    <div className="md-subpage-panel p-6 sm:p-8">
      {onTeam && currentTeamName && invites.length > 0 && (
        <div className="mb-6 flex items-start gap-3 border border-[color-mix(in_srgb,var(--warning)_45%,var(--border))] bg-[color-mix(in_srgb,var(--warning)_8%,transparent)] px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--warning)]" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-[var(--foreground)]">
              You&apos;re on <span className="font-medium">{currentTeamName}</span>. Leave
              your current roster before accepting another invite.
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="mt-3 h-8"
              disabled={leaving}
              onClick={leaveTeam}
            >
              {leaving ? "Leaving…" : "Leave team"}
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="mb-4 border border-[color-mix(in_srgb,var(--danger)_40%,var(--border))] bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      {invites.length === 0 ? (
        <DeskEmpty
          className="border-0 bg-transparent p-0"
          title="No invites yet"
          body="When a manager sends a recruitment invite, it lands here. You can also browse teams and request to join."
          actionLabel="Browse teams"
          actionHref="/dashboard/teams"
        />
      ) : (
        <ul className="space-y-3">
          {invites.map((invite) => (
            <li
              key={invite.id}
              className="border border-[var(--border)] bg-[var(--background)] px-4 py-4"
            >
              <p className="font-heading text-base font-semibold tracking-[-0.01em] text-[var(--foreground)]">
                {invite.teamName}
              </p>
              {invite.message && (
                <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                  &ldquo;{invite.message}&rdquo;
                </p>
              )}
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                Invited{" "}
                {new Date(invite.invitedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  disabled={loadingId === invite.id || leaving}
                  onClick={() => accept(invite.id)}
                >
                  {loadingId === invite.id ? "Accepting…" : "Accept"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={loadingId === invite.id}
                  onClick={() => decline(invite.id)}
                >
                  Decline
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
