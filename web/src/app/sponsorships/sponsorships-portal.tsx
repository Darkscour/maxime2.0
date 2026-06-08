"use client";

/**
 * Sponsorship portal — public demo for visitors, live Supabase directory for signed-in users.
 */

import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Database, Handshake } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { type Sponsor } from "@/lib/mock-data";
import type { SponsorListing } from "@/lib/sponsor-listing";
import type { SponsorFetchResult } from "@/lib/fetch-sponsors";
import {
  SponsorFiltersPanel,
  DEFAULT_SPONSOR_FILTERS,
  type SponsorshipFilters,
} from "@/components/sponsorships/filters";
import {
  LiveSponsorFiltersPanel,
  DEFAULT_LIVE_SPONSOR_FILTERS,
  type LiveSponsorFilters,
} from "@/components/sponsorships/live-sponsor-filters";
import { SponsorCard } from "@/components/sponsorships/sponsor-card";
import { SponsorMinimalCard } from "@/components/sponsorships/sponsor-minimal-card";
import {
  capForPublicPreview,
  GatedBlurCard,
  PUBLIC_PORTAL_CARD_LIMIT,
} from "@/components/ui/gated-blur-card";
import { PreviewModeBanner } from "@/components/sponsorships/preview-banner";
import { rankSponsorsByFit, type TeamFitProfile } from "@/lib/sponsor-fit";
import type { SponsorLeadRecord } from "@/lib/sponsor-pipeline";
import Link from "next/link";

type SortKey = "best" | "tier" | "alpha";
type LiveSortKey = "fit" | "alpha" | "difficulty";

