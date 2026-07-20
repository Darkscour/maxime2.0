"use client";

import { Check, Minus, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "./section-header";

type Cell = "yes" | "partial" | "no";

type Competitor = {
  key: "maxime" | "playvs" | "mainline" | "status";
  name: string;
  note: string;
};

const competitors: Competitor[] = [
  { key: "maxime", name: "Maxime", note: "Recruitment OS" },
  { key: "playvs", name: "PlayVS", note: "Scholastic leagues" },
  { key: "mainline", name: "Mainline", note: "Tournaments & orgs" },
  { key: "status", name: "Sheets + Discord", note: "Status quo" },
];

const rows: { label: string; cells: Record<Competitor["key"], Cell> }[] = [
  {
    label: "Player scouting + AI fit score",
    cells: { maxime: "yes", playvs: "no", mainline: "no", status: "no" },
  },
  {
    label: "Recruitment pipeline (watchlist, invites)",
    cells: { maxime: "yes", playvs: "no", mainline: "partial", status: "partial" },
  },
  {
    label: "Sponsorship discovery + outreach",
    cells: { maxime: "yes", playvs: "no", mainline: "partial", status: "no" },
  },
  {
    label: "Roster + team management",
    cells: { maxime: "yes", playvs: "partial", mainline: "partial", status: "partial" },
  },
  {
    label: "Built for collegiate programs",
    cells: { maxime: "yes", playvs: "yes", mainline: "partial", status: "partial" },
  },
  {
    label: "Built for grassroots / community teams",
    cells: { maxime: "yes", playvs: "no", mainline: "partial", status: "partial" },
  },
  {
    label: "Affordable for amateur orgs",
    cells: { maxime: "yes", playvs: "partial", mainline: "no", status: "yes" },
  },
  {
    label: "All-in-one workspace (no spreadsheets)",
    cells: { maxime: "yes", playvs: "no", mainline: "partial", status: "no" },
  },
];

function CellIcon({ value }: { value: Cell }) {
  if (value === "yes")
    return <Check className="mx-auto h-4 w-4 text-[var(--accent)]" strokeWidth={2.5} />;
  if (value === "partial")
    return <Minus className="mx-auto h-4 w-4 text-amber-400" strokeWidth={2.5} />;
  return <X className="mx-auto h-4 w-4 text-[var(--foreground-subtle)]" strokeWidth={2.5} />;
}

export function Compare() {
  return (
    <section
      id="compare"
      className="scroll-mt-24 border-b border-[color-mix(in_srgb,var(--border)_50%,transparent)] bg-[var(--background-elevated)]/20 py-10 sm:py-12"
    >
      <Container>
        <SectionHeader
          eyebrow="Why Maxime"
          title="Built for the orgs everyone else ignores"
          subtitle="League platforms run the games. Analytics tools serve the pros. Maxime is the only workspace built to recruit, fund, and run collegiate and grassroots orgs end to end."
        />

        <div className="mt-8 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="px-4 py-3 align-bottom text-[10px] font-medium uppercase tracking-wider text-[var(--foreground-subtle)] sm:px-5">
                    Capability
                  </th>
                  {competitors.map((c) => {
                    const isMaxime = c.key === "maxime";
                    return (
                      <th
                        key={c.key}
                        className={
                          "px-3 py-3 text-center align-bottom sm:px-4" +
                          (isMaxime
                            ? " bg-[color-mix(in_srgb,var(--accent)_6%,transparent)]"
                            : "")
                        }
                      >
                        <div
                          className={
                            "font-heading text-xs font-semibold sm:text-sm " +
                            (isMaxime
                              ? "text-[color-mix(in_srgb,var(--accent)_85%,white)]"
                              : "text-[var(--foreground)]")
                          }
                        >
                          {c.name}
                        </div>
                        <div className="mt-0.5 text-[9px] font-normal normal-case text-[var(--foreground-subtle)] sm:text-[10px]">
                          {c.note}
                        </div>
                        {isMaxime && (
                          <div className="mx-auto mt-1.5 w-fit rounded-full bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[color-mix(in_srgb,var(--accent)_70%,white)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]">
                            Best fit
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-[color-mix(in_srgb,var(--border)_50%,transparent)] last:border-0"
                  >
                    <td className="px-4 py-2.5 text-[var(--foreground)] sm:px-5 sm:py-3">
                      {row.label}
                    </td>
                    {competitors.map((c) => {
                      const isMaxime = c.key === "maxime";
                      return (
                        <td
                          key={c.key}
                          className={
                            "px-3 py-2.5 sm:px-4 sm:py-3" +
                            (isMaxime
                              ? " bg-[color-mix(in_srgb,var(--accent)_6%,transparent)]"
                              : "")
                          }
                        >
                          <CellIcon value={row.cells[c.key]} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-[var(--foreground-subtle)] sm:text-xs">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={2.5} />
              Full support
            </span>
            <span className="flex items-center gap-1.5">
              <Minus className="h-3.5 w-3.5 text-amber-400" strokeWidth={2.5} />
              Partial / workaround
            </span>
            <span className="flex items-center gap-1.5">
              <X className="h-3.5 w-3.5 text-[var(--foreground-subtle)]" strokeWidth={2.5} />
              Not offered
            </span>
          </div>
          <p className="max-w-md text-center text-xs text-[var(--foreground-subtle)] sm:text-right">
            The real incumbent isn&apos;t a competitor — it&apos;s a Google Sheet
            pinned in a Discord channel. Maxime replaces it.
          </p>
        </div>
      </Container>
    </section>
  );
}
