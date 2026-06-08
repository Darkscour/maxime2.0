import { redirect } from "next/navigation";
import { getOnboardingStatus } from "@/lib/auth-user";
import { PlayerOnboardingForm } from "./player-onboarding-form";

export const dynamic = "force-dynamic";

export default async function PlayerOnboardingPage() {
  const status = await getOnboardingStatus();
  if (status.onboardingComplete && status.hasPlayerProfile) {
    redirect("/dashboard");
  }

  return <PlayerOnboardingForm />;
}
