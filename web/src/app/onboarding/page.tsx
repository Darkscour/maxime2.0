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

  const teamHref = buildOnboardingHref("/onboarding/team", { test: testMode });
  const playerHref = buildOnboardingHref("/onboarding/player", { test: testMode });

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
          tone="cyan"
        />
        <RoleCard
          href={playerHref}
          icon={UserRound}
          title="I'm a player"
          description="Build your player profile and join a team with an invite code from your captain."
          tone="violet"
        />
      </div>

      <p className="mt-8 text-center text-sm text-zinc-500">
        Not ready to finish?{" "}
        <OnboardingHomeLink className="text-cyan-400 hover:text-cyan-300" />
      </p>
    </div>
  );
}

function RoleCard({
  href,
  icon: Icon,
  title,
  description,
  tone,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  tone: "cyan" | "violet";
}) {
  const ring =
    tone === "cyan"
      ? "hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]"
      : "hover:border-violet-400/30 hover:bg-violet-400/[0.04]";
  const iconColor = tone === "cyan" ? "text-cyan-400" : "text-violet-400";

  return (
    <Link
      href={href}
      className={`group flex flex-col rounded-2xl border border-white/5 bg-[var(--surface)] p-6 transition-colors ${ring}`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-inset ring-white/10">
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </span>
      <h2 className="font-heading mt-4 text-lg font-semibold text-white group-hover:text-white">
        {title}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-zinc-400">{description}</p>
      <span className="mt-4 text-sm font-medium text-zinc-300 group-hover:text-white">
        Continue →
      </span>
    </Link>
  );
}
