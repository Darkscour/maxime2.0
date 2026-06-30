"use client";

import { useCallback, useState } from "react";
import { useAbortableIntervalFetch } from "@/hooks/use-abortable-interval-fetch";

export type DashboardNavBadges = {
  joinRequests: number;
  teamInvites: number;
};

const EMPTY: DashboardNavBadges = { joinRequests: 0, teamInvites: 0 };

export function useDashboardNavBadges() {
  const [badges, setBadges] = useState<DashboardNavBadges>(EMPTY);

  const onData = useCallback(
    (data: { joinRequests?: number; teamInvites?: number }) => {
      setBadges({
        joinRequests: data.joinRequests ?? 0,
        teamInvites: data.teamInvites ?? 0,
      });
    },
    [],
  );

  useAbortableIntervalFetch("/api/dashboard/nav-badges", 60_000, onData, {
    initialDelayMs: 500,
  });

  return badges;
}
