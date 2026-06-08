import { Hero } from "@/components/home/hero";
import { Logos } from "@/components/home/logos";
import { Features } from "@/components/home/features";
import { HowItWorks } from "@/components/home/how-it-works";
import { RecruitmentPreview } from "@/components/home/recruitment-preview";
import { SponsorshipsPreview } from "@/components/home/sponsorships-preview";
import { Compare } from "@/components/home/compare";
import { FAQ } from "@/components/home/faq";
import { CTA } from "@/components/home/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Logos />
      <HowItWorks />
      <Features />
      <RecruitmentPreview />
      <SponsorshipsPreview />
      <Compare />
      <FAQ />
      <CTA />
    </>
  );
}
