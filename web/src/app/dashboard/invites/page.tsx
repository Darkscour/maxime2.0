import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import { fetchPendingInvitesForPlayer } from "@/lib/player-watchlist-db";
import { DashboardSectionEyebrow } from "@/components/dashboard/dashboard-section-eyebrow";
import { TeamInvitesPanel } from "@/components/dashboard/team-invites-panel";

export const dynamic = "force-dynamic";

export default async function TeamInvitesPage() {
  const ctx = await getDashboardContext();

  if (ctx.accountType === "team_manager") {
    redirect("/dashboard");
  }

  if (!ctx.playerProfile) {
    redirect("/onboarding");
  }

  const invites = await fetchPendingInvitesForPlayer(ctx.playerProfile.id, {
    accountTier: ctx.playerProfile.accountTier ?? ctx.accountTier,
    institutionId: ctx.playerProfile.institutionId,
  });

  const isGrassroots = ctx.accountTier === "grassroots";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <DashboardSectionEyebrow accent="cyan" className="mt-5">
          Explore
        </DashboardSectionEyebrow>
        <h1 className="font-heading mt-2 text-3xl font-semibold text-white">Team invites</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
          {isGrassroots
            ? "Accept or decline recruitment invites from grassroots teams. Managers can also invite you after you request to join."
            : "Accept or decline recruitment invites from collegiate teams at your school. Managers can also invite you after you request to join."}
        </p>
      </header>

      <TeamInvitesPanel
        invites={invites}
        onTeam={!!ctx.team}
        currentTeamName={ctx.team?.name}
      />
    </div>
  );
}
