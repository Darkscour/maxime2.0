# Workflow Polish Audit — Maxime

**Purpose:** Track what needs polishing across every major user workflow so the platform fulfills its purpose — collegiate esports recruitment, team ops, and sponsorships.  
**Last updated:** June 2026  
**Repo:** `esports project` — app code lives in **`web/`**

---

## How to read this doc

Each workflow is broken down into:

- **Current flow** — how it works today (UI → API → DB → notifications)
- **What works well** — keep these patterns
- **Polish needed** — specific gaps with file references
- **Priority** — P0 (trust/dead ends), P1 (core friction), P2 (UX polish)

Priority key:

| Level | Meaning |
|-------|---------|
| **P0** | Broken trust or dead ends — fix before calling the workflow "done" |
| **P1** | Core journey works but feels rough or incomplete |
| **P2** | UX polish, clarity, and delight |

---

## Cross-cutting: Permissions

This affects recruitment, sponsorship, and manager trust across the app.

### Current model

| Function | Definition | Enforced? |
|----------|------------|-----------|
| `canEditTeam` | captain or manager role | Yes — pages + APIs |
| `canInvitePlayers` | `canEditTeam` + verified manager | **No — defined but never imported outside `permissions.ts`** |
| `canUseTeamPipeline` | any team member | Partially |

**Key file:** `web/src/lib/permissions.ts`

### UI vs API mismatch

| UI says (`role-permissions-card.tsx`) | API does |
|---------------------------------------|----------|
| Unverified managers can't invite players | Invites work via `canEditTeam()` only (`api/watchlist/invite/route.ts`) |
| Unverified managers can't use sponsorship pipeline | Leads API allows any team member (`api/sponsorship/leads/route.ts`) |

### Polish needed

| Issue | Files | Priority |
|-------|-------|----------|
| `canInvitePlayers` not enforced anywhere | `permissions.ts`, `api/watchlist/invite/route.ts` | **P0** |
| Sponsorship pipeline not gated by verification | `api/sponsorship/leads/route.ts`, `role-permissions-card.tsx` | **P0** |
| UI/API permission mismatch erodes trust | `role-permissions-card.tsx` vs APIs above | **P0** |
| `requireTeamMembership` allows any role on sponsorship leads | `api/sponsorship/leads/route.ts` | **P1** |
| Verification is one-shot at onboarding — no re-evaluation if email updated | `manager-verification.ts`, team settings | **P1** |
| Invite code sharing allowed while "invites locked" per permissions copy | `InviteCodeStatCard`, `team-invite-panel.tsx` | **P2** |

---

## 1. Team manager onboarding → dashboard

**Purpose:** Get a team set up and recruiting quickly.

### Current flow

Sign-up → `/auth/continue` (`post-auth.ts`) → `/onboarding` → `/onboarding/team` (`team-onboarding-form.tsx`) → `POST /api/onboarding/team` (creates `Team`, `TeamMembership`, sets `managerVerificationStatus`) → `/onboarding/done?invite=…` → `/dashboard`.

### What works well

- Clear role split at `/onboarding/page.tsx`; draft persistence via `onboarding-draft.ts`
- Manager verification evaluated server-side in `manager-verification.ts` + stored on `UserAccount`
- Transactional team + membership creation in `api/onboarding/team/route.ts`
- Dashboard layout gate in `dashboard/layout.tsx` via `deriveOnboardingComplete`
- Invite code surfaced on dashboard via `InviteCodeStatCard` (`dashboard/page.tsx`)

### Polish needed

| Issue | Files | Priority |
|-------|-------|----------|
| Verification outcome never shown after onboarding — API returns status/reason but form redirects without displaying it | `team-onboarding-form.tsx`, `onboarding/done/page.tsx` | **P1** |
| Invite code hidden on done screen for non-captains — Head Coach / Team Manager roles miss code on completion | `onboarding/done/page.tsx`, `InviteCodeStatCard` on dashboard | **P1** |
| No notification when player joins via invite code — managers only discover via refresh | `api/onboarding/join/route.ts`, `api/onboarding/player/route.ts` | **P1** |
| `TeamOverviewCard` built but unused — rich team summary + verification hint exists but isn't on dashboard | `team-overview-card.tsx` | **P2** |
| Signed-in users hitting `/` always redirect to auth continue — can surprise returning users | `middleware.ts` | **P2** |

