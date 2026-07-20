import { BarChart3, Eye, Users } from "lucide-react";
import type { PlayerAnalyticsSnapshot } from "@/lib/player-analytics";
import { AbstractAreaChart, AbstractWaveChart } from "@/components/dashboard/abstract-charts";

export function PlayerAnalyticsCard({ data }: { data: PlayerAnalyticsSnapshot }) {
  const hasViews = data.totalProfileViews > 0;
  const hasPlayData = data.weeklyPlayTime.some((v) => v > 0);
  const trend = data.profileViewsTrend;

  return (
    <div className="rounded-none border border-[var(--foreground)] bg-[var(--surface)] p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]">
            <BarChart3 className="h-5 w-5 text-[var(--accent)]" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">Analytics</p>
            <h2 className="font-heading mt-1 text-lg font-semibold text-[var(--foreground)]">
              Scout visibility
            </h2>
            <p className="mt-0.5 text-sm text-[var(--foreground-muted)]">
              How teams discover and engage with your profile
            </p>
          </div>
        </div>
        {trend != null && (
          <span
            className={`inline-flex items-center gap-1 rounded-none px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
              trend >= 0
                ? "bg-[color-mix(in_srgb,var(--success)_12%,transparent)] text-[var(--success)] ring-[color-mix(in_srgb,var(--success)_28%,transparent)]"
                : "bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] text-[var(--danger)] ring-[color-mix(in_srgb,var(--danger)_28%,transparent)]"
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
              stroke="#b84a1b"
              fill="#b84a1b"
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
              stroke="#8f3d18"
            />
          </div>
          <WeekLabels labels={data.weekLabels} />
        </ChartPanel>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3">
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
    <div className="relative overflow-hidden rounded-none border border-[var(--border)] bg-[var(--background)] px-4 pb-3 pt-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
        {title}
      </p>
      <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">{subtitle}</p>
      <div className="relative mt-3">
        {children}
        {empty && (
          <p className="mt-2 text-center text-[11px] leading-4 text-[var(--foreground-muted)]">{emptyHint}</p>
        )}
      </div>
    </div>
  );
}

function WeekLabels({ labels }: { labels: string[] }) {
  return (
    <div className="mt-2 flex justify-between gap-1 px-1">
      {labels.map((label) => (
        <span key={label} className="flex-1 text-center text-[9px] text-[var(--foreground-muted)]">
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
      ? "text-[var(--accent)]"
      : tone === "violet"
        ? "text-[var(--accent-2)]"
        : "text-[var(--success)]";

  return (
    <div className="rounded-none border border-[var(--border)] bg-[var(--background)] px-3.5 py-3">
      <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[var(--foreground-muted)]">
        <Icon className={`h-3 w-3 ${toneClass}`} />
        {label}
      </dt>
      <dd className="font-heading mt-1.5 text-base font-semibold text-[var(--foreground)]">{value}</dd>
    </div>
  );
}
