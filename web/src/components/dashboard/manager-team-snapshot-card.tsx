import Link from "next/link";
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

/** Compact recruiting health for activity strips. */
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
      <p className="desk-kicker !text-[var(--foreground-muted)]">Team snapshot</p>
      <p className="mt-2 break-words font-heading text-[1.75rem] font-semibold leading-[0.95] tracking-[-0.02em] text-[var(--foreground)]">
        {headline}
      </p>
      <p className="mt-2 break-words text-xs leading-5 text-[var(--foreground-muted)]">
        {hint}
      </p>
      {pendingJoinRequests > 0 && (
        <Link
          href="/dashboard/join-requests"
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
        >
          Review join requests
        </Link>
      )}
    </div>
  );
}
