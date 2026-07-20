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
    <AuthPageShell
      kicker="Sign in"
      title="Welcome back"
      description="Sign in to continue to your Maxime workspace."
      alternateHint="No Maxime account yet?"
      alternateHref="/sign-up"
      alternateLabel="Get started"
    >
      <AuthPageGate intent="sign-in" skipSignedInRedirect={allowAuthPage}>
        <SignIn {...clerkSignInPageProps} />
      </AuthPageGate>
    </AuthPageShell>
  );
}
