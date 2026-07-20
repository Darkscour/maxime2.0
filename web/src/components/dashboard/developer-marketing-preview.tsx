import { Badge } from "@/components/ui/badge";
import { PlatformFeatures } from "@/components/home/solution-features-panel";
import { RecruitmentPreview } from "@/components/home/recruitment-preview";
import { SponsorshipsPreview } from "@/components/home/sponsorships-preview";

/** Marketing sections from the public homepage — visible only to the developer account. */
export function DeveloperMarketingPreview() {
  return (
    <div className="space-y-4 border-b border-dashed border-amber-400/20 pb-12">
      <div className="rounded-none border border-amber-400/20 bg-amber-400/[0.05] px-4 py-3 sm:px-5">
        <Badge tone="amber" className="mb-2">
          Developer preview
        </Badge>
        <p className="text-sm text-[var(--foreground-muted)]">
          Visitor-facing homepage sections below — only you see this on the dashboard.
          Set <code className="text-[var(--foreground-muted)]">DEVELOPER_EMAIL</code> in{" "}
          <code className="text-[var(--foreground-muted)]">.env</code> to match your sign-in email.
        </p>
      </div>
      <RecruitmentPreview />
      <SponsorshipsPreview />
      <PlatformFeatures />
    </div>
  );
}
