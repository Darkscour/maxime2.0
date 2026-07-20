import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import { fetchTeamRosterWithAvatars } from "@/lib/team-roster";
import { RosterHubPanel } from "@/components/dashboard/roster-hub-panel";
import { DashboardSectionEyebrow } from "@/components/dashboard/dashboard-section-eyebrow";
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

  const members = await fetchTeamRosterWithAvatars(ctx.team.id);
  const canManage = canEditTeam(ctx.membershipRole);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground-muted)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <DashboardSectionEyebrow accent="cyan" className="mt-5">
          Team
        </DashboardSectionEyebrow>
        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <h1 className="font-heading text-3xl font-semibold text-[var(--foreground)]">
            {ctx.team.name}
          </h1>
          <span className="text-sm text-[var(--foreground-muted)]">
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