---

## 2. Player onboarding (solo vs invite code join)

**Purpose:** Create a scout profile and optionally join a team.

### Current flow

`/onboarding/player` (`player-onboarding-form.tsx`) → `POST /api/onboarding/player` (creates `PlayerProfile`, optional `TeamMembership` via `inviteCode`) → `/onboarding/done`.

Post-onboarding join: `/onboarding/join` or dashboard `DashboardJoinTeamPanel` → `POST /api/onboarding/join`.

### What works well

- Dual CTAs: "Save profile & join team" vs "Create profile without a team"
- Client + server validation (rank/game match, age, bio length)
- Solo path correctly sets `onboardingComplete` without team
- `/onboarding/done` links solo players to `/onboarding/join`

### Polish needed

| Issue | Files | Priority |
|-------|-------|----------|
| Invalid invite code rolls back entire profile creation — transaction throws `INVALID_INVITE`; player loses all form work | `api/onboarding/player/route.ts` | **P0** |
| Invite join paths don't notify managers | `api/onboarding/join/route.ts`, `api/onboarding/player/route.ts` | **P1** |
| Copy says "captain" everywhere but non-captain managers also have codes | `player-onboarding-form.tsx`, `join-team-form.tsx`, `dashboard-join-team-panel.tsx` | **P2** |
| No success state on dashboard join — inline success only, easy to miss | `dashboard-join-team-panel.tsx` | **P2** |
| Account type locked to `player` — managers cannot add a player profile; no UI explains this | `api/onboarding/player/route.ts` | **P2** |

---

## 3. Player join request flow

**Purpose:** Player expresses interest → manager reviews → invite → accept → roster.

### Current flow

```
Browse teams → Request → Manager reviews → Send invite → Player accepts → Roster
```

1. Player: `/dashboard/teams` → `TeamJoinRequestButton` → `POST /api/teams/join-request`
2. Creates `TeamJoinRequest` row + notifications to captain/manager user IDs
3. Manager: `/dashboard/join-requests` → `JoinRequestsPanel` → `POST /api/watchlist/invite`
4. Creates `PlayerRecruitmentInvite` + `fulfillJoinRequest` + player notification
5. Player: `TeamInvitesWidget` / `PendingInvitesCard` → `POST /api/invites/[id]/accept` → roster

### What works well

- Solid empty state on join requests (`join-requests-panel.tsx`)
- Duplicate-request handling (`createTeamJoinRequest` reopens dismissed rows)
- Blocks join request if pending invite exists (409 with helpful message)
- Join request cleared when invite sent (`fulfillJoinRequest` in `team-join-request-db.ts`)
- Manager analytics counts join requests (`manager-analytics.ts` + pipeline chips)

### Polish needed

| Issue | Files | Priority |
|-------|-------|----------|
| Player never notified when request dismissed | `api/teams/join-requests/route.ts` (DELETE) | **P1** |
| Player not notified meaningfully when invite sent — generic notification with `href: "/dashboard"` | `api/watchlist/invite/route.ts` | **P1** |
| No player-side "my pending requests" view — only disabled button state on team cards | `teams-directory.tsx`, `team-join-request-button.tsx` | **P1** |
| `alreadyPending: true` silent in UI — button shows "Request sent" either way | `team-join-request-button.tsx` | **P2** |
| Browse teams header says "invite code" but primary action is join request | `dashboard/teams/page.tsx`, `teams-directory.tsx` | **P2** |
| Accept invite: no success toast/banner — only `router.refresh()` | `team-invites-widget.tsx`, `pending-invites-card.tsx` | **P2** |

---

