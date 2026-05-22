# Competitor Analysis + Where You Win

> **Your thesis (restated for clarity):** Collegiate and lower‑tier esports orgs are underserved. Pro teams have analysts, agents, sponsorship reps, and back‑office staff. Amateur orgs have one overworked team captain doing all of it on Discord and Google Sheets. An AI‑powered, all‑in‑one platform that handles recruitment + sponsorships + ops is a clear, unclaimed gap.

This document maps the market, dissects each competitor's offering, and pinpoints why your angle wins.

---

## 1. The Market, Segmented

| Segment | Who they serve | Typical pain point |
|---|---|---|
| **Pro analytics** | Top 1% pro orgs (T1, G2, Cloud9) | In‑depth player and opponent analytics |
| **Tournament platforms** | Anyone running brackets | "Where's my schedule, where do I check in" |
| **Individual improvement** | Solo players grinding rank | "How do I get better at my role" |
| **Collegiate league hosts** | Universities running esports clubs | "Run intra‑school tournaments" |
| **Org management (gap)** | **Lower‑tier orgs, collegiate clubs** | **"I need recruitment + sponsors + ops, not just one thing"** ← **YOU** |

You compete with bits and pieces of the first four — nobody owns the fifth.

---

## 2. Competitor Breakdown

### Esports One
- **What they do:** Pro‑grade match analytics, real‑time data overlays, scouting tools for League / Valorant.
- **Audience:** Top pro orgs, broadcasters, betting partners.
- **Pricing:** Enterprise, not published — five‑figure annual deals.
- **Why they're not your competition:** Built for orgs with full‑time analysts who can interpret advanced stats. Way too complex and expensive for a collegiate club captain.
- **What to steal:** The polish of their data visualizations. Their AI fit‑score concept (but pitched to amateurs, not pros).

### Mobalytics
- **What they do:** AI coaching for individual players — your ranked stats, recommended champions, build paths.
- **Audience:** Solo players who want to climb ranked.
- **Pricing:** Freemium with $10/mo Pro tier.
- **Why they're not your competition:** Zero org‑management features. A team manager can't use Mobalytics to recruit, find sponsors, or coordinate scrims.
- **What to steal:** Their consumer onboarding flow and clean dashboards.

### Tracker.gg
- **What they do:** Aggregate game stats across titles. Public profiles.
- **Audience:** Individual players curious about their stats.
- **Why not your competition:** Stats only. No actions, no org features.
- **What to steal:** Their cross‑game stat normalization API is useful for your recruitment scoring.

### Generation Esports / PlayVS / NACE Starleague
- **What they do:** Host collegiate and high‑school tournament leagues.
- **Audience:** Schools that want a turn‑key league experience.
- **Why not direct competition:** They focus on running tournaments, not on helping the *team* manage itself between tournaments.
- **What to steal:** Distribution. These platforms are where your customers already are. **Integrating with them (via start.gg / Battlefy) so a team can sync their tournament results into your dashboard is a killer onboarding move.**

### Super.gg / Super League Gaming
- **What they do:** Casual community esports events and creator platform.
- **Audience:** Casual players and creators.
- **Why not direct competition:** Different vibe; not org‑focused.

### Leaguepedia / Liquipedia
- **What they do:** Wiki‑style encyclopedias of pro players, teams, tournaments.
- **Why not competition:** Read‑only, no tools, no AI.
- **What to use:** A useful seed source for player data — public domain‑ish.

### Discord + Google Sheets (the ACTUAL incumbent)
- **What they do:** Free, ubiquitous, painful.
- **Why this is your real competition:** Every collegiate captain you talk to says, *"We use Discord for comms, a Google Sheet for the roster, another sheet for tryouts, DMs for sponsor outreach."* You're not unseating Esports One — you're replacing five spreadsheets and 30 Discord pings.
- **What to steal:** Don't fight Discord. **Integrate** with it. Discord webhook + bot integration is a must‑have, not a nice‑to‑have.

### Riot's own Scouting Grounds / Valorant Game Changers
- **What they do:** First‑party amateur leagues with built‑in scouting.
- **Why not competition:** Single‑game, single‑publisher, gated to top tier.

---

## 3. Where the Market Has Holes (Your Wedge)

Cross‑reference what each player offers vs. what your audience needs:

| Need | Esports One | Mobalytics | Tracker.gg | Gen Esports | Discord+Sheets | **YOU** |
|---|---|---|---|---|---|---|
| Player scouting + AI fit score | ✓ (pro only) | ✗ | ✗ | ✗ | ✗ | **✓** |
| Sponsorship discovery | ✗ | ✗ | ✗ | ✗ | ✗ | **✓** |
| Roster management | ✗ | ✗ | ✗ | partial | manual | **✓** |
| Multi‑game support | partial | ✗ | ✓ | ✓ | ✓ | **✓** |
| Affordable for amateur orgs | ✗ | ✓ | ✓ | ✓ | free | **✓** |
| AI coach / strategy assistant | ✗ | ✓ (player) | ✗ | ✗ | ✗ | **✓** |
| Discord / start.gg integration | ✗ | ✗ | ✗ | partial | n/a | **✓** |

