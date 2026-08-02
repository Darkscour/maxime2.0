import type { PlayerRecruitmentFitBreakdown, PlayerRecruitmentFitResult } from "@/lib/player-recruitment-fit";
import { PlayerScoutFitMeter } from "@/components/dashboard/player-scout-fit-meter";

const BREAKDOWN_LABELS: Record<keyof PlayerRecruitmentFitBreakdown, string> = {
  game: "Title match",
  role: "Role need",
  rank: "Rank band",
  availability: "Availability",
  region: "Region",
  rosterNeed: "Roster slots",
  school: "Campus / school",
};

export function PlayerScoutFitPanel({ fit }: { fit: PlayerRecruitmentFitResult }) {
  const rows = (
    Object.entries(fit.breakdown) as [keyof PlayerRecruitmentFitBreakdown, number][]
  ).filter(([key, value]) => key !== "school" || value !== 70 || fit.reasons.some((r) => /school|campus/i.test(r)));

  return (
    <section className="mt-6 rounded-none border border-[var(--md-card-border)] bg-[var(--md-chip-bg)] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--md-text-muted)]">
        Roster fit
      </p>
      <PlayerScoutFitMeter
        score={fit.score}
        reason={fit.reason}
        className="mt-3"
        showReason={false}
      />
      <p className="mt-2 text-sm text-[var(--md-text-muted)]">{fit.reason}</p>
      <dl className="mt-4 grid gap-2 sm:grid-cols-2">
        {rows.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between gap-3 border border-[var(--md-card-border)] bg-[var(--md-card)] px-3 py-2 text-xs"
          >
            <dt className="text-[var(--md-text-muted)]">{BREAKDOWN_LABELS[key]}</dt>
            <dd className="font-mono tabular-nums text-[var(--md-accent)]">{value}%</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
