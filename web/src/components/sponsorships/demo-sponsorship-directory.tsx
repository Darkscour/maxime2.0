"use client";

import { useMemo, useState } from "react";
import { Handshake } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { DEMO_SPONSOR_LISTINGS } from "@/lib/sponsor-listing";
import {
  LiveSponsorFiltersPanel,
  DEFAULT_LIVE_SPONSOR_FILTERS,
  type LiveSponsorFilters,
} from "@/components/sponsorships/live-sponsor-filters";
import { SponsorMinimalCard } from "@/components/sponsorships/sponsor-minimal-card";
import {
  capForPublicPreview,
  GatedBlurCard,
  PUBLIC_PORTAL_CARD_LIMIT,
} from "@/components/ui/gated-blur-card";

type DemoSortKey = "alpha" | "difficulty";

/** Homepage / marketing preview — same shell as dashboard sponsorship directory. */
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
    () => [...new Set(catalog.map((s) => s.industry))].sort(),
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
          ? "grid gap-6"
          : "grid gap-6 lg:grid-cols-[280px_1fr]"
      }
    >
      <LiveSponsorFiltersPanel
        filters={filters}
        setFilters={setFilters}
        industries={industries}
        difficulties={difficulties}
        resultsCount={filtered.length}
        resultsLabel="sample sponsors"
        sticky={!compact}
      />

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-[var(--surface)] px-4 py-3">
          <div className="text-sm text-zinc-400">
            Showing <span className="font-semibold text-white">{filtered.length}</span>{" "}
            sample sponsors
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500">Sort by</span>
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
                    ? "rounded-full bg-violet-400/10 px-3 py-1 text-violet-300 ring-1 ring-inset ring-violet-400/40"
                    : "rounded-full px-3 py-1 text-zinc-400 hover:text-white"
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[var(--surface)] py-16 text-center">
            <Handshake className="h-8 w-8 text-zinc-600" />
            <h3 className="font-heading mt-3 text-base font-semibold text-white">
              No sponsors match those filters
            </h3>
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_LIVE_SPONSOR_FILTERS)}
              className="mt-4 rounded-full bg-violet-400 px-4 py-1.5 text-xs font-medium text-zinc-950 hover:bg-violet-300"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            {filtered.map((sponsor, i) => {
              const isLastGated =
                gateLast && filtered.length > 1 && i === filtered.length - 1;
              const card = (
                <SponsorMinimalCard sponsor={sponsor} tag="Sample" showAi={false} />
              );

              return (
                <GatedBlurCard
                  key={sponsor.id}
                  gated={isLastGated}
                  redirectUrl="/sign-up"
                  message="Sign in for the live sponsor directory on your dashboard"
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