## 4. Manager invite flow (watchlist → invite → accept)

**Purpose:** Proactive recruitment from scout.

### Current flow

Scout grid/profile/watchlist → `POST /api/watchlist/invite` → DB invite + notification → player accepts via invite APIs → manager notified on accept (`api/invites/[id]/accept/route.ts`).

### What works well

- Custom message modal reused (`invite-message-modal.tsx`)
- Invite status badges on watchlist/scout cards
- Accept path removes from watchlist (`team-membership.ts`)
- Decline notifies inviter with link to watchlist

### Polish needed

| Issue | Files | Priority |
|-------|-------|----------|
| Unverified managers can send invites — UI says restricted, API allows | `api/watchlist/invite/route.ts`, `permissions.ts` | **P0** |
| Players on other teams still scoutable with no badge | `player-analytics.ts`, `player-scout-visibility.ts`, `scout/page.tsx` | **P1** |
| Notification deep link is `/dashboard`, not invites widget | `api/watchlist/invite/route.ts` | **P1** |
| Invite to rostered player fails late — 409 at send time; no upfront disable | `scout-player-grid-card.tsx` | **P2** |
| Scout profile hides watchlist when join request pending | `scout/[handle]/page.tsx` | **P2** |
| No re-invite after decline — unclear UX | `player-watchlist-db.ts` | **P2** |

---

## 5. Scout discovery (list, profile, visibility)

**Purpose:** Find and evaluate players at scale.

### Current flow

`/dashboard/scout` (managers only) → `listScoutablePlayers` → `filterPlayersForScout` (removes your roster) → grid cards with watchlist/invite.

Profile: `/dashboard/scout/[handle]` → `recordPlayerProfileView` → analytics + optional "New profile view" notification to player.

### What works well

- Visibility matrix documented in `player-scout-visibility.ts`
- Join-request badges on grid cards
- Profile view deduped (1 hour) and self-views skipped
- Non-managers redirected from scout routes

### Polish needed

| Issue | Files | Priority |
|-------|-------|----------|
| No filters (game, region, rank, availability) — hard to use at scale | `scout/page.tsx` | **P1** |
| Players on other teams appear fully recruitable | `player-analytics.ts`, `scout-player-grid-card.tsx` | **P1** |
| Profile view notification is generic — no team name; links to `/dashboard` | `player-analytics.ts` | **P2** |
| Manager without team can browse but not act — no CTA to complete team setup | `scout/page.tsx`, `scout-watchlist-button.tsx` | **P2** |
| Scout profile missing age/tags in detail view vs settings preview | `scout/[handle]/page.tsx`, `player-profile-edit-form.tsx` | **P2** |

---

## 6. Roster management (view, remove, leave, captaincy)

**Purpose:** See who's on the team, remove players, handle departures.

### Current flow

- **View:** `/dashboard/roster` → `RosterHubPanel`
- **Remove:** `POST /api/team/roster/remove` → player notification
- **Leave:** `LeaveTeamCard` / widgets → `POST /api/player/leave-team` → `leaveCurrentTeam`

### What works well

- Leadership vs players grouping in `roster-hub-panel.tsx`
- Remove restricted to player role slots
- Removed players get notification
- Leave team keeps player profile (`leave-team-card.tsx` copy matches behavior)

### Polish needed

| Issue | Files | Priority |
|-------|-------|----------|
| Captaincy transfer promised but not implemented — API error with no UI/API to transfer | `api/player/leave-team/route.ts`, `team-membership.ts` | **P0** |
| Managers/captains cannot leave at all — dead end with "Update your team in settings" | `leave-team-card.tsx`, `api/player/leave-team/route.ts` | **P1** |
| No notification to remaining managers when player leaves voluntarily | `api/player/leave-team/route.ts` | **P1** |
| Remove uses `window.confirm` — rough for production | `roster-hub-panel.tsx` | **P2** |
| Roster empty state lacks next steps ("Share invite code", "Scout players") | `roster-hub-panel.tsx` | **P2** |
| Roster preview on dashboard but full `TeamOverviewCard` unused | `dashboard/page.tsx`, `roster-hub-preview.tsx` | **P2** |

