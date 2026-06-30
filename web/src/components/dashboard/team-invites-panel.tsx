"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Mail } from "lucide-react";
import type { PendingInviteRow } from "@/lib/player-watchlist-db";
import { Button } from "@/components/ui/button";
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
    <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-6 sm:p-8">
      {onTeam && currentTeamName && invites.length > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-amber-100">
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
        <p className="mb-4 rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      {invites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-inset ring-white/10">
            <Mail className="h-5 w-5 text-zinc-500" />
          </span>
          <p className="mt-4 text-sm font-medium text-zinc-300">No team invites yet</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
            When a manager sends you a recruitment invite, it will show up here and in your
            notification bell. You can also browse teams and request to join directly.
          </p>
          <Button href="/dashboard/teams" size="sm" variant="outline" className="mt-5">
            Browse teams
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {invites.map((invite) => (
            <li
              key={invite.id}
              className="rounded-xl border border-white/5 bg-black/20 px-4 py-4"
            >
              <p className="text-base font-medium text-white">{invite.teamName}</p>
              {invite.message && (
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  &ldquo;{invite.message}&rdquo;
                </p>
              )}
              <p className="mt-1 text-xs text-zinc-600">
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
                  {loadingId === invite.id ? "Accepting…" : "Accept invite"}
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
