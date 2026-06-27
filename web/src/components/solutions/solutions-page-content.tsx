import Link from "next/link";
import { ArrowRight, GraduationCap, Users } from "lucide-react";
import type { SolutionContent } from "@/lib/solutions-content";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SolutionsPageContent({ content }: { content: SolutionContent }) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/5 bg-spotlight">
        <div className="bg-grid bg-grid-fade absolute inset-0" aria-hidden />
        <Container className="relative py-16 sm:py-20">
          <Badge tone={content.audience === "collegiate" ? "cyan" : "violet"}>
            {content.audience === "collegiate" ? (
              <GraduationCap className="h-3.5 w-3.5" />
            ) : (
              <Users className="h-3.5 w-3.5" />
            )}
            {content.heroBadge}
          </Badge>
          <h1 className="font-heading mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {content.heroTitle}{" "}
            <span className="text-gradient">{content.heroHighlight}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            {content.heroDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/sign-up" size="lg">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              href={content.audience === "collegiate" ? "/solutions/grassroots" : "/solutions/collegiate"}
              variant="outline"
              size="lg"
            >
              Compare with{" "}
              {content.audience === "collegiate" ? "grassroots" : "collegiate"}
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SolutionAudienceBlock
            eyebrow="Managers"
            heading={content.managerHeading}
            intro={content.managerIntro}
            features={content.managerFeatures}
          />
        </Container>
      </section>

      <section className="border-y border-white/5 bg-[var(--background-elevated)]/30 py-20 sm:py-24">
        <Container>
          <SolutionAudienceBlock
            eyebrow="Players"
            heading={content.playerHeading}
            intro={content.playerIntro}
            features={content.playerFeatures}
          />
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/5 bg-[var(--surface)] p-8 text-center sm:p-12">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {content.ctaTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {content.ctaDescription}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button href="/sign-up" size="lg">
                Create your account
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link
                href="/#recruitment"
                className="text-sm text-zinc-400 hover:text-white"
              >
                Preview recruitment →
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function SolutionAudienceBlock({
  eyebrow,
  heading,
  intro,
  features,
}: {
  eyebrow: string;
  heading: string;
  intro: string;
  features: SolutionContent["managerFeatures"];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
        {eyebrow}
      </p>
      <h2 className="font-heading mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {heading}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">{intro}</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          const tone = feature.tone ?? "cyan";
          const iconClass =
            tone === "cyan" ? "text-cyan-400" : "text-violet-400";

          return (
            <article
              key={feature.title}
              className="rounded-xl border border-white/5 bg-[var(--surface)] p-6 transition-colors hover:border-cyan-400/20"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-inset ring-white/10">
                <Icon className={`h-4 w-4 ${iconClass}`} />
              </span>
              <h3 className="font-heading mt-4 text-base font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {feature.description}
              </p>
              {feature.href ? (
                <Link
                  href={feature.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300"
                >
                  Preview feature
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
