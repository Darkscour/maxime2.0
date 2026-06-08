"use client";

import { Search, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

export type RecruitmentFilters = {
  search: string;
  game: string;
  role: string;
  region: string;
  rank: string;
  status: string;
};

export const DEFAULT_RECRUITMENT_FILTERS: RecruitmentFilters = {
  search: "",
  game: "",
  role: "",
  region: "",
  rank: "",
  status: "",
};

export function RecruitmentFiltersPanel({
  filters,
  setFilters,
  games,
  roles,
  regions,
  ranks,
  statuses,
  resultsCount,
  resultsLabel = "sample players",
  sticky = true,
}: {
  filters: RecruitmentFilters;
  setFilters: (f: RecruitmentFilters) => void;
  games: string[];
  roles: string[];
  regions: string[];
  ranks: string[];
  statuses: string[];
  resultsCount: number;
  resultsLabel?: string;
  /** Sticky sidebar — off for homepage embeds so filters don't float over other sections. */
  sticky?: boolean;
}) {
  return (
    <aside className={cn(sticky && "lg:sticky lg:top-20 lg:self-start")}>
      <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Sliders className="h-4 w-4 text-cyan-400" />
            Filters
          </div>
          <button
            type="button"
            onClick={() => setFilters(DEFAULT_RECRUITMENT_FILTERS)}
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
            placeholder="Search handle…"
            className="w-full rounded-lg border border-white/10 bg-[var(--background)] py-2 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-400/50 focus:outline-none"
          />
        </div>

        {games.length > 0 && (
          <FilterSection title="Game">
            <select
              value={filters.game}
              onChange={(e) => setFilters({ ...filters, game: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[var(--background)] px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400/50 focus:outline-none"
            >
              <option value="">All games</option>
              {games.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </FilterSection>
        )}

        {roles.length > 0 && (
          <FilterSection title="Role">
            <ChipRow
              options={roles}
              value={filters.role}
              onChange={(role) => setFilters({ ...filters, role })}
            />
          </FilterSection>
        )}

        {regions.length > 0 && (
          <FilterSection title="Region">
            <select
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[var(--background)] px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400/50 focus:outline-none"
            >
              <option value="">All regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </FilterSection>
        )}

        {ranks.length > 0 && (
          <FilterSection title="Rank">
            <ChipRow
              options={ranks}
              value={filters.rank}
              onChange={(rank) => setFilters({ ...filters, rank })}
            />
          </FilterSection>
        )}

        {statuses.length > 0 && (
          <FilterSection title="Status">
            <ChipRow
              options={statuses}
              value={filters.status}
              onChange={(status) => setFilters({ ...filters, status })}
            />
          </FilterSection>
        )}

        <div className="mt-6 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs text-zinc-400">
          <span className="font-semibold text-cyan-300">{resultsCount}</span>{" "}
          {resultsLabel}
        </div>
      </div>
    </aside>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </h4>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ChipRow({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Chip active={!value} onClick={() => onChange("")}>
        All
      </Chip>
      {options.map((opt) => (
        <Chip
          key={opt}
          active={value === opt}
          onClick={() => onChange(value === opt ? "" : opt)}
        >
          {opt}
        </Chip>
      ))}
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
          ? "bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400/40"
          : "bg-white/[0.03] text-zinc-300 ring-1 ring-inset ring-white/5 hover:bg-white/[0.06]",
      )}
    >
      {children}
    </button>
  );
}
