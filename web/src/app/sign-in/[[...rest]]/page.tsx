import { SignIn } from "@clerk/nextjs";
import { AuthPageGate } from "@/components/auth/auth-page-gate";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { clerkSignInPageProps } from "@/lib/clerk-auth-pages";
import { hasAuthPageAllow } from "@/lib/auth-intent";

/**
 * Catch-all at /sign-in/[[...rest]] — required by Clerk for OAuth sub-routes.
 */
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ allow?: string }>;
}) {
  const params = await searchParams;
  const allowAuthPage = hasAuthPageAllow(params);

  return (
    <AuthPageShell>
      <AuthPageGate intent="sign-in" skipSignedInRedirect={allowAuthPage}>
        <SignIn {...clerkSignInPageProps} />
      </AuthPageGate>
    </AuthPageShell>
  );
}
