"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { RosterMember } from "@/lib/team-roster";
import { Button } from "@/components/ui/button";

function memberInitial(member: RosterMember) {
  const src = member.handle ?? member.displayName ?? member.email ?? "?";
  return src.charAt(0).toUpperCase();
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
      const data = await res.json();
      if (!res.ok) {
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

  if (members.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 py-12 text-center">
        <p className="text-sm text-zinc-500">No one on {teamName}&apos;s roster yet.</p>
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
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
              Leadership
            </p>
          )}
          <div className={compact ? "space-y-2" : "grid gap-2 sm:grid-cols-2"}>
            {staff.map((member) => (
              <MemberCard key={member.membershipId} member={member} compact={compact} />
            ))}
          </div>
        </section>
      )}

      {players.length > 0 && (
        <section className="space-y-2">
          {!compact && (
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
              Players
            </p>
          )}
          <div className={compact ? "space-y-2" : "grid gap-2 sm:grid-cols-2 lg:grid-cols-3"}>
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
  const label = member.handle ?? member.displayName ?? member.email ?? "Member";
  const staffRole = roleLabel(member.role);
  const gameLine = [member.game, member.roleInGame, member.rank].filter(Boolean).join(" · ");

  return (
    <article
      className={
        compact
          ? "group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-white/10"
          : "group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-cyan-400/15 hover:bg-cyan-400/[0.02]"
      }
    >
      <span
        className={
          compact
            ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 text-xs font-semibold text-zinc-200"
            : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 text-sm font-semibold text-zinc-200"
        }
      >
        {memberInitial(member)}
      </span>

      <div className="min-w-0 flex-1">
        {member.handle ? (
          <Link
            href={`/dashboard/scout/${member.handle}`}
            className="truncate font-medium text-white hover:text-cyan-200"
          >
            {member.handle}
          </Link>
        ) : (
          <p className="truncate font-medium text-white">{label}</p>
        )}

        {staffRole ? (
          <p className="mt-0.5 text-xs text-cyan-400/80">{staffRole}</p>
        ) : gameLine ? (
          <p className="mt-0.5 truncate text-xs text-zinc-500">{gameLine}</p>
        ) : null}

        {!compact && member.hoursPerWeek != null && (
          <p className="mt-1 text-[11px] text-zinc-600">{member.hoursPerWeek} hrs/week</p>
        )}
      </div>

      {canManage && member.role === "player" && onRemove && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={loading}
          onClick={onRemove}
          className="h-8 w-8 shrink-0 p-0 text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-300"
          aria-label={`Remove ${label}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </article>
  );
}
