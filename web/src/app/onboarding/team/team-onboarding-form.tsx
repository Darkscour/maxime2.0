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
import type { AccountTier } from "@/lib/account-tier";
import { TIER_LABELS } from "@/lib/account-tier";
import {
  buildOnboardingHref,
  onboardingQueryFromSearchParams,
} from "@/lib/onboarding-path";
import {
  clearOnboardingDraft,
  onboardingDraftKey,
  useOnboardingDraft,
} from "@/lib/onboarding-draft";
import type { InstitutionListItem } from "@/lib/institutions";
import { SchoolCombobox } from "@/components/onboarding/school-combobox";
import { useClientMounted } from "@/hooks/use-client-mounted";

type TeamDraft = {
  displayName: string;
  name: string;
  institution: InstitutionListItem | null;
  games: string[];
  region: string;
  rosterSize: string;
  discordUrl: string;
  managerTitle: string;
  managerOrgEmail: string;
  authorized: boolean;
};

const INITIAL_TEAM_DRAFT: TeamDraft = {
  displayName: "",
  name: "",
  institution: null,
  games: [],
  region: "",
  rosterSize: "",
  discordUrl: "",
  managerTitle: "",
  managerOrgEmail: "",
  authorized: false,
};

export function TeamOnboardingForm({
  tier,
  signInEmail,
}: {
  tier: AccountTier;
  signInEmail?: string | null;
}) {
  const isCollegiate = tier === "collegiate";
  const mounted = useClientMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const onboardingQuery = onboardingQueryFromSearchParams(searchParams);
  const draftKey = onboardingDraftKey("team", tier);
  const [draft, setDraft, draftReady] = useOnboardingDraft(
    draftKey,
    INITIAL_TEAM_DRAFT,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const tierBackHref = buildOnboardingHref("/onboarding/team/tier", onboardingQuery);

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

    if (isCollegiate && !draft.institution) {
      setError("Select your school / university from the list.");
      setLoading(false);
      return;
    }

    if (isCollegiate && !draft.managerOrgEmail.trim()) {
      setError("School email is required to verify your collegiate affiliation.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/onboarding/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountTier: tier,
          displayName: !isCollegiate ? draft.displayName.trim() : undefined,
          name: draft.name,
          institutionId: isCollegiate ? draft.institution?.id : undefined,
          games: draft.games,
          region: draft.region || undefined,
          rosterSize: draft.rosterSize ? Number(draft.rosterSize) : undefined,
          discordUrl: draft.discordUrl || undefined,
          managerTitle: draft.managerTitle,
          managerOrgEmail: isCollegiate
            ? draft.managerOrgEmail
            : (signInEmail?.trim() || draft.managerOrgEmail),
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
          tier,
          extra: { invite: data.team.inviteCode },
        }),
      );
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const profileReady = Boolean(
    mounted &&
      draftReady &&
      draft.name.trim() &&
      draft.games.length > 0 &&
      draft.managerTitle &&
      draft.authorized &&
      (isCollegiate
        ? !!draft.managerOrgEmail.trim() && !!draft.institution
        : !!signInEmail?.trim() && !!draft.displayName.trim()) &&
      (isCollegiate || !!draft.region),
  );
  const submitDisabled = !profileReady || loading;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <OnboardingBackNav href="/onboarding/team/tier" label="Back to account type" />
      <StepHeader
        step="Team onboarding"
        title={
          isCollegiate
            ? "Set up your collegiate org profile"
            : "Set up your grassroots org profile"
        }
        subtitle={
          isCollegiate
            ? `${TIER_LABELS.collegiate} teams recruit verified players on campus. School email verification unlocks org tools.`
            : `${TIER_LABELS.grassroots} teams recruit openly by region. No school affiliation required.`
        }
      />

      <FormError message={error} />

      {isCollegiate ? (
        <div className="space-y-5 rounded-2xl border border-violet-400/20 bg-violet-400/[0.04] p-5">
          <div>
            <p className="text-sm font-medium text-violet-100">
              Collegiate org verification
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Collegiate teams require a school affiliation and official school
              email. You cannot create a campus org profile with a personal email
              alone.
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
            required
            hint={
              draft.institution?.primaryDomain
                ? `Must be your official address at ${draft.institution.name} (e.g. you@${draft.institution.primaryDomain})`
                : "Use your official .edu or university alias email"
            }
          >
            <TextInput
              type="email"
              value={draft.managerOrgEmail}
              onChange={(e) => patchDraft("managerOrgEmail", e.target.value)}
              placeholder={
                draft.institution?.primaryDomain
                  ? `you@${draft.institution.primaryDomain}`
                  : "you@school.edu"
              }
              required
            />
          </FormField>
        </div>
      ) : (
        <div className="space-y-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5">
          <p className="text-sm font-medium text-cyan-100">Manager contact</p>
          <FormField
            label="Name on Maxime"
            hint="How you appear on the platform — not derived from your email."
            required
          >
            <TextInput
              value={draft.displayName}
              onChange={(e) => patchDraft("displayName", e.target.value)}
              placeholder="Alex"
              required
              maxLength={80}
            />
          </FormField>
          <FormField
            label="Your email"
            hint="Sign-in email for your grassroots manager account."
          >
            <TextInput
              type="email"
              value={signInEmail ?? ""}
              readOnly
              className="opacity-80"
            />
          </FormField>
        </div>
      )}

      <div className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <p className="text-sm font-medium text-zinc-200">Leadership details</p>
        <FormField
          label="Your role at the org"
          hint={isCollegiate ? "Required for collegiate team managers" : "Required"}
          required
        >
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

      <FormField label="Team name" hint="How your org appears on Maxime" required>
        <TextInput
          value={draft.name}
          onChange={(e) => patchDraft("name", e.target.value)}
          placeholder={
            isCollegiate ? "Penn State Valorant" : "Night Shift Esports"
          }
          required
          maxLength={80}
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
        {!isCollegiate && (
          <FormField
            label="Primary region"
            hint="Required — used for regional player discovery"
            required
          >
            <SelectInput
              value={draft.region}
              onChange={(e) => patchDraft("region", e.target.value)}
              required
            >
              <option value="">Select region</option>
              {ONBOARDING_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </SelectInput>
          </FormField>
        )}

        {isCollegiate && (
          <FormField label="Target roster size" hint="Approximate players you plan to field">
            <TextInput
              type="number"
              min={1}
              max={99}
              value={draft.rosterSize}
              onChange={(e) => patchDraft("rosterSize", e.target.value)}
              placeholder="5"
            />
          </FormField>
        )}
      </div>

      <FormField label="Discord invite URL" hint="Optional">
        <TextInput
          value={draft.discordUrl}
          onChange={(e) => patchDraft("discordUrl", e.target.value)}
          placeholder="https://discord.gg/..."
        />
      </FormField>

      <Button type="submit" size="lg" disabled={submitDisabled}>
        {loading ? "Creating team…" : "Create team & get invite code"}
      </Button>

      <p className="text-center text-sm text-zinc-500">
        <OnboardingHomeLink className="text-cyan-400 hover:text-cyan-300" />
      </p>
    </form>
  );
}
