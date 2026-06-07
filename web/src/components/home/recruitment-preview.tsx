import { ArrowRight, Filter, Shield, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { RecruitmentDemoPanel } from "@/components/recruitment/recruitment-demo-panel";

const bullets = [
  {
    icon: Filter,
    title: "Filter by role, rank, and region",
    description:
      "Narrow candidates by game, competitive rank, and availability.",
  },
  {
    icon: Shield,
    title: "AI fit score",
    description:
      "Every profile includes a fit score ranked against your team’s criteria.",
  },
  {
    icon: Users,
    title: "Verified collegiate talent",
    description:
      "Four sample profiles in this preview — the full scout database after sign-in.",
  },
];

export function RecruitmentPreview() {
  return (
    <section
      id="recruitment"
      className="relative border-y border-white/5 py-24 sm:py-32"
    >
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Recruitment
            </p>
            <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Scout players that actually fit your roster
            </h2>
            <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
              Preview four sample profiles — the last card stays blurred until
              you sign in for the full scout directory.
            </p>

            <ul className="mt-8 space-y-5">
              {bullets.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400/30">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-heading text-sm font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Button href="/recruitment" size="lg">
                Open recruitment portal
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <RecruitmentDemoPanel compact previewLimit={4} />
        </div>
      </Container>
    </section>
  );
}
