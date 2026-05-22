# APIs and Data Sources

This is your shopping list for real data. Each entry tells you what the API gives you, how to sign up, what it costs, and how it fits your product.

---

## A. Player / Match Data (powers the Recruitment Portal)

The recruitment portal needs to filter a pool of players by game, rank, role, region, win rate, and other performance stats. No single API gives you "every collegiate esports player ever," so you'll **stitch a few sources together** and let users connect their own accounts to enrich profiles.

### 1. PandaScore — START HERE
- **URL:** https://pandascore.co
- **What it gives you:** Unified API across League of Legends, Valorant, CS2, Dota 2, Overwatch, Rocket League, R6 — players, teams, tournaments, matches, live odds.
- **Why it's perfect for v1:** One API key, one schema, every game your collegiate audience plays.
- **Pricing:** Free dev plan (rate‑limited), paid plans start ~$99/mo for production.
- **Auth:** Bearer token in header.
- **Example call:**
  ```
  GET https://api.pandascore.co/lol/players?filter[active]=true&per_page=50
  Authorization: Bearer YOUR_TOKEN
  ```
- **Use in your app:** Backfill the player database overnight via a scheduled job. Cache results in your Postgres DB so you're not hitting their API on every search.

### 2. Riot Games API (League of Legends, Valorant, TFT)
- **URL:** https://developer.riotgames.com
- **What it gives you:** Per‑player match history, ranked tier, champion mastery, recent performance. Free.
- **Catch:** Their dev keys expire every 24 hours. To go to production you must apply for a "Personal" or "Production" key by filling out a form describing your app — they approve most legitimate SaaS use cases in 1–4 weeks.
- **Use in your app:** When a player connects their Riot account ("Verify your stats" flow), pull their match history to fill in role, peak rank, KDA, win rate. This is the **gold standard** data and a huge differentiator vs. competitors using only self‑reported stats.

### 3. Steam Web API (CS2, Dota 2, Apex)
- **URL:** https://steamcommunity.com/dev
- **What it gives you:** Basic profile info, owned games, friend lists. Limited match data unless the player has a public profile.
- **Pricing:** Free.
- **Use:** Verify ownership of a game; pull friend connections for "vouched by" features.

### 4. OpenDota API (Dota 2 specifically)
- **URL:** https://docs.opendota.com
- **What it gives you:** Deep Dota 2 match data, MMR, hero performance — completely free, no key for low volume.
- **Use:** Dota 2 recruitment is rich here.

### 5. FACEIT API (CS2, primarily)
- **URL:** https://developers.faceit.com
- **What it gives you:** ELO, recent matches, hub activity. Many collegiate CS2 players use FACEIT, so it doubles as a "verified rank" signal.

### 6. Tracker.gg (multi‑game stats)
- **URL:** https://tracker.gg/developers
- **What it gives you:** Aggregated stats for Apex, Valorant, Halo, R6. Useful as a backup source.
- **Catch:** Requires you to register an application and may rate‑limit aggressively on free tier.

### 7. Esports Earnings API
- **URL:** https://www.esportsearnings.com/apidocs
- **What it gives you:** Career prize money for players who have competed. Mostly relevant for the top end; some semi‑pro collegiate players will show up.

### 8. Your Own Database (the long‑term moat)
The truth is: **no API covers collegiate / amateur players well.** Your real competitive advantage is the data you collect yourself once orgs onboard.

> When a team registers, they import their roster. When a player joins, they connect Riot/Steam/FACEIT. After 6 months you'll have player profiles no API can match — and that becomes the recruitment portal.

### Recommended starter stack for recruitment portal data:
- **PandaScore** (broad coverage, single key) — primary
- **Riot API** (deep League/Valorant stats) — verification layer
- **OpenDota / FACEIT** — game‑specific extensions
- **Your DB** — collegiate players, self‑onboarded

---

## B. Sponsorship Data (powers the Sponsorship Portal)

**The honest reality:** there is **no public API for "companies that sponsor small esports orgs."** This is exactly the market gap you identified, and exactly why building it is hard *and* defensible.

You have to assemble this dataset yourself. Here's how:

### B.1. Company / Brand Discovery APIs

