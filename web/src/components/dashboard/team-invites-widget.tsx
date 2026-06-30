"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Mail } from "lucide-react";
import type { PendingInviteRow } from "@/lib/player-watchlist-db";
import { Button } from "@/components/ui/button";
import { parseJsonResponse } from "@/lib/safe-json";

/** Small stat-style team invites widget for the player overview row. */
export function TeamInvitesWidget({
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
        setError(data?.error || "Could not leave.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLeaving(false);
    }
  }

  async function accept(inviteId: string) {
    setLoadingId(inviteId);
    setError("");
    try {
      const res = await fetch(`/api/invites/${inviteId}/accept`, { method: "POST" });
      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error || "Could not accept.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoadingId(null);
    }
  }

  async function decline(inviteId: string) {
    setLoadingId(inviteId);
    setError("");
    try {
      const res = await fetch(`/api/invites/${inviteId}/decline`, { method: "POST" });
      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error || "Could not decline.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Team invites</p>
          <p className="font-heading mt-2 text-2xl font-semibold text-white">
            {invites.length}
            <span className="ml-1 text-sm font-normal text-zinc-500">pending</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {invites.length > 0 ? (
              <>
                Accept or decline below ·{" "}
                <Link href="/dashboard/invites" className="text-cyan-400 hover:text-cyan-300">
                  View all
                </Link>
              </>
            ) : (
              "No invites right now"
            )}
          </p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-inset ring-white/10">
          <Mail className="h-4 w-4 text-cyan-400" />
        </span>
      </div>

      {onTeam && currentTeamName && invites.length > 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-400/20 bg-amber-400/5 px-2.5 py-2">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-300" />
          <p className="flex-1 text-xs text-amber-100">On {currentTeamName}</p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            disabled={leaving}
            onClick={leaveTeam}
          >
            Leave
          </Button>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}

      {invites.length > 0 && (
        <ul className="mt-3 space-y-2">
          {invites.slice(0, 2).map((invite) => (
            <li
              key={invite.id}
              className="rounded-lg border border-white/5 bg-black/20 px-2.5 py-2"
            >
              <p className="truncate text-sm font-medium text-white">{invite.teamName}</p>
              <div className="mt-1.5 flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  className="h-7 flex-1 text-xs"
                  disabled={loadingId === invite.id || leaving}
                  onClick={() => accept(invite.id)}
                >
                  Accept
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 flex-1 text-xs"
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
