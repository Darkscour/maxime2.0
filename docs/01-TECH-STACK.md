# Tech Stack — What You're Using and Why

This document explains every technology in your project, why it was chosen for an AI‑powered esports platform, and exactly how to use it. Read it top‑to‑bottom once; you don't need to memorize anything.

---

## 1. The Big Picture

Your service has three "layers":

| Layer | Job | Tool we picked |
|---|---|---|
| **Frontend** | What users see and click in the browser | **Next.js 16 + React 19 + TypeScript + Tailwind CSS v4** |
| **Backend** | Business logic, auth, database access, calling external APIs | **Next.js API Routes** (Node.js) for now → **FastAPI (Python)** later when you add ML models |
| **Data** | Where players, sponsors, teams, and users are stored | **PostgreSQL** (via **Supabase** or **Neon** — free tier) + **Prisma ORM** |

Everything else (auth, AI, payments, hosting) plugs into those three.

```
┌────────────────────────────────────────────────────────────┐
│                       USER'S BROWSER                       │
│           (your homepage, portals, dashboards)             │
└────────────────────────────────────────────────────────────┘
                            │ HTTPS
                            ▼
┌────────────────────────────────────────────────────────────┐
│   NEXT.JS  (frontend pages + API routes for "thin" logic)  │
│   - Renders React pages                                    │
│   - Auth checks, form submits, simple CRUD                 │
│   - Calls heavier services for ML / scraping               │
└────────────────────────────────────────────────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│  PostgreSQL  │        │  Python ML   │        │  External    │
│  (Supabase)  │        │   FastAPI    │        │  APIs        │
│  players,    │        │  (scoring,   │        │  Riot,       │
│  sponsors,   │        │  predictions)│        │  PandaScore, │
│  teams       │        │              │        │  OpenAI ...  │
└──────────────┘        └──────────────┘        └──────────────┘
```

---

## 2. Frontend

### Next.js 16 (App Router)
**What it is:** A React framework. React on its own only renders UI in the browser — Next.js adds routing, server rendering, image optimization, and an API layer in one package.

**Why we picked it for an esports SaaS:**
- File‑based routing (`src/app/recruitment/page.tsx` automatically becomes `/recruitment`) — easy for beginners
- Server Components render heavy pages (player lists with thousands of records) on the server, so the user's browser stays fast
- API Routes (`src/app/api/...`) let you write backend endpoints in the same project — no separate Node server needed for v1
- Industry standard for SaaS dashboards; massive job market

**How you use it:**
- Pages go in `src/app/<route>/page.tsx`
- Layouts (shared header/footer) go in `src/app/<route>/layout.tsx`
- Server-only code (DB queries, secret keys) goes in `page.tsx` or `route.ts` files — never in `"use client"` files
- Interactive components (anything with `useState`, `onClick`, animations) start with `"use client"` at the top

```
src/app/
├── layout.tsx          ← global shell (html, body, fonts)
├── page.tsx            ← homepage  /
├── recruitment/
│   └── page.tsx        ← /recruitment
├── sponsorships/
│   └── page.tsx        ← /sponsorships
└── api/
    └── players/
        └── route.ts    ← GET /api/players
```

**Where to learn it:** https://nextjs.org/learn — the official interactive tutorial, ~3 hours.

### React 19
**What it is:** The library that turns JavaScript objects into HTML the browser displays.

**Mental model:** You write functions that return HTML‑looking code (JSX). React re‑runs the function whenever data changes and updates only the parts of the page that differ. You don't manipulate the DOM directly.

```tsx
function PlayerCard({ name, rank }) {
  return (
    <div className="rounded-lg border p-4">
      <h3>{name}</h3>
      <p>{rank}</p>
    </div>
  );
}
```

**Where to learn it:** https://react.dev/learn — the "Quick Start" + "Thinking in React" sections are enough to begin.

### TypeScript
**What it is:** JavaScript with type labels. Instead of `let player = {...}` and hoping it has a `name`, you declare `type Player = { name: string; rank: number }` and the editor catches mistakes before you run the code.

**Why it matters for you:** When you start hooking up real APIs (Riot, PandaScore), you'll get autocomplete for every field and the compiler will yell if you typo `playr.name`. Saves hours of debugging.

