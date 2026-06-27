"use client";

import { useMemo, useState } from "react";
import { Handshake, Sparkles } from "lucide-react";
import type { SponsorListing } from "@/lib/sponsor-listing";
import type { SponsorFetchResult } from "@/lib/fetch-sponsors";
import type { SponsorLeadRecord } from "@/lib/sponsor-pipeline";
import { curatedIndustriesFromData } from "@/lib/sponsor-filters";
import {
  LiveSponsorFiltersPanel,
  DEFAULT_LIVE_SPONSOR_FILTERS,
  type LiveSponsorFilters,
} from "@/components/sponsorships/live-sponsor-filters";
import { SponsorDirectoryCard } from "@/components/sponsorships/sponsor-directory-card";
import { DashboardSectionEyebrow } from "@/components/dashboard/dashboard-section-eyebrow";

export function LiveSponsorshipDirectory({
  liveSponsors,
  dataSource,
  fetchError,
  embedded = false,
  leadsBySponsorId,
  showPipeline = false,
}: {
  liveSponsors: SponsorListing[];
  dataSource: SponsorFetchResult["source"];
  fetchError?: string;
  embedded?: boolean;
  leadsBySponsorId?: Record<string, SponsorLeadRecord>;
  showPipeline?: boolean;
}) {
  const [filters, setFilters] = useState<LiveSponsorFilters>(
    DEFAULT_LIVE_SPONSOR_FILTERS,
  );

  const industries = useMemo(
    () =>
      curatedIndustriesFromData(
        [...new Set(liveSponsors.map((s) => s.industry))].sort(),
      ),
    [liveSponsors],
  );
  const difficulties = useMemo(
    () => [...new Set(liveSponsors.map((s) => s.difficulty))].sort(),
    [liveSponsors],
  );

  const filteredSponsors = useMemo(() => {
    const filtered = liveSponsors.filter((s) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!s.name.toLowerCase().includes(q)) return false;
      }
      if (filters.industry && s.industry !== filters.industry) return false;
      if (filters.difficulty && s.difficulty !== filters.difficulty) return false;
      return true;
    });

    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }, [liveSponsors, filters]);

  return (
    <div className={embedded ? "mx-auto max-w-6xl" : ""}>
      {embedded ? (
        <header className="mb-6">
          <DashboardSectionEyebrow accent="emerald">
            Partnerships
          </DashboardSectionEyebrow>
          <h1 className="font-heading mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Sponsor directory
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Curated brands that sponsor collegiate esports orgs — save leads to
            your pipeline and track outreach.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-400/10 px-2.5 py-1 text-xs font-medium text-violet-300 ring-1 ring-inset ring-violet-400/20">
              <Sparkles className="h-3 w-3" />
              {liveSponsors.length} sponsors
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

      {liveSponsors.length === 0 ? (
        <DirectoryEmptyState dataSource={dataSource} fetchError={fetchError} />
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
          <LiveSponsorFiltersPanel
            filters={filters}
            setFilters={setFilters}
            industries={industries}
            difficulties={difficulties}
            resultsCount={filteredSponsors.length}
            totalCount={liveSponsors.length}
            resultsLabel="in directory"
            sticky
            stickyContext={embedded ? "dashboard" : "marketing"}
          />

          <div>
            {filteredSponsors.length === 0 ? (
              <FilterEmptyState
                onReset={() => setFilters(DEFAULT_LIVE_SPONSOR_FILTERS)}
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredSponsors.map((sponsor) => (
                  <SponsorDirectoryCard
                    key={sponsor.id}
                    sponsor={sponsor}
                    lead={leadsBySponsorId?.[sponsor.id]}
                    showPipeline={showPipeline}
                    compact
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[var(--surface)] py-14 text-center">
      <Handshake className="h-8 w-8 text-zinc-600" />
      <h3 className="font-heading mt-3 text-base font-semibold text-white">
        No sponsors match those filters
      </h3>
      <p className="mt-1 text-sm text-zinc-500">Try clearing a filter or searching again.</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-full bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-200 ring-1 ring-inset ring-emerald-400/25 hover:bg-emerald-400/15"
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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[var(--surface)] py-16 text-center">
      <Handshake className="h-8 w-8 text-zinc-600" />
      <h3 className="font-heading mt-3 text-base font-semibold text-white">
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
