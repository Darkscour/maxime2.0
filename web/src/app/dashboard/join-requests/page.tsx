import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import { fetchPendingJoinRequestsWithAvatars } from "@/lib/team-join-request-db";
import { JoinRequestsPanel } from "@/components/dashboard/join-requests-panel";
import { DashboardSectionEyebrow } from "@/components/dashboard/dashboard-section-eyebrow";
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
      <header>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground-muted)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <DashboardSectionEyebrow accent="violet" className="mt-5">
          Recruitment
        </DashboardSectionEyebrow>
        <h1 className="font-heading mt-2 text-3xl font-semibold text-[var(--foreground)]">
          Join requests
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
          {ctx.accountTier === "collegiate"
            ? `Players at your school who requested to join ${ctx.team.name}. Only collegiate players from your campus appear here.`
            : `Grassroots players who requested to join ${ctx.team.name}.`}
        </p>
      </header>

      <JoinRequestsPanel items={items} teamName={ctx.team.name} />
    </div>
  );
}
