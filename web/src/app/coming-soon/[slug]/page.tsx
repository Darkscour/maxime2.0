import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MaximeLogo } from "@/components/brand/maxime-logo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getComingSoonPage } from "@/lib/coming-soon-pages";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getComingSoonPage(slug);
  if (!page) return { title: "Maxime" };
  return {
    title: `${page.title} — Maxime`,
    description: page.description,
  };
}

export default async function ComingSoonPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getComingSoonPage(slug);
  if (!page) notFound();

  return (
    <section className="relative flex flex-1 items-center overflow-hidden bg-spotlight py-16 sm:py-20">
      <div className="bg-grid bg-grid-fade absolute inset-0" aria-hidden />
      <Container className="relative">
        <div className="mx-auto max-w-xl text-center">
          <MaximeLogo size="lg" className="mx-auto" />
          <h1 className="font-heading mt-8 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {page.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--foreground-muted)]">{page.description}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/" variant="primary" size="lg">
              Back to homepage
            </Button>
            <Button href="/sign-up" variant="outline" size="lg">
              Get started
            </Button>
          </div>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Return home
          </Link>
        </div>
      </Container>
    </section>
  );
}
