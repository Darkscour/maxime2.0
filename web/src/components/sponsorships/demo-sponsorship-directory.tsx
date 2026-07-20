"use client";

import { useMemo, useState } from "react";
import { Handshake } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { DEMO_SPONSOR_LISTINGS } from "@/lib/sponsor-listing";
import { curatedIndustriesFromData } from "@/lib/sponsor-filters";
import {
  LiveSponsorFiltersPanel,
  DEFAULT_LIVE_SPONSOR_FILTERS,
  type LiveSponsorFilters,
} from "@/components/sponsorships/live-sponsor-filters";
import { SponsorDirectoryCard } from "@/components/sponsorships/sponsor-directory-card";
import {
  capForPublicPreview,
  GatedBlurCard,
  PUBLIC_PORTAL_CARD_LIMIT,
} from "@/components/ui/gated-blur-card";

type DemoSortKey = "alpha" | "difficulty";

/** Homepage / marketing preview — sticky filters, cards scroll beside them. */
export function DemoSponsorshipDirectory({ compact = false }: { compact?: boolean }) {
  const { isSignedIn, isLoaded } = useAuth();
  const gateLast = isLoaded && !isSignedIn;

  const catalog = useMemo(
    () => DEMO_SPONSOR_LISTINGS.slice(0, PUBLIC_PORTAL_CARD_LIMIT),
    [],
  );

  const [filters, setFilters] = useState(DEFAULT_LIVE_SPONSOR_FILTERS);
  const [sort, setSort] = useState<DemoSortKey>("alpha");

  const industries = useMemo(
    () =>
      curatedIndustriesFromData(
        [...new Set(catalog.map((s) => s.industry))].sort(),
      ),
    [catalog],
  );
  const difficulties = useMemo(
    () => [...new Set(catalog.map((s) => s.difficulty))].sort(),
    [catalog],
  );

  const filtered = useMemo(() => {
    const matches = catalog.filter((s) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!s.name.toLowerCase().includes(q)) return false;
      }
      if (filters.industry && s.industry !== filters.industry) return false;
      if (filters.difficulty && s.difficulty !== filters.difficulty) return false;
      return true;
    });

    const sorted = [...matches].sort((a, b) => {
      if (sort === "difficulty") return a.difficulty.localeCompare(b.difficulty);
      return a.name.localeCompare(b.name);
    });

    return gateLast ? capForPublicPreview(sorted) : sorted;
  }, [catalog, filters, sort, gateLast]);

  return (
    <div
      className={
        compact
          ? "grid items-start gap-6 lg:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]"
          : "grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]"
      }
    >
      <LiveSponsorFiltersPanel
        filters={filters}
        setFilters={setFilters}
        industries={industries}
        difficulties={difficulties}
        resultsCount={filtered.length}
        resultsLabel="sample sponsors"
        sticky
        stickyContext="marketing"
      />

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--foreground-muted)]">
          <span>
            Showing <span className="font-medium text-[var(--foreground)]">{filtered.length}</span>{" "}
            sample sponsors
          </span>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--foreground-muted)]">Sort</span>
            {(
              [
                ["alpha", "A–Z"],
                ["difficulty", "Difficulty"],
              ] as [DemoSortKey, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                className={
                  sort === key
                    ? "rounded-none bg-[var(--background)] px-2.5 py-1 text-[var(--foreground)]"
                    : "rounded-none px-2.5 py-1 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-none border border-dashed border-[var(--border)] bg-[var(--surface)] py-16 text-center">
            <Handshake className="h-8 w-8 text-[var(--foreground-muted)]" />
            <h3 className="font-heading mt-3 text-base font-semibold text-[var(--foreground)]">
              No sponsors match those filters
            </h3>
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_LIVE_SPONSOR_FILTERS)}
              className="mt-4 rounded-none bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-4 py-2 text-xs font-medium text-[var(--accent)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent)_25%,transparent)]"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((sponsor, i) => {
              const isLastGated =
                gateLast && filtered.length > 1 && i === filtered.length - 1;
              const card = (
                <SponsorDirectoryCard sponsor={sponsor} tag="Sample" />
              );

              return (
                <GatedBlurCard
                  key={sponsor.id}
                  gated={isLastGated}
                  redirectUrl="/sign-up"
                  message="Sign in for the full curated directory on your dashboard"
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
