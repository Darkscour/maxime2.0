# Project Status — Maxime (handoff for new chats)

**Purpose:** Read this file first in a new Cursor chat so you inherit context without the old conversation.  
**Last updated:** May 2026  
**Repo:** `esports project` — app code lives in **`web/`**

---

## What Maxime is

An all-in-one platform for **collegiate and grassroots esports orgs**: recruitment, sponsorships, team ops, and AI assistance. Pre-launch marketing site + early product surfaces.

**Brand:** Maxime (formerly Clutch.gg — rebrand complete in UI/docs).

---

## Tech stack (installed and in use)

| Technology | Role in this project |
|------------|----------------------|
| **Next.js 16** (App Router) | Pages, routing, server components, API |
| **React 19** + **TypeScript** | UI and type safety |
| **Tailwind CSS v4** | Styling (`web/src/app/globals.css`, `font-heading` = Space Grotesk) |
| **Framer Motion** | Section/card animations |
| **Lucide** | Icons |
| **Clerk** | Sign-in / sign-up (`web/.env` keys, middleware in `web/src/middleware.ts`) |
| **Prisma** | ORM — talks to Postgres (`web/prisma/schema.prisma`, `web/src/lib/db.ts`) |
| **Supabase** | Hosted **PostgreSQL** database (connection via `DATABASE_URL` / `DIRECT_URL` in `web/.env`) |
| **Vercel** (typical deploy) | Frontend deploy from GitHub — not configured in this doc |

**Not yet integrated:** OpenAI/Claude (AI pitch is rule-based preview), Hunter/Clearbit, external game APIs (PandaScore, Riot), CSV import script (planned).

**Deeper explanations:** See `docs/01-TECH-STACK.md` and `docs/05-EXPLANATIONS.md` (if present — plain-English glossary).

---

## Repository layout (important paths)

```
esports project/
├── docs/                    # Learning + this status file
├── web/                     # ← Run all npm commands here
│   ├── .env                 # Secrets (gitignored): Supabase URLs, Clerk keys
│   ├── prisma/
│   │   ├── schema.prisma    # Player, Sponsor models (Prisma shape)
│   │   └── seed.ts          # Seeds mock data from mock-data.ts
│   ├── scripts/
│   │   └── test-sponsor-fetch.ts   # Quick DB connectivity test
│   └── src/
│       ├── app/
│       │   ├── page.tsx             # Homepage (fetches sponsors for validation)
│       │   ├── sponsorships/        # Full sponsor portal page
│       │   └── recruitment/         # Marketing overview + demo video
│       ├── components/
│       │   ├── home/                # Hero, features, sponsorships-preview, etc.
│       │   └── sponsorships/        # Cards, filters, preview banners
│       └── lib/
│           ├── fetch-sponsors.ts    # Loads Supabase sponsors (Prisma + manual fallback)
│           ├── sponsor-listing.ts   # Minimal sponsor type for UI
│           └── mock-data.ts         # Types + seed/mock sponsors & players
```

---

## What has been done

### Branding and marketing site

- [x] Rebrand **Clutch.gg → Maxime** across site and README
- [x] Homepage: hero, logos, **How it works** (before Features), features (SVG illustrations), compare table, FAQ, CTA
- [x] Typography: **Space Grotesk** for headings (`font-heading`), **Geist** for body; font preview toggles removed
- [x] **AI VOD Review** moved to “On the roadmap” with **Coming soon** badge (not in main feature grid)
- [x] Features headline: “The whole stack of a pro org — without the staff to match.”
- [x] Navbar anchors on homepage: `#features`, `#how-it-works`, `#sponsorships` (same-page scroll when on `/`)

### Recruitment

- [x] `/recruitment` is a **marketing overview** (no public placeholder player list)
- [x] Demo video component + early-access CTA
- [x] Old filter/player-card portal code removed from public flow

### Sponsorships (current focus)

