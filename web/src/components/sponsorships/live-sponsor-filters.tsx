"use client";

import { Search } from "lucide-react";
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
  /** Dashboard main pane scrolls below the h-14 header — pin near top of that pane. */
  dashboard: "lg:sticky lg:top-4 lg:z-10 lg:self-start",
  /** Marketing pages scroll on the document — clear the sticky site navbar. */
  marketing: "lg:sticky lg:top-24 lg:z-10 lg:self-start",
} as const;

export function LiveSponsorFiltersPanel({
  filters,
  setFilters,
  industries,
  difficulties,
  resultsCount,
  resultsLabel = "sponsors",
  sticky = true,
  stickyContext = "dashboard",
}: {
  filters: LiveSponsorFilters;
  setFilters: (f: LiveSponsorFilters) => void;
  industries: string[];
  difficulties: string[];
  resultsCount: number;
  resultsLabel?: string;
  /** Pin filters while the sponsor grid scrolls. */
  sticky?: boolean;
  stickyContext?: keyof typeof stickyTopClass;
}) {
  return (
    <aside className={cn(sticky && stickyTopClass[stickyContext])}>
      <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-zinc-200">Filter sponsors</p>
          <button
            type="button"
            onClick={() => setFilters(DEFAULT_LIVE_SPONSOR_FILTERS)}
            className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            Clear
          </button>
        </div>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search brand…"
            className={cn(fieldClassName, "pl-9")}
          />
        </div>

        {industries.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-medium text-zinc-500">Industry</p>
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
          <div className="mt-5">
            <p className="text-xs font-medium text-zinc-500">Difficulty</p>
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

        <p className="mt-5 text-xs text-zinc-500">
          <span className="font-medium text-zinc-300">{resultsCount}</span>{" "}
          {resultsLabel}
        </p>
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
        "rounded-lg px-2.5 py-1.5 text-xs transition-colors",
        active
          ? "bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400/30"
          : "bg-white/[0.03] text-zinc-400 ring-1 ring-inset ring-white/5 hover:text-zinc-200",
      )}
    >
      {children}
    </button>
  );
}
