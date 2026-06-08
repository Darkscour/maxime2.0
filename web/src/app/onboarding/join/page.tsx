import { redirect } from "next/navigation";
import { getOnboardingStatus } from "@/lib/auth-user";
import { JoinTeamForm } from "./join-team-form";

export const dynamic = "force-dynamic";

export default async function JoinTeamPage() {
  const status = await getOnboardingStatus();

  if (!status.hasPlayerProfile) {
    redirect("/onboarding/player");
  }

  if (status.hasTeam) {
    redirect("/dashboard");
  }

  return <JoinTeamForm />;
}
