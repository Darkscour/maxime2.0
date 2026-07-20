import { SignIn, SignUp } from "@clerk/nextjs";
import { AuthClerkInputTuning } from "@/components/auth/auth-clerk-input-tuning";
import { AuthPageGate } from "@/components/auth/auth-page-gate";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import type { AuthIntent } from "@/lib/auth-intent";
import { clerkSignInPageProps, clerkSignUpPageProps } from "@/lib/clerk-auth-pages";

export function AuthCredentialPage({
  intent,
  skipSignedInRedirect = false,
}: {
  intent: AuthIntent;
  skipSignedInRedirect?: boolean;
}) {
  return (
    <AuthPageShell intent={intent}>
      <AuthPageGate intent={intent} skipSignedInRedirect={skipSignedInRedirect}>
        <AuthClerkInputTuning intent={intent}>
          {intent === "sign-in" ? (
            <SignIn {...clerkSignInPageProps} />
          ) : (
            <SignUp {...clerkSignUpPageProps} />
          )}
        </AuthClerkInputTuning>
      </AuthPageGate>
    </AuthPageShell>
  );
}
