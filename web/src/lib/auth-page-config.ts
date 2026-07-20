import type { AuthIntent } from "@/lib/auth-intent";

export const AUTH_TABS: ReadonlyArray<{
  intent: AuthIntent;
  label: string;
  href: string;
}> = [
  { intent: "sign-in", label: "Sign in", href: "/sign-in" },
  { intent: "sign-up", label: "Create account", href: "/sign-up" },
];

export const AUTH_PAGE_DESCRIPTION: Record<AuthIntent, string> = {
  "sign-in": "Use the email you registered with.",
  "sign-up": "Set up a team or player profile right after.",
};

export const AUTH_PAGE_TITLE: Record<AuthIntent, string> = {
  "sign-in": "Sign in",
  "sign-up": "Create account",
};
