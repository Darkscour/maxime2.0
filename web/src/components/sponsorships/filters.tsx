"use client";

import { Search, Sliders } from "lucide-react";
import {
  GAMES,
  REGIONS,
  INDUSTRIES,
  SPONSOR_TIERS,
  type Game,
  type Region,
  type Sponsor,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export type SponsorshipFilters = {
  search: string;
  industries: Sponsor["industry"][];
  tiers: Sponsor["tier"][];
  regions: Region[];
  games: Game[];
};

export const DEFAULT_SPONSOR_FILTERS: SponsorshipFilters = {
  search: "",
  industries: [],
  tiers: [],
  regions: [],
  games: [],
};

export function SponsorFiltersPanel({
  filters,
  setFilters,
  resultsCount,
}: {
  filters: SponsorshipFilters;
  setFilters: (f: SponsorshipFilters) => void;
  resultsCount: number;
}) {
  const toggle = <K extends keyof Omit<SponsorshipFilters, "search">>(
    key: K,
    value: SponsorshipFilters[K][number],
  ) => {
    const list = filters[key] as Array<typeof value>;
    const next = list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];
    setFilters({ ...filters, [key]: next });
  };

  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Sliders className="h-4 w-4 text-violet-400" />
            Filters
          </div>
          <button
            onClick={() => setFilters(DEFAULT_SPONSOR_FILTERS)}
            className="text-xs text-zinc-500 hover:text-white"
          >
            Reset
          </button>
        </div>

        <div className="mt-4 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
            placeholder="Search brand…"
            className="w-full rounded-lg border border-white/10 bg-[var(--background)] py-2 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-violet-400/50 focus:outline-none"
          />
        </div>

        <Section title="Tier">
          <div className="flex flex-wrap gap-1.5">
            {SPONSOR_TIERS.map((t) => (
              <Chip
                key={t}
                active={filters.tiers.includes(t)}
                onClick={() => toggle("tiers", t)}
              >
                {t}
              </Chip>
            ))}
          </div>
        </Section>

        <Section title="Industry">
          <div className="flex flex-wrap gap-1.5">
            {INDUSTRIES.map((i) => (
              <Chip
                key={i}
                active={filters.industries.includes(i)}
                onClick={() => toggle("industries", i)}
              >
                {i}
              </Chip>
            ))}
          </div>
        </Section>

        <Section title="Region">
          <div className="flex flex-wrap gap-1.5">
            {REGIONS.map((r) => (
              <Chip
                key={r}
                active={filters.regions.includes(r)}
                onClick={() => toggle("regions", r)}
              >
                {r}
              </Chip>
            ))}
          </div>
        </Section>

        <Section title="Game focus">
          <div className="flex flex-wrap gap-1.5">
            {GAMES.map((g) => (
              <Chip
                key={g}
                active={filters.games.includes(g)}
                onClick={() => toggle("games", g)}
              >
                {g}
              </Chip>
            ))}
          </div>
        </Section>

        <div className="mt-6 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs text-zinc-400">
          <span className="font-semibold text-violet-300">{resultsCount}</span>{" "}
          sponsors match your filters
        </div>
      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </h4>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-2.5 py-1 text-xs transition-colors",
        active
          ? "bg-violet-400/10 text-violet-300 ring-1 ring-inset ring-violet-400/40"
          : "bg-white/[0.03] text-zinc-300 ring-1 ring-inset ring-white/5 hover:bg-white/[0.06]",
      )}
    >
      {children}
    </button>
  );
}
