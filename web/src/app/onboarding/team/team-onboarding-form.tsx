"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  FormField,
  TextInput,
  SelectInput,
  FormError,
  StepHeader,
} from "@/components/onboarding/form-fields";
import {
  ONBOARDING_GAMES,
  ONBOARDING_REGIONS,
} from "@/lib/onboarding-options";

export function TeamOnboardingForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [games, setGames] = useState<string[]>([]);
  const [region, setRegion] = useState("");
  const [rosterSize, setRosterSize] = useState("");
  const [avgViewers, setAvgViewers] = useState("");
  const [discordUrl, setDiscordUrl] = useState("");

  function toggleGame(game: string) {
    setGames((prev) =>
      prev.includes(game) ? prev.filter((g) => g !== game) : [...prev, game],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/onboarding/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          school: school || undefined,
          games,
          region: region || undefined,
          rosterSize: rosterSize ? Number(rosterSize) : undefined,
          avgViewers: avgViewers ? Number(avgViewers) : undefined,
          discordUrl: discordUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      router.push(
        `/onboarding/done?invite=${encodeURIComponent(data.team.inviteCode)}`,
      );
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <StepHeader
        step="Team onboarding"
        title="Set up your org profile"
        subtitle="This becomes the source of truth for sponsorship fit, recruitment filters, and your future AI assistant."
      />

      <FormError message={error} />

      <FormField label="Team name" hint="How your org appears on Maxime">
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Penn State Valorant"
          required
          maxLength={80}
        />
      </FormField>

      <FormField label="School / university" hint="Optional">
        <TextInput
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          placeholder="Penn State University"
        />
      </FormField>

      <FormField label="Games" hint="Select all titles your org competes in">
        <div className="flex flex-wrap gap-2">
          {ONBOARDING_GAMES.map((game) => {
            const active = games.includes(game);
            return (
              <button
                key={game}
                type="button"
                onClick={() => toggleGame(game)}
                className={
                  active
                    ? "rounded-full bg-cyan-400/15 px-3 py-1.5 text-xs font-medium text-cyan-200 ring-1 ring-inset ring-cyan-400/35"
                    : "rounded-full bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-400 ring-1 ring-inset ring-white/10 hover:text-white"
                }
              >
                {game}
              </button>
            );
          })}
        </div>
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Primary region">
          <SelectInput
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">Select region</option>
            {ONBOARDING_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label="Roster size" hint="Approximate active players">
          <TextInput
            type="number"
            min={1}
            max={99}
            value={rosterSize}
            onChange={(e) => setRosterSize(e.target.value)}
            placeholder="8"
          />
        </FormField>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Avg. stream viewers" hint="Optional — helps sponsorship fit">
          <TextInput
            type="number"
            min={0}
            value={avgViewers}
            onChange={(e) => setAvgViewers(e.target.value)}
            placeholder="45"
          />
        </FormField>

        <FormField label="Discord invite URL" hint="Optional">
          <TextInput
            value={discordUrl}
            onChange={(e) => setDiscordUrl(e.target.value)}
            placeholder="https://discord.gg/..."
          />
        </FormField>
      </div>

      <Button type="submit" size="lg" disabled={loading || !name || games.length === 0}>
        {loading ? "Creating team…" : "Create team & get invite code"}
      </Button>
    </form>
  );
}
