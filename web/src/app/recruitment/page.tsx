"use client";

import { useMemo, useState } from "react";
import { Sparkles, Target } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { PLAYERS, type Player, RANKS } from "@/lib/mock-data";
import {
  FiltersPanel,
  DEFAULT_FILTERS,
  type RecruitmentFilters,
} from "@/components/recruitment/filters";
import { PlayerCard } from "@/components/recruitment/player-card";

type SortKey = "fit" | "winRate" | "kda";

export default function RecruitmentPage() {
  const [filters, setFilters] = useState<RecruitmentFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("fit");

  const filtered = useMemo(() => {
    const minRankIdx = filters.ranks.length
      ? Math.min(...filters.ranks.map((r) => RANKS.indexOf(r)))
      : -1;

    return PLAYERS.filter((p) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const hay = `${p.handle} ${p.school ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.games.length && !filters.games.includes(p.game)) return false;
      if (filters.regions.length && !filters.regions.includes(p.region))
        return false;
      if (minRankIdx >= 0 && RANKS.indexOf(p.rank) < minRankIdx) return false;
      if (filters.onlyAvailable && p.status !== "Available") return false;
      if (filters.onlyVerified && !p.verified) return false;
      return true;
    }).sort((a, b) => {
      if (sort === "fit") return b.fitScore - a.fitScore;
      if (sort === "winRate") return b.winRate - a.winRate;
      return b.kda - a.kda;
    });
  }, [filters, sort]);

  return (
    <>
      <PageHeader />
      <section className="pb-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <FiltersPanel
              filters={filters}
              setFilters={setFilters}
              resultsCount={filtered.length}
            />

            <div>
              <Toolbar
                count={filtered.length}
                sort={sort}
                setSort={setSort}
              />
              {filtered.length === 0 ? (
                <EmptyState
                  onReset={() => setFilters(DEFAULT_FILTERS)}
                />
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((p, i) => (
                    <PlayerCard key={p.id} player={p as Player} index={i} />
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
        <Badge tone="cyan">
          <Target className="h-3.5 w-3.5" /> Recruitment Portal
        </Badge>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Scout players that actually <span className="text-gradient">fit your roster</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
          Search a database of verified collegiate and amateur players across
          every major title. The AI fit score ranks candidates against your
          team's criteria — role, region, play style — in seconds.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge tone="violet">
            <Sparkles className="h-3.5 w-3.5" /> Fit score is mock data for demo
          </Badge>
          <Badge tone="zinc">Data sources: PandaScore · Riot · OpenDota · FACEIT</Badge>
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
        players
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-zinc-500">Sort by</span>
        {(["fit", "winRate", "kda"] as SortKey[]).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={
              sort === s
                ? "rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-300 ring-1 ring-inset ring-cyan-400/40"
                : "rounded-full px-3 py-1 text-zinc-400 hover:text-white"
            }
          >
            {s === "fit" ? "AI fit" : s === "winRate" ? "Win rate" : "KDA"}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[var(--surface)] py-16 text-center">
      <Target className="h-8 w-8 text-zinc-600" />
      <h3 className="mt-3 text-base font-semibold text-white">
        No players match those filters
      </h3>
      <p className="mt-1 max-w-sm text-sm text-zinc-400">
        Try loosening your rank floor or removing a game restriction.
      </p>
      <button
        onClick={onReset}
        className="mt-4 rounded-full bg-cyan-400 px-4 py-1.5 text-xs font-medium text-zinc-950 hover:bg-cyan-300"
      >
        Reset filters
      </button>
    </div>
  );
}
