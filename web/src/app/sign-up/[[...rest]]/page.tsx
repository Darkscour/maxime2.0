import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { AuthPageGate } from "@/components/auth/auth-page-gate";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { clerkSignUpPageProps } from "@/lib/clerk-auth-pages";
import {
  authContinuePath,
  authContinueSignupPath,
  hasAuthPageAllow,
} from "@/lib/auth-intent";
import { getMeaningfulUserAccount } from "@/lib/auth-user";

/**
 * Catch-all at /sign-up/[[...rest]] — same OAuth redirect flow as /sign-in.
 */
export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ allow?: string }>;
}) {
  const params = await searchParams;
  const allowAuthPage = hasAuthPageAllow(params);
  const { userId } = await auth();

  if (userId && allowAuthPage) {
    const meaningful = await getMeaningfulUserAccount();
    if (!meaningful) {
      redirect(authContinueSignupPath());
    }
    redirect(authContinuePath("sign-up"));
  }

  return (
    <AuthPageShell>
      <AuthPageGate intent="sign-up" skipSignedInRedirect={allowAuthPage}>
        <SignUp {...clerkSignUpPageProps} />
      </AuthPageGate>
    </AuthPageShell>
  );
}
