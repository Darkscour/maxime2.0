import Link from "next/link";
import { Activity, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardStatCardClassName } from "@/components/dashboard/dashboard-cards";

type ManagerTeamSnapshotCardProps = {
  memberCount: number;
  rosterSize: number | null;
  pendingJoinRequests: number;
  pendingInvites: number;
  className?: string;
};

function rosterHeadline(memberCount: number, rosterSize: number | null): string {
  if (rosterSize != null && rosterSize > 0) {
    const openSlots = Math.max(0, rosterSize - memberCount);
    if (openSlots === 0) return "Roster full";
    if (openSlots === 1) return "1 slot open";
    return `${openSlots} slots open`;
  }
  return "Roster active";
}

function pipelineHint(pendingJoinRequests: number, pendingInvites: number): string {
  const parts: string[] = [];

  if (pendingJoinRequests > 0) {
    parts.push(
      `${pendingJoinRequests} join request${pendingJoinRequests === 1 ? "" : "s"}`,
    );
  }

  if (pendingInvites > 0) {
    parts.push(
      `${pendingInvites} invite${pendingInvites === 1 ? "" : "s"} pending`,
    );
  }

  return parts.length > 0 ? parts.join(" · ") : "No pending requests";
}

/** Compact recruiting health — same footprint as other overview stat cards. */
export function ManagerTeamSnapshotCard({
  memberCount,
  rosterSize,
  pendingJoinRequests,
  pendingInvites,
  className,
}: ManagerTeamSnapshotCardProps) {
  const headline = rosterHeadline(memberCount, rosterSize);
  const hint = pipelineHint(pendingJoinRequests, pendingInvites);

  return (
    <div className={cn(dashboardStatCardClassName, className)}>
      <div className="flex flex-1 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-zinc-500">
            Team snapshot
          </p>
          <p className="font-heading mt-2 truncate text-2xl font-semibold text-white">
            {headline}
          </p>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">{hint}</p>
          {pendingJoinRequests > 0 && (
            <Link
              href="/dashboard/join-requests"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-cyan-400/90 hover:text-cyan-300"
            >
              <Users className="h-3 w-3 shrink-0" />
              Review join requests
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
