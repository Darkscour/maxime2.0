"use client";

import { Eye, Users, UserPlus } from "lucide-react";
import type { ManagerOrgAnalytics } from "@/lib/manager-analytics";

export function GrassrootsManagerAnalyticsCard({
  data,
}: {
  data: ManagerOrgAnalytics;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-6">
      <p className="text-xs uppercase tracking-wider text-zinc-500">Analytics</p>
      <h2 className="font-heading mt-1 text-lg font-semibold text-white">
        Grassroots snapshot
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        Lightweight team metrics without charting.
      </p>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <Metric icon={Users} label="Roster" value={String(data.playerCount)} />
        <Metric
          icon={Eye}
          label="Profile views"
          value={String(data.scoutSummary.weekly.profileViews)}
        />
        <Metric
          icon={UserPlus}
          label="Join requests"
          value={String(data.pendingJoinRequests)}
        />
      </dl>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
      <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-zinc-500">
        <Icon className="h-3.5 w-3.5 text-cyan-300" />
        {label}
      </dt>
      <dd className="mt-1 text-base font-semibold text-zinc-100">{value}</dd>
    </div>
  );
}

