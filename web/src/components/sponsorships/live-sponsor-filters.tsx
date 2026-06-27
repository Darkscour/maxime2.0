"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldClassName } from "@/lib/form-styles";

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

const stickyTopClass = {
  dashboard: "lg:sticky lg:top-4 lg:z-10 lg:self-start",
  marketing: "lg:sticky lg:top-24 lg:z-10 lg:self-start",
} as const;

function activeFilterCount(filters: LiveSponsorFilters) {
  let count = 0;
  if (filters.search.trim()) count += 1;
  if (filters.industry) count += 1;
  if (filters.difficulty) count += 1;
  return count;
}

export function LiveSponsorFiltersPanel({
  filters,
  setFilters,
  industries,
  difficulties,
  resultsCount,
  totalCount,
  resultsLabel = "sponsors",
  sticky = true,
  stickyContext = "dashboard",
}: {
  filters: LiveSponsorFilters;
  setFilters: (f: LiveSponsorFilters) => void;
  industries: string[];
  difficulties: string[];
  resultsCount: number;
  totalCount?: number;
  resultsLabel?: string;
  sticky?: boolean;
  stickyContext?: keyof typeof stickyTopClass;
}) {
  const activeCount = activeFilterCount(filters);
  const hasActive = activeCount > 0;

  return (
    <aside className={cn(sticky && stickyTopClass[stickyContext])}>
      <div className="overflow-hidden rounded-2xl border border-emerald-400/15 bg-gradient-to-b from-emerald-400/[0.06] to-[var(--surface)] shadow-sm shadow-black/20">
        <div className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 ring-1 ring-inset ring-emerald-400/20">
              <SlidersHorizontal className="h-4 w-4 text-emerald-300" />
            </span>
            <div>
              <p className="text-sm font-medium text-white">Filters</p>
              <p className="text-[11px] text-zinc-500">Narrow the directory</p>
            </div>
          </div>
          {hasActive && (
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_LIVE_SPONSOR_FILTERS)}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-200"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>

        <div className="space-y-5 p-4">
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Search
            </span>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Brand name…"
                className={cn(fieldClassName, "pl-9")}
              />
            </div>
          </label>

          {industries.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Industry
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <FilterChip
                  active={!filters.industry}
                  onClick={() => setFilters({ ...filters, industry: "" })}
                >
                  All
                </FilterChip>
                {industries.map((i) => (
                  <FilterChip
                    key={i}
                    active={filters.industry === i}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        industry: filters.industry === i ? "" : i,
                      })
                    }
                  >
                    {i}
                  </FilterChip>
                ))}
              </div>
            </div>
          )}

          {difficulties.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Difficulty
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <FilterChip
                  active={!filters.difficulty}
                  onClick={() => setFilters({ ...filters, difficulty: "" })}
                >
                  All
                </FilterChip>
                {difficulties.map((d) => (
                  <FilterChip
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
                  </FilterChip>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/5 bg-black/20 px-4 py-3">
          <p className="text-xs text-zinc-500">
            Showing{" "}
            <span className="font-semibold text-emerald-200/90">{resultsCount}</span>
            {totalCount != null && totalCount !== resultsCount ? (
              <span> of {totalCount}</span>
            ) : null}{" "}
            {resultsLabel}
            {hasActive && (
              <span className="ml-1.5 text-zinc-600">
                · {activeCount} filter{activeCount === 1 ? "" : "s"} active
              </span>
            )}
          </p>
        </div>
      </div>
    </aside>
  );
}

function FilterChip({
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
        "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
        active
          ? "bg-emerald-400/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/30"
          : "bg-white/[0.03] text-zinc-400 ring-1 ring-inset ring-white/8 hover:bg-white/[0.05] hover:text-zinc-200",
      )}
    >
      {children}
    </button>
  );
}
