import { Suspense } from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { SignUpGate } from "@/components/auth/sign-up-gate";
import { SignUpPanel } from "@/components/auth/sign-up-panel";

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ "sign-up"?: string[] }>;
}) {
  const resolved = await params;
  const segments = resolved["sign-up"] ?? [];
  const isOAuthCallback = segments.includes("sso-callback");

  if (isOAuthCallback) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <AuthenticateWithRedirectCallback
          signInForceRedirectUrl="/auth/continue?intent=sign-in"
          signUpForceRedirectUrl="/auth/continue?intent=sign-up"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="text-sm text-zinc-500">Loading sign up…</div>
        }
      >
        <SignUpGate>
          <SignUpPanel />
        </SignUpGate>
      </Suspense>
    </div>
  );
}
