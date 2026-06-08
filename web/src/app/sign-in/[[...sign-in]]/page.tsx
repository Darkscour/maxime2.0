import { SignIn } from "@clerk/nextjs";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";

/**
 * /sign-in route — Clerk's hosted sign-in component, themed to match the
 * dark esports look. The `[[...sign-in]]` folder name (catch-all) is what
 * Clerk expects so it can handle multi-step flows like email verification.
 */
export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <SignIn
        forceRedirectUrl="/auth/continue?intent=sign-in"
        signUpForceRedirectUrl="/auth/continue?intent=sign-up"
        appearance={clerkAuthAppearance}
        oauthFlow="redirect"
      />
    </div>
  );
}