| Source | What it gives you | Notes |
|---|---|---|
| **OpenCorporates API** (https://api.opencorporates.com) | Legal entity data, industry codes, addresses worldwide | Free tier; great for company verification |
| **Crunchbase API** (https://data.crunchbase.com) | Funding rounds, marketing spend signals, company stage | Paid only (~$49/mo for basic) |
| **Clearbit Enrichment API** (https://clearbit.com/docs) | Enrich a domain → company size, tech stack, social links | Paid; great for enriching scraped leads |
| **Apollo.io API** (https://apolloapi.com) | B2B contact data — marketing managers, sponsorship leads | Paid; useful for the "contact info" feature |
| **Hunter.io API** | Find email addresses at a company domain | Cheap; ~$49/mo |

### B.2. Esports‑Specific Sponsor Signals (no API — you have to gather these)

Build a curated database by:

1. **Scraping public sponsor walls** — most established esports orgs list sponsors on their website (Cloud9, TSM, FaZe, smaller orgs like Pittsburgh Knights). Tools:
   - **Apify** (https://apify.com) — pre‑built scrapers, ~$49/mo
   - **Bright Data** (https://brightdata.com) — proxy + scraper
   - **Crawlee** (open source, https://crawlee.dev) — DIY in Node.js
2. **Crunchbase / PR newswire searches** for "company sponsors esports" — programmatic via SerpAPI (https://serpapi.com, ~$50/mo) which gives you a JSON API for Google search results.
3. **Monitoring esports news sites** (Esports Insider, The Esports Observer, Dot Esports) for sponsorship announcements — RSS feeds + a daily ingest job.
4. **Reddit & Twitter mentions** of `#sponsorship #esports` — Twitter API (now X API, paid) or Reddit API (free).
5. **Industry tracker — Sponsor United** (https://sponsorunited.com) — paid B2B service that tracks sports/esports sponsorships. Pricey but the gold standard if you raise funding.

### B.3. The Pragmatic Sponsorship Data Strategy

For v1 (next 1–3 months):
1. **Manually curate** a list of ~200 companies known to sponsor amateur/collegiate sports & esports (energy drinks, peripherals, gaming chairs, local restaurants, regional banks, ISPs, universities). Store in your Postgres DB.
2. **Tag each** with industry, typical sponsorship size, regions, target demographics, application URL or contact email.
3. **Show this curated list** in the portal with a "Request Intro" button.
4. **Enrich on demand** via Clearbit + Hunter when a user clicks a company.
5. **Add scraped data over time** — set up a weekly Apify job hitting `[orgname].gg/sponsors` for ~500 esports org sites; flag new sponsors automatically.

For v2 (6+ months):
- Pay for Crunchbase + Clearbit + Apollo.
- Build a recommendation model: "Teams like yours got sponsored by Razer, HyperX, G Fuel." Use collaborative filtering on the data you've gathered.
- License a Sponsor United feed if you raise capital.

### B.4. Sample sponsorship record schema (Postgres)

```sql
CREATE TABLE sponsors (
  id UUID PRIMARY KEY,
  company_name TEXT NOT NULL,
  domain TEXT,
  logo_url TEXT,
  industry TEXT,              -- "energy_drink", "peripherals", "apparel", "fintech"
  sponsorship_tier TEXT,      -- "starter" | "growth" | "established"
  typical_check_size_usd INT, -- 500, 5000, 50000
  regions TEXT[],             -- ['NA', 'EU']
  games TEXT[],               -- ['valorant', 'league_of_legends']
  target_audience JSONB,      -- {"min_followers": 1000, "tier": "collegiate"}
  application_url TEXT,
  contact_email TEXT,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  source TEXT,                -- "manual_curation" | "apify_scrape" | "user_submission"
  last_verified_at TIMESTAMPTZ
);
```

---

## C. Other Useful APIs

### Authentication
- **Clerk** (https://clerk.com) — user accounts, social login, magic link.
- **Discord OAuth** — let team managers log in with Discord (high adoption among esports).

### Communication
- **Resend** (https://resend.com) — transactional email (welcome, sponsor intro), $20/mo for 50k emails.
- **Discord Webhooks** — push notifications into team Discord channels (free).

### Payments (when you monetize)
- **Stripe** (https://stripe.com) — subscriptions, sponsorship escrow.

### AI
- **OpenAI Platform** (https://platform.openai.com) — chat completions for the AI coach + sponsorship outreach generator.
- **Anthropic Claude** (https://www.anthropic.com) — alternative LLM, often better at long context.

### Tournament data
- **start.gg API** (https://developer.start.gg) — every grassroots tournament runs on start.gg. Free with key. Pulls bracket data and player attendance.
- **Battlefy API** — many collegiate tournaments use Battlefy.

---

## D. Putting It Together — Data Flow Per Feature

### Recruitment Portal
1. **Cold start:** seed DB with PandaScore players for the top 4 games.
2. **Onboarding:** when an org signs up, their managers invite their players, who connect Riot/Steam/FACEIT.
3. **Search:** user types criteria → query your Postgres DB (with PandaScore + custom data) → return ranked results.
4. **AI Fit Score:** call your FastAPI service (placeholder for now) → returns 0–100 score.

### Sponsorship Portal
1. **Cold start:** seed DB with 200 manually curated sponsors.
2. **Search:** user types game / region / team size → query your DB → return matching sponsors.
3. **Enrich:** when user clicks a sponsor, call Clearbit + Hunter to pull fresh contact info.
4. **Outreach:** AI button generates a personalized pitch email using OpenAI based on team profile + sponsor profile.

---

## E. Cost Estimate for a Real V1 Launch

| Service | Plan | Monthly |
|---|---|---|
| Vercel (frontend) | Hobby → Pro | $0 → $20 |
| Supabase (Postgres + Auth) | Free → Pro | $0 → $25 |
| PandaScore | Free dev → Starter | $0 → $99 |
| Clerk | Free | $0 |
| OpenAI API | Pay‑as‑go (~50k requests) | ~$30 |
| Resend (email) | Pro | $20 |
| Domain | yearly | ~$1 |
| **Total minimum to launch** | | **~$0–$50/mo** |
| **Total for a paying‑customer v1** | | **~$200/mo** |

You can launch entirely on free tiers for an MVP.

Next: read `03-COMPETITOR-ANALYSIS.md` to see who else is in the market and why your angle wins.
