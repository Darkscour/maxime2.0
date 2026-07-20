import Link from "next/link";
import { Building2, UserRound } from "lucide-react";
import {
  enforceOnboardingRoute,
  isOnboardingTestMode,
} from "@/lib/onboarding-guards";
import { buildOnboardingHref } from "@/lib/onboarding-path";
import { OnboardingHomeLink } from "@/components/onboarding/onboarding-home-link";
import { StepHeader } from "@/components/onboarding/form-fields";

export const dynamic = "force-dynamic";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ test?: string }>;
}) {
  const params = await searchParams;
  const testMode = isOnboardingTestMode(params);
  await enforceOnboardingRoute("/onboarding", {
    testMode,
  });

  const teamHref = buildOnboardingHref("/onboarding/team/tier", { test: testMode });
  const playerHref = buildOnboardingHref("/onboarding/player/tier", { test: testMode });

  return (
    <div>
      <StepHeader
        step="Onboarding"
        title="How are you joining Maxime?"
        subtitle="Team managers set up an org profile and get an invite code for players. Players create a scout profile and join a team with that code."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <RoleCard
          href={teamHref}
          icon={Building2}
          title="I'm managing a team"
          description="Create your org profile — games, region, roster size — and share an invite code with players."
        />
        <RoleCard
          href={playerHref}
          icon={UserRound}
          title="I'm a player"
          description="Build your player profile and join a team with an invite code from your captain."
        />
      </div>

      <p className="mt-8 text-center text-sm text-[var(--foreground-muted)]">
        Not ready to finish?{" "}
        <OnboardingHomeLink className="text-[var(--accent)] hover:text-[var(--accent-strong)]" />
      </p>
    </div>
  );
}

function RoleCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col border border-[var(--foreground)] bg-[var(--surface)] p-6 transition-colors hover:bg-[var(--background)]"
    >
      <span className="oc-mark">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="font-heading mt-4 text-lg font-medium tracking-tight text-[var(--foreground)]">
        {title}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-[var(--foreground-muted)]">
        {description}
      </p>
      <span className="mt-4 text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent)]">
        Continue →
      </span>
    </Link>
  );
}
