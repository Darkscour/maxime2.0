import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
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
    <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-inset ring-cyan-400/25">
            <Users className="h-5 w-5 text-cyan-400" />
          </span>
          <h2 className="font-heading text-lg font-semibold text-white">Roster hub</h2>
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
          className="mt-4 inline-block text-sm text-cyan-400 hover:text-cyan-300"
        >
          View all {members.length} members →
        </Link>
      )}
    </div>
  );
}
