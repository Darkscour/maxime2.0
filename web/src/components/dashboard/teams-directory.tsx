"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
      <div className="rounded-none border border-dashed border-[var(--border)] bg-[var(--surface)]/50 p-10 text-center">
        <p className="text-sm text-[var(--foreground-muted)]">
          No teams have registered yet. Check back soon as orgs join Maxime.
        </p>
      </div>
    );
  }

  const pendingRequests = new Set(pendingRequestTeamIds);
  const pendingInvites = new Set(pendingInviteTeamIds);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

function TeamCardAvatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      className="font-heading flex h-12 w-12 shrink-0 items-center justify-center rounded-none bg-[var(--foreground)] text-lg font-bold text-[var(--background)]"
      aria-hidden
    >
      {initial}
    </span>
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
  const gameLabel =
    primaryGame && moreGames > 0
      ? `${primaryGame} +${moreGames} more`
      : primaryGame;
  const detailLine = [gameLabel, team.region, rosterHint].filter(Boolean).join(" · ");

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-none border bg-[var(--surface)] transition-colors",
        requestPending
          ? "border-[var(--accent)] hover:border-[var(--foreground)]"
          : "border-[var(--border)] hover:border-[color-mix(in_srgb,var(--accent)_35%,var(--border))]",
      )}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <TeamCardAvatar name={team.name} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-heading text-lg font-semibold text-[var(--foreground)]">
                {team.name}
              </h2>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                aria-label={expanded ? "Collapse team details" : "Expand team details"}
                className="shrink-0 rounded-lg p-1 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background)] hover:text-[var(--foreground-muted)]"
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expanded && "rotate-180",
                  )}
                />
              </button>
            </div>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">{detailLine}</p>
            {team.school && (
              <p className="mt-2 text-xs text-[var(--foreground-muted)]">{team.school}</p>
            )}
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4 text-sm text-[var(--foreground-muted)]">
            {team.games.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">Titles</p>
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
                <Calendar className="h-3.5 w-3.5 shrink-0 text-[var(--foreground-muted)]" />
                <span>On Maxime since {formatJoinedDate(team.createdAt)}</span>
              </div>
              {team.rosterSize != null && team.rosterSize > 0 && (
                <p>
                  {team.memberCount} of {team.rosterSize} roster spots filled
                </p>
              )}
              {team.accountTier && (
                <p className="capitalize text-[var(--foreground-muted)]">{team.accountTier} org</p>
              )}
            </div>

            {team.discordUrl && (
              <a
                href={team.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent)]"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Discord server
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-[var(--border)] px-5 py-4">
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
