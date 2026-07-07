import { Suspense } from "react";
import { HeroV2 } from "@/components/home-v2/hero-v2";
import { ImpactBand } from "@/components/home-v2/impact-band";
import { Logos } from "@/components/home/logos";
import { SolutionsPreview } from "@/components/home/solutions-preview";
import { PlatformFeatures } from "@/components/home/solution-features-panel";
import { HowItWorks } from "@/components/home/how-it-works";
import { Compare } from "@/components/home/compare";
import { FAQ } from "@/components/home/faq";
import { CTA } from "@/components/home/cta";

export function HomeV2Content() {
  return (
    <>
      <HeroV2 />
      <Logos />
      <Suspense fallback={null}>
        <SolutionsPreview />
      </Suspense>
      <PlatformFeatures />
      <HowItWorks />
      <ImpactBand />
      <Compare />
      <FAQ />
      <CTA />
    </>
  );
}
