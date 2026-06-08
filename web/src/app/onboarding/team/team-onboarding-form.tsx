"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  TextInput,
  SelectInput,
  FormError,
  StepHeader,
} from "@/components/onboarding/form-fields";
import { OnboardingBackNav } from "@/components/onboarding/onboarding-back-nav";
import { OnboardingHomeLink } from "@/components/onboarding/onboarding-home-link";
import {
  ONBOARDING_GAMES,
  ONBOARDING_REGIONS,
} from "@/lib/onboarding-options";
import { MANAGER_TITLES } from "@/lib/manager-verification";
import {
  buildOnboardingHref,
  onboardingQueryFromSearchParams,
} from "@/lib/onboarding-path";
import {
  clearOnboardingDraft,
  onboardingDraftKey,
  useOnboardingDraft,
} from "@/lib/onboarding-draft";

type TeamDraft = {
  name: string;
  school: string;
  games: string[];
  region: string;
  rosterSize: string;
  discordUrl: string;
  managerTitle: string;
  managerOrgEmail: string;
  authorized: boolean;
};

const INITIAL_TEAM_DRAFT: TeamDraft = {
  name: "",
  school: "",
  games: [],
  region: "",
  rosterSize: "",
  discordUrl: "",
  managerTitle: "",
  managerOrgEmail: "",
  authorized: false,
};

export function TeamOnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const onboardingQuery = onboardingQueryFromSearchParams(searchParams);
  const draftKey = onboardingDraftKey("team");
  const [draft, setDraft] = useOnboardingDraft(draftKey, INITIAL_TEAM_DRAFT);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function patchDraft<K extends keyof TeamDraft>(key: K, value: TeamDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function toggleGame(game: string) {
    setDraft((prev) => ({
      ...prev,
      games: prev.games.includes(game)
        ? prev.games.filter((g) => g !== game)
        : [...prev.games, game],
    }));
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
          name: draft.name,
          school: draft.school || undefined,
          games: draft.games,
          region: draft.region || undefined,
          rosterSize: draft.rosterSize ? Number(draft.rosterSize) : undefined,
          discordUrl: draft.discordUrl || undefined,
          managerTitle: draft.managerTitle,
          managerOrgEmail: draft.managerOrgEmail,
          authorized: draft.authorized,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      clearOnboardingDraft(draftKey);
      router.push(
        buildOnboardingHref("/onboarding/done", {
          ...onboardingQuery,
          extra: { invite: data.team.inviteCode },
        }),
      );
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <OnboardingBackNav href="/onboarding" label="Back to role selection" />
      <StepHeader
        step="Team onboarding"
        title="Set up your org profile"
        subtitle="Team managers must verify their role before inviting players and using org tools."
      />

      <FormError message={error} />

      <div className="rounded-2xl border border-violet-400/20 bg-violet-400/[0.04] p-5 space-y-5">
        <p className="text-sm font-medium text-violet-100">Manager verification</p>
        <FormField label="Your role at the org" hint="Required for team managers">
          <SelectInput
            value={draft.managerTitle}
            onChange={(e) => patchDraft("managerTitle", e.target.value)}
            required
          >
            <option value="">Select your role</option>
            {MANAGER_TITLES.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </SelectInput>
        </FormField>
        <FormField
          label="Official org / school email"
          hint="Use your .edu or team domain email — we use this to verify you represent the org"
        >
          <TextInput
            type="email"
            value={draft.managerOrgEmail}
            onChange={(e) => patchDraft("managerOrgEmail", e.target.value)}
            placeholder="you@school.edu"
            required
          />
        </FormField>
        <label className="flex items-start gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={draft.authorized}
            onChange={(e) => patchDraft("authorized", e.target.checked)}
            className="mt-1 rounded border-white/20 bg-transparent"
            required
          />
          <span>
            I confirm I am authorized to create and manage this organization&apos;s
            profile on Maxime.
          </span>
        </label>
      </div>

      <FormField label="Team name" hint="How your org appears on Maxime">
        <TextInput
          value={draft.name}
          onChange={(e) => patchDraft("name", e.target.value)}
          placeholder="Penn State Valorant"
          required
          maxLength={80}
        />
      </FormField>

      <FormField label="School / university" hint="Optional">
        <TextInput
          value={draft.school}
          onChange={(e) => patchDraft("school", e.target.value)}
          placeholder="Penn State University"
        />
      </FormField>

      <FormField label="Games" hint="Select all titles your org competes in">
        <div className="flex flex-wrap gap-2">
          {ONBOARDING_GAMES.map((game) => {
            const active = draft.games.includes(game);
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
            value={draft.region}
            onChange={(e) => patchDraft("region", e.target.value)}
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
            value={draft.rosterSize}
            onChange={(e) => patchDraft("rosterSize", e.target.value)}
            placeholder="8"
          />
        </FormField>
      </div>

      <FormField label="Discord invite URL" hint="Optional">
        <TextInput
          value={draft.discordUrl}
          onChange={(e) => patchDraft("discordUrl", e.target.value)}
          placeholder="https://discord.gg/..."
        />
      </FormField>

      <Button
        type="submit"
        size="lg"
        disabled={
          loading ||
          !draft.name ||
          draft.games.length === 0 ||
          !draft.managerTitle ||
          !draft.managerOrgEmail ||
          !draft.authorized
        }
      >
        {loading ? "Creating team…" : "Create team & get invite code"}
      </Button>

      <p className="text-center text-sm text-zinc-500">
        <OnboardingHomeLink className="text-cyan-400 hover:text-cyan-300" />
      </p>
    </form>
  );
}
