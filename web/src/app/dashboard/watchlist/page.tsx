import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import { fetchTeamWatchlist } from "@/lib/player-watchlist-db";
import { WatchlistPanel } from "@/components/dashboard/watchlist-panel";
import { canEditTeam } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const ctx = await getDashboardContext();

  if (ctx.accountType !== "team_manager") {
    redirect("/dashboard");
  }

  if (!ctx.team || !canEditTeam(ctx.membershipRole)) {
    redirect("/dashboard/settings/team");
  }

  const items = await fetchTeamWatchlist(ctx.team.id);

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
          Recruitment
        </p>
        <h1 className="font-heading mt-2 text-3xl font-semibold text-white">
          Watchlist
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
          Shortlist players you&apos;re considering, then send invites when you&apos;re
          ready to recruit them to {ctx.team.name}.
        </p>
      </header>

      <WatchlistPanel items={items} teamName={ctx.team.name} />
    </div>
  );
}