- [x] `/sponsorships` — **two UIs in one route**: signed out = 4 demo sponsors; signed in = full Supabase list via `fetchSponsorsForDisplay()`
- [x] Homepage **`#sponsorships` section**:
  - Interactive **demo panel** (4 sample sponsors, minimal filters: name / industry / difficulty)
  - **AI “should we apply?”** accordion per demo card (rule-based; not OpenAI yet)
  - **Supabase validation** block — shows **all** live rows from DB (“Live DB” tag); demo panel stays 4 sample sponsors
- [x] `fetchSponsorsForDisplay()` in `web/src/lib/fetch-sponsors.ts`:
  - Tries Prisma `Sponsor` model first
  - Falls back to raw SQL for **manual Supabase import** column names (`ID`, `Name`, `Industry`, `sponsor_link`, etc.)

### Database (Supabase)

- [x] Supabase project: **Darkscour's Project**
- [x] `Sponsor` table populated via **CSV import** (~17 real curated rows after cleaning empty rows)
- [x] Connection fixed: **password must be URL-encoded** in `DATABASE_URL` / `DIRECT_URL` (e.g. `#` → `%23`; do **not** use `[brackets]` around password)
- [x] Test script: `npx tsx scripts/test-sponsor-fetch.ts` → expect `source: database`, `count: 17`

### Auth

- [x] Clerk sign-in / sign-up pages and navbar buttons
- [x] Middleware scaffold (`isProtectedRoute` mostly empty — most routes still public)

### Documentation

- [x] `docs/01` through `docs/04` (tech stack, APIs, competitors, roadmap)
- [x] `docs/06-PROJECT-STATUS.md` (this file)

---

## Known issues / schema mismatch

| Topic | Detail |
|-------|--------|
| **Supabase `Sponsor` columns** | Imported with spreadsheet names: `ID`, `Name`, `Industry`, `sponsor_link` (and possibly `Sponsorship Difficulty`). Prisma schema expects `id`, `name`, `industry`, `applicationUrl`, `tier`, plus required fields like `audience`, `description`, `checkSize`, etc. |
| **App behavior** | Site reads manual columns via **raw SQL fallback** in `fetch-sponsors.ts`. Full Prisma `findMany` fails until table matches `schema.prisma` or data is re-imported to Prisma shape. |
| **`/sponsorships` page** | Uses `fetchSponsorsForDisplay()` + `listingToPortalSponsor()`; signed-in users see all DB rows; visitors see demo only. |
| **README** | Partially outdated (still mentions old recruitment portal behavior in places). Trust **this file** over README for current state. |

---

## Spreadsheet → Supabase (operator notes)

**Recommended CSV headers for future imports** (must match DB column names exactly):

```text
id,name,industry,tier,checkSize,regions,games,audience,description,applicationUrl,active,lastVerifiedAt
```

**Current manual table** uses `ID`, `Name`, `Industry`, `sponsor_link` — works with fallback query only.

**Import tips:**

- Export **CSV UTF-8**, not `.xlsx` renamed to `.csv`
- No blank rows at top/bottom of sheet
- Every row needs non-empty `id` / `ID`
- Primary key on `id` / `ID` — no duplicate empty IDs

---

## Two UIs: marketing site vs team dashboard

Apply this pattern to **every** feature (sponsorships first, then recruitment, roster, etc.).

| Surface | Who | Goal | What to show |
|---------|-----|------|----------------|
| **Marketing site** | Visitors, prospects | Explain value; convert to sign-up | Short copy, 1 interactive **demo** (fake/sample data), no full DB, no save/apply/pipeline |
| **Team dashboard** | Signed-in (later: verified team) | Do real work | Live Supabase data, full filters, apply/save, pipeline, AI with team context |

**Current routes (sponsorships):**

- Homepage `#sponsorships` — marketing: `SponsorDemoPanel` (4 samples) + optional **Supabase validation** strip (all rows — for ops; hide behind env before public launch if needed)
- `/sponsorships` — signed **out** → same 4 demo sponsors; signed **in** → all DB sponsors
- **Future:** `/dashboard/...` app shell with sidebar; marketing pages stay on `/` and `/recruitment`

