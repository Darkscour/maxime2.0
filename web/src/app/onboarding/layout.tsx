import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/onboarding");

  return (
    <div className="border-b border-white/5 bg-spotlight py-12 sm:py-16">
      <Container className="max-w-2xl">{children}</Container>
    </div>
  );
}
