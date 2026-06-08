import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import {
  TeamProfileEditForm,
  type TeamProfileFormData,
} from "@/components/dashboard/team-profile-edit-form";

export const dynamic = "force-dynamic";

import { canEditTeam } from "@/lib/permissions";

function toFormData(
  team: NonNullable<Awaited<ReturnType<typeof getDashboardContext>>["team"]>,
): TeamProfileFormData {
  return {
    name: team.name,
    school: team.school ?? "",
    games: team.games,
    region: team.region ?? "",
    rosterSize: team.rosterSize != null ? String(team.rosterSize) : "",
    discordUrl: team.discordUrl ?? "",
  };
}

export default async function TeamSettingsPage() {
  const ctx = await getDashboardContext();

  if (!ctx.team) {
    if (ctx.accountType === "team_manager") {
      redirect("/dashboard");
    }
    redirect("/dashboard/teams");
  }

  if (!canEditTeam(ctx.membershipRole)) {
    return (
      <div className="space-y-6">
        <header className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-violet-500/[0.06] via-[var(--surface)] to-cyan-400/[0.04] p-6 sm:p-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-violet-400/90">
            Team
          </p>
          <h1 className="font-heading mt-2 text-2xl font-semibold text-white">
            Team settings
          </h1>
        </header>
        <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface)]/90 p-8 text-center">
          <Building2 className="mx-auto h-8 w-8 text-zinc-600" />
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Only captains and managers can edit org info. Ask your captain to update
            team details.
          </p>
        </div>
      </div>
    );
  }

  return <TeamProfileEditForm initial={toFormData(ctx.team)} />;
}
