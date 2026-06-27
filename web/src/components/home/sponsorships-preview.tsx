import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DemoSponsorshipDirectory } from "@/components/sponsorships/demo-sponsorship-directory";
import { MarketingFeaturePreviewShell } from "@/components/home/marketing-feature-preview-shell";

export function SponsorshipsPreview() {
  return (
    <section
      id="sponsorships"
      className="relative border-y border-white/5 bg-[var(--background-elevated)]/30 py-24 sm:py-32"
    >
      <Container>
        <MarketingFeaturePreviewShell
          eyebrow="Partnerships"
          eyebrowAccent="emerald"
          title="Sponsor directory"
          description="Collegiate managers filter brands by industry and difficulty, review typical deal sizes and regions, and track outreach through a lead pipeline. Grassroots orgs focus on recruitment and roster tools."
          previewNote="Sample sponsors — reputable brands for preview only"
        >
          <DemoSponsorshipDirectory />
        </MarketingFeaturePreviewShell>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button href="/sponsorships" size="lg">
            Open sponsorship portal
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-sm text-zinc-500">
            Matches your dashboard sponsor directory — placeholder data on the marketing site.
          </p>
        </div>
      </Container>
    </section>
  );
}
