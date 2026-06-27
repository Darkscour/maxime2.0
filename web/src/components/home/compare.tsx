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
    return <Check className="mx-auto h-5 w-5 text-cyan-400" strokeWidth={2.5} />;
  if (value === "partial")
    return <Minus className="mx-auto h-5 w-5 text-amber-400" strokeWidth={2.5} />;
  return <X className="mx-auto h-5 w-5 text-zinc-600" strokeWidth={2.5} />;
}

export function Compare() {
  return (
    <section
      id="compare"
      className="scroll-mt-24 border-y border-white/5 bg-[var(--background-elevated)]/20 py-16 sm:py-20"
    >
      <Container>
        <SectionHeader
          eyebrow="Why Maxime"
          title="Built for the orgs everyone else ignores"
          subtitle="League platforms run the games. Analytics tools serve the pros. Maxime is the only workspace built to recruit, fund, and run collegiate and grassroots orgs end to end."
        />

        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-6 py-5 align-bottom text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Capability
                  </th>
                  {competitors.map((c) => {
                    const isMaxime = c.key === "maxime";
                    return (
                      <th
                        key={c.key}
                        className={
                          "px-4 py-5 text-center align-bottom" +
                          (isMaxime ? " bg-cyan-400/[0.06]" : "")
                        }
                      >
                        <div
                          className={
                            "font-heading text-sm font-semibold " +
                            (isMaxime ? "text-cyan-300" : "text-zinc-200")
                          }
                        >
                          {c.name}
                        </div>
                        <div className="mt-0.5 text-[10px] font-normal normal-case text-zinc-500">
                          {c.note}
                        </div>
                        {isMaxime && (
                          <div className="mx-auto mt-2 w-fit rounded-full bg-cyan-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-200 ring-1 ring-inset ring-cyan-400/30">
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
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="px-6 py-4 text-zinc-200">{row.label}</td>
                    {competitors.map((c) => {
                      const isMaxime = c.key === "maxime";
                      return (
                        <td
                          key={c.key}
                          className={
                            "px-4 py-4" + (isMaxime ? " bg-cyan-400/[0.06]" : "")
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

        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-cyan-400" strokeWidth={2.5} />
              Full support
            </span>
            <span className="flex items-center gap-1.5">
              <Minus className="h-4 w-4 text-amber-400" strokeWidth={2.5} />
              Partial / workaround
            </span>
            <span className="flex items-center gap-1.5">
              <X className="h-4 w-4 text-zinc-600" strokeWidth={2.5} />
              Not offered
            </span>
          </div>
          <p className="max-w-md text-center text-sm text-zinc-500 sm:text-right">
            The real incumbent isn&apos;t a competitor — it&apos;s a Google Sheet
            pinned in a Discord channel. Maxime replaces it.
          </p>
        </div>
      </Container>
    </section>
  );
}
