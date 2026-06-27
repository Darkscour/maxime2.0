import { Hero } from "@/components/home/hero";
import { Logos } from "@/components/home/logos";
import { HowItWorks } from "@/components/home/how-it-works";
import { SolutionsPreview } from "@/components/home/solutions-preview";
import { PlatformFeatures } from "@/components/home/solution-features-panel";
import { Compare } from "@/components/home/compare";
import { FAQ } from "@/components/home/faq";
import { CTA } from "@/components/home/cta";

export function HomePageContent() {
  return (
    <>
      <Hero />
      <Logos />
      <HowItWorks />
      <SolutionsPreview />
      <PlatformFeatures />
      <Compare />
      <FAQ />
      <CTA />
    </>
  );
}
