"use client";

import { useMemo, useState } from "react";
import { Handshake, Sparkles } from "lucide-react";
import type { SponsorListing } from "@/lib/sponsor-listing";
import type { SponsorFetchResult } from "@/lib/fetch-sponsors";
import { curatedIndustriesFromData } from "@/lib/sponsor-filters";
import {
  LiveSponsorFiltersPanel,
  DEFAULT_LIVE_SPONSOR_FILTERS,
  type LiveSponsorFilters,
} from "@/components/sponsorships/live-sponsor-filters";
import { SponsorDirectoryCard } from "@/components/sponsorships/sponsor-directory-card";

type LiveSortKey = "alpha" | "difficulty";

export function LiveSponsorshipDirectory({
  liveSponsors,
  dataSource,
  fetchError,
  embedded = false,
}: {
  liveSponsors: SponsorListing[];
  dataSource: SponsorFetchResult["source"];
  fetchError?: string;
  embedded?: boolean;
}) {
  const [liveFilters, setLiveFilters] = useState(DEFAULT_LIVE_SPONSOR_FILTERS);
  const [liveSort, setLiveSort] = useState<LiveSortKey>("alpha");

  const liveIndustries = useMemo(
    () =>
      curatedIndustriesFromData(
        [...new Set(liveSponsors.map((s) => s.industry))].sort(),
      ),
    [liveSponsors],
  );
  const liveDifficulties = useMemo(
    () => [...new Set(liveSponsors.map((s) => s.difficulty))].sort(),
    [liveSponsors],
  );

  const liveFiltered = useMemo(() => {
    const filtered = liveSponsors.filter((s) => {
      if (liveFilters.search) {
        const q = liveFilters.search.toLowerCase();
        if (!s.name.toLowerCase().includes(q)) return false;
      }
      if (liveFilters.industry && s.industry !== liveFilters.industry) return false;
      if (liveFilters.difficulty && s.difficulty !== liveFilters.difficulty)
        return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (liveSort === "difficulty")
        return a.difficulty.localeCompare(b.difficulty);
      return a.name.localeCompare(b.name);
    });
  }, [liveSponsors, liveFilters, liveSort]);

  return (
    <div className={embedded ? "mx-auto max-w-6xl" : ""}>
      {embedded ? (
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            Sponsorships
          </p>
          <h1 className="font-heading mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Sponsor directory
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            A curated selection of brands that sponsor collegiate and grassroots
            esports orgs — filter by fit and jump straight to application pages.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-400/10 px-2.5 py-1 text-xs font-medium text-violet-300 ring-1 ring-inset ring-violet-400/20">
              <Sparkles className="h-3 w-3" />
              {liveSponsors.length} curated sponsors
            </span>
          </div>
        </header>
      ) : (
        <section className="relative overflow-hidden border-b border-white/5 bg-spotlight">
          <div className="bg-grid bg-grid-fade absolute inset-0" aria-hidden />
          <div className="relative px-4 py-16 sm:px-8 sm:py-20">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-400/10 px-2.5 py-1 text-xs font-medium text-violet-300 ring-1 ring-inset ring-violet-400/20">
              <Handshake className="h-3.5 w-3.5" /> Sponsorship directory
            </span>
            <h1 className="font-heading mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Curated sponsors for collegiate orgs
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
              Hand-picked brands with real application links — built for team
              managers who need deals that actually fit amateur rosters.
            </p>
          </div>
        </section>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        {liveSponsors.length > 0 && (
          <LiveSponsorFiltersPanel
            filters={liveFilters}
            setFilters={setLiveFilters}
            industries={liveIndustries}
            difficulties={liveDifficulties}
            resultsCount={liveFiltered.length}
            resultsLabel="in directory"
            sticky
            stickyContext={embedded ? "dashboard" : "marketing"}
          />
        )}
        <div className={liveSponsors.length === 0 ? "lg:col-span-2" : ""}>
          {liveSponsors.length > 0 && (
            <LiveToolbar
              count={liveFiltered.length}
              sort={liveSort}
              setSort={setLiveSort}
            />
          )}
          {liveSponsors.length === 0 ? (
            <DirectoryEmptyState dataSource={dataSource} fetchError={fetchError} />
          ) : liveFiltered.length === 0 ? (
            <FilterEmptyState
              onReset={() => setLiveFilters(DEFAULT_LIVE_SPONSOR_FILTERS)}
            />
          ) : (
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              {liveFiltered.map((sponsor) => (
                <SponsorDirectoryCard key={sponsor.id} sponsor={sponsor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LiveToolbar({
  count,
  sort,
  setSort,
}: {
  count: number;
  sort: LiveSortKey;
  setSort: (s: LiveSortKey) => void;
}) {
  const options: [LiveSortKey, string][] = [
    ["alpha", "A–Z"],
    ["difficulty", "Difficulty"],
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
      <span>
        Showing <span className="font-medium text-white">{count}</span> sponsors
      </span>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-zinc-500">Sort</span>
        {options.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSort(key)}
            className={
              sort === key
                ? "rounded-lg bg-white/[0.06] px-2.5 py-1 text-zinc-200"
                : "rounded-lg px-2.5 py-1 text-zinc-500 hover:text-zinc-300"
            }
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[var(--surface)] py-16 text-center">
      <Handshake className="h-8 w-8 text-zinc-600" />
      <h3 className="font-heading mt-3 text-base font-semibold text-white">
        No sponsors match those filters
      </h3>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-lg bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-300 ring-1 ring-inset ring-cyan-400/25 hover:bg-cyan-400/15"
      >
        Clear filters
      </button>
    </div>
  );
}

function DirectoryEmptyState({
  dataSource,
  fetchError,
}: {
  dataSource: SponsorFetchResult["source"];
  fetchError?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[var(--surface)] py-20 text-center">
      <Handshake className="h-10 w-10 text-zinc-600" />
      <h3 className="font-heading mt-4 text-lg font-semibold text-white">
        {dataSource === "unavailable"
          ? "Directory temporarily unavailable"
          : "No sponsors in the directory yet"}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
        {dataSource === "unavailable"
          ? fetchError ?? "Check your database connection and try again shortly."
          : "Curated sponsors will appear here as they are added to Maxime."}
      </p>
    </div>
  );
}
