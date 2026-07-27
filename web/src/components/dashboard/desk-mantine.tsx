"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  Clock,
  Copy,
  Minus,
  Star,
} from "lucide-react";

/*
  ─── Mantine-styled Maxime desk ────────────────────────────────────────
  All card components used by both the real /dashboard page (real data)
  and the /preview/dashboard/[type] route (mock data).

  Layout mirrors the reference brief:
    Row 1: identity (spans 2 rows) · compliance strip
    Row 2:                           · 3 signal minis beside profile
    Row 3: movement (wide)          · analytics overview
    Row 3: recent activity (full)

  Every card is a presentational component. Data is shaped upstream so
  managers see roster/recruit metrics and players see visibility metrics.
*/

// ────────────────────────────────────────────────────────────────────────
// Types

export type DeskAudience =
  | "manager_grassroots"
  | "manager_collegiate"
  | "player_grassroots"
  | "player_collegiate";

export type DeskIdentity = {
  kind: "org" | "player";
  name: string;
  /** School for orgs · "Game · Role · Rank" for players */
  subLabel: string | null;
  /** Address-style row: region/roster for players; display fallback for orgs */
  code: string;
  /** Bare invite code for org copy control */
  inviteCode?: string | null;
  /** e.g. "Roster" / "Weekly hours" — mirrors reference "Balance" label */
  balanceLabel: string;
  balanceValue: string;
  /** e.g. "Region" — mirrors reference "Chain" label */
  chainLabel: string;
  chainValue: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  imageUrl?: string | null;
};

export type DeskComplianceItem = {
  label: string;
  status: "good" | "pending" | "warn";
};

export type DeskCompliance = {
  title: string;
  subtitle: string;
  items: DeskComplianceItem[];
};

export type DeskSignal = {
  label: string;
  value: string;
  /** null when there is no prior period to compare against */
  trendPct: number | null;
  /** rendered as a small caption under the trend */
  caption?: string;
  href?: string;
};

export type DeskMovement = {
  title: string;
  primaryLabel: string;
  primaryValue: string;
  /** Absolute change annotation shown under the value */
  changeAnnotation: string | null;
  trendPct: number | null;
  splitA: { label: string; value: string };
  splitB: { label: string; value: string };
  breakdown: Array<{ label: string; value: string }>;
  ctaLabel: string;
  ctaHref: string;
  monthLabel: string;
};

export type DeskOverview = {
  title: string;
  labels: string[];
  seriesA: { label: string; values: number[] };
  seriesB: { label: string; values: number[] };
};

export type DeskActivityItem = {
  id: string;
  /** Short category — e.g. "Invite", "Duel", "Sponsor" */
  type: string;
  title: string;
  when: string; // pre-formatted (e.g. "2h ago" or "Fri 7pm")
  status: "good" | "pending" | "warn" | "neutral";
  href?: string | null;
};

export type DeskViewProps = {
  audience: DeskAudience;
  identity: DeskIdentity;
  compliance: DeskCompliance;
  signals: [DeskSignal, DeskSignal, DeskSignal];
  movement: DeskMovement;
  overview: DeskOverview;
  activity: DeskActivityItem[];
};

// ────────────────────────────────────────────────────────────────────────
// Helpers

function TrendBadge({ pct }: { pct: number | null }) {
  if (pct === null) {
    return (
      <span className="md-trend md-trend-flat" aria-label="No prior period">
        <Minus size={12} />—
      </span>
    );
  }
  const cls = pct > 0 ? "md-trend-up" : pct < 0 ? "md-trend-down" : "md-trend-flat";
  const Icon = pct > 0 ? ArrowUpRight : pct < 0 ? ArrowDownRight : Minus;
  const sign = pct > 0 ? "+" : "";
  return (
    <span className={`md-trend ${cls}`}>
      {`${sign}${pct}%`} <Icon size={12} />
    </span>
  );
}

function StatusPill({ status }: { status: DeskActivityItem["status"] }) {
  const map: Record<string, { cls: string; label: string }> = {
    good: { cls: "md-status-good", label: "Cleared" },
    pending: { cls: "md-status-neutral", label: "Pending" },
    warn: { cls: "md-status-warn", label: "Action" },
    neutral: { cls: "md-status-neutral", label: "Info" },
  };
  const spec = map[status] ?? map.neutral!;
  return <span className={`md-status-pill ${spec.cls}`}>{spec.label}</span>;
}

