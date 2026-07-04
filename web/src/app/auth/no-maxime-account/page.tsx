import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { MaximeLogo } from "@/components/brand/maxime-logo";
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
      <AuthPageShell>
        <DbUnavailableRecovery retryHref="/auth/continue?intent=sign-in" />
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell>
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[var(--surface)]/90 p-8 text-center shadow-2xl shadow-black/20">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.03] ring-1 ring-inset ring-white/10">
          <MaximeLogo variant="mark" size="md" href={null} className="h-9 w-9" />
        </span>
        <h1 className="font-heading mt-5 text-2xl font-semibold text-white">
          No Maxime account yet
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-400">
          You&apos;re signed in, but this email doesn&apos;t have a Maxime profile.
          Sign in only works for existing accounts — use sign up to register on
          Maxime first.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button href={authContinueSignupPath()} size="lg" className="w-full gap-2">
            Create Maxime account
            <ArrowRight className="h-4 w-4" />
          </Button>
          <SignOutToSignInButton />
        </div>
        <p className="mt-6 text-xs text-zinc-500">
          Wrong email?{" "}
          <AuthSignOutLink
            redirectUrl="/sign-in"
            className="text-cyan-400 transition-colors hover:text-cyan-300"
          >
            Sign out
          </AuthSignOutLink>{" "}
          and try again, or{" "}
          <Link
            href="/?browse=1"
            className="text-cyan-400 transition-colors hover:text-cyan-300"
          >
            return home
          </Link>
          .
        </p>
      </div>
    </AuthPageShell>
  );
}