---

## 7. Watchlist management

**Purpose:** Shortlist players before inviting.

### Current flow

- **Add/remove:** `POST/DELETE /api/watchlist` from scout UI
- **Page:** `/dashboard/watchlist` → `WatchlistPanel` → invite or remove

### What works well

- Good empty state with link to scout
- Invite-pending badge on cards
- Auto-prune when player joins roster (`player-watchlist-db.ts`)

### Polish needed

| Issue | Files | Priority |
|-------|-------|----------|
| Non-editors redirected to team settings instead of read-only explanation | `watchlist/page.tsx` | **P2** |
| No sort/compare tools — watchlist is flat grid | `watchlist-panel.tsx` | **P2** |
| Cannot remove from watchlist on scout grid — only add; must go to watchlist page | `scout-player-grid-card.tsx` | **P2** |
| Pipeline chip links pending invites to watchlist, not dedicated "outbound invites" view | `manager-analytics-card.tsx` | **P2** |

---

## 8. Notifications (creation, display, mark read, deep links)

**Purpose:** Keep both sides informed at every step.

### Current flow

**Created in:** join request, invite send/accept/decline, roster remove, profile view.

**Stored in:** runtime-created `UserNotification` table (`notifications-db.ts`).

**UI:** bell in `dashboard-notifications.tsx` → `GET/PATCH /api/notifications`.

### What works well

- Lazy schema bootstrap for notifications table
- Mark single / mark all read
- Polling every 60s
- Type-based tone styling

### Polish needed

| Issue | Files | Priority |
|-------|-------|----------|
| Weak deep links — most recruitment notifications use `href: "/dashboard"` | `api/watchlist/invite/route.ts`, `api/teams/join-request/route.ts`, `player-analytics.ts` | **P1** |
| No dedicated notifications page — footer link goes to dashboard | `dashboard-notifications.tsx` | **P2** |
| GET failures return empty silently — user sees "No updates" on DB errors | `api/notifications/route.ts` | **P2** |
| No real-time update after in-app actions — must wait for poll or manual open | `dashboard-notifications.tsx` | **P2** |
| Profile view spam potential — one notification per unique manager per hour; no batching | `player-analytics.ts` | **P2** |
| Raw SQL table outside Prisma schema — migration drift risk | `notifications-db.ts`, `team-join-request-db.ts` | **P2** (ops) |

### Recommended deep link targets

| Event | Should link to |
|-------|----------------|
| Join request received | `/dashboard/join-requests` |
| Invite sent (player) | `/dashboard` (invites section / anchor) |
| Invite accepted (manager) | `/dashboard/roster` |
| Invite declined (manager) | `/dashboard/watchlist` |
| Roster remove (player) | `/dashboard/teams` |
| Profile view (player) | `/dashboard` (analytics section) |
| Join request dismissed (player) | `/dashboard/teams` |

---

## 9. Player dashboard (play time, analytics, profile)

**Purpose:** Track visibility, manage invites, stay active.

### Current flow

`/dashboard` loads `getPlayerAnalytics`, `PlayTimeWidget`, `TeamInvitesWidget`, profile summary, `PlayerAnalyticsCard`.

### What works well

- Play time updates log history for charts (`api/player/play-time/route.ts` + `logPlayerPlayTime`)
- Analytics empty states with hints (`player-analytics-card.tsx`)
- Quick links to settings and browse teams when teamless

### Polish needed

| Issue | Files | Priority |
|-------|-------|----------|
| `TeamInvitesWidget` only shows first 2 invites — rest hidden | `team-invites-widget.tsx` | **P1** |
| No "request status" section for pending join requests | `dashboard/page.tsx` | **P1** |
| `PendingInvitesCard` exists but isn't on main dashboard | `dashboard/page.tsx`, `pending-invites-card.tsx` | **P2** |
| Invite messages truncated/hidden in compact widget | `team-invites-widget.tsx` vs `pending-invites-card.tsx` | **P2** |
| Play time widget duplicates settings — no link to full play-time report | `play-time-widget.tsx`, `play-time-report.tsx` | **P2** |
| Profile block on dashboard duplicates settings — long scroll | `dashboard/page.tsx` | **P2** |

