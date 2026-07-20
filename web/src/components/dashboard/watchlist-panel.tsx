"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Trash2 } from "lucide-react";
import type { WatchlistListing } from "@/lib/player-watchlist-db";
import { PlayerScoutCard } from "@/components/dashboard/player-scout-card";
import { Button } from "@/components/ui/button";
import { InviteMessageModal } from "@/components/dashboard/invite-message-modal";
import { DeskEmpty } from "@/components/dashboard/desk-ui";
import { parseJsonResponse } from "@/lib/safe-json";

export function WatchlistPanel({
  items,
  teamName,
}: {
  items: WatchlistListing[];
  teamName: string;
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [inviteTarget, setInviteTarget] = useState<WatchlistListing | null>(null);

  const defaultInviteMessage = useMemo(() => {
    if (!inviteTarget) return "";
    return `Hi ${inviteTarget.handle}, ${teamName} would like to invite you to join our roster. Accept the invite from your dashboard when you're ready.`;
  }, [inviteTarget, teamName]);

  async function remove(playerProfileId: string) {
    setError("");
    setLoadingId(playerProfileId);
    try {
      const res = await fetch("/api/watchlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerProfileId }),
      });
      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error || "Could not remove player.");
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
      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error || "Could not send invite.");
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
      <DeskEmpty
        title="Watchlist is empty"
        body="Scout players and save the ones worth comparing before you invite."
        actionLabel="Open scout"
        actionHref="/dashboard/scout"
      />
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="border border-[color-mix(in_srgb,var(--danger)_40%,var(--border))] bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((player) => (
          <div
            key={player.id}
            className="desk-panel flex h-full flex-col transition-colors hover:border-[var(--accent)]"
          >
            <Link
              href={`/dashboard/scout/${player.handle}`}
              className="block p-5 transition-colors hover:bg-[var(--surface-2)]"
            >
              <PlayerScoutCard
                handle={player.handle}
                game={player.game}
                role={player.role}
                rank={player.rank}
                school={player.school}
                imageUrl={player.imageUrl}
                badge={
                  player.inviteStatus === "pending" ? "Invite sent" : undefined
                }
                className="border-0 bg-transparent p-0"
              />
            </Link>

            <div className="mt-auto border-t border-[var(--border)] px-5 py-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  disabled={
                    loadingId === player.playerProfileId ||
                    player.inviteStatus === "pending"
                  }
                  onClick={() => setInviteTarget(player)}
                  className="gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {player.inviteStatus === "pending" ? "Invited" : "Send invite"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={loadingId === player.playerProfileId}
                  onClick={() => remove(player.playerProfileId)}
                  className="gap-1.5 text-[var(--foreground-muted)]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--foreground-muted)]">
        Players receive your custom message on their dashboard and can accept or decline
        directly — no invite code required.
      </p>

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
