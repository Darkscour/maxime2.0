import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, UserRound } from "lucide-react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { AuthSignOutLink } from "@/components/auth/auth-sign-out-link";
import { SignOutToSignInButton } from "@/components/auth/sign-out-to-sign-in-button";
import { Button } from "@/components/ui/button";
import {
  AUTH_INTENT_COOKIE,
  authContinueSignupPath,
  parseSessionAuthIntent,
  pathForUnregisteredSession,
} from "@/lib/auth-intent";
import {
  getExistingUserAccount,
  getMeaningfulUserAccount,
} from "@/lib/auth-user";

export const dynamic = "force-dynamic";

/** Shown only when a user signs in with an email that has no Maxime profile. */
export default async function NoMaximeAccountPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const meaningful = await getMeaningfulUserAccount();
  if (meaningful) {
    redirect("/auth/continue?intent=sign-in");
  }

  const cookieStore = await cookies();
  const sessionIntent = parseSessionAuthIntent(
    cookieStore.get(AUTH_INTENT_COOKIE)?.value,
  );
  const existing = await getExistingUserAccount();

  // Sign-up flows and in-progress registrations never see this page.
  if (sessionIntent === "sign-up" || existing) {
    redirect(
      pathForUnregisteredSession({
        sessionIntent,
        hasPlatformShell: !!existing,
      }),
    );
  }

  return (
    <AuthPageShell>
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[var(--surface)]/90 p-8 text-center shadow-2xl shadow-black/20">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 ring-1 ring-inset ring-amber-400/25">
          <UserRound className="h-7 w-7 text-amber-300" />
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
