"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormError, TextInput } from "@/components/onboarding/form-fields";

export function PlayTimeReport({
  game,
  hoursPerWeek,
  updatedAt,
  compact = false,
}: {
  game: string;
  hoursPerWeek: number | null;
  updatedAt: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [hours, setHours] = useState(
    hoursPerWeek != null ? String(hoursPerWeek) : "",
  );
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setLoading(true);

    const value = Number(hours);
    if (!Number.isFinite(value) || value < 0 || value > 168) {
      setError("Enter a number between 0 and 168.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/player/play-time", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hoursPerWeek: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save.");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const lastUpdated = new Date(updatedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section
      className={
        compact
          ? "flex h-full flex-col rounded-2xl border border-white/5 bg-[var(--surface)] p-4"
          : "rounded-2xl border border-white/5 bg-[var(--surface)] p-6 sm:p-8"
      }
    >
      <div className={compact ? "flex items-start gap-3" : "flex items-start gap-4"}>
        <span
          className={
            compact
              ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 ring-1 ring-inset ring-cyan-400/25"
              : "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-inset ring-cyan-400/25"
          }
        >
          <Clock className={compact ? "h-4 w-4 text-cyan-400" : "h-5 w-5 text-cyan-400"} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Play time
          </p>
          <h2
            className={
              compact
                ? "font-heading mt-0.5 text-base font-semibold text-white"
                : "font-heading mt-1 text-xl font-semibold text-white"
            }
          >
            Self-reported hours
          </h2>
          {!compact && (
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              How many hours per week do you play{" "}
              <span className="text-zinc-200">{game}</span>? You report this yourself
              — captains use it for roster planning and availability fit.
            </p>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className={compact ? "mt-4 flex-1 space-y-3" : "mt-6 max-w-sm space-y-4"}
      >
        <FormError message={error} />
        {saved && (
          <p className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-sm text-emerald-200">
            Play time saved.
          </p>
        )}

        <label className="block">
          <span className="text-sm font-medium text-zinc-200">Hours per week</span>
          {!compact && (
            <span className="mt-0.5 block text-xs text-zinc-500">
              Include ranked, scrims, and team practice
            </span>
          )}
          <div className="mt-2 flex max-w-[200px] items-center gap-3">
            <TextInput
              type="number"
              min={0}
              max={168}
              value={hours}
              onChange={(e) => {
                setHours(e.target.value);
                setSaved(false);
              }}
              placeholder="e.g. 20"
              required
            />
            <span className="text-sm text-zinc-500">hrs / week</span>
          </div>
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "Saving…" : compact ? "Save" : "Update play time"}
          </Button>
          {!compact && (
            <p className="text-xs text-zinc-600">Last updated {lastUpdated}</p>
          )}
        </div>
      </form>
    </section>
  );
}
