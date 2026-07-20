"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  PLAYER_BIO_MAX_LENGTH,
  ONBOARDING_REGIONS,
  PLAYER_ROLES,
  derivePlayerRegionFromInstitutionState,
  getRanksForGame,
  isPlayerRole,
} from "@/lib/onboarding-options";
import type { AccountTier } from "@/lib/account-tier";
import { TIER_LABELS } from "@/lib/account-tier";
import {
  buildOnboardingHref,
  onboardingQueryFromSearchParams,
} from "@/lib/onboarding-path";
import type { InstitutionListItem } from "@/lib/institutions";
import {
  evaluateInstitutionEmailVerification,
  toInstitutionEmailTarget,
} from "@/lib/institution-verification";
import { domainFromEmail, normalizeEmail } from "@/lib/manager-verification";
import { useClientMounted } from "@/hooks/use-client-mounted";
import { SchoolCombobox } from "@/components/onboarding/school-combobox";
import { GameSelect } from "@/components/onboarding/game-select";
import { parseJsonResponse } from "@/lib/safe-json";
import { recordOnboardingCheckpoint } from "@/lib/onboarding-checkpoint-client";
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

function normalizeInstitutionListItem(
  institution: InstitutionListItem,
): InstitutionListItem {
  return {
    ...institution,
    domains: institution.domains ?? [],
  };
}

function needsInstitutionRefresh(institution: InstitutionListItem): boolean {
  return !Array.isArray(institution.domains) || !institution.state;
}

/** US campus emails use a .edu TLD (not country suffixes like .edu.in). */
function isLikelyUsCampusEmail(email: string): boolean {
  const domain = domainFromEmail(normalizeEmail(email));
  if (!domain) return false;
  return /\.edu$/i.test(domain);
}

async function fetchCollegiateInstitution(
  institution: InstitutionListItem,
): Promise<InstitutionListItem> {
  const normalized = normalizeInstitutionListItem(institution);
  try {
    const res = await fetch(`/api/institutions/${institution.id}`);
    if (!res.ok) return normalized;
    const data = await parseJsonResponse<{
      institution?: InstitutionListItem & { domains?: string[] };
    }>(res);
    if (!res.ok || !data) return normalized;
    const inst = data.institution;
    if (!inst) return normalized;
    return normalizeInstitutionListItem({
      ...normalized,
      ...inst,
      domains: inst.domains ?? normalized.domains,
      logoUrl: inst.logoUrl ?? normalized.logoUrl,
    });
  } catch {
    return normalized;
  }
}