---

## 10. Manager dashboard (analytics, pipeline chips)

**Purpose:** Recruitment pipeline at a glance.

### Current flow

`/dashboard` → `getManagerOrgAnalytics` → `ManagerAnalyticsCard` with roster/scout charts + pipeline chips.

### What works well

- Pipeline chips deep-link to join-requests and watchlist
- Weekly vs all-time chart toggle
- Roster hub preview for managers
- Verification hint in account stat card

### Chart vs summary clarification

| Chart | Line graph tracks | Summary cards below |
|-------|-------------------|---------------------|
| **Roster size** | Active members at end of each week (0 before anyone joined) | On roster & Players = current totals; New joins = period-based |
| **Scouting activity** | Profile views per week | Profile views, Join requests, Invites sent = period-based |

**Key files:** `manager-analytics-card.tsx`, `manager-analytics.ts`, `manager-analytics-line-chart.tsx`

### Polish needed

| Issue | Files | Priority |
|-------|-------|----------|
| Unverified managers still have full recruitment APIs — UI says restricted | See Permissions section | **P0** |
| No verification banner on dashboard — only small hint in stat card | `dashboard/page.tsx`, `team-overview-card.tsx` | **P1** |
| No sponsorship pipeline summary on manager dashboard | `dashboard/page.tsx` | **P1** |
| Analytics hidden if `getManagerOrgAnalytics` fails/null | `dashboard-analytics-card.tsx` | **P2** |
| Nav lacks badge counts for join requests / pending invites | `dashboard-nav.ts`, `dashboard-shell.tsx` | **P2** |

---

## 11. Sponsorship pipeline (discover → save lead → pitch → status)

**Purpose:** Discover sponsors, save leads, track outreach.

### Current flow

`/dashboard/sponsorships` → `LiveSponsorshipDirectory` → per-card `SponsorLeadActions` → `POST/PATCH /api/sponsorship/leads` → `sponsor-lead-store`.

### What works well

- Fit score computed on save (`sponsor-fit.ts`)
- Status lifecycle: saved → applied → replied → deal / passed
- Auto-advance to "applied" when opening application link
- Empty/error states for directory fetch

### Polish needed

| Issue | Files | Priority |
|-------|-------|----------|
| Verification not enforced on leads API — any team member can save/update | `api/sponsorship/leads/route.ts`, `role-permissions-card.tsx` | **P0** |
| No pipeline overview page — leads only visible per sponsor card | `live-sponsorship-directory.tsx` | **P1** |
| No notes UI — PATCH supports `notes` but no form | `sponsor-lead-actions.tsx` | **P1** |
| AI pitch advisor only on demo cards, not live directory | `sponsor-directory-card.tsx` vs `sponsor-ai-advisor.tsx` | **P1** |
| No notifications for pipeline milestones | Entire sponsorship flow | **P2** |
| Public `/sponsorships` vs dashboard directory diverge — marketing demo vs live DB | `sponsorships-portal.tsx`, `dashboard/sponsorships/page.tsx` | **P2** |

---

## 12. Settings (account, team profile, player profile)

**Purpose:** Keep account, team, and player info accurate.

### Current flow

- **Account:** `/dashboard/settings/account` → `AccountSettingsForm` + `RolePermissionsCard`
- **Team:** `/dashboard/settings/team` → `TeamProfileEditForm` → `PATCH /api/team/profile`
- **Player:** `/dashboard/settings/profile` → `PlayerProfileEditForm` → `PATCH /api/player/profile`

### What works well

- Settings chrome hides irrelevant tabs (`settings/layout.tsx`)
- Non-editors get clear team settings blocked state
- Player profile settings include live scout card preview
- Account permissions card explains verification well

