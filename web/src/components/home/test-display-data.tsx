import { FlaskConical } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { SponsorFetchResult } from "@/lib/fetch-sponsors";
import { SponsorDbValidation } from "./sponsor-db-validation";

export function TestDisplayData({ dbResult }: { dbResult: SponsorFetchResult }) {
  return (
    <section
      id="test-display-data"
      className="relative border-y border-[var(--border)] bg-[var(--surface)] py-24 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            <FlaskConical className="h-3.5 w-3.5" />
            Test display data
          </p>
          <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Live Supabase sponsor rows
          </h2>
          <p className="mt-5 text-base leading-7 text-[var(--foreground-muted)] sm:text-lg">
            Internal dev section — confirms your database connection and shows
            every imported sponsor with an AI assistant on each card. This is
            not shown to visitors in the public sponsorship demo.
          </p>
        </div>

        <SponsorDbValidation result={dbResult} />
      </Container>
    </section>
  );
}