**You don't need to "learn TypeScript" first.** Just copy patterns from the existing code; the types you'll write are 90% `string`, `number`, `boolean`, and arrays of objects.

### Tailwind CSS v4
**What it is:** Styling by writing utility classes directly on elements instead of writing separate CSS files.

```tsx
// Old way (CSS file)
<div className="player-card">...</div>

// Tailwind way
<div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:border-cyan-500">
  ...
</div>
```

**Why for an esports site:** Lets you iterate on the dark, neon‑accented look extremely fast. No naming things, no jumping between files.

**Key classes you'll see everywhere in this project:**
| Class | What it does |
|---|---|
| `bg-zinc-950` | very dark gray background |
| `text-zinc-100` | near‑white text |
| `text-cyan-400` | neon accent text |
| `border border-zinc-800` | thin subtle border |
| `rounded-2xl` | rounded corners |
| `p-6` / `px-4 py-2` | padding |
| `flex items-center gap-4` | horizontal layout, vertically centered, 1rem gap |
| `grid grid-cols-3 gap-6` | 3‑column grid |
| `hover:bg-zinc-800` | hover state |
| `md:grid-cols-3` | only applies on screens ≥ 768px (responsive) |

**Where to learn it:** Skim https://tailwindcss.com/docs/styling-with-utility-classes once, then keep https://tailwindcss.com/docs open as a cheat sheet.

### Framer Motion
**What it is:** Animation library for React. One‑line fade‑ins, slides, hover effects.

```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Hello
</motion.div>
```

Used in this project for the homepage hero entrance and feature cards. Premium‑feeling animations are a huge part of the "AI esports SaaS" vibe.

### Lucide React
**What it is:** A pack of clean SVG icons (gamepad, trophy, target, zap, etc.).

```tsx
import { Trophy, Target, Zap } from "lucide-react";
<Trophy className="h-6 w-6 text-cyan-400" />
```

---

## 3. Backend Options (How to Add Each)

### Stage 1 (today): Next.js API Routes
Already built into your project. You write a file like:

```ts
// src/app/api/players/route.ts
export async function GET() {
  const players = await db.player.findMany();
  return Response.json(players);
}
```

Good enough for: auth, CRUD, calling external APIs, simple aggregations. **Use this until something forces you to upgrade.**

### Stage 2 (when you add the AI scoring model): FastAPI (Python)
ML models are written in Python (scikit‑learn, PyTorch). FastAPI is a tiny web framework that lets you expose a Python function as an HTTP endpoint your Next.js app can call.

```python
# api/main.py
from fastapi import FastAPI
import joblib

app = FastAPI()
model = joblib.load("recruitment_model.pkl")

@app.post("/predict")
def predict(player: dict, team_criteria: dict):
    score = model.predict([...])
    return {"fit_score": float(score)}
```

You'd run this as a separate service (deployed to Railway or Render), and your Next.js code calls it with `fetch("https://your-ml-api.railway.app/predict")`.

**Don't build this yet.** Mock the prediction with a fake function returning random numbers. Build it for real once you have actual user data to train on.

---

## 4. Database

### PostgreSQL via Supabase (recommended)
**What it is:** Postgres is the most widely used open‑source relational database. Supabase is a hosting service that gives you a Postgres database + auth + file storage + auto‑generated APIs, on a generous free tier.

**Why over MongoDB / Firebase:**
- Relational data fits your domain perfectly (a Team has many Players, a Player has many MatchStats, a Sponsorship has many Applications). Joins are easy in SQL, painful in NoSQL.
- Supabase's row‑level security policies map cleanly onto SaaS multi‑tenancy ("only members of Team X can see Team X's roster").

### Prisma ORM
**What it is:** A library that lets you write database queries as TypeScript code instead of raw SQL, with full autocomplete.

```ts
const player = await prisma.player.findUnique({
  where: { id: playerId },
  include: { stats: true, team: true },
});
```

You define your data shape once in `schema.prisma`, run `prisma generate`, and the types flow through your whole codebase.

**Add this when you're ready to persist data** (probably after you've built the static UI and demoed it to a few orgs). For now we use mock data.

