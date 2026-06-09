"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, Mail, Trash2 } from "lucide-react";
import type { WatchlistRow } from "@/lib/player-watchlist-db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InviteMessageModal } from "@/components/dashboard/invite-message-modal";

export function WatchlistPanel({
  items,
  teamName,
}: {
  items: WatchlistRow[];
  teamName: string;
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [inviteTarget, setInviteTarget] = useState<WatchlistRow | null>(null);

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
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Could not remove player.");
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
        <Bookmark className="mx-auto h-8 w-8 text-zinc-600" />
        <p className="mt-4 text-sm text-zinc-400">
          Your watchlist is empty. Browse{" "}
          <Link href="/dashboard/scout" className="text-cyan-400 hover:text-cyan-300">
            scout players
          </Link>{" "}
          and save candidates to compare before recruiting.
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
            className="rounded-2xl border border-white/5 bg-[var(--surface)] p-5"
          >
            <Link
              href={`/dashboard/scout/${player.handle}`}
              className="font-heading text-lg font-semibold text-white hover:text-violet-200"
            >
              {player.handle}
            </Link>
            <p className="mt-1 text-sm text-zinc-400">
              {player.game} · {player.role} · {player.rank}
            </p>
            {player.school && (
              <p className="mt-1 text-xs text-zinc-500">{player.school}</p>
            )}
            {player.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {player.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} tone="violet">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            {player.inviteStatus === "pending" && (
              <p className="mt-3 text-xs text-emerald-400">Invite sent — awaiting response</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="primary"
                disabled={loadingId === player.playerProfileId || player.inviteStatus === "pending"}
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
                className="gap-1.5 text-zinc-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </Button>
            </div>
          </article>
        ))}
      </div>
      <p className="text-xs text-zinc-600">
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
