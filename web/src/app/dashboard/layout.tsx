import { redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/auth-user";
import { deriveOnboardingComplete } from "@/lib/onboarding-complete";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    redirect("/onboarding");
  }

  return (
    <DashboardShell accountType={ctx.accountType} accountTier={ctx.accountTier}>
      {children}
    </DashboardShell>
  );
}
