"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { DEMO_SPONSOR_LISTINGS } from "@/lib/sponsor-listing";
import { SponsorMinimalCard } from "@/components/sponsorships/sponsor-minimal-card";
import {
  capForPublicPreview,
  GatedBlurCard,
  PUBLIC_PORTAL_CARD_LIMIT,
} from "@/components/ui/gated-blur-card";

/** Homepage sponsorship preview: 4 demo cards — last one blurred when signed out. */
export function SponsorPreviewPanel() {
  const { isSignedIn, isLoaded } = useAuth();
  const gateLast = isLoaded && !isSignedIn;

  const catalog = useMemo(
    () => DEMO_SPONSOR_LISTINGS.slice(0, PUBLIC_PORTAL_CARD_LIMIT),
    [],
  );

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const industries = useMemo(
    () => [...new Set(catalog.map((s) => s.industry))],
    [catalog],
  );
  const difficulties = useMemo(
    () => [...new Set(catalog.map((s) => s.difficulty))],
    [catalog],
  );

  const filtered = useMemo(() => {
    const matches = catalog.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (industry && s.industry !== industry) return false;
      if (difficulty && s.difficulty !== difficulty) return false;
      return true;
    });
    return gateLast ? capForPublicPreview(matches) : matches;
  }, [catalog, search, industry, difficulty, gateLast]);

  return (
    <div className="rounded-xl border border-white/5 bg-[var(--surface)]/80 p-4 sm:p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
        Interactive preview
      </p>
      <p className="mt-1 text-sm text-[var(--foreground-muted)]">
        {PUBLIC_PORTAL_CARD_LIMIT} sample sponsors
        {gateLast ? " — last card blurred until you sign in" : ""}.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative min-w-[140px] flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--foreground-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name…"
            className="w-full rounded-none border border-[var(--border)] bg-[var(--background)] py-2 pl-8 pr-3 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:border-[var(--accent)] focus:outline-none"
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

      <p className="mt-3 text-xs text-[var(--foreground-muted)]">
        Showing {filtered.length} preview sponsor{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {filtered.map((s, i) => {
          const isLastGated =
            gateLast && filtered.length > 1 && i === filtered.length - 1;
          const card = (
            <SponsorMinimalCard sponsor={s} tag="Sample" showAi={false} />
          );

          return (
            <GatedBlurCard
              key={s.id}
              gated={isLastGated}
              redirectUrl="/sign-up"
              message="Sign in for the live sponsor directory on your dashboard"
            >
              {card}
            </GatedBlurCard>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-4 text-center text-sm text-[var(--foreground-muted)]">
          No sponsors match those filters.
        </p>
      )}
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
    <label className="flex min-w-[140px] flex-col gap-1 text-xs text-[var(--foreground-muted)]">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-none border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
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
