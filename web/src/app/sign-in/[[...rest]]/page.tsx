import { AuthCredentialPage } from "@/components/auth/auth-credential-page";
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
    <AuthCredentialPage intent="sign-in" skipSignedInRedirect={allowAuthPage} />
  );
}
