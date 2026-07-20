"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { DEMO_PLAYER_LISTINGS } from "@/lib/player-listing";
import { PlayerDemoCard } from "@/components/recruitment/player-demo-card";
import {
  RecruitmentFiltersPanel,
  DEFAULT_RECRUITMENT_FILTERS,
  type RecruitmentFilters,
} from "@/components/recruitment/recruitment-filters-panel";
import {
  capForPublicPreview,
  GatedBlurCard,
  PUBLIC_PORTAL_CARD_LIMIT,
} from "@/components/ui/gated-blur-card";

type DemoSortKey = "alpha" | "rank" | "fit";

/** Homepage / marketing preview — same shell as dashboard sponsorship directory. */
export function DemoRecruitmentDirectory({ compact = false }: { compact?: boolean }) {
  const { isSignedIn, isLoaded } = useAuth();
  const gateLast = isLoaded && !isSignedIn;

  const pool = useMemo(
    () => DEMO_PLAYER_LISTINGS.slice(0, PUBLIC_PORTAL_CARD_LIMIT),
    [],
  );

  const [filters, setFilters] = useState(DEFAULT_RECRUITMENT_FILTERS);
  const [sort, setSort] = useState<DemoSortKey>("fit");

  const games = useMemo(() => [...new Set(pool.map((p) => p.game))].sort(), [pool]);
  const roles = useMemo(() => [...new Set(pool.map((p) => p.role))].sort(), [pool]);
  const regions = useMemo(
    () => [...new Set(pool.map((p) => p.region))].sort(),
    [pool],
  );
  const ranks = useMemo(() => [...new Set(pool.map((p) => p.rank))].sort(), [pool]);
  const statuses = useMemo(
    () => [...new Set(pool.map((p) => p.status))].sort(),
    [pool],
  );

  const filtered = useMemo(() => {
    const matches = pool.filter((p) => {
      if (filters.search && !p.handle.toLowerCase().includes(filters.search.toLowerCase()))
        return false;
      if (filters.game && p.game !== filters.game) return false;
      if (filters.role && p.role !== filters.role) return false;
      if (filters.region && p.region !== filters.region) return false;
      if (filters.rank && p.rank !== filters.rank) return false;
      if (filters.status && p.status !== filters.status) return false;
      return true;
    });

    const sorted = [...matches].sort((a, b) => {
      if (sort === "fit") return b.fitScore - a.fitScore;
      if (sort === "rank") return a.rank.localeCompare(b.rank);
      return a.handle.localeCompare(b.handle);
    });

    return gateLast ? capForPublicPreview(sorted) : sorted;
  }, [pool, filters, sort, gateLast]);

  return (
    <div
      className={
        compact
          ? "grid gap-6"
          : "grid gap-6 lg:grid-cols-[280px_1fr]"
      }
    >
      <RecruitmentFiltersPanel
        filters={filters}
        setFilters={setFilters}
        games={games}
        roles={roles}
        regions={regions}
        ranks={ranks}
        statuses={statuses}
        resultsCount={filtered.length}
        resultsLabel="sample players"
        sticky={!compact}
      />

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-none border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
          <div className="text-sm text-[var(--foreground-muted)]">
            Showing <span className="font-semibold text-[var(--foreground)]">{filtered.length}</span>{" "}
            sample players
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--foreground-muted)]">Sort by</span>
            {(
              [
                ["fit", "Best fit"],
                ["alpha", "A–Z"],
                ["rank", "Rank"],
              ] as [DemoSortKey, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                className={
                  sort === key
                    ? "rounded-none bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-3 py-1 text-[var(--accent)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
                    : "rounded-none px-3 py-1 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-none border border-dashed border-[var(--border)] bg-[var(--surface)] py-16 text-center">
            <Users className="h-8 w-8 text-[var(--foreground-muted)]" />
            <h3 className="font-heading mt-3 text-base font-semibold text-[var(--foreground)]">
              No players match those filters
            </h3>
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_RECRUITMENT_FILTERS)}
              className="mt-4 rounded-none bg-[var(--accent)] px-4 py-1.5 text-xs font-medium text-[var(--accent-ink)] hover:bg-[var(--accent-strong)]"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            {filtered.map((player, i) => {
              const isLastGated =
                gateLast && filtered.length > 1 && i === filtered.length - 1;
              const card = <PlayerDemoCard player={player} tag="Sample" />;

              return (
                <GatedBlurCard
                  key={player.id}
                  gated={isLastGated}
                  redirectUrl="/sign-up"
                  message="Sign in to scout the full player directory"
                >
                  {card}
                </GatedBlurCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
