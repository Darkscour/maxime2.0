import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { RosterMember } from "@/lib/team-roster";
import { RosterHubPanel } from "@/components/dashboard/roster-hub-panel";
import { Button } from "@/components/ui/button";

export function RosterHubPreview({
  members,
  teamName,
  canManage,
}: {
  members: RosterMember[];
  teamName: string;
  canManage: boolean;
}) {
  return (
    <div className="desk-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="desk-kicker !text-[var(--foreground-muted)]">Roster</p>
          <h2 className="mt-1 font-heading text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
            {teamName}
          </h2>
        </div>
        <Button href="/dashboard/roster" size="sm" variant="outline" className="gap-1.5">
          Manage roster
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="mt-5">
        <RosterHubPanel
          members={members.slice(0, 4)}
          teamName={teamName}
          canManage={canManage}
          compact
        />
      </div>

      {members.length > 4 && (
        <Link
          href="/dashboard/roster"
          className="mt-4 inline-block text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)]"
        >
          View all {members.length} members →
        </Link>
      )}
    </div>
  );
}
