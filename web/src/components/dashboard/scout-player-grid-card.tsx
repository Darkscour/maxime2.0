"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, Mail } from "lucide-react";
import { PlayerScoutCard } from "@/components/dashboard/player-scout-card";
import { InviteMessageModal } from "@/components/dashboard/invite-message-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ScoutGridPlayer = {
  id: string;
  handle: string;
  game: string;
  role: string;
  rank: string;
  school: string | null;
  imageUrl: string | null;
};

export function ScoutPlayerGridCard({
  player,
  teamName,
  canManage,
  onWatchlist,
  invitePending,
  joinRequestPending,
  onRoster,
}: {
  player: ScoutGridPlayer;
  teamName: string;
  canManage: boolean;
  onWatchlist: boolean;
  invitePending: boolean;
  joinRequestPending: boolean;
  onRoster: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(onWatchlist);
  const [invited, setInvited] = useState(invitePending);
  const [saveLoading, setSaveLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [error, setError] = useState("");

  const defaultInviteMessage = useMemo(
    () =>
      `Hi ${player.handle}, ${teamName} would like to invite you to join our roster. Accept the invite from your dashboard when you're ready.`,
    [player.handle, teamName],
  );

  async function saveToWatchlist() {
    if (saved || onRoster) return;
    setError("");
    setSaveLoading(true);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerProfileId: player.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save player.");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSaveLoading(false);
    }
  }

  async function sendInvite(message: string) {
    setError("");
    setInviteLoading(true);
    try {
      const res = await fetch("/api/watchlist/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerProfileId: player.id, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not send invite.");
        return;
      }
      setInvited(true);
      setInviteOpen(false);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setInviteLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border bg-[var(--surface)] transition-colors",
        joinRequestPending
          ? "border-cyan-400/25 hover:border-cyan-400/35"
          : "border-white/5 hover:border-violet-400/20",
      )}
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
          badge={joinRequestPending ? "Requested to join" : undefined}
          className="border-0 bg-transparent p-0"
        />
      </Link>

      {canManage && (
        <div className="mt-auto border-t border-white/5 px-5 py-4">
          {onRoster ? (
            <p className="text-xs text-zinc-500">Already on your roster</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={saved ? "outline" : "ghost"}
                disabled={saveLoading || saved}
                onClick={saveToWatchlist}
                className="gap-1.5"
              >
                {saved ? (
                  <>
                    <BookmarkCheck className="h-3.5 w-3.5" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-3.5 w-3.5" />
                    {saveLoading ? "Saving…" : "Save"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="primary"
                disabled={inviteLoading || invited}
                onClick={() => setInviteOpen(true)}
                className="gap-1.5"
              >
                <Mail className="h-3.5 w-3.5" />
                {invited
                  ? "Invited"
                  : joinRequestPending
                    ? "Send invite"
                    : "Invite"}
              </Button>
            </div>
          )}
          {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
        </div>
      )}

      <InviteMessageModal
        open={inviteOpen}
        playerHandle={player.handle}
        teamName={teamName}
        defaultMessage={defaultInviteMessage}
        loading={inviteLoading}
        onClose={() => setInviteOpen(false)}
        onSend={sendInvite}
      />
    </div>
  );
}
