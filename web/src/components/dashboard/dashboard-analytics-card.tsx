import { BarChart3, TrendingUp } from "lucide-react";
import type { PlayerAnalyticsSnapshot } from "@/lib/player-analytics";
import { PlayerAnalyticsCard } from "@/components/dashboard/player-analytics-card";
import { AbstractAreaChart } from "@/components/dashboard/abstract-charts";

/** Placeholder weekly values for manager org activity. */
const PLACEHOLDER_WEEKS = [42, 58, 51, 73, 68, 84];

const CHART_HEIGHT = 96;

export function DashboardAnalyticsCard({
  accountType,
  playerAnalytics,
}: {
  accountType: string | null;
  playerAnalytics?: PlayerAnalyticsSnapshot | null;
}) {
  const isManager = accountType === "team_manager";

  if (!isManager && playerAnalytics) {
    return <PlayerAnalyticsCard data={playerAnalytics} />;
  }

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
              {isManager ? "Org activity" : "Your activity"}
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              {isManager
                ? "Roster & sponsorship engagement (sample)"
                : "Profile & play time trends (sample)"}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
          <TrendingUp className="h-3 w-3" />
          +12%
        </span>
      </div>

      <div
        className="mt-6 h-28 overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent px-2 pt-2"
        role="img"
        aria-label="Org activity chart"
      >
        <AbstractAreaChart
          values={PLACEHOLDER_WEEKS}
          gradientId="org-gradient"
          stroke="#34d399"
          fill="#34d399"
          height={CHART_HEIGHT}
        />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        <Metric label={isManager ? "Roster fills" : "Profile views"} value="—" />
        <Metric label={isManager ? "Sponsor leads" : "Team invites"} value="—" />
      </dl>

      <p className="mt-4 text-xs leading-5 text-zinc-600">
        Sample chart — connect real events to populate this card.
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-black/20 px-3 py-2.5">
      <dt className="text-[10px] uppercase tracking-wider text-zinc-600">{label}</dt>
      <dd className="font-heading mt-1 text-sm font-semibold text-zinc-400">{value}</dd>
    </div>
  );
}
