"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { InviteMessageModal } from "@/components/dashboard/invite-message-modal";
import { Button } from "@/components/ui/button";
import { parseJsonResponse } from "@/lib/safe-json";

export function ScoutJoinRequestActions({
  playerProfileId,
  playerHandle,
  teamName,
  joinRequestPending,
  invitePending,
}: {
  playerProfileId: string;
  playerHandle: string;
  teamName: string;
  joinRequestPending: boolean;
  invitePending: boolean;
}) {
  const router = useRouter();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invited, setInvited] = useState(invitePending);
  const [error, setError] = useState("");

  const defaultMessage = useMemo(
    () =>
      joinRequestPending
        ? `Hi ${playerHandle}, thanks for requesting to join ${teamName}! We'd like to invite you to our roster — accept the invite from your dashboard when you're ready.`
        : `Hi ${playerHandle}, ${teamName} would like to invite you to join our roster. Accept the invite from your dashboard when you're ready.`,
    [joinRequestPending, playerHandle, teamName],
  );

  async function sendInvite(message: string) {
    setError("");
    setLoading(true);
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
      setInvited(true);
      setInviteOpen(false);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!joinRequestPending && !invitePending && invited) {
    return <p className="text-sm text-emerald-400">Invite sent — awaiting response</p>;
  }

  return (
    <div className="space-y-3">
      {joinRequestPending && (
        <div className="rounded-none border border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-4 py-3">
          <p className="text-sm font-medium text-[var(--accent)]">Requested to join your team</p>
          <p className="mt-1 text-xs leading-5 text-[var(--accent)]/70">
            This player asked to join {teamName}. Send a recruitment invite so they can
            accept from their dashboard.
          </p>
        </div>
      )}

      <Button
        type="button"
        size="sm"
        variant="primary"
        disabled={loading || invited || invitePending}
        onClick={() => setInviteOpen(true)}
        className="gap-2"
      >
        <Mail className="h-4 w-4" />
        {invited || invitePending ? "Invited" : "Send invite"}
      </Button>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <InviteMessageModal
        open={inviteOpen}
        playerHandle={playerHandle}
        teamName={teamName}
        defaultMessage={defaultMessage}
        loading={loading}
        onClose={() => setInviteOpen(false)}
        onSend={sendInvite}
      />
    </div>
  );
}
