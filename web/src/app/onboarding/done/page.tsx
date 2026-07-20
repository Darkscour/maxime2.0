import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutDashboard } from "lucide-react";
import {
  enforceOnboardingRoute,
  isOnboardingTestMode,
} from "@/lib/onboarding-guards";
import { buildOnboardingHref } from "@/lib/onboarding-path";
import { isAccountTier } from "@/lib/account-tier";
import type { AccountTier } from "@/lib/account-tier";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InviteCodeCopy } from "./invite-code-copy";
import { OnboardingBackNav } from "@/components/onboarding/onboarding-back-nav";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function OnboardingDonePage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string; test?: string; tier?: string }>;
}) {
  const params = await searchParams;
  const testMode = isOnboardingTestMode(params);
  const status = await enforceOnboardingRoute("/onboarding/done", {
    testMode,
  });

  const tierRaw =
    (isAccountTier(params.tier) ? params.tier : null) ??
    (isAccountTier(status.accountTier ?? undefined) ? status.accountTier : null) ??
    (isAccountTier(status.team?.accountTier ?? undefined)
      ? status.team!.accountTier
      : null) ??
    (isAccountTier(status.playerProfile?.accountTier ?? undefined)
      ? status.playerProfile!.accountTier
      : null);
  const tier: AccountTier | undefined = isAccountTier(tierRaw ?? undefined)
    ? (tierRaw as AccountTier)
    : undefined;

  const isCaptain = status.membershipRole === "captain";
  const inviteCode = params.invite || status.team?.inviteCode;
  const profileBackHref =
    status.accountType === "team_manager"
      ? buildOnboardingHref("/onboarding/team", { test: testMode, tier })
      : buildOnboardingHref("/onboarding/player", { test: testMode, tier });

  return (
    <div className="text-center">
      <Suspense fallback={null}>
        <div className="mb-2 text-left">
          <OnboardingBackNav
            href={profileBackHref}
            label="Back to profile"
            revise
          />
        </div>
      </Suspense>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-none bg-[color-mix(in_srgb,var(--success)_12%,transparent)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--success)_28%,transparent)]">
        <CheckCircle2 className="h-7 w-7 text-[var(--success)]" />
      </div>
      <h1 className="font-heading mt-5 text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
        You&apos;re set up on Maxime!
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--foreground-muted)]">
        {status.accountType === "team_manager"
          ? "Your team profile is saved. Head to your dashboard to explore sponsorships, recruitment, and org tools."
          : status.hasTeam
            ? `You're on ${status.team?.name}. Your player profile is ready — your dashboard has everything in one place.`
            : "Your player profile is saved. Open your dashboard to explore the platform, or join a team with an invite code."}
      </p>

      <div className="mx-auto mt-8 max-w-md rounded-none border border-[var(--foreground)] bg-[var(--surface)] p-6 text-left">
        {status.team && (
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
              Team
            </p>
            <p className="font-heading mt-1 text-lg font-semibold text-[var(--foreground)]">
              {status.team.name}
            </p>
            {status.team.school && (
              <p className="text-sm text-[var(--foreground-muted)]">
                {status.team.school}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {status.team.games.map((g) => (
                <Badge key={g} tone="cyan">
                  {g}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {status.playerProfile && (
          <div className={status.team ? "border-t border-[var(--border)] pt-4" : ""}>
            <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
              Player profile
            </p>
            <p className="font-heading mt-1 text-lg font-semibold text-[var(--foreground)]">
              {status.playerProfile.handle}
            </p>
            <p className="text-sm text-[var(--foreground-muted)]">
              {status.playerProfile.game} · {status.playerProfile.role} ·{" "}
              {status.playerProfile.rank}
            </p>
            {status.playerProfile.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {status.playerProfile.tags.map((t) => (
                  <Badge key={t} tone="violet">
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {isCaptain && inviteCode && (
          <div className="mt-4 border-t border-[var(--border)] pt-4">
            <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
              Player invite code
            </p>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Players paste this during onboarding to join your team.
            </p>
            <InviteCodeCopy code={inviteCode} />
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button href="/dashboard" size="lg" className="min-w-[220px] gap-2">
          <LayoutDashboard className="h-4 w-4" />
          Go to dashboard
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button href="/sponsorships" variant="outline" size="lg">
          Browse sponsorships
        </Button>
      </div>

      {!status.hasTeam && status.hasPlayerProfile && (
        <p className="mt-6 text-sm text-[var(--foreground-muted)]">
          Have an invite code?{" "}
          <Link
            href={buildOnboardingHref("/onboarding/join", { test: testMode })}
            className="text-[var(--accent)] hover:text-[var(--accent-strong)]"
          >
            Join a team →
          </Link>
        </p>
      )}
    </div>
  );
}
