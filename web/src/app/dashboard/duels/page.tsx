import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import { canEditTeam } from "@/lib/permissions";
import { DuelsPanel } from "@/components/dashboard/duels-panel";
import { listPublicTeams } from "@/lib/teams-directory";
import { listDuelsForTeam } from "@/lib/duels";
import type { PublicTeamListing } from "@/lib/teams-directory";

export const dynamic = "force-dynamic";

export default async function DuelsPage() {
  const ctx = await getDashboardContext();
  if (ctx.accountType !== "team_manager" || ctx.accountTier !== "grassroots") {
    redirect("/dashboard");
  }
  if (!ctx.team || !canEditTeam(ctx.membershipRole)) {
    redirect("/dashboard/settings/team");
  }

  const [duels, teams] = await Promise.all([
    listDuelsForTeam(ctx.team.id),
    listPublicTeams("grassroots"),
  ]);

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
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
          Grassroots
        </p>
        <h1 className="font-heading mt-2 text-3xl font-semibold text-white">Duels</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
          Challenge other grassroots teams and track responses.
        </p>
      </header>

      <DuelsPanel
        teamId={ctx.team.id}
        teams={teams
          .filter((team: PublicTeamListing) => team.id !== ctx.team!.id)
          .map((team: PublicTeamListing) => ({ id: team.id, name: team.name }))}
        initialDuels={duels}
      />
    </div>
  );
}

