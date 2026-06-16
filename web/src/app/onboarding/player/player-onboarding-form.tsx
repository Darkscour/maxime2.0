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
import type { AccountTier } from "@/lib/account-tier";
import { TIER_LABELS } from "@/lib/account-tier";
import {
  buildOnboardingHref,
  onboardingQueryFromSearchParams,
} from "@/lib/onboarding-path";
import type { InstitutionListItem } from "@/lib/institutions";
import { SchoolCombobox } from "@/components/onboarding/school-combobox";
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
  institution: InstitutionListItem | null;
  schoolEmail: string;
  bio: string;
  inviteCode: string;
};

const INITIAL_PLAYER_DRAFT: PlayerDraft = {
  handle: "",
  game: "",
  role: "",
  rank: "",
  region: "",
  institution: null,
  schoolEmail: "",
  bio: "",
  inviteCode: "",
};

export function PlayerOnboardingForm({
  tier,
  signInEmail,
}: {
  tier: AccountTier;
  signInEmail?: string | null;
}) {
  const isCollegiate = tier === "collegiate";
  const router = useRouter();
  const searchParams = useSearchParams();
  const onboardingQuery = onboardingQueryFromSearchParams(searchParams);
  const draftKey = onboardingDraftKey("player", tier);
  const [draft, setDraft, hydrated] = useOnboardingDraft(
    draftKey,
    INITIAL_PLAYER_DRAFT,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const tierBackHref = buildOnboardingHref("/onboarding/player/tier", onboardingQuery);
  const ranksForGame = getRanksForGame(draft.game);

  function patchDraft<K extends keyof PlayerDraft>(key: K, value: PlayerDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function submitProfile(includeInvite: boolean) {
    setError("");
    setLoading(true);

    if (isCollegiate && !draft.institution) {
      setError("Select your school / university from the list.");
      setLoading(false);
      return;
    }

    if (isCollegiate && !draft.schoolEmail.trim()) {
      setError("School email is required to verify your collegiate affiliation.");
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
          accountTier: tier,
          handle: draft.handle,
          game: draft.game,
          role: draft.role,
          rank: draft.rank,
          region: draft.region,
          institutionId: isCollegiate ? draft.institution?.id : undefined,
          schoolEmail: isCollegiate ? draft.schoolEmail : undefined,
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
      router.push(
        buildOnboardingHref("/onboarding/done", { ...onboardingQuery, tier }),
      );
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
    (!isCollegiate ||
      (!!draft.institution && draft.schoolEmail.trim().length > 0));

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <OnboardingBackNav href={tierBackHref} label="Back to account type" />
      <StepHeader
        step="Player onboarding"
        title={
          isCollegiate
            ? "Build your collegiate player profile"
            : "Build your grassroots player profile"
        }
        subtitle={
          isCollegiate
            ? "Verify your campus affiliation, then share the competitive details teams at your school care about."
            : "Share your competitive identity so grassroots teams in your region can find and recruit you."
        }
      />

      <FormError message={error} />

      {isCollegiate && (
        <div className="space-y-5 rounded-2xl border border-violet-400/20 bg-violet-400/[0.04] p-5">
          <div>
            <p className="text-sm font-medium text-violet-100">
              Collegiate student verification
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Collegiate profiles require a school email. You cannot create a campus
              profile with a personal email alone.
            </p>
          </div>
          <SchoolCombobox
            value={draft.institution}
            onChange={(institution) => patchDraft("institution", institution)}
            hint="Search registered U.S. colleges and universities"
            required
          />
          <FormField
            label="School email"
            hint={
              draft.institution?.primaryDomain
                ? `Must be your official address at ${draft.institution.name} (e.g. you@${draft.institution.primaryDomain})`
                : signInEmail
                  ? `Use your official .edu or university alias (signed in as ${signInEmail})`
                  : "Use your official .edu or university alias email"
            }
          >
            <TextInput
              type="email"
              value={draft.schoolEmail}
              onChange={(e) => patchDraft("schoolEmail", e.target.value)}
              placeholder={
                draft.institution?.primaryDomain
                  ? `you@${draft.institution.primaryDomain}`
                  : "you@school.edu"
              }
              required
            />
          </FormField>
        </div>
      )}

      <div className="space-y-5">
        <p className="text-sm font-medium text-zinc-200">Competitive profile</p>

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

          <FormField label="Role" hint="Your main in-game position">
            <TextInput
              value={draft.role}
              onChange={(e) => patchDraft("role", e.target.value)}
              placeholder="Duelist, Mid, AWPer…"
              required
            />
          </FormField>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Rank"
            hint={draft.game ? `Current tier in ${draft.game}` : undefined}
          >
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

          <FormField
            label="Region"
            hint={
              isCollegiate
                ? "Helps campus teams understand your ping / schedule"
                : "Grassroots teams filter recruits by region"
            }
          >
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
      </div>

      <FormField
        label="Short bio"
        hint={`Optional — availability, experience, or what you're looking for · max ${PLAYER_BIO_MAX_LENGTH} characters`}
      >
        <TextArea
          value={draft.bio}
          onChange={(e) => patchDraft("bio", e.target.value)}
          placeholder={
            isCollegiate
              ? "Open to tryouts for UMD Valorant. Available Tue/Thu evenings…"
              : "NA East Duelist, LFT for a structured semi-pro team. Flexible weeknights…"
          }
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
            Have an invite code from a captain? Paste it below to join their org when
            your profile is saved.
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
        <p className="text-sm font-medium text-zinc-200">Not on a team yet?</p>
        <p className="mt-1 text-sm leading-6 text-zinc-400">
          {isCollegiate
            ? "Save your profile and appear in your school's campus talent pool. Teams can scout and invite you anytime."
            : `Save your profile and get discovered by ${TIER_LABELS.grassroots.toLowerCase()} teams in your region.`}
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
          href={tierBackHref}
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
