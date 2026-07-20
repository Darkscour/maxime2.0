import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import {
  TeamProfileEditForm,
  type TeamProfileFormData,
} from "@/components/dashboard/team-profile-edit-form";
import { DashboardSectionEyebrow } from "@/components/dashboard/dashboard-section-eyebrow";

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
    profileImageUrl: team.profileImageUrl ?? "",
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
        <header className="relative overflow-hidden rounded-none border border-[var(--foreground)] bg-[var(--surface)] p-6 sm:p-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <DashboardSectionEyebrow accent="cyan" className="mt-5">
            Team
          </DashboardSectionEyebrow>
          <h1 className="font-heading mt-2 text-2xl font-semibold text-[var(--foreground)]">
            Team settings
          </h1>
        </header>
        <div className="rounded-none border border-[var(--foreground)] bg-[var(--surface)] p-8 text-center">
          <Building2 className="mx-auto h-8 w-8 text-[var(--foreground-muted)]" />
          <p className="mt-4 text-sm leading-6 text-[var(--foreground-muted)]">
            Only captains and managers can edit org info. Ask your captain to update
            team details.
          </p>
        </div>
      </div>
    );
  }

  return <TeamProfileEditForm initial={toFormData(ctx.team)} />;
}
