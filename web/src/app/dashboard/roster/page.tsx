import { redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/auth-user";
import { fetchTeamRosterWithAvatars } from "@/lib/team-roster";
import { RosterHubPanel } from "@/components/dashboard/roster-hub-panel";
import { DeskPageHeader } from "@/components/dashboard/desk-ui";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
      <DeskPageHeader
        title={ctx.team.name}
        job={`${members.length} on the roster. Accepted invites land here automatically.`}
        action={
          canManage ? (
            <Button href="/dashboard/scout" size="sm" variant="outline">
              Scout players
            </Button>
          ) : undefined
        }
      />

      <RosterHubPanel
        members={members}
        teamName={ctx.team.name}
        canManage={canManage}
      />
    </div>
  );
}
