import { cn } from "@/lib/utils";
import Link from "next/link";

/** Compact activity cell — secondary, not hero KPIs. */
export function DeskActivityStat({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="desk-kicker !text-[var(--foreground-muted)]">{label}</p>
      <p className="mt-1 font-heading text-2xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}

/** @deprecated Prefer DeskActivityStat — kept for analytics cards during migration. */
export const dashboardStatCardClassName =
  "desk-panel flex flex-col p-5";

export function DashboardStatCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  void Icon;

  return (
    <div className={cn(dashboardStatCardClassName, className)}>
      <p className="desk-kicker !text-[var(--foreground-muted)]">{label}</p>
      <p className="mt-2 break-words font-heading text-[1.75rem] font-semibold leading-[0.95] tracking-[-0.02em] text-[var(--foreground)]">
        {value}
      </p>
      {hint && (
        <p className="mt-2 break-words text-xs leading-5 text-[var(--foreground-muted)]">
          {hint}
        </p>
      )}
    </div>
  );
}

/** Quiet link row for secondary destinations — not a numbered work list. */
export function FeatureTile({
  href,
  title,
  description,
  icon: Icon,
  tone = "cyan",
  index,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "cyan" | "violet";
  index?: number;
}) {
  void Icon;
  void tone;
  void index;

  return (
    <Link
      href={href}
      className="group flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-4 last:border-b-0 hover:bg-[color-mix(in_srgb,var(--accent)_5%,var(--surface))]"
    >
      <div className="min-w-0">
        <h3 className="font-heading text-base font-semibold tracking-[-0.01em] text-[var(--foreground)]">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
          {description}
        </p>
      </div>
      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--accent)] transition-transform group-hover:translate-x-0.5">
        Open
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
