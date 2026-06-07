"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { DEMO_PLAYER_LISTINGS } from "@/lib/player-listing";
import type { PlayerListing } from "@/lib/player-listing";
import { PlayerDemoCard } from "./player-demo-card";
import {
  capForPublicPreview,
  GatedBlurCard,
  PUBLIC_PORTAL_CARD_LIMIT,
} from "@/components/ui/gated-blur-card";

export function RecruitmentDemoPanel({
  compact = false,
  previewLimit,
  showFilters = true,
}: {
  compact?: boolean;
  previewLimit?: number;
  showFilters?: boolean;
}) {
  const { isSignedIn, isLoaded } = useAuth();
  const gateLast = isLoaded && !isSignedIn;

  const pool = useMemo(() => {
    const limit = previewLimit ?? PUBLIC_PORTAL_CARD_LIMIT;
    return DEMO_PLAYER_LISTINGS.slice(0, limit);
  }, [previewLimit]);

  const [search, setSearch] = useState("");
  const [game, setGame] = useState("");
  const [role, setRole] = useState("");
  const [region, setRegion] = useState("");
  const [rank, setRank] = useState("");
  const [status, setStatus] = useState("");

  const games = useMemo(() => [...new Set(pool.map((p) => p.game))], [pool]);
  const roles = useMemo(() => [...new Set(pool.map((p) => p.role))], [pool]);
  const regions = useMemo(
    () => [...new Set(pool.map((p) => p.region))],
    [pool],
  );
  const ranks = useMemo(() => [...new Set(pool.map((p) => p.rank))], [pool]);
  const statuses = useMemo(
    () => [...new Set(pool.map((p) => p.status))],
    [pool],
  );

  const filtered = useMemo(() => {
    let matches: PlayerListing[] = pool;

    if (showFilters) {
      matches = pool.filter((p) => {
        if (search && !p.handle.toLowerCase().includes(search.toLowerCase()))
          return false;
        if (game && p.game !== game) return false;
        if (role && p.role !== role) return false;
        if (region && p.region !== region) return false;
        if (rank && p.rank !== rank) return false;
        if (status && p.status !== status) return false;
        return true;
      });
    }

    return gateLast ? capForPublicPreview(matches) : matches;
  }, [pool, showFilters, search, game, role, region, rank, status, gateLast]);

  return (
    <div
      className={
        compact
          ? "rounded-xl border border-white/5 bg-[var(--surface)]/80 p-4 sm:p-5"
          : "rounded-2xl border border-white/5 bg-[var(--surface)] p-5 sm:p-6"
      }
    >
      <p className="text-xs font-medium uppercase tracking-wider text-cyan-400/90">
        Interactive preview
      </p>
      <p className="mt-1 text-sm text-zinc-500">
        {PUBLIC_PORTAL_CARD_LIMIT} player preview
        {gateLast ? " — last card blurred until you sign in" : ""}.
      </p>

      {showFilters && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search handle…"
              className="w-full rounded-lg border border-white/10 bg-[var(--background)] py-2 pl-8 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-400/40 focus:outline-none"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <FilterSelect
              label="Game"
              value={game}
              onChange={setGame}
              options={games}
            />
            <FilterSelect
              label="Role"
              value={role}
              onChange={setRole}
              options={roles}
            />
            <FilterSelect
              label="Region"
              value={region}
              onChange={setRegion}
              options={regions}
            />
            <FilterSelect
              label="Rank"
              value={rank}
              onChange={setRank}
              options={ranks}
            />
            <FilterSelect
              label="Status"
              value={status}
              onChange={setStatus}
              options={statuses}
            />
          </div>
        </div>
      )}

      <p className="mt-3 text-xs text-zinc-500">
        Showing {filtered.length} preview player{filtered.length === 1 ? "" : "s"}
      </p>

      <div
        className={
          compact || !showFilters
            ? "mt-4 grid gap-4 sm:grid-cols-2"
            : "mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        }
      >
        {filtered.length === 0 ? (
          <p className="col-span-full py-8 text-center text-sm text-zinc-500">
            No players match those filters. Try clearing one constraint.
          </p>
        ) : (
          filtered.map((p, i) => {
            const isLastGated =
              gateLast && filtered.length > 1 && i === filtered.length - 1;
            const card = <PlayerDemoCard player={p} tag="Demo" />;

            return (
              <GatedBlurCard
                key={p.id}
                gated={isLastGated}
                redirectUrl="/recruitment"
                message="Sign in to scout the full player directory"
              >
                {card}
              </GatedBlurCard>
            );
          })
        )}
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
    <label className="flex flex-col gap-1 text-xs text-zinc-500">
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