export function PlayerOnboardingForm({
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
  const draftKey = onboardingDraftKey("player", tier);
  const [draft, setDraft, draftReady] = useOnboardingDraft(
    draftKey,
    INITIAL_PLAYER_DRAFT,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!error || !errorRef.current) return;
    errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  useEffect(() => {
    if (!draftReady || !isCollegiate || !signInEmail?.trim()) return;
    if (!isLikelyUsCampusEmail(signInEmail)) return;
    setDraft((prev) =>
      prev.schoolEmail.trim()
        ? prev
        : { ...prev, schoolEmail: signInEmail.trim() },
    );
  }, [draftReady, isCollegiate, signInEmail, setDraft]);

  useEffect(() => {
    if (!draftReady || !draft.institution) return;
    if (!needsInstitutionRefresh(draft.institution)) return;

    let cancelled = false;
    void fetchCollegiateInstitution(draft.institution).then((institution) => {
      if (cancelled) return;
      setDraft((prev) =>
        prev.institution?.id === institution.id
          ? { ...prev, institution }
          : prev,
      );
    });

    return () => {
      cancelled = true;
    };
  }, [draftReady, draft.institution, setDraft]);

  useEffect(() => {
    if (!draftReady || !isCollegiate || !draft.institution) return;
    const derived = derivePlayerRegionFromInstitutionState(draft.institution.state);
    if (!derived) return;
    setDraft((prev) => (prev.region ? prev : { ...prev, region: derived }));
  }, [draftReady, isCollegiate, draft.institution, setDraft]);

  const tierBackHref = buildOnboardingHref("/onboarding/player/tier", onboardingQuery);
  const ranksForGame = getRanksForGame(draft.game);

  function patchDraft<K extends keyof PlayerDraft>(key: K, value: PlayerDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function submitProfile(includeInvite: boolean) {
    setError("");
    setLoading(true);

    try {
      if (isCollegiate && !draft.institution) {
        setError("Select your school / university from the list.");
        return;
      }

      if (isCollegiate && !draft.schoolEmail.trim()) {
        setError("School email is required to verify your collegiate affiliation.");
        return;
      }

      let resolvedInstitution = draft.institution;

      if (isCollegiate && draft.institution) {
        resolvedInstitution = needsInstitutionRefresh(draft.institution)
          ? await fetchCollegiateInstitution(draft.institution)
          : normalizeInstitutionListItem(draft.institution);
        const verification = evaluateInstitutionEmailVerification({
          email: draft.schoolEmail,
          institution: toInstitutionEmailTarget(resolvedInstitution),
          signInEmail,
        });
        if (verification.status !== "verified") {
          setError(
            `${verification.reason} If you are not on a U.S. campus team, go back and choose Grassroots instead.`,
          );
          return;
        }
      }

      if (draft.rank && !ranksForGame.includes(draft.rank)) {
        setError("Select a rank that matches your primary game.");
        return;
      }

      if (!isPlayerRole(draft.role)) {
        setError("Select your main in-game role from the list.");
        return;
      }

      const region = draft.region.trim();

      const res = await fetch("/api/onboarding/player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountTier: tier,
          handle: draft.handle,
          game: draft.game,
          role: draft.role,
          rank: draft.rank,
          region,
          institutionId: isCollegiate ? draft.institution?.id : undefined,
          schoolEmail: isCollegiate ? draft.schoolEmail : undefined,
          bio: draft.bio || undefined,
          inviteCode:
            includeInvite && draft.inviteCode.trim()
              ? draft.inviteCode.trim()
              : undefined,
        }),
      });

      const data = await parseJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        setError(data?.error || "Something went wrong.");
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

  const profileReady = Boolean(
    mounted &&
      draftReady &&
      draft.handle.trim() &&
      draft.game &&
      isPlayerRole(draft.role) &&
      draft.rank &&
      (isCollegiate
        ? !!draft.institution && draft.schoolEmail.trim().length > 0
        : true) &&
      !!draft.region,
  );

  const submitDisabled = !mounted || !draftReady || loading || !profileReady;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <OnboardingBackNav href="/onboarding/player/tier" label="Back to account type" />
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

      <div ref={errorRef}>
        <FormError message={error} />
      </div>

      {isCollegiate && (
        <div className="space-y-5 rounded-none border border-[var(--border)] bg-[var(--surface)] p-5">
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              Collegiate student verification
            </p>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Collegiate profiles require a school email. You cannot create a campus
              profile with a personal email alone.
            </p>
          </div>
          <SchoolCombobox
            value={draft.institution}
            onChange={(institution) =>
              patchDraft(
                "institution",
                institution ? normalizeInstitutionListItem(institution) : null,
              )
            }
            hint="Search registered U.S. colleges and universities"
            required
          />
          <FormField
            label="School email"
            required
            hint={
              signInEmail && !isLikelyUsCampusEmail(signInEmail)
                ? "Collegiate verification requires a U.S. campus .edu email for your selected school (your sign-in email cannot be used)."
                : draft.institution?.primaryDomain
                  ? `Must be your official address at ${draft.institution.name} (e.g. you@${draft.institution.primaryDomain})`
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
        <p className="text-sm font-medium text-[var(--foreground)]">
          Competitive profile
        </p>

        <FormField label="In-game handle" hint="How scouts will find you">
          <TextInput
            value={draft.handle}
            onChange={(e) => patchDraft("handle", e.target.value)}
            placeholder="Zylith"
            required
            maxLength={32}
          />
        </FormField>

        <div className="grid gap-6 sm:grid-cols-2 sm:items-start">
          <GameSelect
            value={draft.game}
            onChange={(game) => {
              patchDraft("game", game);
              patchDraft("rank", "");
            }}
            required
          />

          <FormField label="Role" hint="Your main in-game position" required>
            <SelectInput
              value={draft.role}
              onChange={(e) => patchDraft("role", e.target.value)}
              required
            >
              <option value="">Select role</option>
              {PLAYER_ROLES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectInput>
          </FormField>
        </div>

        <div className={`grid gap-6 sm:items-start ${isCollegiate ? "" : "sm:grid-cols-2"}`}>
          <FormField
            label="Rank"
            hint={draft.game ? `Current tier in ${draft.game}` : undefined}
            required
          >
            <SelectInput
              key={draft.game || "no-game"}
              value={draft.rank}
              onChange={(e) => patchDraft("rank", e.target.value)}
              required
              disabled={!mounted || !draft.game}
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
                ? "Teams filter recruits by region — auto-filled from your school when possible"
                : "Grassroots teams filter recruits by region"
            }
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

      <div className="rounded-none border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
        <div>
          <p className="text-sm font-medium text-[var(--foreground)]">
            Join a team now
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
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

      <div className="rounded-none border border-[var(--foreground)] bg-[var(--surface)] p-5">
        <p className="text-sm font-medium text-[var(--foreground)]">
          Not on a team yet?
        </p>
        <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
          {isCollegiate
            ? "Save your profile and appear in your school's campus talent pool. Teams can scout and invite you anytime."
            : `Save your profile and get discovered by ${TIER_LABELS.grassroots.toLowerCase()} teams in your region.`}
        </p>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="mt-4 w-full sm:w-auto"
          disabled={submitDisabled}
          onClick={() => submitProfile(false)}
        >
          {loading ? "Saving profile…" : "Create profile without a team"}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={submitDisabled}>
          {loading
            ? "Saving profile…"
            : draft.inviteCode.trim()
              ? "Save profile & join team"
              : "Save profile & continue"}
        </Button>
        <Link
          href={tierBackHref}
          onClick={async (e) => {
            e.preventDefault();
            try {
              await recordOnboardingCheckpoint(tierBackHref);
            } catch {
              // Continue navigation even if checkpoint sync fails.
            }
            router.push(tierBackHref);
          }}
          className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
        >
          ← Back
        </Link>
      </div>

      <p className="text-center text-sm text-[var(--foreground-muted)]">
        <OnboardingHomeLink className="text-[var(--accent)] hover:text-[var(--accent-strong)]" />
      </p>
    </form>
  );
}
