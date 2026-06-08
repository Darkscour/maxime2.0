"use client";

import { Search, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

export type LiveSponsorFilters = {
  search: string;
  industry: string;
  difficulty: string;
};

export const DEFAULT_LIVE_SPONSOR_FILTERS: LiveSponsorFilters = {
  search: "",
  industry: "",
  difficulty: "",
};

export function LiveSponsorFiltersPanel({
  filters,
  setFilters,
  industries,
  difficulties,
  resultsCount,
}: {
  filters: LiveSponsorFilters;
  setFilters: (f: LiveSponsorFilters) => void;
  industries: string[];
  difficulties: string[];
  resultsCount: number;
}) {
  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Sliders className="h-4 w-4 text-violet-400" />
            Filters
          </div>
          <button
            type="button"
            onClick={() => setFilters(DEFAULT_LIVE_SPONSOR_FILTERS)}
            className="text-xs text-zinc-500 hover:text-white"
          >
            Reset
          </button>
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search brand…"
            className="w-full rounded-lg border border-white/10 bg-[var(--background)] py-2 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-violet-400/50 focus:outline-none"
          />
        </div>

        {industries.length > 0 && (
          <Section title="Industry">
            <select
              value={filters.industry}
              onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[var(--background)] px-3 py-2 text-sm text-zinc-100 focus:border-violet-400/50 focus:outline-none"
            >
              <option value="">All industries</option>
              {industries.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </Section>
        )}

        {difficulties.length > 0 && (
          <Section title="Sponsorship difficulty">
            <div className="flex flex-wrap gap-1.5">
              <Chip
                active={!filters.difficulty}
                onClick={() => setFilters({ ...filters, difficulty: "" })}
              >
                All
              </Chip>
              {difficulties.map((d) => (
                <Chip
                  key={d}
                  active={filters.difficulty === d}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      difficulty: filters.difficulty === d ? "" : d,
                    })
                  }
                >
                  {d}
                </Chip>
              ))}
            </div>
          </Section>
        )}

        <div className="mt-6 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs text-zinc-400">
          <span className="font-semibold text-violet-300">{resultsCount}</span>{" "}
          sponsors from Supabase
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
      type="button"
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
