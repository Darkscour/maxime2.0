import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getOnboardingStatus } from "@/lib/auth-user";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InviteCodeCopy } from "./invite-code-copy";

export const dynamic = "force-dynamic";

export default async function OnboardingDonePage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const params = await searchParams;
  const status = await getOnboardingStatus();

  if (!status.onboardingComplete && !status.hasTeam && !status.hasPlayerProfile) {
    redirect("/onboarding");
  }

  const isCaptain = status.membershipRole === "captain";
  const inviteCode = params.invite || status.team?.inviteCode;

  return (
    <div className="text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
      <h1 className="font-heading mt-4 text-3xl font-semibold text-white sm:text-4xl">
        You&apos;re set up on Maxime
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400">
        {status.accountType === "team_manager"
          ? "Your team profile is saved. Share the invite code below so players can join."
          : status.hasTeam
            ? `You're on ${status.team?.name}. Your player profile is ready for recruitment.`
            : "Your player profile is saved. Join a team anytime with an invite code from your captain."}
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

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/sponsorships" size="lg">
          Open sponsorships
        </Button>
        <Button href="/recruitment" variant="ghost" size="lg">
          Browse recruitment
        </Button>
      </div>

      {!status.hasTeam && status.hasPlayerProfile && (
        <p className="mt-6 text-sm text-zinc-500">
          Have an invite code?{" "}
          <Link href="/onboarding/join" className="text-cyan-400 hover:text-cyan-300">
            Join a team →
          </Link>
        </p>
      )}
    </div>
  );
}