function DeskInviteCodeCopy({ inviteCode }: { inviteCode: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <button
      type="button"
      className="md-invite-copy-btn"
      onClick={copy}
      title="Copy invite code"
    >
      <span>MX · {inviteCode}</span>
      {copied ? <Check size={14} style={{ flexShrink: 0 }} /> : <Copy size={14} style={{ flexShrink: 0, opacity: 0.6 }} />}
    </button>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 1. Identity card — replaces reference "Profile / balance" card

export function DeskIdentityCard({ identity }: { identity: DeskIdentity }) {
  return (
    <section className="md-card md-col-profile">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            background: "var(--md-chip-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            color: "var(--md-text-faint)",
          }}
          aria-hidden
        >
          {identity.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={identity.imageUrl}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : identity.kind === "org" ? (
            <Building2 size={20} />
          ) : (
            <Star size={20} />
          )}
        </div>
        <button
          type="button"
          className="md-top-icon-btn"
          style={{ width: 28, height: 28, background: "transparent", border: 0, color: "var(--md-text-faint)" }}
          aria-label="More"
        >
          ⋯
        </button>
      </div>

      <div style={{ marginTop: 14 }}>
        <div className="md-num" style={{ fontSize: 22, color: "var(--md-accent)" }}>{identity.name}</div>
        {identity.subLabel ? (
          <div className="md-eyebrow" style={{ marginTop: 6, fontSize: 13, color: "var(--md-text-muted)" }}>
            {identity.subLabel}
          </div>
        ) : null}
        {identity.kind === "org" && identity.inviteCode ? (
          <div style={{ marginTop: 10 }}>
            <div className="md-eyebrow" style={{ fontSize: 11, color: "var(--md-text-muted)" }}>
              Invite code
            </div>
            <DeskInviteCodeCopy inviteCode={identity.inviteCode} />
          </div>
        ) : (
          <div
            className="md-eyebrow"
            style={{
              marginTop: 10,
              fontFamily: "var(--font-mono), ui-monospace, monospace",
              fontSize: 12,
              color: "var(--md-text-faint)",
              wordBreak: "break-all",
            }}
          >
            {identity.code}
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, paddingTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, borderTop: "1px solid var(--md-card-border)" }}>
        <div>
          <div className="md-eyebrow" style={{ color: "var(--md-text-muted)" }}>{identity.balanceLabel}</div>
          <div className="md-num md-num-lg" style={{ marginTop: 4 }}>{identity.balanceValue}</div>
        </div>
        <div>
          <div className="md-eyebrow" style={{ color: "var(--md-text-muted)" }}>{identity.chainLabel}</div>
          <div className="md-num md-num-md" style={{ marginTop: 4 }}>{identity.chainValue}</div>
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <Link href={identity.secondaryCta.href} className="md-btn md-btn-ghost">
          {identity.secondaryCta.label}
        </Link>
        <Link href={identity.primaryCta.href} className="md-btn md-btn-primary">
          {identity.primaryCta.label}
        </Link>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 2. Compliance strip — replaces reference "Welcome back!" bullets

export function DeskComplianceCard({ compliance }: { compliance: DeskCompliance }) {
  return (
    <section className="md-card md-col-welcome">
      <div className="md-num" style={{ fontSize: 18 }}>{compliance.title}</div>
      <div className="md-eyebrow" style={{ marginTop: 6, fontSize: 13, color: "var(--md-text-muted)" }}>
        {compliance.subtitle}
      </div>
      <ul style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {compliance.items.map((item, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
            <span
              className={
                item.status === "good"
                  ? "md-check md-check-good"
                  : item.status === "warn"
                    ? "md-check md-check-warn"
                    : "md-check md-check-pending"
              }
              aria-hidden
            >
              {item.status === "good" ? <Check /> : item.status === "warn" ? <ArrowRight /> : <Clock />}
            </span>
            <span style={{ color: item.status === "good" ? "var(--md-text-muted)" : "var(--md-text)" }}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 3. Three signal minis — replaces BTC / ETH / DOGE

export function DeskSignalsRow({ signals }: { signals: [DeskSignal, DeskSignal, DeskSignal] }) {
  return (
    <div className="md-col-signals">
      {signals.map((s, i) => (
        <DeskSignalMini key={i} signal={s} />
      ))}
    </div>
  );
}

function DeskSignalMini({ signal }: { signal: DeskSignal }) {
  const inner = (
    <>
      <div className="md-eyebrow" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {signal.label}
      </div>
      <div className="md-num md-num-lg" style={{ marginTop: 8 }}>{signal.value}</div>
      <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
        <TrendBadge pct={signal.trendPct} />
        {signal.caption ? (
          <span style={{ fontSize: 10, lineHeight: 1.3, color: "var(--md-text-faint)" }}>{signal.caption}</span>
        ) : null}
      </div>
    </>
  );
  if (signal.href) {
    return (
      <Link href={signal.href} className="md-card" style={{ transition: "transform 120ms ease" }}>
        {inner}
      </Link>
    );
  }
  return <section className="md-card">{inner}</section>;
}

// ────────────────────────────────────────────────────────────────────────
// 4. Movement card — replaces "Wallet balance" wide card

export function DeskMovementCard({ movement }: { movement: DeskMovement }) {
  return (
    <section className="md-card md-col-movement">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div className="md-num" style={{ fontSize: 18 }}>{movement.title}</div>
        <select className="md-select" defaultValue={movement.monthLabel} aria-label="Timeframe">
          <option>{movement.monthLabel}</option>
        </select>
      </div>

      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 24 }}>
        {/* Left: primary metric */}
        <div>
          <div className="md-eyebrow" style={{ color: "var(--md-text-muted)" }}>{movement.primaryLabel}</div>
          <div className="md-num md-num-2xl" style={{ marginTop: 6 }}>{movement.primaryValue}</div>
          {movement.changeAnnotation ? (
            <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <span style={{ color: "var(--md-text-muted)" }}>{movement.changeAnnotation}</span>
              <TrendBadge pct={movement.trendPct} />
            </div>
          ) : null}

          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div className="md-eyebrow" style={{ color: "var(--md-text-muted)" }}>{movement.splitA.label}</div>
              <div className="md-num md-num-md" style={{ marginTop: 4 }}>{movement.splitA.value}</div>
            </div>
            <div>
              <div className="md-eyebrow" style={{ color: "var(--md-text-muted)" }}>{movement.splitB.label}</div>
              <div className="md-num md-num-md" style={{ marginTop: 4 }}>{movement.splitB.value}</div>
            </div>
          </div>

          <Link
            href={movement.ctaHref}
            className="md-btn md-btn-primary"
            style={{ marginTop: 20, alignSelf: "flex-start" }}
          >
            {movement.ctaLabel} <ArrowRight size={14} />
          </Link>
        </div>

        {/* Right: breakdown list */}
        <ul style={{ display: "flex", flexDirection: "column", gap: 12, alignSelf: "start", paddingTop: 22 }}>
          {movement.breakdown.map((row, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 12,
                paddingBottom: 10,
                borderBottom:
                  i === movement.breakdown.length - 1 ? "0" : "1px dashed var(--md-card-border)",
              }}
            >
              <span style={{ fontSize: 13, color: "var(--md-text-muted)" }}>{row.label}</span>
              <span className="md-num" style={{ fontSize: 14 }}>{row.value}</span>
            </li>
          ))}
          {movement.breakdown.length === 0 ? (
            <li style={{ fontSize: 13, color: "var(--md-text-faint)" }}>
              Nothing to break down yet — activity will populate as you use Maxime.
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 5. Overview chart — replaces reference "Overview" line chart

export function DeskOverviewCard({ overview }: { overview: DeskOverview }) {
  return (
    <section className="md-card md-col-overview">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div className="md-num" style={{ fontSize: 18 }}>{overview.title}</div>
        <div style={{ display: "inline-flex", gap: 6 }}>
          <span
            className="md-chart-legend-swatch"
            style={{ ["--_swatch" as never]: "var(--md-accent-a)" } as React.CSSProperties}
          >
            {overview.seriesA.label}
          </span>
          <span
            className="md-chart-legend-swatch"
            style={{ ["--_swatch" as never]: "var(--md-accent-b)" } as React.CSSProperties}
          >
            {overview.seriesB.label}
          </span>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <DualLineChart
          labels={overview.labels}
          seriesA={overview.seriesA.values}
          seriesB={overview.seriesB.values}
        />
      </div>
    </section>
  );
}

function DualLineChart({
  labels,
  seriesA,
  seriesB,
}: {
  labels: string[];
  seriesA: number[];
  seriesB: number[];
}) {
  const w = 340;
  const h = 180;
  const padL = 32;
  const padR = 10;
  const padT = 10;
  const padB = 28;

  const combined = [...seriesA, ...seriesB, 1];
  const rawMax = Math.max(...combined);
  const niceMax = niceCeil(rawMax);
  const innerH = h - padT - padB;
  const innerW = w - padL - padR;
  const n = Math.max(labels.length, seriesA.length, seriesB.length);
  const stepX = innerW / Math.max(n - 1, 1);
  const yFor = (v: number) => padT + innerH * (1 - v / niceMax);

  const pathFor = (values: number[]) => {
    if (values.length === 0) return "";
    return values
      .map((v, i) => `${i === 0 ? "M" : "L"} ${padL + i * stepX} ${yFor(v)}`)
      .join(" ");
  };

  const yTicks = 4;
  const tickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((niceMax * i) / yTicks),
  );

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} role="img" aria-label="Weekly trend">
      {tickValues.map((val, i) => {
        const y = yFor(val);
        return (
          <g key={i}>
            <line
              x1={padL}
              x2={w - padR}
              y1={y}
              y2={y}
              stroke="rgba(24,22,60,0.06)"
              strokeWidth={1}
            />
            <text
              x={padL - 6}
              y={y + 3}
              fontSize={9}
              fill="var(--md-text-faint)"
              textAnchor="end"
            >
              {val >= 1000 ? `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k` : val}
            </text>
          </g>
        );
      })}
      <path
        d={pathFor(seriesB)}
        fill="none"
        stroke="var(--md-accent-b)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={pathFor(seriesA)}
        fill="none"
        stroke="var(--md-accent-a)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {labels.map((label, i) => (
        <text
          key={i}
          x={padL + i * stepX}
          y={h - 8}
          fontSize={9}
          fill="var(--md-text-faint)"
          textAnchor="middle"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

function niceCeil(n: number) {
  if (n <= 0) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(n)));
  const rel = n / pow;
  const step = rel <= 1 ? 1 : rel <= 2 ? 2 : rel <= 5 ? 5 : 10;
  return step * pow;
}

// ────────────────────────────────────────────────────────────────────────
// 6. Recent activity — replaces reference "Latest Block" table

export function DeskActivityCard({
  activity,
  title = "Recent activity",
}: {
  activity: DeskActivityItem[];
  title?: string;
}) {
  return (
    <section className="md-card md-col-activity">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="md-num" style={{ fontSize: 18 }}>{title}</div>
        <span
          className="md-eyebrow"
          style={{ fontSize: 12, color: "var(--md-text-muted)" }}
        >
          From your notifications
        </span>
      </div>

      {activity.length === 0 ? (
        <div style={{ marginTop: 16, padding: "24px 0", textAlign: "center", color: "var(--md-text-faint)", fontSize: 13 }}>
          Nothing yet — invites, join requests, scout activity, and duel/sponsor updates land here.
        </div>
      ) : (
        <div style={{ marginTop: 12, overflowX: "auto" }}>
          <table className="md-table">
            <thead>
              <tr>
                <th style={{ width: "18%" }}>Type</th>
                <th>Detail</th>
                <th style={{ width: "18%" }}>When</th>
                <th style={{ width: "14%" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {activity.slice(0, 12).map((row) => {
                const detailNode = row.href ? (
                  <Link href={row.href} style={{ color: "var(--md-text)" }}>
                    {row.title}
                  </Link>
                ) : (
                  row.title
                );
                return (
                  <tr key={row.id}>
                    <td className="mono">{row.type}</td>
                    <td>{detailNode}</td>
                    <td className="mono">{row.when}</td>
                    <td><StatusPill status={row.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Top-level view

export function DeskMantineView(props: DeskViewProps) {
  return (
    <>
      <h1 className="md-page-title">Dashboard</h1>
      <div className="md-grid">
        <DeskIdentityCard identity={props.identity} />
        <DeskComplianceCard compliance={props.compliance} />
        <DeskSignalsRow signals={props.signals} />
        <DeskMovementCard movement={props.movement} />
        <DeskOverviewCard overview={props.overview} />
        <DeskActivityCard activity={props.activity} />
      </div>
    </>
  );
}
