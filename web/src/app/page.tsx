import { Hero } from "@/components/home/hero";
import { Logos } from "@/components/home/logos";
import { Features } from "@/components/home/features";
import { HowItWorks } from "@/components/home/how-it-works";
import { RecruitmentPreview } from "@/components/home/recruitment-preview";
import { SponsorshipsPreview } from "@/components/home/sponsorships-preview";
import { TestDisplayData } from "@/components/home/test-display-data";
import { Compare } from "@/components/home/compare";
import { FAQ } from "@/components/home/faq";
import { CTA } from "@/components/home/cta";
import { fetchSponsorsForDisplay } from "@/lib/fetch-sponsors";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dbResult = await fetchSponsorsForDisplay();

  return (
    <>
      <Hero />
      <Logos />
      <HowItWorks />
      <Features />
      <RecruitmentPreview />
      <SponsorshipsPreview dbResult={dbResult} />
      <TestDisplayData dbResult={dbResult} />
      <Compare />
      <FAQ />
      <CTA />
    </>
  );
}
