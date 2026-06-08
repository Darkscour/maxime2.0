"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Database, Handshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SponsorListing } from "@/lib/sponsor-listing";
import type { SponsorFetchResult } from "@/lib/fetch-sponsors";
import {
  LiveSponsorFiltersPanel,
  DEFAULT_LIVE_SPONSOR_FILTERS,
  type LiveSponsorFilters,
} from "@/components/sponsorships/live-sponsor-filters";
import { SponsorMinimalCard } from "@/components/sponsorships/sponsor-minimal-card";
import type { SponsorLeadRecord } from "@/lib/sponsor-pipeline";

type LiveSortKey = "alpha" | "difficulty";

export function LiveSponsorshipDirectory({
  liveSponsors,
  dataSource,
  fetchError,
  hasTeam = false,
  leadsBySponsorId = {},
  embedded = false,
}: {
  liveSponsors: SponsorListing[];
  dataSource: SponsorFetchResult["source"];
  fetchError?: string;
  hasTeam?: boolean;
  leadsBySponsorId?: Record<string, SponsorLeadRecord>;
  embedded?: boolean;
}) {
  const [liveFilters, setLiveFilters] = useState(DEFAULT_LIVE_SPONSOR_FILTERS);
  const [liveSort, setLiveSort] = useState<LiveSortKey>("alpha");

  const liveIndustries = useMemo(
    () => [...new Set(liveSponsors.map((s) => s.industry))].sort(),
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
            Live brands from Supabase — filter by industry and difficulty, save to
            your team pipeline, and track applications.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="cyan">
              <Database className="mr-1 inline h-3 w-3" />
              {liveSponsors.length} from Supabase
            </Badge>
          </div>
        </header>
      ) : (
        <section className="relative overflow-hidden border-b border-white/5 bg-spotlight">
          <div className="bg-grid bg-grid-fade absolute inset-0" aria-hidden />
          <div className="relative px-4 py-16 sm:px-8 sm:py-20">
            <Badge tone="violet">
              <Handshake className="h-3.5 w-3.5" /> Sponsorship Portal
            </Badge>
            <h1 className="font-heading mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Your sponsor directory —{" "}
              <span className="text-gradient">{liveSponsors.length} from Supabase</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
              Live sponsor rows from your database — industry, application links, and
              difficulty straight from Supabase.
            </p>
          </div>
        </section>
      )}

      {!hasTeam && (
        <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-4 py-4 text-sm text-zinc-300">
          Join or create a team to save sponsors to your shared pipeline.{" "}
          <Link href="/dashboard/settings/team" className="text-cyan-400 hover:text-cyan-300">
            Set up your team →
          </Link>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {liveSponsors.length > 0 && (
          <LiveSponsorFiltersPanel
            filters={liveFilters}
            setFilters={setLiveFilters}
            industries={liveIndustries}
            difficulties={liveDifficulties}
            resultsCount={liveFiltered.length}
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
            <SupabaseEmptyState dataSource={dataSource} fetchError={fetchError} />
          ) : liveFiltered.length === 0 ? (
            <FilterEmptyState
              onReset={() => setLiveFilters(DEFAULT_LIVE_SPONSOR_FILTERS)}
            />
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
              {liveFiltered.map((sponsor) => (
                <SponsorMinimalCard
                  key={sponsor.id}
                  sponsor={sponsor}
                  showAi={hasTeam}
                  showPipeline={hasTeam}
                  lead={leadsBySponsorId[sponsor.id] ?? null}
                />
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
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-[var(--surface)] px-4 py-3">
      <div className="text-sm text-zinc-400">
        Showing <span className="font-semibold text-white">{count}</span> Supabase
        sponsors
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-zinc-500">Sort by</span>
        {options.map(([key, label]) => (
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
  );
}

function FilterEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[var(--surface)] py-16 text-center">
      <Handshake className="h-8 w-8 text-zinc-600" />
      <h3 className="font-heading mt-3 text-base font-semibold text-white">
        No sponsors match those filters
      </h3>
      <p className="mt-1 max-w-sm text-sm text-zinc-400">
        Try removing an industry or difficulty constraint.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-full bg-violet-400 px-4 py-1.5 text-xs font-medium text-zinc-950 hover:bg-violet-300"
      >
        Reset filters
      </button>
    </div>
  );
}

function SupabaseEmptyState({
  dataSource,
  fetchError,
}: {
  dataSource: SponsorFetchResult["source"];
  fetchError?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[var(--surface)] py-20 text-center">
      <Database className="h-10 w-10 text-zinc-600" />
      <h3 className="font-heading mt-4 text-lg font-semibold text-white">
        {dataSource === "unavailable"
          ? "Could not load sponsors from Supabase"
          : "No sponsors in your database yet"}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
        {dataSource === "unavailable"
          ? fetchError ??
            "Check your DATABASE_URL connection and that the Sponsor table exists."
          : "Import sponsor rows into your Supabase Sponsor table to populate this directory."}
      </p>
    </div>
  );
}
