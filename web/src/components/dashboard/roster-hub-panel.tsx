"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { RosterMember } from "@/lib/team-roster";
import { PlayerScoutCard } from "@/components/dashboard/player-scout-card";
import { Button } from "@/components/ui/button";
import { DeskEmpty } from "@/components/dashboard/desk-ui";
import { cn } from "@/lib/utils";
import { parseJsonResponse } from "@/lib/safe-json";

function memberLabel(member: RosterMember) {
  return member.handle ?? member.displayName ?? member.email ?? "Member";
}

function roleLabel(role: string) {
  if (role === "captain") return "Captain";
  if (role === "manager") return "Manager";
  return null;
}

export function RosterHubPanel({
  members,
  teamName,
  canManage,
  compact = false,
}: {
  members: RosterMember[];
  teamName: string;
  canManage: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const staff = members.filter((m) => m.role === "captain" || m.role === "manager");
  const players = members.filter((m) => m.role === "player");

  async function removePlayer(userId: string) {
    setError("");
    setLoadingId(userId);
    try {
      const res = await fetch("/api/team/roster/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error || "Could not remove player.");
        return;
      }
      setConfirmId(null);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoadingId(null);
    }
  }

  if (members.length === 0) {
    return (
      <DeskEmpty
        title={`No one on ${teamName} yet`}
        body="Share your invite code or scout players and send recruitment invites."
        actionLabel="Open scout"
        actionHref="/dashboard/scout"
      />
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="border border-[color-mix(in_srgb,var(--danger)_40%,var(--border))] bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      {staff.length > 0 && (
        <section className="space-y-2">
          {!compact && (
            <p className="desk-kicker !text-[var(--foreground-muted)]">Leadership</p>
          )}
          <div
            className={
              compact ? "space-y-2" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            }
          >
            {staff.map((member) => (
              <MemberCard key={member.membershipId} member={member} compact={compact} />
            ))}
          </div>
        </section>
      )}

      {players.length > 0 && (
        <section className="space-y-2">
          {!compact && (
            <p className="desk-kicker !text-[var(--foreground-muted)]">Players</p>
          )}
          <div
            className={
              compact ? "space-y-2" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            }
          >
            {players.map((member) => (
              <MemberCard
                key={member.membershipId}
                member={member}
                compact={compact}
                canManage={canManage}
                loading={loadingId === member.userId}
                confirming={confirmId === member.userId}
                onAskRemove={() => setConfirmId(member.userId)}
                onCancelRemove={() => setConfirmId(null)}
                onConfirmRemove={() => removePlayer(member.userId)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MemberCard({
  member,
  compact,
  canManage,
  loading,
  confirming,
  onAskRemove,
  onCancelRemove,
  onConfirmRemove,
}: {
  member: RosterMember;
  compact?: boolean;
  canManage?: boolean;
  loading?: boolean;
  confirming?: boolean;
  onAskRemove?: () => void;
  onCancelRemove?: () => void;
  onConfirmRemove?: () => void;
}) {
  const label = memberLabel(member);
  const staffRole = roleLabel(member.role);
  const scoutHref = member.handle ? `/dashboard/scout/${member.handle}` : null;

  const card = (
    <PlayerScoutCard
      handle={label}
      game={member.game ?? ""}
      role={member.roleInGame ?? ""}
      rank={member.rank ?? ""}
      school={member.school}
      imageUrl={member.imageUrl}
      badge={staffRole ?? undefined}
      className="border-0 bg-transparent p-0"
    />
  );

  return (
    <article
      className={cn(
        "desk-panel group flex flex-col transition-colors",
        !compact && "hover:border-[var(--border-strong)]",
      )}
    >
      {scoutHref ? (
        <Link
          href={scoutHref}
          className="block p-5 transition-colors hover:bg-[var(--surface-2)]"
        >
          {card}
        </Link>
      ) : (
        <div className="p-5">{card}</div>
      )}

      {canManage && member.role === "player" && onAskRemove && (
        <div className="mt-auto border-t border-[var(--border)] px-5 py-3">
          {confirming ? (
            <div className="space-y-2">
              <p className="text-sm text-[var(--foreground-muted)]">
                Remove {label} from the roster?
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  disabled={loading}
                  onClick={onConfirmRemove}
                >
                  {loading ? "Removing…" : "Remove"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={loading}
                  onClick={onCancelRemove}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={loading}
              onClick={onAskRemove}
              className="gap-1.5 text-[var(--foreground-muted)] hover:text-[var(--danger)]"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove from roster
            </Button>
          )}
        </div>
      )}
    </article>
  );
}
