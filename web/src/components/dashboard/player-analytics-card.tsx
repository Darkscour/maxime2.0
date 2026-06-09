import { BarChart3, Eye, Flame, Users } from "lucide-react";
import type { PlayerAnalyticsSnapshot } from "@/lib/player-analytics";
import { AbstractAreaChart, AbstractWaveChart } from "@/components/dashboard/abstract-charts";

export function PlayerAnalyticsCard({ data }: { data: PlayerAnalyticsSnapshot }) {
  const hasViews = data.totalProfileViews > 0;
  const hasPlayData = data.weeklyPlayTime.some((v) => v > 0);
  const trend = data.profileViewsTrend;

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
              Scout visibility
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              How teams discover and engage with your profile
            </p>
          </div>
        </div>
        {trend != null && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
              trend >= 0
                ? "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20"
                : "bg-rose-400/10 text-rose-300 ring-rose-400/20"
            }`}
          >
            {trend >= 0 ? "+" : ""}
            {trend}% views
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartPanel
          title="Profile views"
          subtitle="Teams opening your scout card"
          empty={!hasViews}
          emptyHint="Views appear when managers browse your profile in Scout"
        >
          <div className="h-28">
            <AbstractAreaChart
              values={data.weeklyProfileViews}
              gradientId="views-gradient"
              stroke="#22d3ee"
              fill="#22d3ee"
            />
          </div>
          <WeekLabels labels={data.weekLabels} />
        </ChartPanel>

        <ChartPanel
          title="Play time pulse"
          subtitle="Hours logged each week"
          empty={!hasPlayData}
          emptyHint="Update your weekly hours to build this curve"
        >
          <div className="h-28">
            <AbstractWaveChart
              values={data.weeklyPlayTime}
              gradientId="play-gradient"
              stroke="#a78bfa"
            />
          </div>
          <WeekLabels labels={data.weekLabels} />
        </ChartPanel>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3">
        <Metric
          icon={Eye}
          label="Profile views"
          value={String(data.totalProfileViews)}
          tone="cyan"
        />
        <Metric
          icon={Users}
          label="Unique scouts"
          value={String(data.uniqueScoutTeams)}
          tone="violet"
        />
        <Metric
          icon={Flame}
          label="Active weeks"
          value={String(data.activeWeeks)}
          tone="emerald"
        />
      </dl>
    </div>
  );
}

function ChartPanel({
  title,
  subtitle,
  empty,
  emptyHint,
  children,
}: {
  title: string;
  subtitle: string;
  empty: boolean;
  emptyHint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent px-4 pb-3 pt-4">
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-400/5 blur-2xl" />
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {title}
      </p>
      <p className="mt-0.5 text-xs text-zinc-600">{subtitle}</p>
      <div className="relative mt-3">
        {children}
        {empty && (
          <p className="mt-2 text-center text-[11px] leading-4 text-zinc-600">{emptyHint}</p>
        )}
      </div>
    </div>
  );
}

function WeekLabels({ labels }: { labels: string[] }) {
  return (
    <div className="mt-2 flex justify-between gap-1 px-1">
      {labels.map((label) => (
        <span key={label} className="flex-1 text-center text-[9px] text-zinc-700">
          {label}
        </span>
      ))}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "cyan" | "violet" | "emerald";
}) {
  const toneClass =
    tone === "cyan"
      ? "text-cyan-400"
      : tone === "violet"
        ? "text-violet-400"
        : "text-emerald-400";

  return (
    <div className="rounded-lg border border-white/5 bg-black/20 px-3 py-2.5">
      <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-600">
        <Icon className={`h-3 w-3 ${toneClass}`} />
        {label}
      </dt>
      <dd className="font-heading mt-1 text-sm font-semibold text-zinc-200">{value}</dd>
    </div>
  );
}
