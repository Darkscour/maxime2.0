import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { getDashboardContext } from "@/lib/auth-user";
import { listScoutablePlayers } from "@/lib/player-analytics";
import { Badge } from "@/components/ui/badge";

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
            <Link
              key={player.id}
              href={`/dashboard/scout/${player.handle}`}
              className="group rounded-2xl border border-white/5 bg-[var(--surface)] p-5 transition-colors hover:border-violet-400/25"
            >
              <h2 className="font-heading text-lg font-semibold text-white group-hover:text-violet-200">
                {player.handle}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                {player.game} · {player.role} · {player.rank}
              </p>
              {player.school && (
                <p className="mt-2 text-xs text-zinc-500">{player.school}</p>
              )}
              {player.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {player.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} tone="violet">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