### Polish needed

| Issue | Files | Priority |
|-------|-------|----------|
| No way to update manager verification email/title after onboarding | `team-onboarding-form.tsx` only | **P1** |
| Verification pending: no "what to do next" action | `role-permissions-card.tsx` | **P1** |
| Team settings success redirects to dashboard — no inline confirmation | `team-profile-edit-form.tsx` | **P2** |
| Settings index auto-redirects when only one profile type | `settings/page.tsx` | **P2** |

---

## Recommended implementation order

Work through phases in order — each phase unlocks trust for the next.

### Phase 1 — Trust & dead ends (1–2 days)

1. Enforce `canInvitePlayers` on `POST /api/watchlist/invite` + disable in UI when unverified
2. Enforce verified manager on sponsorship leads API + UI gate on `SponsorLeadActions`
3. Fix invalid invite code failing entire player profile transaction (save profile first, join separately)
4. Implement captaincy transfer UI — or remove misleading "Transfer captaincy before leaving" error

### Phase 2 — Complete the recruitment loop (2–3 days)

5. Notification deep links to specific surfaces (invites, join-requests, roster)
6. Player pending requests panel + show all invites (not just 2)
7. Scout filters + "on another team" badges
8. Manager notifications: code joins, voluntary leaves, request dismissals
9. Show verification result on onboarding done + dashboard banner

### Phase 3 — Dashboard & pipeline clarity (1–2 days)

10. Sponsorship pipeline overview + notes UI
11. AI pitch advisor on live sponsor cards
12. Nav badge counts for join requests / pending invites
13. Wire up `TeamOverviewCard` and `PendingInvitesCard` on dashboard

### Phase 4 — UX polish (ongoing)

14. Success toasts after accept/join/save actions
15. Replace `window.confirm` with proper modals
16. Empty-state CTAs on roster, watchlist, scout
17. Align copy (invite code vs join request on Browse Teams)
18. Reconcile marketing copy with real features (fit score, verified players, filters)

---

## P0 checklist (quick reference)

- [ ] Enforce `canInvitePlayers` on invite API + UI
- [ ] Enforce verified manager on sponsorship leads API + UI
- [ ] Fix player onboarding invite-code rollback
- [ ] Captaincy transfer UI or honest leave-team UX

---

## P1 checklist (quick reference)

- [ ] Notification deep links for all event types
- [ ] Player pending join-request status view
- [ ] Show all team invites on player dashboard
- [ ] Scout filters + "on another team" badges
- [ ] Manager notifications (code joins, leaves, dismissals)
- [ ] Verification banner on onboarding done + dashboard
- [ ] Sponsorship pipeline overview + notes
- [ ] Re-verification path in settings

---

## Related docs

| Doc | Contents |
|-----|----------|
| `docs/06-PROJECT-STATUS.md` | Overall project status and tech stack |
| `docs/04-BUILD-ROADMAP.md` | Week-by-week build plan |
| `docs/MAXIME_CHAT_HANDOFF.md` | Recent session handoff (may overlap — prefer updating this audit as workflows are polished) |

---

## Workflow maturity scorecard

| Area | Maturity | Biggest gap |
|------|----------|-------------|
| Manager onboarding | **High** | Verification feedback |
| Player onboarding | **Medium-High** | Invite code rollback |
| Join requests | **Medium** | Player status view + notifications |
| Manager invites | **Medium** | Permission enforcement |
| Scout | **Medium** | Filters + rostered-player badges |
| Roster | **Medium-High** | Captaincy transfer |
| Watchlist | **High** | Minor UX gaps |
| Notifications | **Medium** | Deep links |
| Player dashboard | **Medium-High** | Hidden invites + request status |
| Manager dashboard | **High** | Sponsorship summary |
| Sponsorships | **Medium-High** (dashboard) | Pipeline overview + permissions |
| Settings | **High** | Re-verification |
| Permissions | **Low** (enforcement) | UI/API mismatch |
