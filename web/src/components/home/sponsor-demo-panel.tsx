"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  DEMO_SPONSOR_LISTINGS,
  type SponsorListing,
} from "@/lib/sponsor-listing";
import { SponsorMinimalCard } from "@/components/sponsorships/sponsor-minimal-card";

export function SponsorDemoPanel() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const industries = useMemo(
    () => [...new Set(DEMO_SPONSOR_LISTINGS.map((s) => s.industry))],
    [],
  );
  const difficulties = useMemo(
    () => [...new Set(DEMO_SPONSOR_LISTINGS.map((s) => s.difficulty))],
    [],
  );

  const filtered = useMemo(() => {
    return DEMO_SPONSOR_LISTINGS.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (industry && s.industry !== industry) return false;
      if (difficulty && s.difficulty !== difficulty) return false;
      return true;
    });
  }, [search, industry, difficulty]);

  return (
    <div className="rounded-xl border border-white/5 bg-[var(--surface)]/80 p-4 sm:p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-cyan-400/90">
        Interactive preview
      </p>
      <p className="mt-1 text-sm text-zinc-500">
        Sample sponsors — not your live database.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative min-w-[140px] flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name…"
            className="w-full rounded-lg border border-white/10 bg-[var(--background)] py-2 pl-8 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-400/40 focus:outline-none"
          />
        </div>
        <FilterSelect
          label="Industry"
          value={industry}
          onChange={setIndustry}
          options={industries}
        />
        <FilterSelect
          label="Difficulty"
          value={difficulty}
          onChange={setDifficulty}
          options={difficulties}
        />
      </div>

      <p className="mt-3 text-xs text-zinc-500">
        {filtered.length} sample sponsor{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {filtered.map((s) => (
          <SponsorMinimalCard key={s.id} sponsor={s} tag="Demo" />
        ))}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex min-w-[140px] flex-col gap-1 text-xs text-zinc-500">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-white/10 bg-[var(--background)] px-3 py-2 text-sm text-zinc-200 focus:border-cyan-400/40 focus:outline-none"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
