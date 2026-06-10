import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import type { ManagerOrgAnalytics } from "@/lib/manager-analytics";
import { AbstractAreaChart } from "@/components/dashboard/abstract-charts";

const CHART_HEIGHT = 96;

/**
 * Org activity — metrics not already shown in the overview stat row.
 * Stat row covers: roster headcount, pending invites.
 * Here: growth trend, recruitment outcomes, scouting, sponsorship pipeline.
 */
export function ManagerAnalyticsCard({ data }: { data: ManagerOrgAnalytics }) {
  const trend = data.rosterTrend;
  const trendLabel =
    trend == null ? null : trend >= 0 ? `+${trend}%` : `${trend}%`;

  return (
    <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-inset ring-cyan-400/25">
            <BarChart3 className="h-5 w-5 text-cyan-300" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">Analytics</p>
            <h2 className="font-heading mt-1 text-lg font-semibold text-white">
              Org activity
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              Recruitment, scouting, and sponsorship momentum
            </p>
          </div>
        </div>
        {trendLabel && (
          <span
            className={
              trend != null && trend >= 0
                ? "inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/20"
                : "inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-300 ring-1 ring-inset ring-amber-400/20"
            }
          >
            {trend != null && trend >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trendLabel}
          </span>
        )}
      </div>

      <div
        className="mt-6 h-28 overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent px-2 pt-2"
        role="img"
        aria-label="Roster joins over the last six weeks"
      >
        <AbstractAreaChart
          values={data.weeklyRosterJoins}
          gradientId="org-gradient"
          stroke="#34d399"
          fill="#34d399"
          height={CHART_HEIGHT}
        />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="New joins" value={String(data.recentJoins)} hint="6 wks" />
        <Metric label="Invites accepted" value={String(data.invitesAccepted)} />
        <Metric label="Scout views" value={String(data.scoutProfileViews)} hint="6 wks" />
        <Metric label="Sponsor leads" value={String(data.sponsorLeads)} />
      </dl>
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-black/20 px-3 py-2.5">
      <dt className="text-[10px] uppercase tracking-wider text-zinc-600">
        {label}
        {hint && <span className="text-zinc-700"> · {hint}</span>}
      </dt>
      <dd className="font-heading mt-1 text-sm font-semibold text-zinc-200">{value}</dd>
    </div>
  );
}
