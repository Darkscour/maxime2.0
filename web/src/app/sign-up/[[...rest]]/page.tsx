import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AuthCredentialPage } from "@/components/auth/auth-credential-page";
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
    <AuthCredentialPage intent="sign-up" skipSignedInRedirect={allowAuthPage} />
  );
}
