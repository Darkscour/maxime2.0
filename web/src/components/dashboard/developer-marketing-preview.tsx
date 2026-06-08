import { Badge } from "@/components/ui/badge";
import { Features } from "@/components/home/features";
import { RecruitmentPreview } from "@/components/home/recruitment-preview";
import { SponsorshipsPreview } from "@/components/home/sponsorships-preview";

/** Marketing sections from the public homepage — visible only to the developer account. */
export function DeveloperMarketingPreview() {
  return (
    <div className="space-y-4 border-b border-dashed border-amber-400/20 pb-12">
      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] px-4 py-3 sm:px-5">
        <Badge tone="amber" className="mb-2">
          Developer preview
        </Badge>
        <p className="text-sm text-zinc-400">
          Visitor-facing homepage sections below — only you see this on the dashboard.
          Set <code className="text-zinc-300">DEVELOPER_EMAIL</code> in{" "}
          <code className="text-zinc-300">.env</code> to match your sign-in email.
        </p>
      </div>
      <RecruitmentPreview />
      <SponsorshipsPreview />
      <Features />
    </div>
  );
}
