import type { SponsorListing } from "@/lib/sponsor-listing";

export type SponsorAiTopic =
  | "about"
  | "apply"
  | "pitch"
  | "expect"
  | "link";

function difficultyLabel(difficulty: string) {
  const d = difficulty.toLowerCase();
  if (d.includes("starter") || d.includes("easy")) return "starter-friendly";
  if (d.includes("growth") || d.includes("medium")) return "mid-tier";
  if (d.includes("established") || d.includes("hard")) return "competitive";
  return difficulty || "unspecified";
}

export function getSponsorAiResponse(
  sponsor: SponsorListing,
  topic: SponsorAiTopic,
): string {
  const tier = difficultyLabel(sponsor.difficulty);

  switch (topic) {
    case "about":
      return [
        `${sponsor.name} is listed in the ${sponsor.industry} space with a ${tier} sponsorship difficulty rating.`,
        `For collegiate esports orgs, brands in this category usually look for consistent content output, clear brand representation on jerseys/streams, and a professional point of contact.`,
        sponsor.sponsorLink !== "#"
          ? `Official link on file: ${sponsor.sponsorLink}`
          : "No application URL is stored yet — verify the sponsor's official partnerships page before outreach.",
      ].join("\n\n");

    case "apply":
      return [
        `Fit check for ${sponsor.name}: difficulty is ${tier}.`,
        tier === "starter-friendly"
          ? "Strong match if you're a smaller club (roughly 5–15 active members) with regular streams or LAN presence and a simple one-page media kit."
          : tier === "mid-tier"
            ? "Best if you have measurable reach (social + stream stats), a defined content calendar, and past sponsor references or tournament results."
            : "Only pursue if you have significant audience, polished creative assets, and a dedicated partnerships lead — otherwise queue this for later.",
        "Team-size and viewer-specific scoring is coming soon; treat this as a general collegiate org guideline.",
      ].join("\n\n");

    case "pitch":
      return [
        `Pitch angle for ${sponsor.name}:`,
        `• Lead with what ${sponsor.industry} buyers care about — product visibility, authentic community access, and campus/collegiate credibility.`,
        "• Include roster size, primary game(s), avg concurrent viewers, and 2–3 content deliverables (stream overlays, social posts, event activation).",
        "• Keep the first email under 200 words with a link to a one-page deck or Notion doc.",
        `• Mention why ${sponsor.name} specifically (product use on stream, prior brand affinity, regional overlap).`,
      ].join("\n");

    case "expect":
      return [
        `What ${sponsor.name} typically expects from grassroots/collegiate partners:`,
        "• Logo on jerseys, stream panels, or Discord server",
        "• Scheduled social posts tagging the brand (often 2–4 per month)",
        "• Professional communication and deliverable tracking",
        tier === "starter-friendly"
          ? "• Product-only or small cash deals ($100–$500 range) are common at this tier"
          : tier === "mid-tier"
            ? "• Mix of product, event support, and modest cash ($500–$2k) depending on reach"
            : "• Larger packages with strict reporting and exclusivity clauses",
      ].join("\n");

    case "link":
      return sponsor.sponsorLink !== "#"
        ? `Apply or learn more here: ${sponsor.sponsorLink}\n\nOpen the page first to confirm the form is still active and note any eligibility requirements (region, org type, minimum followers).`
        : "No stored link for this sponsor. Search the brand's site for “partnerships”, “sponsorship”, or “affiliate” pages before cold outreach.";
  }
}

/** Simple keyword routing for free-form questions (rule-based preview). */
export function matchSponsorAiQuestion(
  sponsor: SponsorListing,
  question: string,
): string {
  const q = question.toLowerCase().trim();
  if (!q) return "Ask anything about this sponsor — industry fit, application tips, or what to include in a pitch.";

  if (q.includes("apply") || q.includes("worth") || q.includes("fit"))
    return getSponsorAiResponse(sponsor, "apply");
  if (q.includes("pitch") || q.includes("email") || q.includes("outreach"))
    return getSponsorAiResponse(sponsor, "pitch");
  if (q.includes("expect") || q.includes("deliver") || q.includes("want"))
    return getSponsorAiResponse(sponsor, "expect");
  if (q.includes("link") || q.includes("url") || q.includes("where"))
    return getSponsorAiResponse(sponsor, "link");
  if (q.includes("industry") || q.includes("who") || q.includes("about"))
    return getSponsorAiResponse(sponsor, "about");

  return [
    `Here's what I know about ${sponsor.name}:`,
    getSponsorAiResponse(sponsor, "about"),
    "\nTry asking: “Should we apply?”, “What should our pitch include?”, or “What do they expect from teams?”",
  ].join("\n\n");
}
