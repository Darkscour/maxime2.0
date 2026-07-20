"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Who is Maxime built for?",
    a: "Collegiate and grassroots esports orgs — team managers who recruit and run rosters, and players who want to get discovered and join teams. You choose your track during onboarding.",
  },
  {
    q: "What's the difference between collegiate and grassroots?",
    a: "Collegiate accounts tie to a verified school: managers recruit players on campus and access the sponsorship directory. Grassroots accounts are region-based — managers scout openly, players browse community teams, and both can use Duels for matchups.",
  },
  {
    q: "How does recruitment work?",
    a: "Managers search player profiles, save prospects to a watchlist, and send roster invites. Players can browse recruiting teams, request to join, and accept or decline offers from a single inbox — no more scattered Discord threads.",
  },
  {
    q: "What do managers get that players don't?",
    a: "Managers run the recruitment portal, roster hub, join-request queue, and (for collegiate orgs) sponsorship outreach. Players get a scout profile, team discovery, and an invite inbox. Grassroots managers and players both have access to Duels.",
  },
  {
    q: "Is Maxime free?",
    a: "Yes — you can sign up and run your org on the free tier. Create a team or player profile, recruit, and manage your roster without paying upfront.",
  },
  {
    q: "What's on the roadmap?",
    a: "AI VOD review, Discord-native workflows, and a scrim finder are in active development. Everything else on the Features section — recruitment, rosters, sponsorships, Duels, and the AI assistant — is available today.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 border-b border-[color-mix(in_srgb,var(--border)_50%,transparent)] bg-[var(--background-elevated)]/40 py-10 sm:py-12"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--accent)_20%,transparent)] bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--accent)_85%,white)]">
            <HelpCircle className="h-3.5 w-3.5" />
            FAQ
          </div>
          <h2 className="font-heading mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Answers before you sign up
          </h2>
          <p className="mt-3 text-base leading-7 text-[var(--foreground-muted)]">
            The essentials on account types, recruitment, and what&apos;s live
            today.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-3xl divide-y divide-[color-mix(in_srgb,var(--border)_50%,transparent)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-lg shadow-black/20">
          {faqs.map((f, i) => (
            <FAQItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function FAQItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="px-5 py-4 sm:px-7 sm:py-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="font-heading text-base font-semibold text-[var(--foreground)] sm:text-lg">
          {q}
        </span>
        <ChevronDown
          className={cn(
            "mt-1 h-5 w-5 shrink-0 text-[color-mix(in_srgb,var(--accent)_70%,transparent)] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">{a}</p>
      )}
    </div>
  );
}
