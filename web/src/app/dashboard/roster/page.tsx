import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import { fetchTeamRoster } from "@/lib/team-roster";
import { RosterHubPanel } from "@/components/dashboard/roster-hub-panel";
import { canEditTeam } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function RosterHubPage() {
  const ctx = await getDashboardContext();

  if (ctx.accountType !== "team_manager") {
    redirect("/dashboard");
  }

  if (!ctx.team) {
    redirect("/dashboard/settings/team");
  }

  const members = await fetchTeamRoster(ctx.team.id);
  const canManage = canEditTeam(ctx.membershipRole);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Roster hub
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <h1 className="font-heading text-3xl font-semibold text-white">
            {ctx.team.name}
          </h1>
          <span className="text-sm text-zinc-500">
            {members.length} on team
          </span>
        </div>
      </header>

      <RosterHubPanel
        members={members}
        teamName={ctx.team.name}
        canManage={canManage}
      />
    </div>
  );
}
