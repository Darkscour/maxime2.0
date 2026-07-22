import {
  Bookmark,
  Building2,
  Handshake,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import { MaximeLogo } from "@/components/brand/maxime-logo";
import {
  DashboardStatCard,
  dashboardStatCardClassName,
} from "@/components/dashboard/dashboard-cards";
import { ManagerAnalyticsCard } from "@/components/dashboard/manager-analytics-card";
import {
  MarketingRosterPageView,
  MarketingScoutPageView,
  MarketingWatchlistPageView,
} from "@/components/marketing/marketing-dashboard-views";
import { MOCK_MANAGER_ANALYTICS } from "@/lib/marketing-dashboard-mock";
import { cn } from "@/lib/utils";

export type MarketingDashboardView =
  | "overview"
  | "analytics"
  | "scout"
  | "watchlist"
  | "roster";

type NavItemId =
  | "overview"
  | "scout"
  | "watchlist"
  | "join-requests"
  | "roster"
  | "team-profile"
  | "sponsorships"
  | "account";

const navGroups: {
  label?: string;
  accent?: "cyan" | "violet" | "emerald" | "muted";
  items: {
    id: NavItemId;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: string;
  }[];
}[] = [
  {
    items: [{ id: "overview", label: "Overview", icon: LayoutDashboard }],
  },
  {
    label: "Recruitment",
    accent: "violet",
    items: [
      { id: "scout", label: "Scout players", icon: Search },
      { id: "watchlist", label: "Watchlist", icon: Bookmark, badge: "27" },
      { id: "join-requests", label: "Join requests", icon: UserPlus, badge: "2" },
    ],
  },
  {
    label: "Team",
    accent: "cyan",
    items: [
      { id: "roster", label: "Roster hub", icon: Users },
      { id: "team-profile", label: "Team profile", icon: Building2 },
    ],
  },
  {
    label: "Partnerships",
    accent: "emerald",
    items: [{ id: "sponsorships", label: "Sponsorships", icon: Handshake }],
  },
  {
    label: "Account",
    accent: "muted",
    items: [{ id: "account", label: "Account", icon: Settings }],
  },
];

const accentEyebrow = {
  cyan: "text-[color-mix(in_srgb,var(--accent)_90%,transparent)]",
  violet: "text-[color-mix(in_srgb,var(--accent-2)_90%,transparent)]",
  emerald: "text-emerald-400/90",
  muted: "text-[var(--foreground-subtle)]",
};

const accentBorder = {
  cyan: "border-[color-mix(in_srgb,var(--accent)_20%,transparent)]",
  violet: "border-[color-mix(in_srgb,var(--accent-2)_20%,transparent)]",
  emerald: "border-emerald-400/20",
  muted: "border-[color-mix(in_srgb,var(--border)_60%,transparent)]",
};

const accentLink = {
  cyan: {
    active: "bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--foreground)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent)_25%,transparent)]",
    icon: "text-[var(--accent)]",
  },
  violet: {
    active: "bg-[color-mix(in_srgb,var(--accent-2)_10%,transparent)] text-[var(--foreground)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent-2)_25%,transparent)]",
    icon: "text-[var(--accent-2)]",
  },
  emerald: {
    active: "bg-emerald-400/10 text-[var(--foreground)] ring-1 ring-inset ring-emerald-400/25",
    icon: "text-emerald-400",
  },
  muted: {
    active: "bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] text-[var(--foreground)] ring-1 ring-inset ring-[var(--border)]",
    icon: "text-[var(--foreground)]",
  },
};

function isNavItemActive(itemId: NavItemId, activeView: MarketingDashboardView) {
  if (activeView === "analytics") return itemId === "overview";
  return itemId === activeView;
}

export function ManagerDashboardPreview({
  className,
  showAnalytics = true,
  showStatCards = true,
  showSidebar = true,
  showTopBar = true,
  activeView = "overview",
  variant = "default",
}: {
  className?: string;
  showAnalytics?: boolean;
  showStatCards?: boolean;
  showSidebar?: boolean;
  showTopBar?: boolean;
  activeView?: MarketingDashboardView;
  variant?: "default" | "hero";
}) {
  const isHero = variant === "hero";
  const compactStatCardClassName = isHero
    ? "p-3 [&_.font-heading]:mt-1.5 [&_.font-heading]:text-xl"
    : undefined;

  return (
    <div
      className={cn(
        "dashboard-shot flex overflow-hidden bg-[var(--background)]",
        isHero
          ? "min-h-0 rounded-none border-0"
          : "min-h-[640px] rounded-2xl border border-[var(--border)]",
        className,
      )}
    >
      {showSidebar ? (
        <aside className="hidden w-56 shrink-0 border-r border-[color-mix(in_srgb,var(--border)_50%,transparent)] bg-[color-mix(in_srgb,var(--background)_90%,transparent)] sm:flex sm:flex-col">
          <div className="border-b border-[color-mix(in_srgb,var(--border)_50%,transparent)] px-4 py-4">
            <MaximeLogo variant="lockup" size="nav" href={null} />
            <div className="mt-3 border-t border-[color-mix(in_srgb,var(--border)_50%,transparent)] pt-3">
              <span className="inline-flex rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--foreground)_3%,transparent)] px-2.5 py-1 text-[10px] font-medium tracking-wide text-[var(--foreground-muted)]">
                Manager
              </span>
            </div>
          </div>
          <nav className="flex-1 px-2 py-3">
            {navGroups.map((group, index) => {
              const accent = group.accent ?? "cyan";
              return (
                <div
                  key={group.label ?? `group-${index}`}
                  className={cn(
                    index > 0 && "mt-2 border-t border-dashed pt-2",
                    index > 0 && accentBorder[accent],
                  )}
                >
                  {group.label ? (
                    <p
                      className={cn(
                        "mb-1.5 px-2 text-[9px] font-semibold uppercase tracking-wider",
                        accentEyebrow[accent],
                      )}
                    >
                      {group.label}
                    </p>
                  ) : null}
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const styles = accentLink[accent];
                      const active = isNavItemActive(item.id, activeView);
                      return (
                        <div
                          key={item.id}
                          data-demo-nav={item.id}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-2 py-2 text-xs",
                            active ? styles.active : "text-[var(--foreground-muted)]",
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-3.5 w-3.5 shrink-0",
                              active ? styles.icon : "text-[var(--foreground-subtle)]",
                            )}
                          />
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {item.badge ? (
                            <span className="rounded-full bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] px-1.5 py-0.5 text-[9px] font-semibold text-[color-mix(in_srgb,var(--accent)_70%,white)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]">
                              {item.badge}
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </aside>
      ) : null}

      <div className="min-w-0 flex-1 overflow-hidden">
        {showTopBar ? (
          <div className="border-b border-[color-mix(in_srgb,var(--border)_50%,transparent)] px-4 py-3 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-[var(--foreground-subtle)]">maxime.com/dashboard</p>
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[color-mix(in_srgb,var(--accent)_30%,transparent)] to-[color-mix(in_srgb,var(--accent-2-strong)_30%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]" />
            </div>
          </div>
        ) : null}

        <div
          data-demo-region="main"
          className={cn(isHero ? "space-y-3 p-3" : "space-y-5 p-4 sm:p-5")}
        >
          {activeView === "overview" || activeView === "analytics" ? (
            <>
              <header
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--border)_50%,transparent)] bg-gradient-to-br from-[color-mix(in_srgb,var(--accent)_8%,transparent)] via-[var(--surface)] to-[color-mix(in_srgb,var(--accent-2-strong)_6%,transparent)]",
                  isHero ? "p-4" : "p-5 sm:p-6",
                )}
              >
                <p
                  className={cn(
                    "font-semibold uppercase tracking-[0.2em] text-[var(--accent)]",
                    isHero ? "text-[9px]" : "text-[10px]",
                  )}
                >
                  Your workspace
                </p>
                <h1
                  className={cn(
                    "font-heading mt-2 font-semibold tracking-tight text-[var(--foreground)]",
                    isHero ? "text-xl" : "text-2xl sm:text-3xl",
                  )}
                >
                  Welcome back, Coach Max
                </h1>
                <p
                  className={cn(
                    "mt-2 max-w-xl text-[var(--foreground-muted)]",
                    isHero ? "text-xs leading-5" : "text-sm leading-6",
                  )}
                >
                  Manage sponsorship outreach, scout campus players, and keep your org
                  profile in one place.
                </p>
                <Sparkles
                  className={cn(
                    "pointer-events-none absolute -right-3 -top-3 text-[color-mix(in_srgb,var(--accent)_10%,transparent)]",
                    isHero ? "h-16 w-16" : "h-24 w-24",
                  )}
                />
              </header>

              {showStatCards ? (
                <section
                  className={cn(
                    "grid gap-3",
                    isHero ? "grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-4",
                  )}
                >
                  <DashboardStatCard
                    label="Account"
                    value="Manager"
                    hint="Verified manager"
                    icon={Building2}
                    className={compactStatCardClassName}
                  />
                  <DashboardStatCard
                    label="Team"
                    value="Maxime Titans"
                    hint="California · On Maxime since Jan 2026"
                    icon={Building2}
                    className={compactStatCardClassName}
                  />
                  <div className={cn(dashboardStatCardClassName, compactStatCardClassName)}>
                    <div className="flex flex-1 items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-wider text-[var(--foreground-subtle)]">
                          Roster
                        </p>
                        <p
                          className={cn(
                            "font-heading font-semibold text-[var(--foreground)]",
                            isHero ? "mt-1.5 text-xl" : "mt-2 text-2xl",
                          )}
                        >
                          14
                        </p>
                        <p className="mt-1 text-xs text-[var(--foreground-subtle)]">3 invites pending</p>
                      </div>
                      <span
                        className={cn(
                          "flex shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)] ring-1 ring-inset ring-[var(--border)]",
                          isHero ? "h-8 w-8" : "h-10 w-10",
                        )}
                      >
                        <Users className="h-4 w-4 text-[var(--accent)]" />
                      </span>
                    </div>
                  </div>
                  <div className={cn(dashboardStatCardClassName, compactStatCardClassName)}>
                    <div className="flex flex-1 items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-wider text-[var(--foreground-subtle)]">
                          Watchlist
                        </p>
                        <p
                          className={cn(
                            "font-heading font-semibold text-[var(--foreground)]",
                            isHero ? "mt-1.5 text-xl" : "mt-2 text-2xl",
                          )}
                        >
                          27
                        </p>
                        <p className="mt-1 text-xs text-[var(--foreground-subtle)]">
                          5 high-priority candidates
                        </p>
                      </div>
                      <span
                        className={cn(
                          "flex shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)] ring-1 ring-inset ring-[var(--border)]",
                          isHero ? "h-8 w-8" : "h-10 w-10",
                        )}
                      >
                        <Bookmark className="h-4 w-4 text-[var(--accent)]" />
                      </span>
                    </div>
                  </div>
                </section>
              ) : null}

              {showAnalytics ? (
                <section data-demo-region="analytics">
                  <ManagerAnalyticsCard data={MOCK_MANAGER_ANALYTICS} />
                </section>
              ) : null}
            </>
          ) : null}

          {activeView === "scout" ? <MarketingScoutPageView /> : null}
          {activeView === "watchlist" ? <MarketingWatchlistPageView /> : null}
          {activeView === "roster" ? <MarketingRosterPageView /> : null}
        </div>
      </div>
    </div>
  );
}
