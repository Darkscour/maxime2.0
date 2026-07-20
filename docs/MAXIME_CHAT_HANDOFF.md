# Maxime Project — Chat Handoff

**Generated:** June 2026  
**Project path:** `c:\Users\sahit\Downloads\esports project\web\`

---

## Project Overview

**Maxime** is a Next.js 16 esports platform for team managers and players.

**Stack:** Clerk auth, Prisma/Supabase, raw SQL for newer tables (watchlist, notifications, analytics).

---

## Goals We Pursued

### Completed product goals

1. **Dashboard notifications** — Bell in header/sidebar for recruitment, analytics, etc.
2. **Custom invite messages** — Managers customize text when sending watchlist invites.
3. **Player invite flow** — Accept/decline on dashboard (no invite code required).
4. **Leave team** — Players can leave; inline on invites card and Browse Teams.
5. **Fix "already on team"** — Leave first, then accept another invite.
6. **Delete duplicate DXL Clan** — Removed older player-only duplicate; kept manager team (`sahithg1@terpmail.umd.edu`).
7. **Sponsorship pipeline** — "Save to pipeline" + status tracking on manager sponsorship directory.
8. **Roster hub** — Managers see full playerbase; accepted invites / code joins appear as TeamMembership.
9. **Watchlist ↔ roster sync** — Players on roster auto-removed from watchlist; blocked from re-adding.
10. **Manager org analytics** — Real metrics for roster joins, invites, scout views, sponsor leads.
11. **Dashboard layout polish** — Compact play time + team invites widgets side-by-side; invite code stat card; role consistency; roster hub UI cleanup.
12. **Onboarding in sidebar** — Temporarily added for both manager and player nav.

### Explicit UX decisions

- **Player overview row:** Play time and Team invites are small stat-style widgets in a 2-column grid (like Account/Team cards), not large cards.
- **Manager overview stat row:** Account shows membership role (e.g. "Captain"), not "Team manager"; Titles stat replaced with tap-to-copy invite code; 4th stat is Roster count.
- **Roster hub page:** Header = team name + "X on team" only — no target roster, no active/player split, no description, no bottom Send invites/Scout buttons.
- **Roster hub preview card:** Title "Roster hub" only — no "N players on roster" subtitle.
- **Roster member cards:** Avatar initials, one leadership label (Captain/Manager), game info as single line for players — no badge spam.
- **Watchlist:** Roster members should never appear; prune on fetch + remove on join/accept.
- **Onboarding nav:** Temporary — added back to sidebar for now.

---

## Current State (What Works)

| Area | Status |
|------|--------|
| Notifications bell | Done — API + UI in dashboard-shell.tsx |
| Invite accept/decline/leave | Done — APIs + player widgets |
| Manager watchlist + custom invite message | Done — Modal in watchlist-panel.tsx |
| Sponsorship pipeline on dashboard | Done — SponsorLeadActions on directory cards |
| Roster hub | Done — /dashboard/roster + preview on manager dashboard |
| Manager org analytics | Done — Real data via manager-analytics.ts |
| Watchlist auto-prune for roster members | Done — On fetch, join, accept, add, invite |
| DB message column on invites | Done — Migration + auto-heal in player-watchlist-db.ts |
| Build | Passes (npm run build) |

### Key user accounts (from DB investigation)

- `sahithg1@terpmail.umd.edu` — manager/captain, DXL Clan (kept)
- `sahithgandham@gmail.com` — player account
- `sahithg@sis.edu.in` — exists but had no team linked
- Duplicate DXL Clan (player-only) was deleted (id: cmq4dvhy00006ussosgdlsu81)

---

## Architecture Notes

### Raw SQL tables (not in Prisma schema)

Run setup scripts from `web/` if features fail silently:

```
npm run db:onboarding
npm run db:manager-columns
npm run db:player-analytics
npm run db:watchlist
npm run db:notifications
npm run db:sponsor-leads
```

Tables: PlayerWatchlist, PlayerRecruitmentInvite, UserNotification, PlayerProfileView, PlayerPlayTimeLog, SponsorLead, etc.

### Invite → roster flow

Accepting invite calls `joinTeamAsPlayer()` in `team-membership.ts`, which creates TeamMembership and removes player from watchlist. Manager sees them in roster hub via `fetchTeamRoster()`.

### Permissions

- `canEditTeam()` — captain/manager can edit team, roster, watchlist
- `canInvitePlayers()` — defined but NOT yet enforced on invite API (medium priority)

---

## Files Created / Heavily Modified

### New files

- src/lib/notifications-db.ts
- src/lib/team-membership.ts
- src/lib/team-roster.ts
- src/lib/manager-analytics.ts
- src/app/api/notifications/route.ts
- src/app/api/invites/[id]/accept/route.ts
- src/app/api/invites/[id]/decline/route.ts
- src/app/api/player/leave-team/route.ts
- src/app/api/team/roster/remove/route.ts
- src/app/dashboard/roster/page.tsx
- src/components/dashboard/dashboard-notifications.tsx
- src/components/dashboard/leave-team-card.tsx
- src/components/dashboard/invite-message-modal.tsx
- src/components/dashboard/roster-hub-panel.tsx
- src/components/dashboard/roster-hub-preview.tsx
- src/components/dashboard/invite-code-stat-card.tsx
- src/components/dashboard/play-time-widget.tsx
- src/components/dashboard/team-invites-widget.tsx
- src/components/dashboard/manager-analytics-card.tsx
- scripts/setup-notifications-tables.ts
- scripts/delete-team-by-manager-email.ts
- scripts/delete-team-by-id.ts

### Key modified files

- src/app/dashboard/page.tsx
- src/lib/player-watchlist-db.ts
- src/lib/dashboard-nav.ts
- src/components/dashboard/dashboard-analytics-card.tsx
- src/components/dashboard/dashboard-join-team-panel.tsx
- src/components/dashboard/watchlist-panel.tsx
- src/components/sponsorships/live-sponsorship-directory.tsx
- src/app/dashboard/sponsorships/page.tsx
- src/middleware.ts
- package.json

---

## Open Issues / Not Done Yet

| Priority | Issue |
|----------|-------|
| Medium | Enforce canInvitePlayers() (manager verification) on watchlist invite API |
| Medium | Add Prisma models for watchlist/notifications OR document setup in README |
| Low | Consolidate duplicate components (play-time-report vs play-time-widget) |
| Low | Captaincy transfer before manager leave — no UI |
| Low | Remove temporary onboarding sidebar link when no longer needed |
| Low | Marketing sponsorship cards still show "coming soon" — expected |

### Known past bugs (fixed)

- column i.message does not exist — run npm run db:notifications
- Player on team couldn't accept invites — leave flow + direct accept API
- Manager didn't see accepted players — roster hub built
- Duplicate DXL Clan teams — older one deleted

---

## Dashboard Nav (Current)

**Manager:** Overview, Sponsorships, Scout players, Roster hub, Watchlist, Onboarding (temp), Account, Team profile

**Player:** Overview, Browse teams, Onboarding (temp), Account, Player profile

---

## Suggested Next Steps

1. Smoke test manager + player flows end-to-end.
2. Enforce manager verification on recruitment invites if required.
3. Consolidate duplicate UI components.
4. Roster hub enhancements if needed: captaincy transfer, filter/search.
5. README / setup docs for all npm run db:* scripts.
6. Remove onboarding from sidebar when done testing.

---

## Commands Reference

```
cd web
npm run dev
npm run build
npm run db:notifications
npm run db:watchlist
npx tsx scripts/list-teams-by-name.ts DXL
npx tsx scripts/delete-team-by-id.ts <team-id>
```

---

## Reasoning to Carry Forward

- Prefer minimal, focused diffs; match existing patterns (raw SQL where Prisma client is stale).
- Silent DB failures are common — always verify setup scripts ran.
- Roster = TeamMembership — any feature showing who's on the team should query that.
- Watchlist is pre-roster only — auto-prune when membership exists.
- User cares about dashboard density — stat-card-sized widgets, side-by-side layouts.
- Role consistency — show actual membership role (Captain), not account type (Team manager).

---

*Paste this into a new chat and say what you want to tackle next.*
