"use client";

import { Check, Minus, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "./features";

type Cell = "yes" | "partial" | "no";

const rows: { label: string; maxime: Cell; pro: Cell; mobalytics: Cell; sheets: Cell }[] = [
  { label: "Player scouting + AI fit score", maxime: "yes", pro: "yes", mobalytics: "no", sheets: "no" },
  { label: "Sponsorship discovery + outreach", maxime: "yes", pro: "no", mobalytics: "no", sheets: "no" },
  { label: "Roster + contract management", maxime: "yes", pro: "no", mobalytics: "no", sheets: "partial" },
  { label: "AI coaching assistant", maxime: "yes", pro: "no", mobalytics: "yes", sheets: "no" },
  { label: "Multi‑game support", maxime: "yes", pro: "partial", mobalytics: "no", sheets: "yes" },
  { label: "Discord & start.gg integration", maxime: "yes", pro: "no", mobalytics: "no", sheets: "no" },
  { label: "Affordable for amateur orgs", maxime: "yes", pro: "no", mobalytics: "yes", sheets: "yes" },
  { label: "Built for collegiate & grassroots", maxime: "yes", pro: "no", mobalytics: "no", sheets: "partial" },
];

function CellIcon({ value }: { value: Cell }) {
  if (value === "yes")
    return (
      <Check className="mx-auto h-5 w-5 text-cyan-400" strokeWidth={2.5} />
    );
  if (value === "partial")
    return (
      <Minus className="mx-auto h-5 w-5 text-amber-400" strokeWidth={2.5} />
    );
  return <X className="mx-auto h-5 w-5 text-zinc-600" strokeWidth={2.5} />;
}

export function Compare() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeader
          eyebrow="Why Maxime"
          title="The market has tools for pros and tools for solo grinders. Nothing for everyone in between."
          subtitle="We mapped every competitor in the space. Here's where Maxime fits — and why no single tool replaces it."
        />

        <div className="mt-14 overflow-hidden rounded-2xl border border-white/5 bg-[var(--surface)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-left text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-4 font-medium">Capability</th>
                  <th className="px-6 py-4 text-center font-semibold text-cyan-300">
                    Maxime
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    Pro analytics
                    <div className="text-[10px] font-normal normal-case text-zinc-600">
                      Esports One, etc.
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    Mobalytics
                    <div className="text-[10px] font-normal normal-case text-zinc-600">
                      Solo player
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    Sheets + Discord
                    <div className="text-[10px] font-normal normal-case text-zinc-600">
                      Status quo
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={
                      i % 2 === 0
                        ? "border-b border-white/5"
                        : "border-b border-white/5 bg-white/[0.01]"
                    }
                  >
                    <td className="px-6 py-4 text-zinc-200">{row.label}</td>
                    <td className="bg-cyan-400/[0.04] px-6 py-4">
                      <CellIcon value={row.maxime} />
                    </td>
                    <td className="px-6 py-4">
                      <CellIcon value={row.pro} />
                    </td>
                    <td className="px-6 py-4">
                      <CellIcon value={row.mobalytics} />
                    </td>
                    <td className="px-6 py-4">
                      <CellIcon value={row.sheets} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-zinc-500">
          The real incumbent isn't a competitor — it's a Google Sheet pinned in
          a Discord channel. Maxime replaces it.
        </p>
      </Container>
    </section>
  );
}
