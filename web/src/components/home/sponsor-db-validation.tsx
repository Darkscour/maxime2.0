import { Database, AlertCircle, CheckCircle2 } from "lucide-react";
import type { SponsorFetchResult } from "@/lib/fetch-sponsors";
import { SponsorMinimalCard } from "@/components/sponsorships/sponsor-minimal-card";

export function SponsorDbValidation({
  result,
}: {
  result: SponsorFetchResult;
}) {
  const status =
    result.source === "database"
      ? {
          icon: CheckCircle2,
          tone: "text-emerald-400",
          label: `Connected — ${result.sponsors.length} row(s) from Supabase`,
        }
      : result.source === "empty"
        ? {
            icon: AlertCircle,
            tone: "text-amber-400",
            label: "Connected but no sponsor rows found",
          }
        : {
            icon: AlertCircle,
            tone: "text-amber-400",
            label: "Cannot reach Supabase — fix .env connection strings",
          };

  const StatusIcon = status.icon;

  return (
    <div className="mt-16 rounded-xl border border-dashed border-cyan-400/25 bg-cyan-400/[0.04] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <Database className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Supabase validation
          </p>
          <p className={`mt-2 flex items-center gap-2 text-sm font-medium ${status.tone}`}>
            <StatusIcon className="h-4 w-4 shrink-0" />
            {status.label}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Live rows from your <code className="text-zinc-300">Sponsor</code>{" "}
            table. Signed-in teams will use this data in the full portal (with
            pipeline features coming next).
          </p>
          {result.error && (
            <p className="mt-3 rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-xs leading-5 text-amber-100/90">
              {result.error}
            </p>
          )}
        </div>
      </div>

      {result.sponsors.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.sponsors.slice(0, 12).map((s) => (
            <SponsorMinimalCard
              key={s.id}
              sponsor={s}
              showAi={false}
              tag="Live DB"
            />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-zinc-500">
          No rows to display. Fix <code className="text-zinc-400">.env</code>{" "}
          URLs, confirm rows exist in Supabase, and ensure each row has a
          non-empty <code className="text-zinc-400">id</code> /{" "}
          <code className="text-zinc-400">ID</code>.
        </p>
      )}

      {result.sponsors.length > 12 && (
        <p className="mt-4 text-center text-xs text-zinc-500">
          Showing first 12 of {result.sponsors.length} rows.
        </p>
      )}
    </div>
  );
}
