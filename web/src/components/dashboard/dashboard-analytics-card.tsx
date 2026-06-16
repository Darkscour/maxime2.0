import type { PlayerAnalyticsSnapshot } from "@/lib/player-analytics";
import type { ManagerOrgAnalytics } from "@/lib/manager-analytics";
import { PlayerAnalyticsCard } from "@/components/dashboard/player-analytics-card";
import { ManagerAnalyticsCard } from "@/components/dashboard/manager-analytics-card";
import { GrassrootsManagerAnalyticsCard } from "@/components/dashboard/grassroots-manager-analytics-card";

export function DashboardAnalyticsCard({
  accountType,
  accountTier,
  playerAnalytics,
  managerAnalytics,
}: {
  accountType: string | null;
  accountTier: string | null;
  playerAnalytics?: PlayerAnalyticsSnapshot | null;
  managerAnalytics?: ManagerOrgAnalytics | null;
}) {
  const isManager = accountType === "team_manager";

  if (isManager && managerAnalytics) {
    if (accountTier === "grassroots") {
      return <GrassrootsManagerAnalyticsCard data={managerAnalytics} />;
    }
    return <ManagerAnalyticsCard data={managerAnalytics} />;
  }

  if (!isManager && playerAnalytics) {
    return <PlayerAnalyticsCard data={playerAnalytics} />;
  }

  return null;
}
