"use client";

import Link from "next/link";
import { Calendar, Clock, Globe, Mail, Users } from "lucide-react";
import type { PublicTeamListing } from "@/lib/teams-directory";
import type { PlayerRecruitmentFitResult } from "@/lib/player-recruitment-fit";
import { TeamJoinRequestButton } from "@/components/dashboard/team-join-request-button";
import { PlayerScoutFitMeter } from "@/components/dashboard/player-scout-fit-meter";
import { DeskEmpty } from "@/components/dashboard/desk-ui";
import { getGameLogoPath } from "@/lib/onboarding-options";
import { cn } from "@/lib/utils";

export type TeamDirectoryCard = PublicTeamListing & {
  fit?: PlayerRecruitmentFitResult | null;
};

function TeamGameTag({ game }: { game: string }) {
  const logoPath = getGameLogoPath(game);

  return (
    <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-[var(--md-card)] px-2 py-0.5 text-[10px] font-medium leading-tight text-[var(--md-text-muted)] ring-1 ring-inset ring-[var(--md-card-border)]">
      {logoPath ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoPath} alt="" className="h-3.5 w-3.5 shrink-0 object-contain" />
      ) : null}
      <span>{game}</span>
    </span>
  );
}

export function TeamsDirectory({
  teams,
  playerOnTeam,
  currentTeamName,
  membershipRole,
  pendingRequestTeamIds = [],
  pendingInviteTeamIds = [],
}: {
  teams: TeamDirectoryCard[];
  playerOnTeam: boolean;
  currentTeamName?: string | null;
  membershipRole?: string | null;
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
  const canLeaveTeam = membershipRole === "player";

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          playerOnTeam={playerOnTeam}
          currentTeamName={currentTeamName}
          canLeaveTeam={canLeaveTeam}
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

function formatJoinedDate(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;
  return value.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function TeamScoutCardBody({
  team,
  fit,
}: {
  team: PublicTeamListing;
  fit?: PlayerRecruitmentFitResult | null;
}) {
  return (
    <article className="relative">
      <div className="flex items-start gap-4">
        <div className="absolute right-0 top-0 inline-flex items-center gap-1 text-sm font-semibold text-[var(--md-text-muted)]">
          <Users size={14} className="shrink-0 text-[var(--md-text-faint)]" aria-hidden />
          <span>{team.memberCount}</span>
        </div>
        <TeamCardAvatar name={team.name} />
        <div className="min-w-0 flex-1 pr-12">
          <h2 className="font-heading text-lg font-semibold text-[var(--md-text)]">
            {team.name}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--md-text-faint)]">
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} className="shrink-0" aria-hidden />
              Joined on {formatJoinedDate(team.createdAt)}
            </span>
            {team.region ? (
              <span className="inline-flex items-center gap-1">
                <Globe size={12} className="shrink-0" aria-hidden />
                {team.region}
              </span>
            ) : null}
          </div>
          {team.school ? (
            <p className="mt-2 text-xs text-[var(--md-text-faint)]">{team.school}</p>
          ) : null}
        </div>
      </div>
      {team.games.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {team.games.map((game) => (
            <TeamGameTag key={game} game={game} />
          ))}
        </div>
      ) : null}
      {fit ? (
        <PlayerScoutFitMeter
          score={fit.score}
          showReason={false}
          className="mt-3"
        />
      ) : null}
    </article>
  );
}

function TeamCardFooter({
  team,
  lockedOnTeam,
  currentTeamName,
  canLeaveTeam,
  requestPending,
  invitePending,
}: {
  team: TeamDirectoryCard;
  lockedOnTeam: boolean;
  currentTeamName?: string | null;
  canLeaveTeam: boolean;
  requestPending: boolean;
  invitePending: boolean;
}) {
  if (invitePending) {
    return (
      <div className="mt-auto border-t border-[var(--md-card-border)] px-5 py-3.5">
        <div className="flex items-center gap-2 text-xs text-[var(--md-text-muted)]">
          <Mail size={14} className="shrink-0 text-[var(--md-accent)]" aria-hidden />
          <span>
            Invited you —{" "}
            <Link
              href="/dashboard/invites"
              className="font-semibold text-[var(--md-accent)] hover:underline"
            >
              view invite
            </Link>
          </span>
        </div>
      </div>
    );
  }

  if (requestPending && !lockedOnTeam) {
    return (
      <div className="mt-auto border-t border-[var(--md-card-border)] px-5 py-3.5">
        <div className="flex items-center gap-2 text-xs text-[var(--md-text-muted)]">
          <Clock size={14} className="shrink-0 text-[var(--md-accent)]" aria-hidden />
          <span>Join request pending</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-auto border-t border-[var(--md-card-border)] px-5 py-4">
      <TeamJoinRequestButton
        teamId={team.id}
        teamName={team.name}
        initialPending={false}
        embedded
        locked={lockedOnTeam}
        currentTeamName={currentTeamName}
        canLeaveTeam={canLeaveTeam}
      />
    </div>
  );
}

function TeamCard({
  team,
  playerOnTeam,
  currentTeamName,
  canLeaveTeam,
  requestPending,
  invitePending,
}: {
  team: TeamDirectoryCard;
  playerOnTeam: boolean;
  currentTeamName?: string | null;
  canLeaveTeam: boolean;
  requestPending: boolean;
  invitePending: boolean;
}) {
  const lockedOnTeam = playerOnTeam;
  const hasActivity = invitePending || requestPending;

  return (
    <article
      className={cn(
        "relative md-card md-scout-portal-card flex h-full flex-col !p-0 overflow-visible transition-colors",
        hasActivity &&
          "border-[color-mix(in_srgb,var(--md-accent)_45%,var(--md-card-border))]",
      )}
    >
      <div className="block p-5">
        <TeamScoutCardBody team={team} fit={team.fit} />
      </div>

      <TeamCardFooter
        team={team}
        lockedOnTeam={lockedOnTeam}
        currentTeamName={currentTeamName}
        canLeaveTeam={canLeaveTeam}
        requestPending={requestPending}
        invitePending={invitePending}
      />
    </article>
  );
}
