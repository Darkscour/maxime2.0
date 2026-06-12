import { Badge } from "@/components/ui/badge";
import { MapPin, Users } from "lucide-react";
import type { PublicTeamListing } from "@/lib/teams-directory";
import { TeamJoinRequestButton } from "@/components/dashboard/team-join-request-button";

export function TeamsDirectory({
  teams,
  playerOnTeam,
  pendingRequestTeamIds = [],
  pendingInviteTeamIds = [],
}: {
  teams: PublicTeamListing[];
  playerOnTeam: boolean;
  pendingRequestTeamIds?: string[];
  pendingInviteTeamIds?: string[];
}) {
  if (teams.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-[var(--surface)]/50 p-10 text-center">
        <p className="text-sm text-zinc-400">
          No teams have registered yet. Check back soon as orgs join Maxime.
        </p>
      </div>
    );
  }

  const pendingRequests = new Set(pendingRequestTeamIds);
  const pendingInvites = new Set(pendingInviteTeamIds);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          playerOnTeam={playerOnTeam}
          requestPending={pendingRequests.has(team.id)}
          invitePending={pendingInvites.has(team.id)}
        />
      ))}
    </div>
  );
}

function TeamCard({
  team,
  playerOnTeam,
  requestPending,
  invitePending,
}: {
  team: PublicTeamListing;
  playerOnTeam: boolean;
  requestPending: boolean;
  invitePending: boolean;
}) {
  const rosterHint =
    team.rosterSize != null && team.rosterSize > 0
      ? `${team.memberCount} / ${team.rosterSize} roster`
      : `${team.memberCount} member${team.memberCount === 1 ? "" : "s"}`;

  let joinDisabled = false;
  let joinDisabledReason: string | undefined;

  if (playerOnTeam) {
    joinDisabled = true;
    joinDisabledReason = "Leave your current team before requesting to join another.";
  } else if (invitePending) {
    joinDisabled = true;
    joinDisabledReason = "This team already invited you — check Team invites on your dashboard.";
  }

  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/5 bg-[var(--surface)] p-5 transition-colors hover:border-cyan-400/20">
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

      <div className="mt-auto pt-4">
        <TeamJoinRequestButton
          teamId={team.id}
          teamName={team.name}
          disabled={joinDisabled}
          disabledReason={joinDisabledReason}
          initialPending={requestPending}
        />
      </div>
    </article>
  );
}
