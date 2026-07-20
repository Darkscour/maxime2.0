import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Barlow_Condensed } from "next/font/google";
import {
  getDashboardContext,
  getExistingUserAccount,
  getMeaningfulUserAccount,
} from "@/lib/auth-user";
import {
  AUTH_INTENT_COOKIE,
  parseSessionAuthIntent,
  pathForUnregisteredSession,
} from "@/lib/auth-intent";
import { deriveOnboardingComplete } from "@/lib/onboarding-complete";
import { resolveIncompleteOnboardingPath } from "@/lib/onboarding-resume";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const meaningful = await getMeaningfulUserAccount();
  if (!meaningful) {
    const existing = await getExistingUserAccount();
    const cookieStore = await cookies();
    const sessionIntent = parseSessionAuthIntent(
      cookieStore.get(AUTH_INTENT_COOKIE)?.value,
    );
    redirect(
      pathForUnregisteredSession({
        sessionIntent,
        hasPlatformShell: !!existing && sessionIntent === "sign-up",
      }),
    );
  }

  const ctx = await getDashboardContext();

  const complete = deriveOnboardingComplete({
    accountType: ctx.accountType,
    onboardingComplete: ctx.onboardingComplete,
    membership: ctx.team
      ? { role: ctx.membershipRole ?? "player", teamId: ctx.team.id }
      : null,
    playerProfile: ctx.playerProfile ? { id: ctx.playerProfile.id } : null,
  });

  if (!complete) {
    redirect(
      resolveIncompleteOnboardingPath({
        accountType: ctx.accountType,
        accountTier: ctx.accountTier,
        onboardingComplete: ctx.onboardingComplete,
        hasTeam: !!ctx.team,
        hasPlayerProfile: !!ctx.playerProfile,
        membershipRole: ctx.membershipRole,
        teamId: ctx.team?.id,
        playerProfileId: ctx.playerProfile?.id,
      }),
    );
  }

  return (
    <DashboardShell
      accountType={ctx.accountType}
      accountTier={ctx.accountTier}
      teamName={ctx.team?.name}
      className={barlowCondensed.variable}
    >
      {children}
    </DashboardShell>
  );
}
