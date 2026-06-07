import { SignUp } from "@clerk/nextjs";

/**
 * /sign-up route — same styling pattern as sign-in.
 * Clerk handles email verification, OAuth callbacks, and session setup.
 */
export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <SignUp
        forceRedirectUrl="/onboarding"
        appearance={{
          variables: {
            colorPrimary: "#22d3ee",
            colorBackground: "#11141b",
            colorText: "#e6e8ee",
            colorInputBackground: "#0d0f14",
            colorInputText: "#e6e8ee",
            borderRadius: "0.75rem",
          },
          elements: {
            card: "bg-[var(--surface)] border border-white/5 shadow-2xl",
            headerTitle: "text-white",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton:
              "border border-white/10 hover:bg-white/5 text-zinc-100",
            formButtonPrimary:
              "bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-medium",
            footerActionLink: "text-cyan-400 hover:text-cyan-300",
          },
        }}
      />
    </div>
  );
}
