import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import { listScoutablePlayers } from "@/lib/player-analytics";
import { PlayerScoutCardLink } from "@/components/dashboard/player-scout-card";

export const dynamic = "force-dynamic";

export default async function DashboardScoutPage() {
  const ctx = await getDashboardContext();

  if (ctx.accountType !== "team_manager") {
    redirect("/dashboard");
  }

  const players = await listScoutablePlayers();

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
          Scout
        </p>
        <h1 className="font-heading mt-2 text-3xl font-semibold text-white">
          Player profiles
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
          Browse registered players on Maxime. Opening a profile counts as a view on
          their analytics dashboard.
        </p>
      </header>

      {players.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[var(--surface)]/50 p-10 text-center">
          <Search className="mx-auto h-8 w-8 text-zinc-600" />
          <p className="mt-4 text-sm text-zinc-400">
            No player profiles yet. They&apos;ll appear here as players complete
            onboarding.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => (
            <PlayerScoutCardLink
              key={player.id}
              href={`/dashboard/scout/${player.handle}`}
              handle={player.handle}
              game={player.game}
              role={player.role}
              rank={player.rank}
              school={player.school}
              imageUrl={player.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
