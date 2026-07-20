import Link from "next/link";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkspaceInviteCode } from "@/components/dashboard/workspace-invite-code";
import { AbstractAreaChart } from "@/components/dashboard/abstract-charts";
import { canEditTeam } from "@/lib/permissions";
import type { DeskTicketItem } from "@/components/dashboard/desk-ui";
import type { RosterMember } from "@/lib/team-roster";
import type { NotificationRow } from "@/lib/notifications-db";
import type { ManagerOrgAnalytics } from "@/lib/manager-analytics";
import type { PlayerAnalyticsSnapshot } from "@/lib/player-analytics";

export function DeskBento({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("desk-bento", className)}>{children}</div>;
}

export function DeskBentoCell({
  children,
  className,
  span = "md",
  tall,
}: {
  children: React.ReactNode;
  className?: string;
  span?: "sm" | "md" | "lg" | "xl" | "full";
  tall?: boolean;
}) {
  return (
    <section
      className={cn(
        "desk-bento-cell",
        span === "sm" && "desk-bento-span-sm",
        span === "md" && "desk-bento-span-md",
        span === "lg" && "desk-bento-span-lg",
        span === "xl" && "desk-bento-span-xl",
        span === "full" && "desk-bento-span-full",
        tall && "desk-bento-tall",
        className,
      )}
    >
      {children}
    </section>
  );
}

