"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FormField,
  TextInput,
  TextArea,
  SelectInput,
  FormError,
  StepHeader,
} from "@/components/onboarding/form-fields";
import { OnboardingBackNav } from "@/components/onboarding/onboarding-back-nav";
import { OnboardingHomeLink } from "@/components/onboarding/onboarding-home-link";
import { BioCharacterCount } from "@/components/onboarding/bio-character-count";
import {
  ONBOARDING_GAMES,
  PLAYER_BIO_MAX_LENGTH,
  PLAYER_ONBOARDING_REGIONS,
  getRanksForGame,
} from "@/lib/onboarding-options";
import {
  buildOnboardingHref,
  onboardingQueryFromSearchParams,
} from "@/lib/onboarding-path";
import {
  clearOnboardingDraft,
  onboardingDraftKey,
  useOnboardingDraft,
} from "@/lib/onboarding-draft";

type PlayerDraft = {
  handle: string;
  game: string;
  role: string;
  rank: string;
  region: string;
  school: string;
  age: string;
  hoursPerWeek: string;
  bio: string;
  inviteCode: string;
};

const INITIAL_PLAYER_DRAFT: PlayerDraft = {
  handle: "",
  game: "",
  role: "",
  rank: "",
  region: "",
  school: "",
  age: "",
  hoursPerWeek: "",
  bio: "",
  inviteCode: "",
};

export function PlayerOnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const onboardingQuery = onboardingQueryFromSearchParams(searchParams);
  const draftKey = onboardingDraftKey("player");
  const [draft, setDraft, hydrated] = useOnboardingDraft(
    draftKey,
    INITIAL_PLAYER_DRAFT,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ranksForGame = getRanksForGame(draft.game);

  function patchDraft<K extends keyof PlayerDraft>(key: K, value: PlayerDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function submitProfile(includeInvite: boolean) {
    setError("");
    setLoading(true);

    const age = Number(draft.age);
    if (!draft.age || Number.isNaN(age) || age < 13 || age > 99) {
      setError("Enter a valid age between 13 and 99.");
      setLoading(false);
      return;
    }

    if (draft.rank && !ranksForGame.includes(draft.rank)) {
      setError("Select a rank that matches your primary game.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/onboarding/player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: draft.handle,
          game: draft.game,
          role: draft.role,
          rank: draft.rank,
          region: draft.region,
          school: draft.school || undefined,
          age,
          hoursPerWeek: draft.hoursPerWeek ? Number(draft.hoursPerWeek) : undefined,
          bio: draft.bio || undefined,
          inviteCode:
            includeInvite && draft.inviteCode.trim()
              ? draft.inviteCode.trim()
              : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      clearOnboardingDraft(draftKey);
      router.push(buildOnboardingHref("/onboarding/done", onboardingQuery));
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitProfile(true);
  }

  const profileReady =
    hydrated &&
    draft.handle &&
    draft.game &&
    draft.role &&
    draft.rank &&
    draft.region &&
    draft.age &&
    Number(draft.age) >= 13 &&
    Number(draft.age) <= 99;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <OnboardingBackNav href="/onboarding" label="Back to role selection" />
      <StepHeader
        step="Player onboarding"
        title="Build your player profile"
        subtitle="Get discovered by teams on Maxime — join an org now with an invite code, or create your profile solo and find a team later."
      />

      <FormError message={error} />

      <FormField label="In-game handle" hint="How scouts will find you">
        <TextInput
          value={draft.handle}
          onChange={(e) => patchDraft("handle", e.target.value)}
          placeholder="Zylith"
          required
          maxLength={32}
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Primary game">
          <SelectInput
            value={draft.game}
            onChange={(e) => {
              patchDraft("game", e.target.value);
              patchDraft("rank", "");
            }}
            required
          >
            <option value="">Select game</option>
            {ONBOARDING_GAMES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label="Role">
          <TextInput
            value={draft.role}
            onChange={(e) => patchDraft("role", e.target.value)}
            placeholder="Duelist, Mid, AWPer…"
            required
          />
        </FormField>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Rank" hint={draft.game ? `Tiers for ${draft.game}` : undefined}>
          <SelectInput
            value={draft.rank}
            onChange={(e) => patchDraft("rank", e.target.value)}
            required
            disabled={!draft.game}
          >
            <option value="">
              {draft.game ? "Select rank" : "Select a game first"}
            </option>
            {ranksForGame.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField label="Region">
          <SelectInput
            value={draft.region}
            onChange={(e) => patchDraft("region", e.target.value)}
            required
          >
            <option value="">Select region</option>
            {PLAYER_ONBOARDING_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </SelectInput>
        </FormField>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="School" hint="Optional">
          <TextInput
            value={draft.school}
            onChange={(e) => patchDraft("school", e.target.value)}
            placeholder="UCLA"
          />
        </FormField>

        <FormField label="Age">
          <TextInput
            type="number"
            min={13}
            max={99}
            value={draft.age}
            onChange={(e) => patchDraft("age", e.target.value)}
            placeholder="20"
            required
          />
        </FormField>
      </div>

      <FormField
        label="Hours played per week"
        hint="Self-reported estimate for your primary game"
      >
        <TextInput
          type="number"
          min={0}
          max={168}
          value={draft.hoursPerWeek}
          onChange={(e) => patchDraft("hoursPerWeek", e.target.value)}
          placeholder="20"
        />
      </FormField>

      <FormField
        label="Short bio"
        hint={`Optional — 1–2 sentences · max ${PLAYER_BIO_MAX_LENGTH} characters`}
      >
        <TextArea
          value={draft.bio}
          onChange={(e) => patchDraft("bio", e.target.value)}
          placeholder="Collegiate VALORANT player looking for a structured practice schedule…"
          maxLength={PLAYER_BIO_MAX_LENGTH}
        />
      </FormField>
      <div className="-mt-6">
        <BioCharacterCount length={draft.bio.length} max={PLAYER_BIO_MAX_LENGTH} />
      </div>

      <div className="rounded-2xl border border-violet-400/20 bg-violet-400/[0.04] p-5 space-y-4">
        <div>
          <p className="text-sm font-medium text-violet-100">Join a team now</p>
          <p className="mt-1 text-sm text-zinc-400">
            Have an invite code from a captain? Paste it below to join their org
            when your profile is saved.
          </p>
        </div>
        <FormField label="Team invite code" hint="Optional">
          <TextInput
            value={draft.inviteCode}
            onChange={(e) => patchDraft("inviteCode", e.target.value)}
            placeholder="Paste invite code"
          />
        </FormField>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <p className="text-sm font-medium text-zinc-200">
          Not on a team yet?
        </p>
        <p className="mt-1 text-sm leading-6 text-zinc-400">
          You can still create your player profile and get discovered by orgs
          looking for talent. Join a team anytime later with an invite code.
        </p>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="mt-4 w-full sm:w-auto"
          disabled={loading || !profileReady}
          onClick={() => submitProfile(false)}
        >
          {loading ? "Saving profile…" : "Create profile without a team"}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={loading || !profileReady}>
          {loading
            ? "Saving profile…"
            : draft.inviteCode.trim()
              ? "Save profile & join team"
              : "Save profile & continue"}
        </Button>
        <Link
          href={buildOnboardingHref("/onboarding", onboardingQuery)}
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Back
        </Link>
      </div>

      <p className="text-center text-sm text-zinc-500">
        <OnboardingHomeLink className="text-cyan-400 hover:text-cyan-300" />
      </p>
    </form>
  );
}