## Feature access model (partially built)

| Role | Sponsorships | Recruitment |
|------|----------------|-------------|
| **Visitor** | Demo + homepage preview; `/sponsorships` = 4 samples | Marketing page only |
| **Signed-in, no verified team** | Full DB list on `/sponsorships`; apply enabled; pipeline TBD | Application-oriented features (planned) |
| **Verified collegiate team** | Full directory + pipeline + apply (pipeline not built) | Full portal (when built) |

**Implementation later:** Clerk metadata (`teamId`, `teamVerified`), middleware gates, `/dashboard` layout, onboarding flow.

---

## What needs to be done (priority order)

### P0 — Sponsorships product

1. [ ] Align **Supabase `Sponsor` table** with `prisma/schema.prisma` OR keep raw-query mapping (working on homepage + `/sponsorships` when signed in)
2. [ ] **Sponsor pipeline** for signed-in users: `SponsorLead` model, Save, status (Saved → Applied → Contacted → Won/Lost)
3. [ ] Simplify sponsor **card UI** on full portal (minimal fields: name, industry, link, difficulty)
4. [ ] **CSV sync script** (`npm run sponsors:sync`) for weekly spreadsheet updates

### P1 — Data and quality

5. [ ] Curate more sponsors in spreadsheet; weekly `lastVerifiedAt` checks
6. [ ] Optional: make `audience` optional in schema or fill defaults on import
7. [ ] Admin page to add/edit sponsors without Supabase UI

### P2 — AI and integrations

8. [ ] Real **LLM** for per-sponsor advice (OpenAI/Claude) + **team size** context from team profile
9. [ ] Team profile model (roster size, games, region, social reach)
10. [ ] Enrichment APIs (Hunter/Clearbit) — phase 2 per `docs/02-APIS-AND-DATA-SOURCES.md`

### P3 — Recruitment and other features

11. [ ] Rebuild recruitment portal behind auth with real/mock DB players
12. [ ] Team verification workflow
13. [ ] Homepage `#recruitment` section (mirror sponsorships pattern)
14. [ ] VOD review remains roadmap-only until video pipeline exists

### P4 — Ops

15. [ ] Update root README to match current behavior
16. [ ] Commit/push pending changes; ensure `.env` never committed
17. [ ] Rotate DB password if it was exposed in chat (use URL encoding in new `.env`)

---

## Commands cheatsheet

Run from **`web/`**:

```bash
npm run dev              # http://localhost:3000
npm run db:migrate       # Apply Prisma schema to Supabase
npm run db:seed          # Seed mock players/sponsors (skipDuplicates)
npm run db:studio        # Visual DB browser
npx tsx scripts/test-sponsor-fetch.ts   # Should print source: database, count: N
```

**`.env` required variables:**

- `DATABASE_URL` — Supabase **transaction pooler** (port 6543, often `?pgbouncer=true`)
- `DIRECT_URL` — Supabase **direct** (port 5432)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`

---

## How to use this file in a new chat

Paste at the start of a new Cursor conversation:

```text
Read docs/06-PROJECT-STATUS.md and continue the Maxime project from the "What needs to be done" section. Focus on: [your task].
```

Optional attachments:

- `@docs/06-PROJECT-STATUS.md`
- `@web/src/lib/fetch-sponsors.ts`
- `@web/prisma/schema.prisma`

---

## Related docs

| File | Contents |
|------|----------|
| `docs/01-TECH-STACK.md` | Full stack rationale |
| `docs/02-APIS-AND-DATA-SOURCES.md` | External APIs, sponsor data strategy |
| `docs/03-COMPETITOR-ANALYSIS.md` | Market positioning |
| `docs/04-BUILD-ROADMAP.md` | Original week-by-week plan (partially superseded by this status) |
| `docs/05-EXPLANATIONS.md` | Beginner glossary (if in repo) |

---

## Git / deploy note

Check `git status` before assuming remote is up to date. Sponsorship preview, Supabase fetch, and env fixes may exist only locally until committed and pushed to trigger Vercel.
