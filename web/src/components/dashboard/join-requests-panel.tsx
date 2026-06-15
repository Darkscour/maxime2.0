"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, UserPlus, X } from "lucide-react";
import type { TeamJoinRequestListing } from "@/lib/team-join-request-db";
import { PlayerScoutCard } from "@/components/dashboard/player-scout-card";
import { InviteMessageModal } from "@/components/dashboard/invite-message-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatRequestedAt(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function JoinRequestsPanel({
  items,
  teamName,
}: {
  items: TeamJoinRequestListing[];
  teamName: string;
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [inviteTarget, setInviteTarget] = useState<TeamJoinRequestListing | null>(
    null,
  );

  const defaultInviteMessage = useMemo(() => {
    if (!inviteTarget) return "";
    return `Hi ${inviteTarget.handle}, thanks for requesting to join ${teamName}! We'd like to invite you to our roster — accept the invite from your dashboard when you're ready.`;
  }, [inviteTarget, teamName]);

  async function dismiss(playerProfileId: string) {
    setError("");
    setLoadingId(playerProfileId);
    try {
      const res = await fetch("/api/teams/join-requests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerProfileId }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Could not dismiss request.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoadingId(null);
    }
  }

  async function sendInvite(playerProfileId: string, message: string) {
    setError("");
    setLoadingId(playerProfileId);
    try {
      const res = await fetch("/api/watchlist/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerProfileId, message }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Could not send invite.");
        return;
      }
      setInviteTarget(null);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoadingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-[var(--surface)]/50 p-10 text-center">
        <UserPlus className="mx-auto h-8 w-8 text-zinc-600" />
        <p className="mt-4 text-sm text-zinc-400">
          No pending join requests. When players tap{" "}
          <strong className="font-medium text-zinc-300">Request to join</strong> on
          your team from Browse teams, they&apos;ll show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((player) => (
          <article
            key={player.id}
            className="flex flex-col rounded-2xl border border-cyan-400/20 bg-[var(--surface)] p-5"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge tone="cyan">Requested to join</Badge>
              <span className="text-xs text-zinc-500">
                {formatRequestedAt(player.requestedAt)}
              </span>
            </div>

            <Link
              href={`/dashboard/scout/${player.handle}`}
              className="block transition-opacity hover:opacity-90"
            >
              <PlayerScoutCard
                handle={player.handle}
                game={player.game}
                role={player.role}
                rank={player.rank}
                school={player.school}
                imageUrl={player.imageUrl}
                className="border-0 bg-transparent p-0"
              />
            </Link>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-4">
              <Button
                type="button"
                size="sm"
                variant="primary"
                disabled={loadingId === player.playerProfileId}
                onClick={() => setInviteTarget(player)}
                className="gap-1.5"
              >
                <Mail className="h-3.5 w-3.5" />
                Send invite
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={loadingId === player.playerProfileId}
                onClick={() => dismiss(player.playerProfileId)}
                className="gap-1.5"
              >
                <X className="h-3.5 w-3.5" />
                Dismiss
              </Button>
            </div>
          </article>
        ))}
      </div>

      <InviteMessageModal
        open={!!inviteTarget}
        playerHandle={inviteTarget?.handle ?? ""}
        teamName={teamName}
        defaultMessage={defaultInviteMessage}
        loading={!!inviteTarget && loadingId === inviteTarget.playerProfileId}
        onClose={() => setInviteTarget(null)}
        onSend={(message) => {
          if (inviteTarget) sendInvite(inviteTarget.playerProfileId, message);
        }}
      />
    </div>
  );
}
