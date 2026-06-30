"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Globe, Users } from "lucide-react";
import { ONBOARDING_GAMES, ONBOARDING_REGIONS } from "@/lib/onboarding-options";
import { parseJsonResponse } from "@/lib/safe-json";
import {
  SettingsAlert,
  SettingsChip,
  SettingsField,
  SettingsFooter,
  SettingsHero,
  SettingsInput,
  SettingsSection,
  SettingsSelect,
} from "@/components/dashboard/settings/settings-ui";

export type TeamProfileFormData = {
  name: string;
  school: string;
  games: string[];
  region: string;
  rosterSize: string;
  discordUrl: string;
};

export function TeamProfileEditForm({ initial }: { initial: TeamProfileFormData }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initial.name);
  const [school, setSchool] = useState(initial.school);
  const [games, setGames] = useState<string[]>(initial.games);
  const [region, setRegion] = useState(initial.region);
  const [rosterSize, setRosterSize] = useState(initial.rosterSize);
  const [discordUrl, setDiscordUrl] = useState(initial.discordUrl);

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
      const res = await fetch("/api/team/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          school: school || undefined,
          games,
          region: region || undefined,
          rosterSize: rosterSize ? Number(rosterSize) : undefined,
          discordUrl: discordUrl || undefined,
        }),
      });

      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error || "Something went wrong.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <SettingsHero
        eyebrow="Team"
        accent="cyan"
        title="Org profile"
        description="Your team's public identity — titles, region, and roster size."
        preview={
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/25 px-4 py-3 backdrop-blur-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400/30 to-cyan-400/20 ring-1 ring-inset ring-white/10">
              <Building2 className="h-5 w-5 text-violet-300" />
            </span>
            <div>
              <p className="font-heading text-base font-semibold text-white">
                {name || "Your team"}
              </p>
              <p className="text-xs text-zinc-500">
                {games.length > 0
                  ? `${games.length} title${games.length === 1 ? "" : "s"} · ${region || "No region"}`
                  : "Add competitive titles"}
              </p>
            </div>
          </div>
        }
      />

      {error && <SettingsAlert tone="error" message={error} />}

      <div className="space-y-5">
        <SettingsSection
          icon={Building2}
          title="Organization"
          description="How your org appears across Maxime."
        >
          <SettingsField label="Team name">
            <SettingsInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Penn State Valorant"
              required
              maxLength={80}
              className="font-heading text-base"
            />
          </SettingsField>
          <SettingsField label="School / university" hint="Optional">
            <SettingsInput
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Penn State University"
            />
          </SettingsField>
        </SettingsSection>

        <SettingsSection
          icon={Users}
          title="Competitive titles"
          description="Every game your org competes in — no single primary title."
        >
          <div className="flex flex-wrap gap-2">
            {ONBOARDING_GAMES.map((game) => (
              <SettingsChip
                key={game}
                active={games.includes(game)}
                onClick={() => toggleGame(game)}
              >
                {game}
              </SettingsChip>
            ))}
          </div>
        </SettingsSection>

        <SettingsSection
          icon={Globe}
          title="Region & roster"
          description="Location and roster size for recruitment and sponsors."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <SettingsField label="Primary region">
              <SettingsSelect
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="">Select region</option>
                {ONBOARDING_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </SettingsSelect>
            </SettingsField>
            <SettingsField label="Roster size" hint="Active players">
              <SettingsInput
                type="number"
                min={1}
                max={99}
                value={rosterSize}
                onChange={(e) => setRosterSize(e.target.value)}
                placeholder="8"
              />
            </SettingsField>
          </div>
          <SettingsField label="Discord invite">
            <SettingsInput
              value={discordUrl}
              onChange={(e) => setDiscordUrl(e.target.value)}
              placeholder="https://discord.gg/..."
            />
          </SettingsField>
        </SettingsSection>
      </div>

      <SettingsFooter
        loading={loading}
        disabled={!name || games.length === 0}
        submitLabel="Save team"
      />
    </form>
  );
}
