"use client";

import { useMemo, useState } from "react";
import { Handshake, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { SPONSORS } from "@/lib/mock-data";
import {
  SponsorFiltersPanel,
  DEFAULT_SPONSOR_FILTERS,
  type SponsorshipFilters,
} from "@/components/sponsorships/filters";
import { SponsorCard } from "@/components/sponsorships/sponsor-card";

type SortKey = "best" | "tier" | "alpha";

export default function SponsorshipsPage() {
  const [filters, setFilters] = useState<SponsorshipFilters>(
    DEFAULT_SPONSOR_FILTERS,
  );
  const [sort, setSort] = useState<SortKey>("best");

  const tierWeight: Record<string, number> = {
    Established: 3,
    Growth: 2,
    Starter: 1,
  };

  const filtered = useMemo(() => {
    return SPONSORS.filter((s) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!s.name.toLowerCase().includes(q)) return false;
      }
      if (filters.industries.length && !filters.industries.includes(s.industry))
        return false;
      if (filters.tiers.length && !filters.tiers.includes(s.tier)) return false;
      if (
        filters.regions.length &&
        !s.regions.some((r) => filters.regions.includes(r))
      )
        return false;
      if (
        filters.games.length &&
        !s.games.some(
          (g) => g === "All" || filters.games.includes(g as never),
        )
      )
        return false;
      return s.active;
    }).sort((a, b) => {
      if (sort === "alpha") return a.name.localeCompare(b.name);
      if (sort === "tier") return tierWeight[b.tier] - tierWeight[a.tier];
      return tierWeight[b.tier] * 10 + b.regions.length - (tierWeight[a.tier] * 10 + a.regions.length);
    });
  }, [filters, sort]);

  return (
    <>
      <PageHeader />
      <section className="pb-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <SponsorFiltersPanel
              filters={filters}
              setFilters={setFilters}
              resultsCount={filtered.length}
            />

            <div>
              <Toolbar count={filtered.length} sort={sort} setSort={setSort} />
              {filtered.length === 0 ? (
                <EmptyState
                  onReset={() => setFilters(DEFAULT_SPONSOR_FILTERS)}
                />
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                  {filtered.map((s, i) => (
                    <SponsorCard key={s.id} sponsor={s} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function PageHeader() {
  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-spotlight">
      <div className="bg-grid bg-grid-fade absolute inset-0" aria-hidden />
      <Container className="relative py-16 sm:py-20">
        <Badge tone="violet">
          <Handshake className="h-3.5 w-3.5" /> Sponsorship Portal
        </Badge>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          The sponsors actually open to{" "}
          <span className="text-gradient">collegiate orgs</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
          A curated database of brands sponsoring grassroots and collegiate
          teams. Filter by industry, region, and game focus — then generate a
          personalized pitch in one click.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge tone="cyan">
            <Sparkles className="h-3.5 w-3.5" /> Demo data — replace with curated DB
          </Badge>
          <Badge tone="zinc">
            Coverage: Clearbit · Hunter · Apify · manual curation
          </Badge>
        </div>
      </Container>
    </section>
  );
}

function Toolbar({
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
        Showing <span className="font-semibold text-white">{count}</span>{" "}
        sponsors
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-zinc-500">Sort by</span>
        {(
          [
            ["best", "Best match"],
            ["tier", "Tier"],
            ["alpha", "A–Z"],
          ] as [SortKey, string][]
        ).map(([key, label]) => (
          <button
            key={key}
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

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[var(--surface)] py-16 text-center">
      <Handshake className="h-8 w-8 text-zinc-600" />
      <h3 className="mt-3 text-base font-semibold text-white">
        No sponsors match those filters
      </h3>
      <p className="mt-1 max-w-sm text-sm text-zinc-400">
        Try removing an industry or region constraint.
      </p>
      <button
        onClick={onReset}
        className="mt-4 rounded-full bg-violet-400 px-4 py-1.5 text-xs font-medium text-zinc-950 hover:bg-violet-300"
      >
        Reset filters
      </button>
    </div>
  );
}
