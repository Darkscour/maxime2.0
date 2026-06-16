"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BarChart3,
  Bookmark,
  Eye,
  Mail,
  UserPlus,
  Users,
} from "lucide-react";
import type {
  ManagerAnalyticsSeries,
  ManagerOrgAnalytics,
  ManagerAnalyticsSummary,
  ManagerScoutSummary,
} from "@/lib/manager-analytics";
import { InteractiveAreaChart } from "@/components/dashboard/interactive-area-chart";
import { cn } from "@/lib/utils";

type RangeMode = "weekly" | "allTime";

function teamJoinedLabel(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ManagerAnalyticsCard({ data }: { data: ManagerOrgAnalytics }) {
  const pipelineActions =
    data.pendingJoinRequests + data.pendingInvites + data.watchlistCount;

  return (
    <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-inset ring-cyan-400/25">
          <BarChart3 className="h-5 w-5 text-cyan-300" />
        </span>
        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500">Analytics</p>
          <h2 className="font-heading mt-1 text-lg font-semibold text-white">
            Recruitment & scouting
          </h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            Tracking since {teamJoinedLabel(data.teamJoinedAt)}
          </p>
        </div>
      </div>

      {pipelineActions > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {data.pendingJoinRequests > 0 && (
            <PipelineChip
              href="/dashboard/join-requests"
              icon={UserPlus}
              label={`${data.pendingJoinRequests} join request${data.pendingJoinRequests === 1 ? "" : "s"}`}
              tone="cyan"
            />
          )}
          {data.pendingInvites > 0 && (
            <PipelineChip
              href="/dashboard/watchlist"
              icon={Mail}
              label={`${data.pendingInvites} invite${data.pendingInvites === 1 ? "" : "s"} pending`}
              tone="violet"
            />
          )}
          {data.watchlistCount > 0 && (
            <PipelineChip
              href="/dashboard/watchlist"
              icon={Bookmark}
              label={`${data.watchlistCount} on watchlist`}
              tone="zinc"
            />
          )}
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <AnalyticsChartPanel
          title="Roster size"
          chartMetric="Active members at end of week"
          subtitle="Line tracks total headcount — summary cards below use the selected period"
          series={data.rosterSize}
          chartId="roster"
          stroke="#34d399"
          fill="#34d399"
          valueLabel={(n) =>
            n === 1 ? "1 on roster" : `${n} on roster`
          }
          emptyHint="Roster growth appears as members join your team"
          renderMetrics={(mode) => (
            <RosterMetrics
              rosterCount={data.rosterCount}
              playerCount={data.playerCount}
              summary={data.rosterSummary[mode]}
              mode={mode}
            />
          )}
        />
        <AnalyticsChartPanel
          title="Scouting activity"
          chartMetric="Profile views per week"
          subtitle="Line tracks scout profile opens — summary cards cover views, requests, and invites"
          series={data.scoutViews}
          chartId="scout"
          stroke="#22d3ee"
          fill="#22d3ee"
          valueLabel={(n) =>
            n === 1 ? "1 profile view" : `${n} profile views`
          }
          emptyHint="Browse Scout players — each profile view is logged for your org"
          renderMetrics={(mode) => (
            <ScoutMetrics summary={data.scoutSummary[mode]} mode={mode} />
          )}
        />
      </div>
    </div>
  );
}

function AnalyticsChartPanel({
  title,
  chartMetric,
  subtitle,
  series,
  chartId,
  stroke,
  fill,
  valueLabel,
  emptyHint,
  renderMetrics,
}: {
  title: string;
  chartMetric: string;
  subtitle: string;
  series: ManagerAnalyticsSeries;
  chartId: string;
  stroke: string;
  fill: string;
  valueLabel: (value: number) => string;
  emptyHint: string;
  renderMetrics: (mode: RangeMode) => React.ReactNode;
}) {
  const [mode, setMode] = useState<RangeMode>("weekly");
  const points = mode === "weekly" ? series.weekly : series.allTime;
  const chartPoints = points.map((p) => ({
    label: p.label,
    date: p.date,
    value: p.value,
  }));

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent px-4 pb-4 pt-4">
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-400/5 blur-2xl" />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {title}
          </p>
          <p className="mt-0.5 text-xs font-medium text-zinc-400">{chartMetric}</p>
          <p className="mt-0.5 text-xs text-zinc-600">{subtitle}</p>
        </div>
        <RangeToggle mode={mode} onChange={setMode} />
      </div>
      <div className="mt-3">
        <InteractiveAreaChart
          key={`${chartId}-${mode}`}
          points={chartPoints}
          gradientId={`${chartId}-${mode}`}
          stroke={stroke}
          fill={fill}
          valueLabel={valueLabel}
          emptyHint={emptyHint}
        />
      </div>
      <div className="mt-4">{renderMetrics(mode)}</div>
    </div>
  );
}

function RosterMetrics({
  rosterCount,
  playerCount,
  summary,
  mode,
}: {
  rosterCount: number;
  playerCount: number;
  summary: ManagerAnalyticsSummary;
  mode: RangeMode;
}) {
  const periodLabel = mode === "weekly" ? "This period" : "All time";

  return (
    <div>
      <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-600">
        Summary · {periodLabel}
      </p>
      <dl className="grid grid-cols-3 gap-3">
        <Metric icon={Users} label="On roster" value={String(rosterCount)} tone="emerald" hint="Current total" />
        <Metric icon={Users} label="Players" value={String(playerCount)} tone="emerald" hint="Current total" />
        <Metric
          icon={UserPlus}
          label="New joins"
          value={String(summary.newJoins)}
          tone="cyan"
          hint={periodLabel}
        />
      </dl>
    </div>
  );
}

function ScoutMetrics({
  summary,
  mode,
}: {
  summary: ManagerScoutSummary;
  mode: RangeMode;
}) {
  const periodLabel = mode === "weekly" ? "This period" : "All time";

  return (
    <div>
      <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-600">
        Summary · {periodLabel}
      </p>
      <dl className="grid grid-cols-3 gap-3">
        <Metric
          icon={Eye}
          label="Profile views"
          value={String(summary.profileViews)}
          tone="cyan"
          hint={periodLabel}
        />
        <Metric
          icon={UserPlus}
          label="Join requests"
          value={String(summary.joinRequests)}
          tone="cyan"
          hint={periodLabel}
        />
        <Metric
          icon={Mail}
          label="Invites sent"
          value={String(summary.invitesSent)}
          tone="violet"
          hint={periodLabel}
        />
      </dl>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tone,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "cyan" | "violet" | "emerald";
  hint?: string;
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
        <Icon className={`h-3 w-3 shrink-0 ${toneClass}`} />
        <span className="truncate">{label}</span>
      </dt>
      <dd className="font-heading mt-1 text-sm font-semibold text-zinc-200">{value}</dd>
      {hint && (
        <p className="mt-0.5 text-[9px] text-zinc-600">{hint}</p>
      )}
    </div>
  );
}

function RangeToggle({
  mode,
  onChange,
}: {
  mode: RangeMode;
  onChange: (mode: RangeMode) => void;
}) {
  return (
    <div
      className="flex rounded-lg border border-white/10 bg-black/30 p-0.5"
      role="tablist"
      aria-label="Chart time range"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === "weekly"}
        onClick={() => onChange("weekly")}
        className={cn(
          "rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors",
          mode === "weekly"
            ? "bg-white/10 text-white"
            : "text-zinc-500 hover:text-zinc-300",
        )}
      >
        Weekly
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "allTime"}
        onClick={() => onChange("allTime")}
        className={cn(
          "rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors",
          mode === "allTime"
            ? "bg-white/10 text-white"
            : "text-zinc-500 hover:text-zinc-300",
        )}
      >
        All time
      </button>
    </div>
  );
}

function PipelineChip({
  href,
  icon: Icon,
  label,
  tone,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tone: "cyan" | "violet" | "zinc";
}) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-200 hover:border-cyan-400/40"
      : tone === "violet"
        ? "border-violet-400/25 bg-violet-400/10 text-violet-200 hover:border-violet-400/40"
        : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20";

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${toneClass}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" />
      {label}
    </Link>
  );
}
