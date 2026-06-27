import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DemoRecruitmentDirectory } from "@/components/recruitment/demo-recruitment-directory";
import { MarketingFeaturePreviewShell } from "@/components/home/marketing-feature-preview-shell";

export function RecruitmentPreview() {
  return (
    <section
      id="recruitment"
      className="relative border-y border-white/5 py-24 sm:py-32"
    >
      <Container>
        <MarketingFeaturePreviewShell
          eyebrow="Recruitment"
          eyebrowAccent="violet"
          title="Player profiles"
          description="Managers browse verified players, filter by game and rank, save prospects to a watchlist, and send roster invites. Players build a discoverable profile and respond to team offers from their dashboard."
          previewNote="Sample players — sign in for the live scout directory"
        >
          <DemoRecruitmentDirectory />
        </MarketingFeaturePreviewShell>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button href="/recruitment" size="lg">
            Open recruitment portal
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-sm text-zinc-500">
            Same layout as your dashboard scout view — preview data only.
          </p>
        </div>
      </Container>
    </section>
  );
}
