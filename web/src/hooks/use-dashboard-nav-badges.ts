"use client";

import { useCallback, useEffect, useState } from "react";

export type DashboardNavBadges = {
  joinRequests: number;
  teamInvites: number;
};

const EMPTY: DashboardNavBadges = { joinRequests: 0, teamInvites: 0 };

export function useDashboardNavBadges() {
  const [badges, setBadges] = useState<DashboardNavBadges>(EMPTY);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/nav-badges");
      if (!res.ok) return;
      const data = (await res.json()) as {
        joinRequests?: number;
        teamInvites?: number;
      };
      setBadges({
        joinRequests: data.joinRequests ?? 0,
        teamInvites: data.teamInvites ?? 0,
      });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [load]);

  return badges;
}
