"use client";

import type { ManagerOrgAnalytics } from "@/lib/manager-analytics";
import { ManagerAnalyticsCard } from "@/components/dashboard/manager-analytics-card";

export function GrassrootsManagerAnalyticsCard({
  data,
}: {
  data: ManagerOrgAnalytics;
}) {
  return <ManagerAnalyticsCard data={data} />;
}

