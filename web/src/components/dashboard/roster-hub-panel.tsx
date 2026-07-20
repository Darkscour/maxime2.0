"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { RosterMember } from "@/lib/team-roster";
import { PlayerScoutCard } from "@/components/dashboard/player-scout-card";
import { Button } from "@/components/ui/button";
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
  const [error, setError] = useState("");

  const staff = members.filter((m) => m.role === "captain" || m.role === "manager");
  const players = members.filter((m) => m.role === "player");

  async function removePlayer(userId: string) {
    if (!confirm("Remove this player from your roster?")) return;
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
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoadingId(null);
    }
  }

  if (members.length === 0) {
    return (
      <div className="rounded-none border border-dashed border-[var(--border)] py-12 text-center">
        <p className="text-sm text-[var(--foreground-muted)]">No one on {teamName}&apos;s roster yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      {staff.length > 0 && (
        <section className="space-y-2">
          {!compact && (
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
              Leadership
            </p>
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
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
              Players
            </p>
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
                onRemove={() => removePlayer(member.userId)}
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
  onRemove,
}: {
  member: RosterMember;
  compact?: boolean;
  canManage?: boolean;
  loading?: boolean;
  onRemove?: () => void;
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
        "group flex flex-col rounded-none border border-[var(--foreground)] bg-[var(--surface)] transition-colors",
        !compact && "hover:border-[var(--border)]",
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

      {canManage && member.role === "player" && onRemove && (
        <div className="mt-auto border-t border-[var(--border)] px-5 py-3">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={loading}
            onClick={onRemove}
            className="gap-1.5 text-[var(--foreground-muted)] hover:text-red-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {loading ? "Removing…" : "Remove from roster"}
          </Button>
        </div>
      )}
    </article>
  );
}
