# Build Roadmap — From This Repo to Paying Customers

A pragmatic, week‑by‑week plan. You don't have to follow it exactly, but it's calibrated for someone learning the stack while shipping.

---

## Week 0 — Right Now (what's done in this repo)

- [x] Next.js 16 + TypeScript + Tailwind v4 scaffolded
- [x] Framer Motion, Lucide icons installed
- [x] Dark, esports‑themed design system
- [x] Homepage with hero, features, how‑it‑works, competitor comparison
- [x] Recruitment portal page with filters + mock player cards
- [x] Sponsorship portal page with filters + mock sponsor cards
- [x] Reusable Navbar + Footer
- [x] Comprehensive documentation in `/docs`

**Action for you:** read `01-TECH-STACK.md`, then run `npm run dev` inside `web/` and click around the site.

---

## Week 1 — Understand the code

Goals:
- Read every file under `web/src/`. Try to predict what each line does before you read the comments.
- Change something cosmetic: site name, hero copy, accent color (search for `cyan-400` and try `violet-400`).
- Add a new page at `web/src/app/about/page.tsx` and link to it from the navbar.

Resource: do the Next.js official tutorial in parallel — https://nextjs.org/learn

---

## Week 2 — Make portals interactive

Goals:
- Add client‑side filtering with `useState` (game, rank, region) — the filter UI already exists, wire it up.
- Add a search input that fuzzy‑matches player names.
- Add a "Save to Shortlist" button that stores selections in `localStorage`.

---

## Week 3 — Set up the database

Goals:
- Create a free Supabase project (https://supabase.com).
- Install Prisma: `npm i prisma @prisma/client` inside `web/`.
- Write a `schema.prisma` with `Team`, `Player`, `Sponsor`, `User` tables.
- Replace mock data in the portals with real Prisma queries.

Migration path: keep the mock data files; just import from the DB instead and the UI works unchanged.

---

## Week 4 — Authentication

Goals:
- Sign up for Clerk (https://clerk.com) — 10 minutes.
- Follow their Next.js quickstart.
- Wrap your app in `<ClerkProvider>`. Add `<SignInButton />` to the navbar.
- Gate the recruitment + sponsorship portals to logged‑in users.

---

## Week 5 — Real player data (Riot integration)

Goals:
- Apply for a Riot dev key.
- Build the "Connect Riot Account" flow.
- Pull the user's match history, store in DB, display on their profile.

---

## Week 6 — Seed sponsorship data

Goals:
- Manually research and curate 100–200 sponsors. Spreadsheet → CSV → import to Postgres.
- Build an admin page (for yourself) to add/edit sponsors.
- Sign up for Hunter.io or Clearbit to enable on‑demand enrichment.

---

## Week 7 — Discord bot + integration

Goals:
- Create a Discord application (https://discord.com/developers/applications).
- Build a basic bot that posts a message into a team's channel when a new sponsorship lead arrives or a new player applies.

This is the feature your customers will love most. Underestimated.

---

## Week 8 — AI coach (the MVP version)

Goals:
- Sign up for OpenAI API. Store the key in `.env.local`.
- Build a chat sidebar component (`/components/AiCoach.tsx`).
- POST user messages to `/api/coach` → forward to OpenAI gpt‑4o‑mini → stream the response back.
- Add a system prompt with the user's team / game context so answers are relevant.

---

## Week 9 — Onboarding wizard + polish

Goals:
- 5‑step onboarding: team name, game, region, roster import, Discord link.
- Animations on form transitions (Framer Motion).
- Empty‑state illustrations.

---

## Week 10 — Talk to 10 real teams

Goals:
- Find 10 collegiate or amateur esports orgs.
- Show them the product. Give them free access. Listen to what they actually need.

This step matters more than any code you'll write. **Do not skip it.**

---

## Weeks 11–12 — Iterate

Goals:
- Build the top 3 things the 10 teams asked for.
- Ignore the rest.

---

## Month 4+ — Launch + monetize

- Add Stripe.
- Turn on paid tiers (Club $19, Org $79).
- Soft‑launch on r/esports, r/collegeesports, esports Discords.

---

## Stretch: The Sponsorship Marketplace

Once you have 100+ teams in the system and a curated sponsor database:
- Add a "Post a Sponsorship" flow for brands.
- Charge a 10% take rate on closed deals.
- This is your real business.

---

## Critical reminders

1. **Don't build features nobody asked for.** Talk to real teams before each major addition.
2. **Don't over‑engineer.** Mock data is fine until you have ten users. ML models are mock functions until you have a thousand.
3. **Ship every week.** Even tiny changes. Momentum compounds.
4. **Your moat is your data**, not your code. Every team you onboard makes the recruitment + sponsorship engines smarter.

You've already done the hardest part — identifying a real, underserved market. Everything else is execution.