export function SponsorshipsPortal({
  previewSponsors,
  liveSponsors,
  dataSource,
  fetchError,
  teamFit,
  leadsBySponsorId = {},
}: {
  previewSponsors: Sponsor[];
  liveSponsors: SponsorListing[];
  dataSource: SponsorFetchResult["source"];
  fetchError?: string;
  teamFit?: TeamFitProfile | null;
  leadsBySponsorId?: Record<string, SponsorLeadRecord>;
}) {
  const { isSignedIn, isLoaded } = useAuth();
  const previewMode = isLoaded && !isSignedIn;
  const hasTeam = !!teamFit;

  const [demoFilters, setDemoFilters] = useState<SponsorshipFilters>(
    DEFAULT_SPONSOR_FILTERS,
  );
  const [liveFilters, setLiveFilters] = useState<LiveSponsorFilters>(
    DEFAULT_LIVE_SPONSOR_FILTERS,
  );
  const [demoSort, setDemoSort] = useState<SortKey>("best");
  const [liveSort, setLiveSort] = useState<LiveSortKey>(
    teamFit ? "fit" : "alpha",
  );

  const tierWeight: Record<string, number> = {
    Established: 3,
    Growth: 2,
    Starter: 1,
  };

  const demoFiltered = useMemo(() => {
    const results = previewSponsors
      .filter((s) => {
        if (demoFilters.search) {
          const q = demoFilters.search.toLowerCase();
          if (!s.name.toLowerCase().includes(q)) return false;
        }
        if (
          demoFilters.industries.length &&
          !demoFilters.industries.includes(s.industry)
        )
          return false;
        if (demoFilters.tiers.length && !demoFilters.tiers.includes(s.tier))
          return false;
        if (
          demoFilters.regions.length &&
          !s.regions.some((r) => demoFilters.regions.includes(r))
        )
          return false;
        if (
          demoFilters.games.length &&
          !s.games.some(
            (g) => g === "All" || demoFilters.games.includes(g as never),
          )
        )
          return false;
        return s.active;
      })
      .sort((a, b) => {
        if (demoSort === "alpha") return a.name.localeCompare(b.name);
        if (demoSort === "tier") return tierWeight[b.tier] - tierWeight[a.tier];
        return (
          tierWeight[b.tier] * 10 +
          b.regions.length -
          (tierWeight[a.tier] * 10 + a.regions.length)
        );
      });

    return capForPublicPreview(results);
  }, [previewSponsors, demoFilters, demoSort]);

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
      if (liveFilters.industry && s.industry !== liveFilters.industry)
        return false;
      if (liveFilters.difficulty && s.difficulty !== liveFilters.difficulty)
        return false;
      return true;
    });

    if (liveSort === "fit" && teamFit) {
      return rankSponsorsByFit(teamFit, filtered);
    }

    return [...filtered].sort((a, b) => {
      if (liveSort === "difficulty")
        return a.difficulty.localeCompare(b.difficulty);
      return a.name.localeCompare(b.name);
    });
  }, [liveSponsors, liveFilters, liveSort, teamFit]);

  return (
    <>
      <PageHeader previewMode={previewMode} liveCount={liveSponsors.length} />
      <section className="pb-24">
        <Container>
          {previewMode && <PreviewModeBanner />}

          {!previewMode && !hasTeam && (
            <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-4 py-4 text-sm text-zinc-300">
              Join or create a team to save sponsors to your shared pipeline.{" "}
              <Link href="/onboarding" className="text-cyan-400 hover:text-cyan-300">
                Finish onboarding →
              </Link>{" "}
              or view progress on{" "}
              <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300">
                your dashboard
              </Link>
              .
            </div>
          )}

          {previewMode ? (
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <SponsorFiltersPanel
                filters={demoFilters}
                setFilters={setDemoFilters}
                resultsCount={demoFiltered.length}
              />
              <div>
                <DemoToolbar
                  count={demoFiltered.length}
                  sort={demoSort}
                  setSort={setDemoSort}
                />
                {demoFiltered.length === 0 ? (
                  <FilterEmptyState
                    onReset={() => setDemoFilters(DEFAULT_SPONSOR_FILTERS)}
                  />
                ) : (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                    {demoFiltered.map((s, i) => {
                      const isLastGated =
                        demoFiltered.length > 1 && i === demoFiltered.length - 1;
                      return (
                        <GatedBlurCard
                          key={s.id}
                          gated={isLastGated}
                          redirectUrl="/sponsorships"
                          message="Sign in to unlock every sponsor and apply links"
                        >
                          <SponsorCard
                            sponsor={s}
                            index={i}
                            previewMode
                          />
                        </GatedBlurCard>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
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
                    showFitSort={hasTeam}
                  />
                )}
                {liveSponsors.length === 0 ? (
                  <SupabaseEmptyState
                    dataSource={dataSource}
                    fetchError={fetchError}
                  />
                ) : liveFiltered.length === 0 ? (
                  <FilterEmptyState
                    onReset={() => setLiveFilters(DEFAULT_LIVE_SPONSOR_FILTERS)}
                  />
                ) : (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                    {liveFiltered.map((sponsor) => {
                      const scored =
                        "score" in sponsor
                          ? (sponsor as SponsorListing & {
                              score: number;
                              reason: string;
                            })
                          : null;
                      return (
                        <SponsorMinimalCard
                          key={sponsor.id}
                          sponsor={sponsor}
                          showAi={hasTeam}
                          showPipeline={hasTeam}
                          lead={leadsBySponsorId[sponsor.id] ?? null}
                          fitScore={scored?.score}
                          fitReason={scored?.reason}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

function PageHeader({
  previewMode,
  liveCount,
}: {
  previewMode: boolean;
  liveCount: number;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-spotlight">
      <div className="bg-grid bg-grid-fade absolute inset-0" aria-hidden />
      <Container className="relative py-16 sm:py-20">
        <Badge tone="violet">
          <Handshake className="h-3.5 w-3.5" /> Sponsorship Portal
        </Badge>
        <h1 className="font-heading mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {previewMode ? (
            <>
              See how sponsorship discovery{" "}
              <span className="text-gradient">works on Maxime</span>
            </>
          ) : (
            <>
              Your sponsor directory —{" "}
              <span className="text-gradient">{liveCount} from Supabase</span>
            </>
          )}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
          {previewMode
            ? "Try filters and sample cards below. Sign in to unlock your live sponsor directory from Supabase."
            : "Live sponsor rows from your database — industry, application links, and difficulty straight from Supabase."}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {previewMode ? (
            <Badge tone="amber">
              Preview — {PUBLIC_PORTAL_CARD_LIMIT} sponsors, last blurred
            </Badge>
          ) : (
            <Badge tone="cyan">
              <Database className="mr-1 inline h-3 w-3" />
              Supabase — {liveCount} sponsor{liveCount === 1 ? "" : "s"}
            </Badge>
          )}
        </div>
      </Container>
    </section>
  );
}

function DemoToolbar({
  count,
  sort,
  setSort,
}: {
  count: number;
  sort: SortKey;
  setSort: (s: SortKey) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-[var(--surface)] px-4 py-3">
      <div className="text-sm text-zinc-400">
        Showing <span className="font-semibold text-white">{count}</span> sample
        sponsors
      </div>
      <SortButtons
        options={[
          ["best", "Best match"],
          ["tier", "Tier"],
          ["alpha", "A–Z"],
        ]}
        sort={sort}
        setSort={setSort as (s: string) => void}
      />
    </div>
  );
}

function LiveToolbar({
  count,
  sort,
  setSort,
  showFitSort,
}: {
  count: number;
  sort: LiveSortKey;
  setSort: (s: LiveSortKey) => void;
  showFitSort: boolean;
}) {
  const options: [LiveSortKey, string][] = showFitSort
    ? [
        ["fit", "Best fit"],
        ["alpha", "A–Z"],
        ["difficulty", "Difficulty"],
      ]
    : [
        ["alpha", "A–Z"],
        ["difficulty", "Difficulty"],
      ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-[var(--surface)] px-4 py-3">
      <div className="text-sm text-zinc-400">
        Showing <span className="font-semibold text-white">{count}</span> Supabase
        sponsors
      </div>
      <SortButtons options={options} sort={sort} setSort={setSort as (s: string) => void} />
    </div>
  );
}

function SortButtons({
  options,
  sort,
  setSort,
}: {
  options: [string, string][];
  sort: string;
  setSort: (s: string) => void;
}) {
  return (
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
          : "Import sponsor rows into your Supabase Sponsor table. Signed-in users only see live database data — no demo cards."}
      </p>
    </div>
  );
}
