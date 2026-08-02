import { cn } from "@/lib/utils";

export function PlayerScoutFitMeter({
  score,
  reason,
  className,
  showReason = true,
}: {
  score: number;
  reason?: string;
  className?: string;
  showReason?: boolean;
}) {
  const clamped = Math.min(100, Math.max(0, score));

  return (
    <div className={cn("md-scout-fit", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--md-text-muted)]">
          Fit
        </span>
        <span className="font-mono text-[10px] tabular-nums tracking-[0.06em] text-[var(--md-accent)]">
          {clamped}%
        </span>
      </div>
      <div className="md-scout-fit-track" role="presentation">
        <span
          className="md-scout-fit-fill"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showReason && reason ? (
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-[var(--md-text-faint)]">
          {reason}
        </p>
      ) : null}
    </div>
  );
}