---

## 5. Authentication

### Clerk (easiest) or Supabase Auth (free, more work)
You will need login/signup for team managers. The two beginner‑friendly options:

- **Clerk** — drop in `<SignIn />` component, get login pages, social auth, magic links, billing. Free up to 10k monthly active users.
- **Supabase Auth** — already included if you use Supabase for the DB. Slightly more wiring but zero extra cost.

Pick Clerk if you want to ship fast; pick Supabase Auth if you're cost‑conscious or already committed to the Supabase ecosystem.

---

## 6. AI / ML Stack

| Use case | Tool |
|---|---|
| Chat assistant (AI coach, recruitment Q&A) | **OpenAI API** (gpt‑4o‑mini for cheap, gpt‑4o for quality) or **Anthropic Claude** |
| Player fit scoring | **scikit‑learn** (gradient boosted trees) trained on historical match data |
| Highlight clip detection (later) | **Twelve Labs** API or **OpenAI Whisper** for audio + a vision model |
| Vector search (e.g. "find sponsors similar to Red Bull") | **pgvector** extension on Postgres |

For v1, the only AI you need is OpenAI's API for the chat assistant and a *placeholder* fit‑score function (random number weighted by a few criteria — totally fine as long as you're transparent the model is "learning").

---

## 7. Deployment

| Service | What it hosts | Cost |
|---|---|---|
| **Vercel** | Your Next.js frontend + API routes | Free for hobby; ~$20/mo when you outgrow it |
| **Supabase** | Postgres DB + auth + storage | Free up to 500 MB + 50k MAU |
| **Railway** or **Render** | The Python FastAPI ML service (when you add it) | Free trial, then ~$5/mo |
| **Cloudflare R2** or **Supabase Storage** | Player avatars, team logos, VOD clips | Free tier covers early use |

**Day‑1 deploy:** `git push` to GitHub, connect the repo to Vercel, done. Vercel runs `npm run build` and gives you a live URL.

---

## 8. Recommended Order to Learn This Stack

1. **HTML/CSS basics** (4 hours) — if you've never built a webpage. https://web.dev/learn/html
2. **JavaScript fundamentals** (1 day) — variables, functions, arrays, fetch, async/await. https://javascript.info
3. **React** — https://react.dev/learn → do the Quick Start + Tic Tac Toe tutorial (3 hours).
4. **Next.js** — https://nextjs.org/learn → the official "Dashboard App" tutorial (4 hours). It teaches App Router, server components, and the database flow.
5. **Tailwind** — keep https://tailwindcss.com/docs open while you build. You'll learn by doing.
6. **TypeScript** — pick up incrementally. https://www.typescriptlang.org/docs/handbook/2/everyday-types.html is enough for now.
7. **Postgres + Prisma** — only when you're ready to persist data. https://www.prisma.io/docs/getting-started/quickstart-sqlite (15 min).
8. **APIs in general** — understand REST, GET/POST, JSON, headers, auth tokens. https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Introduction

If you're brand new, target **~2 weeks of part‑time learning** (React → Next.js → Tailwind) before you start adding real features beyond what's already built. You can read this codebase the whole time as a working example.

---

## 9. Files Already in This Project

```
esports project/
├── docs/                              ← you are here
│   ├── 01-TECH-STACK.md               (this file)
│   ├── 02-APIS-AND-DATA-SOURCES.md
│   ├── 03-COMPETITOR-ANALYSIS.md
│   └── 04-BUILD-ROADMAP.md
├── web/                               ← the Next.js app
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx             (global shell)
│   │   │   ├── page.tsx               (homepage)
│   │   │   ├── recruitment/page.tsx   (recruitment portal)
│   │   │   └── sponsorships/page.tsx  (sponsorship portal)
│   │   ├── components/                (reusable UI: navbar, footer, cards)
│   │   ├── lib/                       (utilities, mock data)
│   │   └── styles/                    (global CSS, design tokens)
│   ├── public/                        (static images, logos)
│   ├── package.json                   (dependencies)
│   └── tsconfig.json                  (TypeScript config)
└── README.md
```

Next: read `02-APIS-AND-DATA-SOURCES.md` to learn which external services feed your portals with real data.
