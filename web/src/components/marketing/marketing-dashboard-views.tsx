import { Bookmark, BookmarkCheck, Mail, Trash2 } from "lucide-react";
import { DeskPageHeader } from "@/components/dashboard/desk-ui";
import { PlayerScoutCard } from "@/components/dashboard/player-scout-card";
import { Button } from "@/components/ui/button";
import {
  MOCK_ROSTER_MEMBERS,
  MOCK_ROSTER_TOTAL,
  MOCK_SCOUT_PLAYERS,
  MOCK_TEAM_NAME,
  MOCK_WATCHLIST_PLAYERS,
} from "@/lib/marketing-dashboard-mock";
import type { RosterMember } from "@/lib/team-roster";
import { cn } from "@/lib/utils";

export function MarketingScoutPageView() {
  return (
    <div className="space-y-5">
      <DeskPageHeader
        title="Scout"
        job="Browse players, compare fit, and invite the right candidates."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_SCOUT_PLAYERS.map((player, index) => (
          <article
            key={player.id}
            className={cn(
              "desk-panel flex h-full flex-col transition-colors",
              index === 2 && "border-[var(--accent)]",
            )}
          >
            <div className="block p-4">
              <PlayerScoutCard
                handle={player.handle}
                game={player.game}
                role={player.role}
                rank={player.rank}
                school={player.region}
                imageUrl={player.imageUrl}
                badge={index === 2 ? "Requested to join" : undefined}
                className="border-0 bg-transparent p-0"
              />
            </div>
            <div className="mt-auto border-t border-[var(--border)] px-4 py-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={index === 0 ? "outline" : "ghost"}
                  className="pointer-events-none gap-1.5"
                >
                  {index === 0 ? (
                    <>
                      <BookmarkCheck className="h-3.5 w-3.5" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-3.5 w-3.5" />
                      Save
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  className="pointer-events-none gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {index === 1 ? "Invited" : "Invite"}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function MarketingWatchlistPageView() {
  return (
    <div className="space-y-5">
      <DeskPageHeader
        title="Watchlist"
        job={`Shortlisted players for ${MOCK_TEAM_NAME}. Invite when you're ready.`}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_WATCHLIST_PLAYERS.map((player) => (
          <article
            key={player.id}
            className="desk-panel flex h-full flex-col"
          >
            <div className="block p-4">
              <PlayerScoutCard
                handle={player.handle}
                game={player.game}
                role={player.role}
                rank={player.rank}
                school={player.region}
                imageUrl={player.imageUrl}
                className="border-0 bg-transparent p-0"
              />
            </div>
            <div className="mt-auto border-t border-[var(--border)] px-4 py-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  className="pointer-events-none gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Send invite
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="pointer-events-none gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function memberLabel(member: RosterMember) {
  return member.handle ?? member.displayName ?? member.email ?? "Member";
}

export function MarketingRosterPageView() {
  const staff = MOCK_ROSTER_MEMBERS.filter(
    (m) => m.role === "captain" || m.role === "manager",
  );
  const players = MOCK_ROSTER_MEMBERS.filter((m) => m.role === "player");

  return (
    <div className="space-y-5">
      <DeskPageHeader
        title={MOCK_TEAM_NAME}
        job={`${MOCK_ROSTER_TOTAL} on the roster. Accepted invites land here automatically.`}
      />

      <section className="space-y-2">
        <p className="desk-kicker !text-[var(--foreground-muted)]">Leadership</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((member) => (
            <article key={member.membershipId} className="desk-panel p-4">
              <PlayerScoutCard
                handle={memberLabel(member)}
                game={member.game ?? ""}
                role={member.roleInGame ?? ""}
                rank={member.rank ?? ""}
                school={member.school}
                imageUrl={member.imageUrl}
                badge={member.role === "captain" ? "Captain" : "Manager"}
                className="border-0 bg-transparent p-0"
              />
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <p className="desk-kicker !text-[var(--foreground-muted)]">Players</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((member) => (
            <article key={member.membershipId} className="desk-panel p-4">
              <PlayerScoutCard
                handle={memberLabel(member)}
                game={member.game ?? ""}
                role={member.roleInGame ?? ""}
                rank={member.rank ?? ""}
                school={member.school}
                imageUrl={member.imageUrl}
                className="border-0 bg-transparent p-0"
              />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
