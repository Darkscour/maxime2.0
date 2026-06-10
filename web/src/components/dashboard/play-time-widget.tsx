"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormError, TextInput } from "@/components/onboarding/form-fields";

/** Small stat-style play time widget for the player overview row. */
export function PlayTimeWidget({
  game,
  hoursPerWeek,
}: {
  game: string;
  hoursPerWeek: number | null;
}) {
  const router = useRouter();
  const [hours, setHours] = useState(
    hoursPerWeek != null ? String(hoursPerWeek) : "",
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const value = Number(hours);
    if (!Number.isFinite(value) || value < 0 || value > 168) {
      setError("Enter 0–168.");
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
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Play time</p>
          <p className="font-heading mt-2 text-2xl font-semibold text-white">
            {hoursPerWeek != null ? `${hoursPerWeek}` : "—"}
            <span className="ml-1 text-sm font-normal text-zinc-500">hrs/wk</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500">Self-reported · {game}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-inset ring-white/10">
          <Clock className="h-4 w-4 text-cyan-400" />
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        <FormError message={error} />
        <div className="flex items-center gap-2">
          <TextInput
            type="number"
            min={0}
            max={168}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="hrs"
            className="h-9 max-w-[5rem] text-sm"
            required
          />
          <Button type="submit" size="sm" disabled={loading} className="h-9">
            {loading ? "…" : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
}
