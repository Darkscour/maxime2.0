import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { OnboardingProgressBar } from "@/components/onboarding/onboarding-progress-bar";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/onboarding");

  return (
    <div className="flex min-h-[calc(100vh-0px)] flex-1 flex-col border-b border-white/5 bg-spotlight py-10 sm:py-14">
      <Container className="max-w-2xl">
        <OnboardingProgressBar />
        {children}
      </Container>
    </div>
  );
}
