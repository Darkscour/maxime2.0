import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutDashboard } from "lucide-react";
import {
  enforceOnboardingRoute,
  isOnboardingTestMode,
} from "@/lib/onboarding-guards";
import { buildOnboardingHref } from "@/lib/onboarding-path";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InviteCodeCopy } from "./invite-code-copy";
import { OnboardingBackNav } from "@/components/onboarding/onboarding-back-nav";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function OnboardingDonePage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string; test?: string }>;
}) {
  const params = await searchParams;
  const testMode = isOnboardingTestMode(params);
  const status = await enforceOnboardingRoute("/onboarding/done", {
    testMode,
  });

  const isCaptain = status.membershipRole === "captain";
  const inviteCode = params.invite || status.team?.inviteCode;
  const profileBackHref =
    status.accountType === "team_manager"
      ? "/onboarding/team"
      : "/onboarding/player";

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
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 ring-1 ring-inset ring-emerald-400/25">
        <CheckCircle2 className="h-7 w-7 text-emerald-400" />
      </div>
      <h1 className="font-heading mt-5 text-3xl font-semibold text-white sm:text-4xl">
        You&apos;re set up on Maxime!
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400">
        {status.accountType === "team_manager"
          ? "Your team profile is saved. Head to your dashboard to explore sponsorships, recruitment, and org tools."
          : status.hasTeam
            ? `You're on ${status.team?.name}. Your player profile is ready — your dashboard has everything in one place.`
            : "Your player profile is saved. Open your dashboard to explore the platform, or join a team with an invite code."}
      </p>

      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/5 bg-[var(--surface)] p-6 text-left">
        {status.team && (
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wider text-zinc-500">Team</p>
            <p className="font-heading mt-1 text-lg font-semibold text-white">
              {status.team.name}
            </p>
            {status.team.school && (
              <p className="text-sm text-zinc-400">{status.team.school}</p>
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
          <div className={status.team ? "border-t border-white/5 pt-4" : ""}>
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Player profile
            </p>
            <p className="font-heading mt-1 text-lg font-semibold text-white">
              {status.playerProfile.handle}
            </p>
            <p className="text-sm text-zinc-400">
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
          <div className="mt-4 border-t border-white/5 pt-4">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Player invite code
            </p>
            <p className="mt-1 text-sm text-zinc-400">
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
        <p className="mt-6 text-sm text-zinc-500">
          Have an invite code?{" "}
          <Link
            href={buildOnboardingHref("/onboarding/join", { test: testMode })}
            className="text-cyan-400 hover:text-cyan-300"
          >
            Join a team →
          </Link>
        </p>
      )}
    </div>
  );
}
