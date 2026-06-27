import Link from "next/link";
import { Activity, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type ManagerTeamSnapshotCardProps = {
  games: string[];
  region: string | null;
  school: string | null;
  memberCount: number;
  rosterSize: number | null;
  pendingJoinRequests: number;
  className?: string;
};

/** Compact team snapshot — same footprint as other overview stat cards. */
export function ManagerTeamSnapshotCard({
  games,
  region,
  school,
  memberCount,
  rosterSize,
  pendingJoinRequests,
  className,
}: ManagerTeamSnapshotCardProps) {
  const primaryGame = games[0] ?? "—";
  const extraGames = games.length > 1 ? ` +${games.length - 1}` : "";
  const location = [school, region].filter(Boolean).join(" · ");
  const rosterLabel =
    rosterSize != null && rosterSize > 0
      ? `${memberCount}/${rosterSize} roster`
      : `${memberCount} on roster`;

  const hintParts = [location, rosterLabel].filter(Boolean);
  const hint = hintParts.join(" · ") || "Team overview";

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/5 bg-[var(--surface)] p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Team snapshot</p>
          <p className="font-heading mt-2 truncate text-2xl font-semibold text-white">
            {primaryGame}
            {extraGames && (
              <span className="text-base font-normal text-zinc-500">{extraGames}</span>
            )}
          </p>
          <p className="mt-1 truncate text-xs text-zinc-500">{hint}</p>
          {pendingJoinRequests > 0 && (
            <Link
              href="/dashboard/join-requests"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-cyan-400/90 hover:text-cyan-300"
            >
              <Users className="h-3 w-3" />
              {pendingJoinRequests} join request
              {pendingJoinRequests === 1 ? "" : "s"}
            </Link>
          )}
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-inset ring-white/10">
          <Activity className="h-4 w-4 text-violet-400" />
        </span>
      </div>
    </div>
  );
}