function CellHeader({
  kicker,
  title,
  meta,
  action,
}: {
  kicker: string;
  title?: string;
  meta?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="desk-bento-header">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="desk-kicker">{kicker}</p>
          {meta ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--foreground-subtle)]">
              {meta}
            </p>
          ) : null}
        </div>
        {title ? (
          <h2 className="mt-1 font-heading text-base font-semibold tracking-[-0.01em] text-[var(--foreground)] sm:text-lg">
            {title}
          </h2>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function formatOnMaximeSince(date: Date) {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function relativeTime(date: Date) {
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const abs = Math.abs(seconds);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  if (abs < 60) return rtf.format(seconds, "second");
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 48) return rtf.format(hours, "hour");
  const days = Math.round(hours / 24);
  return rtf.format(days, "day");
}

type OrgTeam = {
  name: string;
  school: string | null;
  profileImageUrl: string | null;
  inviteCode: string;
  createdAt: Date;
  memberCount: number;
  rosterSize: number | null;
};

export function DeskOrgCard({
  team,
  membershipRole,
  pendingInvites = 0,
}: {
  team: OrgTeam;
  membershipRole: string | null;
  pendingInvites?: number;
}) {
  const rosterLabel =
    team.rosterSize != null && team.rosterSize > 0
      ? `${team.memberCount} / ${team.rosterSize}`
      : String(team.memberCount);

  return (
    <>
      <CellHeader kicker="Org" meta="Workspace" />
      <div className="desk-bento-body flex flex-1 flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0 border border-[var(--border)] bg-[var(--surface-2)] p-1">
            {team.profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={team.profileImageUrl}
                alt={`${team.name} profile`}
                className="h-12 w-12 object-cover"
              />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center font-heading text-lg font-semibold text-[var(--foreground-muted)]">
                {team.name.slice(0, 1)}
              </span>
            )}
            {canEditTeam(membershipRole) && (
              <Link
                href="/dashboard/settings/team"
                className="absolute -bottom-1.5 -right-1.5 inline-flex h-6 w-6 items-center justify-center border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-ink)] transition-colors hover:bg-[var(--accent-strong)]"
                aria-label="Edit team profile"
                title="Edit team profile"
              >
                <Pencil className="h-3 w-3" />
              </Link>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-heading text-lg font-semibold tracking-[-0.01em] text-[var(--foreground)]">
              {team.name}
            </p>
            {team.school ? (
              <p className="mt-0.5 text-xs leading-5 text-[var(--foreground-muted)]">
                {team.school}
              </p>
            ) : null}
            <p className="mt-1.5 text-xs text-[var(--foreground-subtle)]">
              Since {formatOnMaximeSince(team.createdAt)}
            </p>
          </div>
        </div>

        <WorkspaceInviteCode inviteCode={team.inviteCode} />

        <div className="mt-auto grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-3">
          <div>
            <p className="desk-kicker !text-[var(--foreground-muted)]">Roster</p>
            <p className="mt-1 font-heading text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              {rosterLabel}
            </p>
            <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
              {pendingInvites > 0
                ? `${pendingInvites} invite${pendingInvites === 1 ? "" : "s"} out`
                : "Active members"}
            </p>
          </div>
          <div>
            <p className="desk-kicker !text-[var(--foreground-muted)]">Next</p>
            <Link
              href="/dashboard/roster"
              className="mt-1 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              Open roster →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export function DeskScoutCard({
  handle,
  game,
  role,
  rank,
  bio,
  tags,
  teamName,
}: {
  handle: string;
  game: string;
  role: string;
  rank: string;
  bio: string | null;
  tags: string[];
  teamName: string | null;
}) {
  return (
    <>
      <CellHeader kicker="Scout card" meta="You" />
      <div className="desk-bento-body flex flex-1 flex-col gap-3">
        <div>
          <p className="font-heading text-xl font-semibold tracking-[-0.01em] text-[var(--foreground)]">
            {handle}
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            {game} · {role} · {rank}
          </p>
          {bio ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--foreground-muted)]">
              {bio}
            </p>
          ) : null}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((tag) => (
              <Badge key={tag} tone="violet">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Button href="/dashboard/settings/profile" size="sm" variant="outline">
            Edit profile
          </Button>
          {!teamName && (
            <Button href="/dashboard/teams" size="sm" variant="ghost">
              Browse teams
            </Button>
          )}
        </div>
        {teamName ? (
          <p className="border-t border-[var(--border)] pt-3 text-sm text-[var(--foreground-muted)]">
            On {teamName}
          </p>
        ) : null}
      </div>
    </>
  );
}

export function DeskSetupCard() {
  return (
    <>
      <CellHeader kicker="Setup" />
      <div className="desk-bento-body flex flex-1 flex-col gap-3">
        <p className="font-heading text-lg font-semibold text-[var(--foreground)]">
          Your desk is almost ready
        </p>
        <p className="text-sm leading-6 text-[var(--foreground-muted)]">
          Finish onboarding so Maxime can put real work on this desk.
        </p>
        <Button href="/onboarding" size="sm" className="mt-auto w-fit">
          Continue setup
        </Button>
      </div>
    </>
  );
}

const QUEUE_PREVIEW = 3;

export function DeskQueueCompact({
  tickets,
  emptyTitle,
  emptyBody,
  emptyActionLabel,
  emptyActionHref,
}: {
  tickets: DeskTicketItem[];
  emptyTitle: string;
  emptyBody: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
}) {
  const visible = tickets.slice(0, QUEUE_PREVIEW);
  const hidden = Math.max(0, tickets.length - QUEUE_PREVIEW);

  return (
    <>
      <CellHeader
        kicker="Today's desk"
        meta={tickets.length === 0 ? "Clear" : `${tickets.length} open`}
      />
      <div className="desk-bento-body !p-0">
        {tickets.length === 0 ? (
          <div className="px-4 py-5 sm:px-5">
            <p className="font-heading text-base font-semibold text-[var(--foreground)]">
              {emptyTitle}
            </p>
            <p className="mt-1.5 max-w-md text-sm leading-6 text-[var(--foreground-muted)]">
              {emptyBody}
            </p>
            {emptyActionLabel && emptyActionHref ? (
              <Link
                href={emptyActionHref}
                className="mt-3 inline-flex border border-[var(--border-strong)] bg-[var(--background)] px-3 py-1.5 text-sm font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {emptyActionLabel}
              </Link>
            ) : null}
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {visible.map((ticket, index) => (
              <li
                key={ticket.id}
                className="desk-ticket-enter flex items-center gap-3 px-4 py-3 sm:px-5"
                style={{ animationDelay: `${Math.min(index, 4) * 35}ms` }}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-sm font-semibold tracking-[-0.01em] text-[var(--foreground)]">
                    {ticket.title}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-[var(--foreground-muted)]">
                    {ticket.body}
                  </p>
                </div>
                <Link
                  href={ticket.href}
                  className="inline-flex shrink-0 items-center justify-center border border-[var(--accent)] bg-[var(--accent)] px-2.5 py-1.5 text-xs font-semibold text-[var(--accent-ink)] transition-colors hover:border-[var(--accent-strong)] hover:bg-[var(--accent-strong)]"
                >
                  {ticket.actionLabel}
                </Link>
              </li>
            ))}
            {hidden > 0 ? (
              <li className="px-4 py-2.5 sm:px-5">
                <p className="text-xs text-[var(--foreground-subtle)]">
                  +{hidden} more in your queue — clear these first.
                </p>
              </li>
            ) : null}
          </ul>
        )}
      </div>
    </>
  );
}

export function DeskPipelineCard({
  pendingJoinRequests,
  pendingInvites,
  watchlistCount,
  isGrassroots,
  incomingDuels = 0,
  sponsorFollowUps = 0,
}: {
  pendingJoinRequests: number;
  pendingInvites: number;
  watchlistCount: number;
  isGrassroots: boolean;
  incomingDuels?: number;
  sponsorFollowUps?: number;
}) {
  const items = [
    {
      label: "Join requests",
      value: pendingJoinRequests,
      href: "/dashboard/join-requests",
    },
    {
      label: "Invites out",
      value: pendingInvites,
      href: "/dashboard/roster",
    },
    {
      label: "Watchlist",
      value: watchlistCount,
      href: "/dashboard/watchlist",
    },
    isGrassroots
      ? {
          label: "Duels",
          value: incomingDuels,
          href: "/dashboard/duels",
        }
      : {
          label: "Sponsors",
          value: sponsorFollowUps,
          href: "/dashboard/sponsorships",
        },
  ];

  const open = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <>
      <CellHeader kicker="Pipeline" meta={open === 0 ? "Quiet" : `${open} live`} />
      <div className="desk-bento-body flex flex-1 flex-col gap-2 !pt-2">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group flex items-baseline justify-between gap-3 border-b border-[var(--border)] py-2 last:border-b-0 hover:border-[var(--border-strong)]"
          >
            <span className="text-sm text-[var(--foreground-muted)] transition-colors group-hover:text-[var(--foreground)]">
              {item.label}
            </span>
            <span
              className={cn(
                "font-heading text-lg font-semibold tracking-[-0.02em]",
                item.value > 0
                  ? "text-[var(--accent)]"
                  : "text-[var(--foreground-subtle)]",
              )}
            >
              {item.value}
            </span>
          </Link>
        ))}
        <Link
          href="/dashboard/scout"
          className="mt-auto pt-2 text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          Open scout →
        </Link>
      </div>
    </>
  );
}

