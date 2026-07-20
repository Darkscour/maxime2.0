import Link from "next/link";
import { cn } from "@/lib/utils";

/** Shared footprint for overview stats — scoreboard cell or standalone. */
export const dashboardStatCardClassName =
  "ops-status-cell pb-stat flex flex-col border-2 border-[var(--foreground)] bg-[var(--surface)] p-5";

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
      <p className="pb-stat-label pb-kicker !text-[var(--foreground-muted)]">{label}</p>
      <p className="pb-stat-value font-board mt-2 break-words text-[2rem] font-semibold leading-[0.95] tracking-[0.01em] uppercase text-[var(--foreground)]">
        {value}
      </p>
      {hint && (
        <p className="pb-stat-hint mt-2 break-words text-xs leading-5 text-[var(--foreground-muted)]">
          {hint}
        </p>
      )}
    </div>
  );
}

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

  return (
    <Link href={href} className="pb-work-row group">
      <span className="font-mono text-[11px] tracking-[0.14em] text-[var(--foreground-subtle)]">
        {index != null ? String(index).padStart(2, "0") : "—"}
      </span>
      <div className="min-w-0">
        <h3 className="font-board text-lg font-semibold uppercase tracking-[0.03em] text-[var(--foreground)]">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">{description}</p>
      </div>
      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--accent)] transition-transform group-hover:translate-x-0.5">
        Open
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
