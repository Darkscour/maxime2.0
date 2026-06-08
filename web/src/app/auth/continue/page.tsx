import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOnboardingStatus } from "@/lib/auth-user";
import { resolvePostAuthPath } from "@/lib/post-auth";

export const dynamic = "force-dynamic";

/** Clerk lands here after sign-in / sign-up; we route to onboarding or dashboard. */
export default async function AuthContinuePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const status = await getOnboardingStatus();
  redirect(resolvePostAuthPath(status));
}
