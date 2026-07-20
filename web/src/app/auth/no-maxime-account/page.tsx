import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AlertCircle, ArrowRight } from "lucide-react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { AuthSignOutLink } from "@/components/auth/auth-sign-out-link";
import { DbUnavailableRecovery } from "@/components/auth/db-unavailable-recovery";
import { SignOutToSignInButton } from "@/components/auth/sign-out-to-sign-in-button";
import { Button } from "@/components/ui/button";
import { authContinueSignupPath } from "@/lib/auth-intent";
import { getMeaningfulUserAccount } from "@/lib/auth-user";
import { isTransientDbError } from "@/lib/db-retry";

export const dynamic = "force-dynamic";

/** Shown only when a user signs in with an email that has no Maxime profile. */
export default async function NoMaximeAccountPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  let meaningful = null;
  let dbUnavailable = false;
  try {
    meaningful = await getMeaningfulUserAccount();
  } catch (error) {
    if (isTransientDbError(error)) {
      dbUnavailable = true;
    }
    console.error("[no-maxime-account] could not load account", error);
  }
  if (meaningful) {
    redirect("/auth/continue?intent=sign-in");
  }

  if (dbUnavailable) {
    return (
      <AuthPageShell kicker="Account">
        <DbUnavailableRecovery retryHref="/auth/continue?intent=sign-in" />
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell
      kicker="Account"
      title="No Maxime account yet"
      description="You're signed in, but this email doesn't have a Maxime profile. Sign in only works for existing accounts — use sign up to register on Maxime first."
    >
      <div className="text-center">
        <span className="oc-mark mx-auto">
          <AlertCircle className="h-5 w-5" />
        </span>
        <div className="mt-8 flex flex-col gap-3">
          <Button href={authContinueSignupPath()} size="lg" className="w-full gap-2">
            Create Maxime account
            <ArrowRight className="h-4 w-4" />
          </Button>
          <SignOutToSignInButton />
        </div>
        <p className="mt-6 text-xs text-[var(--foreground-muted)]">
          Wrong email?{" "}
          <AuthSignOutLink
            redirectUrl="/sign-in"
            className="text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
          >
            Sign out
          </AuthSignOutLink>{" "}
          and try again, or{" "}
          <Link
            href="/?browse=1"
            className="text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
          >
            return home
          </Link>
          .
        </p>
      </div>
    </AuthPageShell>
  );
}
