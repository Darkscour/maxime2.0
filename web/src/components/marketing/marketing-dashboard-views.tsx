import { ArrowLeft, Bookmark, BookmarkCheck, Mail, Trash2 } from "lucide-react";
import { DashboardSectionEyebrow } from "@/components/dashboard/dashboard-section-eyebrow";
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

function DemoPageBackLink() {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-[var(--foreground-subtle)]">
      <ArrowLeft className="h-4 w-4" />
      Dashboard
    </span>
  );
}

export function MarketingScoutPageView() {
  return (
    <div className="space-y-5">
      <header>
        <DemoPageBackLink />
        <DashboardSectionEyebrow accent="violet" className="mt-4">
          Recruitment
        </DashboardSectionEyebrow>
        <h1 className="font-heading mt-2 text-2xl font-semibold text-[var(--foreground)]">
          Player profiles
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
          Browse players by region, compare fit, and invite the right candidates directly.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_SCOUT_PLAYERS.map((player, index) => (
          <article
            key={player.id}
            className={cn(
              "flex h-full flex-col rounded-2xl border bg-[var(--surface)] transition-colors",
              index === 2
                ? "border-[color-mix(in_srgb,var(--accent)_25%,transparent)]"
                : "border-[color-mix(in_srgb,var(--border)_50%,transparent)] hover:border-[color-mix(in_srgb,var(--accent-2)_20%,transparent)]",
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
            <div className="mt-auto border-t border-[color-mix(in_srgb,var(--border)_50%,transparent)] px-4 py-3">
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
      <header>
        <DemoPageBackLink />
        <DashboardSectionEyebrow accent="violet" className="mt-4">
          Recruitment
        </DashboardSectionEyebrow>
        <h1 className="font-heading mt-2 text-2xl font-semibold text-[var(--foreground)]">
          Watchlist
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
          Shortlist players by region, then send invites when you&apos;re ready to recruit
          them to {MOCK_TEAM_NAME}.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_WATCHLIST_PLAYERS.map((player) => (
          <article
            key={player.id}
            className="flex h-full flex-col rounded-2xl border border-[color-mix(in_srgb,var(--border)_50%,transparent)] bg-[var(--surface)] transition-colors hover:border-[color-mix(in_srgb,var(--accent-2)_20%,transparent)]"
          >
            <div className="block p-4">
              <PlayerScoutCard
                handle={player.handle}
                game={player.game}
                role={player.role}
                rank={player.rank}
                school={player.region}
                imageUrl={player.imageUrl}
                badge={player.invitePending ? "Invite sent" : undefined}
                className="border-0 bg-transparent p-0"
              />
            </div>
            <div className="mt-auto border-t border-[color-mix(in_srgb,var(--border)_50%,transparent)] px-4 py-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  className="pointer-events-none gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {player.invitePending ? "Invited" : "Send invite"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="pointer-events-none gap-1.5 text-[var(--foreground-muted)]"
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

function roleLabel(role: string) {
  if (role === "captain") return "Captain";
  if (role === "manager") return "Manager";
  return null;
}

function MarketingRosterMemberCard({ member }: { member: RosterMember }) {
  const label = member.handle ?? member.displayName ?? "Member";
  const staffRole = roleLabel(member.role);

  return (
    <article className="group flex flex-col rounded-2xl border border-[color-mix(in_srgb,var(--border)_50%,transparent)] bg-[var(--surface)] transition-colors hover:border-[color-mix(in_srgb,var(--accent)_15%,transparent)]">
      <div className="p-4">
        <PlayerScoutCard
          handle={label}
          game={member.game ?? ""}
          role={member.roleInGame ?? ""}
          rank={member.rank ?? ""}
          school={member.school}
          imageUrl={member.imageUrl}
          badge={staffRole ?? undefined}
          className="border-0 bg-transparent p-0"
        />
      </div>
      {member.role === "player" && (
        <div className="mt-auto border-t border-[color-mix(in_srgb,var(--border)_50%,transparent)] px-4 py-2.5">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="pointer-events-none gap-1.5 text-[var(--foreground-muted)]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove from roster
          </Button>
        </div>
      )}
    </article>
  );
}

export function MarketingRosterPageView() {
  const staff = MOCK_ROSTER_MEMBERS.filter(
    (m) => m.role === "captain" || m.role === "manager",
  );
  const players = MOCK_ROSTER_MEMBERS.filter((m) => m.role === "player");

  return (
    <div className="space-y-5">
      <header>
        <DemoPageBackLink />
        <DashboardSectionEyebrow accent="cyan" className="mt-4">
          Team
        </DashboardSectionEyebrow>
        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <h1 className="font-heading text-2xl font-semibold text-[var(--foreground)]">
            {MOCK_TEAM_NAME}
          </h1>
          <span className="text-sm text-[var(--foreground-subtle)]">{MOCK_ROSTER_TOTAL} on team</span>
        </div>
      </header>

      <div className="space-y-5">
        {staff.length > 0 && (
          <section className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)]">
              Leadership
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {staff.map((member) => (
                <MarketingRosterMemberCard key={member.membershipId} member={member} />
              ))}
            </div>
          </section>
        )}

        {players.length > 0 && (
          <section className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)]">
              Players
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {players.map((member) => (
                <MarketingRosterMemberCard key={member.membershipId} member={member} />
              ))}
            </div>
            <p className="text-xs text-[var(--foreground-subtle)]">
              Showing {players.length} of {MOCK_ROSTER_TOTAL - staff.length} players on
              roster
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
