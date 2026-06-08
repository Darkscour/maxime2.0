import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import { listPublicTeams } from "@/lib/teams-directory";
import { TeamsDirectory } from "@/components/dashboard/teams-directory";
import { DashboardJoinTeamPanel } from "@/components/dashboard/dashboard-join-team-panel";

export const dynamic = "force-dynamic";

export default async function DashboardTeamsPage() {
  const ctx = await getDashboardContext();

  if (ctx.accountType === "team_manager") {
    redirect("/dashboard");
  }

  const teams = await listPublicTeams();

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
          Teams
        </p>
        <h1 className="font-heading mt-2 text-3xl font-semibold text-white">
          Browse registered teams
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
          Explore orgs on Maxime and join one with an invite code from their captain
          or manager.
        </p>
      </header>

      <section className="rounded-2xl border border-white/5 bg-[var(--surface)] p-6">
        <h2 className="font-heading text-lg font-semibold text-white">
          Join with an invite code
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Found a team you like? Get their code and join your roster.
        </p>
        <div className="mt-5">
          <DashboardJoinTeamPanel hasTeam={!!ctx.team} />
        </div>
      </section>

      <section>
        <h2 className="font-heading mb-4 text-lg font-semibold text-white">
          {teams.length} team{teams.length === 1 ? "" : "s"} on Maxime
        </h2>
        <TeamsDirectory teams={teams} />
      </section>
    </div>
  );
}