export function DeskQuickLinksCard({
  isManager,
  isGrassroots,
  hasTeam,
}: {
  isManager: boolean;
  isGrassroots: boolean;
  hasTeam: boolean;
}) {
  const links = isManager
    ? [
        { href: "/dashboard/scout", label: "Scout players" },
        { href: "/dashboard/watchlist", label: "Watchlist" },
        { href: "/dashboard/roster", label: "Roster hub" },
        isGrassroots
          ? { href: "/dashboard/duels", label: "Duels" }
          : { href: "/dashboard/sponsorships", label: "Sponsors" },
      ]
    : [
        { href: "/dashboard/teams", label: "Browse teams" },
        { href: "/dashboard/invites", label: "Invites" },
        { href: "/dashboard/settings/profile", label: "Edit profile" },
        hasTeam
          ? { href: "/dashboard/settings/team", label: "Team profile" }
          : { href: "/dashboard/settings/account", label: "Account" },
      ];

  return (
    <>
      <CellHeader kicker="Shortcuts" />
      <div className="desk-bento-body flex flex-1 flex-col gap-1 !pt-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="border-b border-[var(--border)] py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors last:border-b-0 hover:text-[var(--accent)]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}

export function DeskRosterSnapshot({
  members,
  teamName,
  rosterSize,
}: {
  members: RosterMember[];
  teamName: string;
  rosterSize: number | null;
}) {
  const preview = members.slice(0, 6);
  const remaining = Math.max(0, members.length - preview.length);
  const capacity =
    rosterSize != null && rosterSize > 0
      ? `${members.length} / ${rosterSize}`
      : `${members.length} on roster`;

  return (
    <>
      <CellHeader
        kicker="Roster"
        title={teamName}
        meta={capacity}
        action={
          <Link
            href="/dashboard/roster"
            className="text-xs font-semibold text-[var(--accent)] hover:underline"
          >
            Manage →
          </Link>
        }
      />
      <div className="desk-bento-body flex flex-1 flex-col gap-3">
        {preview.length === 0 ? (
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">
              No one on the roster yet. Share your invite code or scout players.
            </p>
            <Link
              href="/dashboard/scout"
              className="mt-3 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              Open scout →
            </Link>
          </div>
        ) : (
          <>
            <div className="flex -space-x-2">
              {preview.map((member) => {
                const label =
                  member.handle ?? member.displayName ?? member.email ?? "?";
                return (
                  <div
                    key={member.membershipId}
                    className="relative h-9 w-9 overflow-hidden border border-[var(--border-strong)] bg-[var(--surface-2)]"
                    title={label}
                  >
                    {member.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center font-heading text-xs font-semibold text-[var(--foreground-muted)]">
                        {label.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                  </div>
                );
              })}
              {remaining > 0 ? (
                <div className="flex h-9 w-9 items-center justify-center border border-[var(--border-strong)] bg-[var(--background)] font-mono text-[10px] font-semibold text-[var(--foreground-muted)]">
                  +{remaining}
                </div>
              ) : null}
            </div>
            <ul className="space-y-1.5">
              {preview.slice(0, 4).map((member) => {
                const label =
                  member.handle ?? member.displayName ?? member.email ?? "Member";
                const detail = [member.roleInGame, member.rank]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <li
                    key={member.membershipId}
                    className="flex items-baseline justify-between gap-2 text-sm"
                  >
                    <span className="truncate font-medium text-[var(--foreground)]">
                      {label}
                    </span>
                    <span className="shrink-0 text-xs text-[var(--foreground-subtle)]">
                      {detail || member.role}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

export function DeskUpdatesSnapshot({
  notifications,
}: {
  notifications: NotificationRow[];
}) {
  return (
    <>
      <CellHeader
        kicker="Updates"
        meta={notifications.length === 0 ? "Caught up" : "Recent"}
      />
      <div className="desk-bento-body !p-0">
        {notifications.length === 0 ? (
          <div className="px-4 py-5 sm:px-5">
            <p className="font-heading text-sm font-semibold text-[var(--foreground)]">
              No recent updates
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
              Join requests, invites, and scout activity will land here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {notifications.slice(0, 5).map((note) => {
              const row = (
                <>
                  <span
                    className={cn(
                      "mt-1.5 h-1.5 w-1.5 shrink-0",
                      note.read
                        ? "bg-[var(--border-strong)]"
                        : "bg-[var(--accent)]",
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "line-clamp-2 text-sm leading-5",
                        note.read
                          ? "text-[var(--foreground-muted)]"
                          : "font-medium text-[var(--foreground)]",
                      )}
                    >
                      {note.title}
                    </p>
                    <time className="mt-1 block font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--foreground-subtle)]">
                      {relativeTime(new Date(note.createdAt))}
                    </time>
                  </div>
                </>
              );
              return (
                <li key={note.id}>
                  {note.href ? (
                    <Link
                      href={note.href}
                      className="flex items-start gap-2.5 px-4 py-3 transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] sm:px-5"
                    >
                      {row}
                    </Link>
                  ) : (
                    <div className="flex items-start gap-2.5 px-4 py-3 sm:px-5">
                      {row}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

export function DeskAnalyticsSnapshot({
  accountType,
  managerAnalytics,
  playerAnalytics,
}: {
  accountType: string | null;
  managerAnalytics?: ManagerOrgAnalytics | null;
  playerAnalytics?: PlayerAnalyticsSnapshot | null;
}) {
  const isManager = accountType === "team_manager";

  if (isManager && managerAnalytics) {
    const views = managerAnalytics.scoutViews.weekly.map((p) => p.value);
    const thisWeekViews =
      managerAnalytics.scoutSummary.weekly.profileViews;
    const joins = managerAnalytics.rosterSummary.weekly.newJoins;

    return (
      <>
        <CellHeader
          kicker="Analytics"
          title="Recruitment pulse"
          meta="This week"
        />
        <div className="desk-bento-body flex flex-1 flex-col gap-4">
          <div className="min-w-0">
            <p className="text-xs text-[var(--foreground-muted)]">
              Scout profile views
            </p>
            <div className="mt-2 h-20 sm:h-24">
              <AbstractAreaChart
                values={views.length > 0 ? views : [0, 0, 0, 0]}
                gradientId="desk-scout-views"
                stroke="#b84a1b"
                fill="#b84a1b"
                height={96}
              />
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Metric label="Roster" value={String(managerAnalytics.rosterCount)} />
            <Metric label="Views" value={String(thisWeekViews)} />
            <Metric label="Joins" value={String(joins)} />
            <Metric
              label="Watchlist"
              value={String(managerAnalytics.watchlistCount)}
            />
          </dl>
        </div>
      </>
    );
  }

  if (!isManager && playerAnalytics) {
    return (
      <>
        <CellHeader
          kicker="Analytics"
          title="Scout visibility"
          meta={
            playerAnalytics.profileViewsTrend != null
              ? `${playerAnalytics.profileViewsTrend >= 0 ? "+" : ""}${playerAnalytics.profileViewsTrend}%`
              : undefined
          }
        />
        <div className="desk-bento-body flex flex-1 flex-col gap-4">
          <div className="min-w-0">
            <p className="text-xs text-[var(--foreground-muted)]">
              Profile views by week
            </p>
            <div className="mt-2 h-20 sm:h-24">
              <AbstractAreaChart
                values={
                  playerAnalytics.weeklyProfileViews.length > 0
                    ? playerAnalytics.weeklyProfileViews
                    : [0, 0, 0, 0]
                }
                gradientId="desk-player-views"
                stroke="#b84a1b"
                fill="#b84a1b"
                height={96}
              />
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-2">
            <Metric
              label="Views"
              value={String(playerAnalytics.totalProfileViews)}
            />
            <Metric
              label="Scouts"
              value={String(playerAnalytics.uniqueScoutTeams)}
            />
            <Metric
              label="Active wks"
              value={String(playerAnalytics.activeWeeks)}
            />
          </dl>
        </div>
      </>
    );
  }

  return null;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border border-[var(--border)] bg-[var(--background)] px-3 py-2">
      <dt className="desk-kicker !text-[var(--foreground-muted)]">{label}</dt>
      <dd className="mt-1 font-heading text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
        {value}
      </dd>
    </div>
  );
}
