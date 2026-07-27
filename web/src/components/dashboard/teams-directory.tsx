"use client";

import type { PublicTeamListing } from "@/lib/teams-directory";
import { TeamJoinRequestButton } from "@/components/dashboard/team-join-request-button";
import { DeskEmpty } from "@/components/dashboard/desk-ui";
import { cn } from "@/lib/utils";

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
      <DeskEmpty
        title="No teams yet"
        body="Orgs appear here as they join Maxime. Check back soon, or wait for an invite code."
      />
    );
  }

  const pendingRequests = new Set(pendingRequestTeamIds);
  const pendingInvites = new Set(pendingInviteTeamIds);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

function TeamCardAvatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      className="font-heading flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--md-primary)] text-lg font-bold text-white"
      aria-hidden
    >
      {initial}
    </span>
  );
}

function TeamScoutCardBody({
  team,
  badge,
}: {
  team: PublicTeamListing;
  badge?: string;
}) {
  const rosterHint =
    team.rosterSize != null && team.rosterSize > 0
      ? `${team.memberCount} / ${team.rosterSize} roster`
      : `${team.memberCount} member${team.memberCount === 1 ? "" : "s"}`;

  const primaryGame = team.games[0];
  const moreGames = team.games.length > 1 ? team.games.length - 1 : 0;
  const gameLabel =
    primaryGame && moreGames > 0
      ? `${primaryGame} +${moreGames} more`
      : primaryGame;
  const detailLine = [gameLabel, team.region, rosterHint].filter(Boolean).join(" · ");

  return (
    <article className="flex items-start gap-4">
      <TeamCardAvatar name={team.name} />
      <div className="min-w-0 flex-1">
        {badge ? (
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--md-accent)]">
            {badge}
          </p>
        ) : null}
        <h2 className="font-heading text-lg font-semibold text-[var(--md-text)]">
          {team.name}
        </h2>
        <p className="mt-1 text-sm text-[var(--md-text-muted)]">{detailLine}</p>
        {team.school ? (
          <p className="mt-2 text-xs text-[var(--md-text-faint)]">{team.school}</p>
        ) : null}
      </div>
    </article>
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
  let joinDisabled = false;
  let joinDisabledReason: string | undefined;

  if (playerOnTeam) {
    joinDisabled = true;
    joinDisabledReason = "Leave your current team before requesting to join another.";
  } else if (invitePending) {
    joinDisabled = true;
    joinDisabledReason = "This team already invited you — check Team invites on your dashboard.";
  }

  const badge = requestPending
    ? "Request pending"
    : invitePending
      ? "Invited"
      : undefined;

  return (
    <article
      className={cn(
        "md-card md-scout-portal-card flex h-full flex-col !p-0 overflow-hidden transition-colors",
        requestPending && "border-[color-mix(in_srgb,var(--md-accent)_45%,#000)]",
      )}
    >
      <div className="block p-5">
        <TeamScoutCardBody team={team} badge={badge} />
      </div>

      <div className="mt-auto border-t border-[var(--md-card-border)] px-5 py-4">
        <TeamJoinRequestButton
          teamId={team.id}
          teamName={team.name}
          disabled={joinDisabled}
          disabledReason={joinDisabledReason}
          initialPending={requestPending}
          embedded
        />
      </div>
    </article>
  );
}
