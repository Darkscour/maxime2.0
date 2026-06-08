import { Badge } from "@/components/ui/badge";
import { MapPin, Users } from "lucide-react";
import type { PublicTeamListing } from "@/lib/teams-directory";

export function TeamsDirectory({ teams }: { teams: PublicTeamListing[] }) {
  if (teams.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-[var(--surface)]/50 p-10 text-center">
        <p className="text-sm text-zinc-400">
          No teams have registered yet. Check back soon as orgs join Maxime.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}

function TeamCard({ team }: { team: PublicTeamListing }) {
  const rosterHint =
    team.rosterSize != null && team.rosterSize > 0
      ? `${team.memberCount} / ${team.rosterSize} roster`
      : `${team.memberCount} member${team.memberCount === 1 ? "" : "s"}`;

  return (
    <article className="rounded-2xl border border-white/5 bg-[var(--surface)] p-5 transition-colors hover:border-cyan-400/20">
      <h2 className="font-heading text-lg font-semibold text-white">{team.name}</h2>
      {team.school && (
        <p className="mt-1 text-sm text-zinc-400">{team.school}</p>
      )}

      <dl className="mt-4 space-y-2 text-sm text-zinc-400">
        {team.region && (
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
            <span>{team.region}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
          <span>{rosterHint}</span>
        </div>
      </dl>

      {team.games.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {team.games.map((game) => (
            <Badge key={game} tone="cyan">
              {game}
            </Badge>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-zinc-500">
        Request to join by asking the org for their invite code, then paste it above.
      </p>
    </article>
  );
}
