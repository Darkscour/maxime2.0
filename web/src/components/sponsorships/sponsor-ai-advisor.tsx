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
    <div className="mt-4 border-t border-white/5 pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-violet-400/20 bg-violet-400/5 px-3 py-2 text-left text-xs font-medium text-violet-200 transition-colors hover:bg-violet-400/10"
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
                    ? "rounded-full bg-violet-400/15 px-2.5 py-1 text-[11px] font-medium text-violet-200 ring-1 ring-inset ring-violet-400/35"
                    : "rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-400 ring-1 ring-inset ring-white/10 hover:text-white"
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
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[var(--background)] px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-violet-400/40 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-violet-400/20 px-2.5 text-violet-200 ring-1 ring-inset ring-violet-400/30 hover:bg-violet-400/30"
              aria-label="Ask AI"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

          {displayAnswer ? (
            <p className="whitespace-pre-line rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 text-xs leading-5 text-zinc-400">
              {displayAnswer}
            </p>
          ) : (
            <p className="text-xs text-zinc-500">
              Pick a topic or ask a question for sponsor-specific guidance
              (rule-based preview — full LLM coming later).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
