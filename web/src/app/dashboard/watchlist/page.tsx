import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import { fetchTeamWatchlistWithAvatars } from "@/lib/player-watchlist-db";
import { WatchlistPanel } from "@/components/dashboard/watchlist-panel";
import { DashboardSectionEyebrow } from "@/components/dashboard/dashboard-section-eyebrow";
import { canEditTeam } from "@/lib/permissions";
import { managerPoolContext } from "@/lib/audience-guards";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const ctx = await getDashboardContext();

  if (ctx.accountType !== "team_manager") {
    redirect("/dashboard");
  }

  if (!ctx.team || !canEditTeam(ctx.membershipRole)) {
    redirect("/dashboard/settings/team");
  }

  const items = await fetchTeamWatchlistWithAvatars(
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
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <DashboardSectionEyebrow accent="violet" className="mt-5">
          Recruitment
        </DashboardSectionEyebrow>
        <h1 className="font-heading mt-2 text-3xl font-semibold text-white">
          Watchlist
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
          {ctx.accountTier === "collegiate"
            ? `Shortlist collegiate players at your school, then send invites when you're ready to recruit them to ${ctx.team.name}.`
            : `Shortlist grassroots players, then send invites when you're ready to recruit them to ${ctx.team.name}.`}
        </p>
      </header>

      <WatchlistPanel items={items} teamName={ctx.team.name} />
    </div>
  );
}
