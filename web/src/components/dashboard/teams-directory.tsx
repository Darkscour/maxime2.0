"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ExternalLink,
  MapPin,
  MessageCircle,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PublicTeamListing } from "@/lib/teams-directory";
import { TeamJoinRequestButton } from "@/components/dashboard/team-join-request-button";
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

function formatJoinedDate(date: Date | string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
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
  const [expanded, setExpanded] = useState(false);

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

  const primaryGame = team.games[0];
  const moreGames = team.games.length > 1 ? team.games.length - 1 : 0;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/5 bg-[var(--surface)] p-5 transition-colors hover:border-cyan-400/20">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-lg font-semibold text-white">{team.name}</h2>
          {team.school && (
            <p className="mt-1 truncate text-sm text-zinc-400">{team.school}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse team details" : "Expand team details"}
          className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300"
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
          />
        </button>
      </div>

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
        {primaryGame && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <Badge tone="cyan">{primaryGame}</Badge>
            {moreGames > 0 && (
              <span className="text-xs text-zinc-500">+{moreGames} more</span>
            )}
          </div>
        )}
      </dl>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-white/5 pt-4 text-sm text-zinc-400">
          {team.games.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-600">Titles</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {team.games.map((game) => (
                  <Badge key={game} tone="violet">
                    {game}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
              <span>On Maxime since {formatJoinedDate(team.createdAt)}</span>
            </div>
            {team.rosterSize != null && team.rosterSize > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                <span>
                  {team.memberCount} of {team.rosterSize} roster spots filled
                </span>
              </div>
            )}
            {team.accountTier && (
              <p className="capitalize text-zinc-500">{team.accountTier} org</p>
            )}
          </div>

          {team.discordUrl && (
            <a
              href={team.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Discord server
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          )}
        </div>
      )}

      <div className="mt-auto pt-4">
        {!expanded && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="mb-3 h-8 px-0 text-xs text-zinc-500 hover:text-zinc-300"
            onClick={() => setExpanded(true)}
          >
            Show more details
          </Button>
        )}
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
