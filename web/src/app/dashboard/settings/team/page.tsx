import { redirect } from "next/navigation";
import {
  TeamProfileEditForm,
  type TeamProfileFormData,
} from "@/components/dashboard/team-profile-edit-form";
import { DeskEmpty, DeskPageHeader } from "@/components/dashboard/desk-ui";
import { canEditTeam } from "@/lib/permissions";
import { getDashboardContext } from "@/lib/auth-user";

export const dynamic = "force-dynamic";

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
        <DeskPageHeader
          title="Team"
          job="Org details for your roster. Only captains and managers can edit."
        />
        <DeskEmpty
          title="View only"
          body="Ask your captain or a manager to update team details."
        />
      </div>
    );
  }

  return <TeamProfileEditForm initial={toFormData(ctx.team)} />;
}
