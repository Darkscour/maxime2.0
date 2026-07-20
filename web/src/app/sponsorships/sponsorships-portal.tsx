"use client";

/**
 * Public sponsorship portal — demo sponsors only (marketing).
 */

import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Handshake } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { type Sponsor } from "@/lib/mock-data";
import {
  SponsorFiltersPanel,
  DEFAULT_SPONSOR_FILTERS,
  type SponsorshipFilters,
} from "@/components/sponsorships/filters";
import { SponsorCard } from "@/components/sponsorships/sponsor-card";
import {
  capForPublicPreview,
  GatedBlurCard,
  PUBLIC_PORTAL_CARD_LIMIT,
} from "@/components/ui/gated-blur-card";
import { PreviewModeBanner } from "@/components/sponsorships/preview-banner";

type SortKey = "best" | "tier" | "alpha";

export function SponsorshipsPortal({
  previewSponsors,
}: {
  previewSponsors: Sponsor[];
}) {
  const { isSignedIn, isLoaded } = useAuth();
  const previewMode = isLoaded && !isSignedIn;

  const [demoFilters, setDemoFilters] = useState<SponsorshipFilters>(
    DEFAULT_SPONSOR_FILTERS,
  );
  const [demoSort, setDemoSort] = useState<SortKey>("best");

  const tierWeight: Record<string, number> = {
    Established: 3,
    Growth: 2,
    Starter: 1,
  };

  const demoFiltered = useMemo(() => {
    const results = previewSponsors
      .filter((s) => {
        if (demoFilters.search) {
          const q = demoFilters.search.toLowerCase();
          if (!s.name.toLowerCase().includes(q)) return false;
        }
        if (
          demoFilters.industries.length &&
          !demoFilters.industries.includes(s.industry)
        )
          return false;
        if (demoFilters.tiers.length && !demoFilters.tiers.includes(s.tier))
          return false;
        if (
          demoFilters.regions.length &&
          !s.regions.some((r) => demoFilters.regions.includes(r))
        )
          return false;
        if (
          demoFilters.games.length &&
          !s.games.some(
            (g) => g === "All" || demoFilters.games.includes(g as never),
          )
        )
          return false;
        return s.active;
      })
      .sort((a, b) => {
        if (demoSort === "alpha") return a.name.localeCompare(b.name);
        if (demoSort === "tier") return tierWeight[b.tier] - tierWeight[a.tier];
        return (
          tierWeight[b.tier] * 10 +
          b.regions.length -
          (tierWeight[a.tier] * 10 + a.regions.length)
        );
      });

    return capForPublicPreview(results);
  }, [previewSponsors, demoFilters, demoSort]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-spotlight">
        <div className="bg-grid bg-grid-fade absolute inset-0" aria-hidden />
        <Container className="relative py-16 sm:py-20">
          <Badge tone="violet">
            <Handshake className="h-3.5 w-3.5" /> Sponsorship Portal
          </Badge>
          <h1 className="font-heading mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
            See how sponsorship discovery{" "}
            <span className="text-gradient">works on Maxime</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--foreground-muted)]">
            Try filters and sample cards below. Sign in to access your live sponsor
            directory from your dashboard.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="amber">
              Preview — {PUBLIC_PORTAL_CARD_LIMIT} sample sponsors, last blurred
            </Badge>
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          {previewMode && <PreviewModeBanner />}

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <SponsorFiltersPanel
              filters={demoFilters}
              setFilters={setDemoFilters}
              resultsCount={demoFiltered.length}
            />
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-none border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                <div className="text-sm text-[var(--foreground-muted)]">
                  Showing{" "}
                  <span className="font-semibold text-[var(--foreground)]">{demoFiltered.length}</span>{" "}
                  sample sponsors
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--foreground-muted)]">Sort by</span>
                  {(
                    [
                      ["best", "Best match"],
                      ["tier", "Tier"],
                      ["alpha", "A–Z"],
                    ] as [SortKey, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setDemoSort(key)}
                      className={
                        demoSort === key
                          ? "rounded-none bg-[color-mix(in_srgb,var(--accent-2)_10%,transparent)] px-3 py-1 text-[var(--accent-2)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent-2)_40%,transparent)]"
                          : "rounded-none px-3 py-1 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {demoFiltered.length === 0 ? (
                <div className="mt-4 flex flex-col items-center justify-center rounded-none border border-dashed border-[var(--border)] bg-[var(--surface)] py-16 text-center">
                  <Handshake className="h-8 w-8 text-[var(--foreground-muted)]" />
                  <h3 className="font-heading mt-3 text-base font-semibold text-[var(--foreground)]">
                    No sponsors match those filters
                  </h3>
                  <button
                    type="button"
                    onClick={() => setDemoFilters(DEFAULT_SPONSOR_FILTERS)}
                    className="mt-4 rounded-none bg-[var(--accent)] px-4 py-1.5 text-xs font-medium text-[var(--accent-ink)] hover:bg-[var(--accent-strong)]"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                  {demoFiltered.map((s, i) => {
                    const isLastGated =
                      previewMode &&
                      demoFiltered.length > 1 &&
                      i === demoFiltered.length - 1;
                    return (
                      <GatedBlurCard
                        key={s.id}
                        gated={isLastGated}
                        redirectUrl="/sign-up"
                        message="Sign in to unlock the live sponsor directory on your dashboard"
                      >
                        <SponsorCard sponsor={s} index={i} previewMode />
                      </GatedBlurCard>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
