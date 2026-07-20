import { redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/auth-user";
import { fetchPendingJoinRequestsWithAvatars } from "@/lib/team-join-request-db";
import { JoinRequestsPanel } from "@/components/dashboard/join-requests-panel";
import { DeskPageHeader } from "@/components/dashboard/desk-ui";
import { Button } from "@/components/ui/button";
import { canEditTeam } from "@/lib/permissions";
import { managerPoolContext } from "@/lib/audience-guards";

export const dynamic = "force-dynamic";

export default async function JoinRequestsPage() {
  const ctx = await getDashboardContext();

  if (ctx.accountType !== "team_manager") {
    redirect("/dashboard");
  }

  if (!ctx.team || !canEditTeam(ctx.membershipRole)) {
    redirect("/dashboard/settings/team");
  }

  const items = await fetchPendingJoinRequestsWithAvatars(
    ctx.team.id,
    managerPoolContext({
      accountTier: ctx.team.accountTier ?? ctx.accountTier,
      institutionId: ctx.team.institutionId ?? null,
    }),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <DeskPageHeader
        title="Join requests"
        job={
          ctx.accountTier === "collegiate"
            ? `Players at your school who asked to join ${ctx.team.name}. Send an invite to approve.`
            : `Players who asked to join ${ctx.team.name}. Send an invite to approve.`
        }
        action={
          <Button href="/dashboard/scout" size="sm" variant="outline">
            Scout instead
          </Button>
        }
      />

      <JoinRequestsPanel items={items} teamName={ctx.team.name} />
    </div>
  );
}
