import type { Appearance } from "@clerk/types";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";
import { authContinueSignupPath } from "@/lib/auth-intent";

/** Shared Clerk OAuth settings for sign-in and sign-up. */
export const clerkOAuthFlow = "redirect" as const;

/** Always show the Google account picker (avoids silent re-use of the last account). */
export const clerkOidcPrompt = "select_account" as const;

const clerkSharedAuthProps = {
  appearance: clerkAuthAppearance as Appearance,
  oauthFlow: clerkOAuthFlow,
  oidcPrompt: clerkOidcPrompt,
};

export const clerkSignInPageProps = {
  ...clerkSharedAuthProps,
  path: "/sign-in",
  routing: "path" as const,
  forceRedirectUrl: "/auth/continue?intent=sign-in",
  fallbackRedirectUrl: "/auth/continue?intent=sign-in",
  signUpForceRedirectUrl: "/auth/continue?intent=sign-up",
};

export const clerkSignUpPageProps = {
  ...clerkSharedAuthProps,
  path: "/sign-up",
  routing: "path" as const,
  forceRedirectUrl: authContinueSignupPath(),
  fallbackRedirectUrl: authContinueSignupPath(),
  signInForceRedirectUrl: "/auth/continue?intent=sign-in",
};
