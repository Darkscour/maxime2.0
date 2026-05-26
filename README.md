# Maxime — AI Operating System for Collegiate Esports

> An all‑in‑one platform for collegiate and grassroots esports orgs.
> Built to replace the spreadsheets, Discord chaos, and cold sponsor DMs
> that captains use today.

This repository contains:

1. **`/web`** — a production‑quality Next.js 16 + Tailwind v4 frontend with a homepage, recruitment portal, and sponsorship portal already built.
2. **`/docs`** — comprehensive learning material that teaches you the stack, the market, the APIs you'll need, and a step‑by‑step build roadmap.

---

## TL;DR — Run It Locally

```bash
cd web
npm install        # only the first time
npm run dev
```

Open http://localhost:3000

You'll see:
- `/` — homepage with hero, features, competitor comparison, FAQ, CTA
- `/recruitment` — player scouting portal with live filtering + AI fit score
- `/sponsorships` — sponsor discovery portal with industry/tier filters

Everything uses mock data in `web/src/lib/mock-data.ts`. The mock data shape matches what a real Postgres + Prisma schema will look like, so swapping in a real database later is a small change, not a rewrite.

---

## Read These Docs Before Anything Else

| Doc | Why |
|---|---|
| **[`docs/01-TECH-STACK.md`](./docs/01-TECH-STACK.md)** | Every technology used, why it was picked, and how to use it. Start here. |
| **[`docs/02-APIS-AND-DATA-SOURCES.md`](./docs/02-APIS-AND-DATA-SOURCES.md)** | Every API you'll need for real player + sponsor data, with sign‑up links and costs. |
| **[`docs/03-COMPETITOR-ANALYSIS.md`](./docs/03-COMPETITOR-ANALYSIS.md)** | Market map, where the gap is, and 17 features to consider in priority order. |
| **[`docs/04-BUILD-ROADMAP.md`](./docs/04-BUILD-ROADMAP.md)** | Week‑by‑week plan from this repo to paying customers. |

---

## What's Built Right Now

### Homepage (`/`)
- Animated hero with stats card and gradient border
- Logos row (game titles supported)
- 8 feature cards with status badges (Live / Coming soon / Planned)
- 4‑step "How it works" section
- **Competitor comparison table** — Maxime vs. Esports One vs. Mobalytics vs. Sheets+Discord
- FAQ accordion
- Final CTA banner

### Recruitment Portal (`/recruitment`)
- Search by handle or school
- Filter by **game, region, rank floor, status, verified**
- Sort by **AI fit score, win rate, KDA**
- 12 mock players with gradient avatars, role, school, stats, tags
- Each card shows the AI fit score with explanation tier
- "Shortlist" and "Request intro" CTAs
- Empty state when filters yield nothing

### Sponsorship Portal (`/sponsorships`)
- Search by brand name
- Filter by **tier, industry, region, game focus**
- Sort by best match / tier / alphabetical
- 12 curated mock sponsors across 10 industries
- "AI pitch" button (mock — wire to OpenAI when ready) and "Apply" deep‑link
- Tier and check‑size badges, regions, audience, contact emails
- Empty state with reset

### Cross‑page polish
- Sticky blurred navbar with mobile menu
- Dark, esports‑themed design tokens (cyan/violet accents over deep zinc)
- Framer Motion entrance animations
- Fully responsive (mobile → 2xl)
- Subtle grid + spotlight backgrounds on hero sections
- Custom scrollbar styling, selection color, focus rings

---

## Project Structure

```
esports project/
├── README.md                       ← this file
├── docs/                           ← read first
│   ├── 01-TECH-STACK.md
│   ├── 02-APIS-AND-DATA-SOURCES.md
│   ├── 03-COMPETITOR-ANALYSIS.md
│   └── 04-BUILD-ROADMAP.md
└── web/                            ← the Next.js app
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx          (global shell: navbar + footer)
    │   │   ├── page.tsx            (homepage)
    │   │   ├── globals.css         (design tokens, gradients, grid)
    │   │   ├── recruitment/
    │   │   │   └── page.tsx
    │   │   └── sponsorships/
    │   │       └── page.tsx
    │   ├── components/
    │   │   ├── navbar.tsx
    │   │   ├── footer.tsx
    │   │   ├── ui/
    │   │   │   ├── container.tsx
    │   │   │   ├── button.tsx
    │   │   │   ├── badge.tsx
    │   │   │   └── avatar.tsx
    │   │   ├── home/
    │   │   │   ├── hero.tsx
    │   │   │   ├── logos.tsx
    │   │   │   ├── features.tsx
    │   │   │   ├── how-it-works.tsx
    │   │   │   ├── compare.tsx
    │   │   │   ├── faq.tsx
    │   │   │   └── cta.tsx
    │   │   ├── recruitment/
    │   │   │   ├── filters.tsx
    │   │   │   └── player-card.tsx
    │   │   └── sponsorships/
    │   │       ├── filters.tsx
    │   │       └── sponsor-card.tsx
    │   └── lib/
    │       ├── utils.ts             (cn helper)
    │       └── mock-data.ts         (players, sponsors, enums)
    ├── public/
    ├── package.json
    └── tsconfig.json
```

---

## Quick Customization Cheat Sheet

| You want to change... | Edit this file |
|---|---|
| Brand name (currently "Maxime") | `web/src/components/navbar.tsx` + `web/src/components/footer.tsx` + `web/src/app/layout.tsx` (metadata) |
| Hero headline / subheadline | `web/src/components/home/hero.tsx` |
| Accent color (cyan → something else) | search `cyan-400` in `globals.css` + components |
| Feature cards content | `web/src/components/home/features.tsx` |
| Comparison table rows | `web/src/components/home/compare.tsx` |
| Add / edit mock players | `web/src/lib/mock-data.ts` (PLAYERS array) |
| Add / edit mock sponsors | `web/src/lib/mock-data.ts` (SPONSORS array) |
| Add a new page | create `web/src/app/<name>/page.tsx`, link from navbar |

---

## What to Do Next

1. **Read** [`docs/01-TECH-STACK.md`](./docs/01-TECH-STACK.md) cover‑to‑cover. ~30 min.
2. **Run** `npm run dev` inside `/web` and click every link.
3. **Open** the source for the recruitment portal and try to change one thing — accent color, a player's name, the heading copy.
4. **Skim** [`docs/02-APIS-AND-DATA-SOURCES.md`](./docs/02-APIS-AND-DATA-SOURCES.md) to know which external services you'll plug in.
5. **Plan** with [`docs/04-BUILD-ROADMAP.md`](./docs/04-BUILD-ROADMAP.md).

When you're ready to take the next concrete step — adding a database, wiring up auth, integrating Riot — come back and I'll walk you through each one.

---

## Tech Stack at a Glance

| Layer | Choice |
|---|---|
| Framework | **Next.js 16** (App Router) |
| Language | **TypeScript** |
| UI | **React 19** + **Tailwind CSS v4** |
| Icons | **Lucide React** |
| Animation | **Framer Motion** |
| Class utilities | **clsx + tailwind‑merge** |
| Recommended database | PostgreSQL (Supabase) + Prisma ORM |
| Recommended auth | Clerk |
| Recommended ML/AI runtime | OpenAI API + Python FastAPI (when needed) |
| Recommended hosting | Vercel (frontend) + Railway (Python service) |

Full reasoning + how to add each layer is in [`docs/01-TECH-STACK.md`](./docs/01-TECH-STACK.md).
