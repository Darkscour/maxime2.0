import { redirect } from "next/navigation";
import { getOnboardingStatus } from "@/lib/auth-user";
import { TeamOnboardingForm } from "./team-onboarding-form";

export const dynamic = "force-dynamic";

export default async function TeamOnboardingPage() {
  const status = await getOnboardingStatus();
  if (status.onboardingComplete && status.hasTeam) {
    redirect("/onboarding/done");
  }

  return <TeamOnboardingForm />;
}