The only column with checkmarks across the board is yours.

---

## 4. Positioning Statement (use this in your marketing copy)

> **"The all‑in‑one operating system for collegiate and grassroots esports orgs."**
>
> "We replace the spreadsheets, Discord chaos, and cold sponsor DMs with one AI‑powered platform that scouts the right players, surfaces the right sponsors, and runs your team's back office — at a price clubs and student orgs can actually afford."

---

## 5. Features You Should Add (in priority order)

These are the features that *also* identify market gaps and reinforce your wedge. Build in this order:

### Tier 0 — V1 launch features (already scaffolded in this repo)
1. **Recruitment Portal** — filter player DB, AI fit score, request intro.
2. **Sponsorship Portal** — curated sponsor list, application status, AI pitch generator.
3. **Beautiful dark esports homepage** with clear value prop.

### Tier 1 — Critical for retention (build in months 1–3)
4. **Roster Hub** — every team's current players, roles, contracts, contact info. The replacement for the Google Sheet.
5. **Discord Integration** — bot pushes notifications (new recruit applied, sponsor intro accepted) into the team's Discord. **This is the #1 sticky feature.**
6. **Tournament Sync** — pull bracket + result data from start.gg / Battlefy automatically.
7. **Onboarding Wizard** — new team captain answers 5 questions, gets a populated dashboard immediately.

### Tier 2 — Differentiators (months 3–6)
8. **AI Coach Assistant** — chat sidebar trained on game knowledge. "What's a good draft against a Garen top?" "How do I run tryouts?" "Pitch a sponsor for me."
9. **Scrim Finder** — match teams of similar rank for practice. Nobody owns this.
10. **VOD Review (AI‑assisted)** — upload a match replay, AI flags key moments. (Twelve Labs API + custom logic.)
11. **Contracts & Templates** — pre‑written rosters, sponsor agreements, NDA. Lawyer‑reviewed once, used by thousands.
12. **Treasury / Finance** — track sponsor revenue, prize splits, dues collection. Stripe integration.

### Tier 3 — Monetization expansion (months 6–12)
13. **Job Board** — coach/manager/caster openings.
14. **Player Marketplace** — buyouts, transfers (collegiate transfer portal energy).
15. **Mental Health & Wellness** — burnout surveys, on‑demand sessions with partner therapists.
16. **Content Studio** — AI generates highlight clips, social posts, weekly recap newsletters.
17. **Org Reputation Score** — public profile of every team showing wins, sponsors, alumni. Becomes the "LinkedIn for esports orgs."

---

## 6. Two Bigger Strategic Ideas

These aren't features — they're bets that change the company shape.

### A. The "LinkedIn for Esports" Network Effect
Once every collegiate org and every player has a profile in your system, you have something nobody else does: **the graph**. Players move between teams; coaches move between orgs; sponsors move between teams. You can build:
- Free public profiles for players → SEO traffic + viral signup.
- Endorsements ("Player X was vouched by Coach Y at Team Z").
- Alumni networks (graduating collegiate players → semi‑pro orgs).

Pitch: *"Every esports career touches this platform."*

### B. The Sponsorship Marketplace (two‑sided)
Today you help teams *find* sponsors. The bigger play: help sponsors *find teams*. Companies post sponsorship budgets ("$5k for a Valorant team with 5k+ followers in NA"), teams apply, you take a 10% transaction fee on every deal closed.

This is the single highest‑leverage monetization path. It also makes your data moat enormous because every match between team and sponsor is data you can train fit models on.

---

## 7. Pricing Strategy (for later)

| Tier | Price | Who | What's included |
|---|---|---|---|
| **Free** | $0 | Anyone | 1 team, 10 player profiles, basic sponsor list, no AI |
| **Club** | $19/mo | Collegiate clubs | 3 teams, unlimited players, full sponsor portal, AI fit score (limited), Discord bot |
| **Org** | $79/mo | Lower‑tier semi‑pro | Unlimited teams, AI coach, sponsorship outreach automation, VOD review |
| **Marketplace fee** | 10% | All tiers | Cut of closed sponsorship deals (only when you take payments) |

Make the free tier *generous*. Land‑and‑expand: a captain plays with it free, hits a usage cap, asks their treasurer for $19/mo. That's the funnel.

---

Next: read `04-BUILD-ROADMAP.md` to see the step‑by‑step path from where this repo is today to a paying customer.
