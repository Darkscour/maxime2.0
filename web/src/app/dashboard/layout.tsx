import { redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/auth-user";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getDashboardContext();

  if (!ctx.onboardingComplete) {
    redirect("/onboarding");
  }

  return (
    <DashboardShell accountType={ctx.accountType}>{children}</DashboardShell>
  );
}
