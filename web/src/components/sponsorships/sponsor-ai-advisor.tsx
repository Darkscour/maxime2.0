"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, Send } from "lucide-react";
import type { SponsorListing } from "@/lib/sponsor-listing";
import {
  getSponsorAiResponse,
  matchSponsorAiQuestion,
  type SponsorAiTopic,
} from "@/lib/sponsor-ai";

const QUICK_TOPICS: { id: SponsorAiTopic; label: string }[] = [
  { id: "about", label: "About sponsor" },
  { id: "apply", label: "Should we apply?" },
  { id: "pitch", label: "Pitch tips" },
  { id: "expect", label: "What they expect" },
  { id: "link", label: "Application link" },
];

export function SponsorAiAdvisor({ sponsor }: { sponsor: SponsorListing }) {
  const [open, setOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState<SponsorAiTopic | null>(null);
  const [question, setQuestion] = useState("");
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);

  const displayAnswer =
    customAnswer ??
    (activeTopic ? getSponsorAiResponse(sponsor, activeTopic) : null);

  function selectTopic(topic: SponsorAiTopic) {
    setActiveTopic(topic);
    setCustomAnswer(null);
    setOpen(true);
  }

  function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setActiveTopic(null);
    setCustomAnswer(matchSponsorAiQuestion(sponsor, question));
    setOpen(true);
  }

  return (
    <div className="mt-4 border-t border-[var(--border)] pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-none border border-[color-mix(in_srgb,var(--accent-2)_20%,var(--border))] bg-[color-mix(in_srgb,var(--accent-2)_5%,transparent)] px-3 py-2 text-left text-xs font-medium text-[var(--accent-2)] transition-colors hover:bg-[color-mix(in_srgb,var(--accent-2)_10%,transparent)]"
      >
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          AI assistant — ask about {sponsor.name}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TOPICS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTopic(t.id)}
                className={
                  activeTopic === t.id && !customAnswer
                    ? "rounded-none bg-[color-mix(in_srgb,var(--accent-2)_15%,transparent)] px-2.5 py-1 text-[11px] font-medium text-[var(--accent-2)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent-2)_35%,transparent)]"
                    : "rounded-none bg-[var(--background)] px-2.5 py-1 text-[11px] text-[var(--foreground-muted)] ring-1 ring-inset ring-[var(--border)] hover:text-[var(--foreground)]"
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleAsk} className="flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Or type a question…"
              className="min-w-0 flex-1 rounded-none border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--foreground)] focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center rounded-none bg-[color-mix(in_srgb,var(--accent-2)_20%,transparent)] px-2.5 text-[var(--accent-2)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--accent-2)_30%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent-2)_30%,transparent)]"
              aria-label="Ask AI"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

          {displayAnswer ? (
            <p className="whitespace-pre-line rounded-none border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-xs leading-5 text-[var(--foreground-muted)]">
              {displayAnswer}
            </p>
          ) : (
            <p className="text-xs text-[var(--foreground-muted)]">
              Pick a topic or ask a question for sponsor-specific guidance
              (rule-based preview — full LLM coming later).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
