import type {
  DeskAudience,
  DeskActivityItem,
  DeskViewProps,
} from "@/components/dashboard/desk-mantine";

// Deterministic mock data for the /preview/dashboard/[type] route.
// Values are hand-picked to look believable for the given audience so
// design reviewers can judge layout without needing real accounts.

const CURRENT_MONTH = new Date().toLocaleString(undefined, { month: "long" });

function makeSeries(base: number, jitter: number[], length = 12): number[] {
  return jitter.slice(0, length).map((j, i) =>
    Math.max(0, Math.round(base + j + Math.sin(i / 2) * base * 0.15)),
  );
}

function activity(entries: Array<Omit<DeskActivityItem, "id">>): DeskActivityItem[] {
  return entries.map((e, i) => ({ ...e, id: `mock-${i}` }));
}

const MANAGER_COLLEGIATE: DeskViewProps = {
  audience: "manager_collegiate",
  identity: {
    kind: "org",
    name: "Ridge State Esports",
    subLabel: "Ridge State University",
    code: "MX-A9F3-COLL-42B7",
    inviteCode: "A9F3-COLL-42B7",
    balanceLabel: "Active roster",
    balanceValue: "12 / 15",
    chainLabel: "Region",
    chainValue: "NA East",
    primaryCta: { label: "Invite", href: "/dashboard/roster" },
    secondaryCta: { label: "Roster", href: "/dashboard/roster" },
  },
  compliance: {
    title: "Program health",
    subtitle: "Ridge State esports · Fall term",
    items: [
      { label: "12 of 12 players academically eligible", status: "good" },
      { label: "3 sponsor replies waiting on you", status: "warn" },
      { label: "Discord bot linked · scrim channels active", status: "good" },
    ],
  },
  signals: [
    { label: "Scout views", value: "1,240", trendPct: 34, caption: "This week" },
    { label: "Join requests", value: "8", trendPct: -13, caption: "Awaiting review" },
    { label: "Sponsor leads", value: "5", trendPct: 18, caption: "Applied · Replied" },
  ],
  movement: {
    title: "Roster movement",
    monthLabel: CURRENT_MONTH,
    primaryLabel: "Active roster",
    primaryValue: "12 / 15",
    changeAnnotation: "+2 this month",
    trendPct: 20,
    splitA: { label: "Joined", value: "3" },
    splitB: { label: "Invites sent", value: "4" },
    breakdown: [
      { label: "Duelist", value: "3 players" },
      { label: "Controller", value: "3 players" },
      { label: "Initiator", value: "3 players" },
      { label: "Sentinel", value: "3 players" },
    ],
    ctaLabel: "Manage roster",
    ctaHref: "/dashboard/roster",
  },
  overview: {
    title: "Analytics",
    labels: [
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
    ],
    seriesA: {
      label: "Scout views",
      values: makeSeries(600, [0, 120, 260, 180, 320, 380, 440, 520, 640, 720, 820, 900]),
    },
    seriesB: {
      label: "Roster joins",
      values: makeSeries(2, [0, 1, 2, 3, 2, 4, 3, 5, 4, 5, 6, 7]),
    },
  },
  activity: activity([
    {
      type: "Invite",
      title: "Kaia \"vex\" Rios accepted your invite",
      when: "12m ago",
      status: "good",
      href: "/dashboard/roster",
    },
    {
      type: "Sponsor",
      title: "OrbitDrinks replied to your pitch",
      when: "2h ago",
      status: "warn",
      href: "/dashboard/sponsorships",
    },
    {
      type: "Join",
      title: "3 players requested to join Ridge State",
      when: "5h ago",
      status: "pending",
      href: "/dashboard/join-requests",
    },
    {
      type: "Scout",
      title: "Berkeley Esports viewed 4 profiles from your roster",
      when: "Yesterday",
      status: "neutral",
      href: "/dashboard/scout",
    },
    {
      type: "Eligibility",
      title: "Fall term GPA check completed — all clear",
      when: "2 days ago",
      status: "good",
      href: "/dashboard/roster",
    },
    {
      type: "Discord",
      title: "Bot re-linked to #ridge-scrims",
      when: "3 days ago",
      status: "good",
    },
  ]),
};

const MANAGER_GRASSROOTS: DeskViewProps = {
  audience: "manager_grassroots",
  identity: {
    kind: "org",
    name: "Blackline VLR",
    subLabel: "Grassroots · North America",
    code: "MX-BL45-GR-91Q2",
    inviteCode: "BL45-GR-91Q2",
    balanceLabel: "Active roster",
    balanceValue: "7 / 8",
    chainLabel: "Region",
    chainValue: "NA West",
    primaryCta: { label: "Invite", href: "/dashboard/roster" },
    secondaryCta: { label: "Roster", href: "/dashboard/roster" },
  },
  compliance: {
    title: "Team health",
    subtitle: "Blackline VLR · this week",
    items: [
      { label: "7 of 8 slots filled — 1 duelist open", status: "warn" },
      { label: "Next scrim scheduled Fri 7pm PT", status: "good" },
      { label: "2 duel challenges to respond to", status: "warn" },
    ],
  },
  signals: [
    { label: "Scout views", value: "412", trendPct: 22, caption: "This week" },
    { label: "Join requests", value: "5", trendPct: 25, caption: "Awaiting review" },
    { label: "Duels", value: "2", trendPct: null, caption: "Incoming challenges" },
  ],
  movement: {
    title: "Roster movement",
    monthLabel: CURRENT_MONTH,
    primaryLabel: "Active roster",
    primaryValue: "7 / 8",
    changeAnnotation: "+1 this month",
    trendPct: 14,
    splitA: { label: "Joined", value: "1" },
    splitB: { label: "Invites sent", value: "2" },
    breakdown: [
      { label: "Duelist", value: "2 players" },
      { label: "Controller", value: "2 players" },
      { label: "Sentinel", value: "2 players" },
      { label: "Initiator", value: "1 player" },
    ],
    ctaLabel: "Manage roster",
    ctaHref: "/dashboard/roster",
  },
  overview: {
    title: "Analytics",
    labels: ["W-11","W-10","W-9","W-8","W-7","W-6","W-5","W-4","W-3","W-2","W-1","Now"],
    seriesA: {
      label: "Scout views",
      values: makeSeries(180, [0, 40, 80, 120, 90, 160, 220, 260, 300, 340, 380, 412]),
    },
    seriesB: {
      label: "Scrim count",
      values: makeSeries(1, [0, 1, 1, 2, 2, 3, 2, 3, 4, 3, 4, 5]),
    },
  },
  activity: activity([
    {
      type: "Duel",
      title: "Neon Void challenged you to a Bo3 scrim (Fri)",
      when: "20m ago",
      status: "warn",
      href: "/dashboard/duels",
    },
    {
      type: "Join",
      title: "\"pika\" requested to join Blackline VLR",
      when: "1h ago",
      status: "pending",
      href: "/dashboard/join-requests",
    },
    {
      type: "Scrim",
      title: "Scrim confirmed vs. Static Rift — Fri 7pm PT",
      when: "3h ago",
      status: "good",
      href: "/dashboard/duels",
    },
    {
      type: "Scout",
      title: "3 orgs viewed your public roster page",
      when: "Yesterday",
      status: "neutral",
    },
    {
      type: "Discord",
      title: "Bot posted scrim results to #match-log",
      when: "2 days ago",
      status: "good",
    },
    {
      type: "Invite",
      title: "Invite sent to \"fable\" (12h remaining)",
      when: "3 days ago",
      status: "pending",
      href: "/dashboard/roster",
    },
  ]),
};

const PLAYER_COLLEGIATE: DeskViewProps = {
  audience: "player_collegiate",
  identity: {
    kind: "player",
    name: "@aurora_jax",
    subLabel: "Valorant · Duelist · Immortal 2",
    code: "handle · aurora_jax · Ridge State",
    balanceLabel: "Weekly hours",
    balanceValue: "18h",
    chainLabel: "Region",
    chainValue: "NA East",
    primaryCta: { label: "Browse teams", href: "/dashboard/teams" },
    secondaryCta: { label: "Edit profile", href: "/dashboard/settings/profile" },
  },
  compliance: {
    title: "Scout status",
    subtitle: "Your recruitment visibility",
    items: [
      { label: "Scout card 100% complete", status: "good" },
      { label: "2 team invites waiting on you", status: "warn" },
      { label: "Weekly hours logged for this week", status: "good" },
    ],
  },
  signals: [
    { label: "Profile views", value: "84", trendPct: 42, caption: "This week" },
    { label: "Invites", value: "2", trendPct: null, caption: "Awaiting reply" },
    { label: "Scouts watching", value: "11", trendPct: 18, caption: "Unique teams" },
  ],
  movement: {
    title: "Play cadence",
    monthLabel: CURRENT_MONTH,
    primaryLabel: "Weekly hours",
    primaryValue: "18h",
    changeAnnotation: "+3h vs last week",
    trendPct: 20,
    splitA: { label: "Active weeks", value: "5 / 6" },
    splitB: { label: "Views (wk)", value: "84" },
    breakdown: [
      { label: "Ranked", value: "11h" },
      { label: "Scrim", value: "5h" },
      { label: "VOD review", value: "2h" },
    ],
    ctaLabel: "Update hours",
    ctaHref: "/dashboard/settings/profile",
  },
  overview: {
    title: "Analytics",
    labels: ["W-5","W-4","W-3","W-2","W-1","Now"],
    seriesA: {
      label: "Profile views",
      values: [22, 34, 40, 52, 68, 84],
    },
    seriesB: {
      label: "Play hours",
      values: [12, 14, 10, 16, 15, 18],
    },
  },
  activity: activity([
    {
      type: "Invite",
      title: "Ridge State Esports invited you to their Valorant roster",
      when: "1h ago",
      status: "warn",
      href: "/dashboard/invites",
    },
    {
      type: "View",
      title: "5 new scout teams viewed your profile",
      when: "Today",
      status: "neutral",
    },
    {
      type: "Match",
      title: "Weekly hours updated (+3h vs last week)",
      when: "Yesterday",
      status: "good",
      href: "/dashboard/settings/profile",
    },
    {
      type: "Team",
      title: "Berkeley Esports added you to their watchlist",
      when: "2 days ago",
      status: "neutral",
    },
    {
      type: "Profile",
      title: "You added \"Sova main · IGL\" to your tags",
      when: "3 days ago",
      status: "good",
      href: "/dashboard/settings/profile",
    },
  ]),
};

const PLAYER_GRASSROOTS: DeskViewProps = {
  audience: "player_grassroots",
  identity: {
    kind: "player",
    name: "@shadowlark",
    subLabel: "League of Legends · Jungler · Diamond IV",
    code: "handle · shadowlark · NA · Free agent",
    balanceLabel: "Weekly hours",
    balanceValue: "22h",
    chainLabel: "Region",
    chainValue: "NA West",
    primaryCta: { label: "Browse teams", href: "/dashboard/teams" },
    secondaryCta: { label: "Edit profile", href: "/dashboard/settings/profile" },
  },
  compliance: {
    title: "Scout status",
    subtitle: "Your recruitment visibility",
    items: [
      { label: "Scout card 100% complete", status: "good" },
      { label: "3 grassroots orgs viewing this week", status: "good" },
      { label: "Weekly hours logged", status: "good" },
    ],
  },
  signals: [
    { label: "Profile views", value: "63", trendPct: 28, caption: "This week" },
    { label: "Invites", value: "1", trendPct: null, caption: "Awaiting reply" },
    { label: "Scouts watching", value: "6", trendPct: 12, caption: "Unique teams" },
  ],
  movement: {
    title: "Play cadence",
    monthLabel: CURRENT_MONTH,
    primaryLabel: "Weekly hours",
    primaryValue: "22h",
    changeAnnotation: "+4h vs last week",
    trendPct: 22,
    splitA: { label: "Active weeks", value: "6 / 6" },
    splitB: { label: "Views (wk)", value: "63" },
    breakdown: [
      { label: "Ranked", value: "16h" },
      { label: "Scrim", value: "4h" },
      { label: "VOD review", value: "2h" },
    ],
    ctaLabel: "Update hours",
    ctaHref: "/dashboard/settings/profile",
  },
  overview: {
    title: "Analytics",
    labels: ["W-5","W-4","W-3","W-2","W-1","Now"],
    seriesA: {
      label: "Profile views",
      values: [18, 24, 32, 44, 55, 63],
    },
    seriesB: {
      label: "Play hours",
      values: [14, 16, 18, 20, 18, 22],
    },
  },
  activity: activity([
    {
      type: "Invite",
      title: "Blackline VLR invited you to their Valorant B-team",
      when: "3h ago",
      status: "warn",
      href: "/dashboard/invites",
    },
    {
      type: "View",
      title: "Neon Void viewed your scout profile",
      when: "Today",
      status: "neutral",
    },
    {
      type: "Profile",
      title: "You updated your rank to Diamond IV",
      when: "Yesterday",
      status: "good",
      href: "/dashboard/settings/profile",
    },
    {
      type: "Watchlist",
      title: "Static Rift added you to their watchlist",
      when: "2 days ago",
      status: "neutral",
    },
    {
      type: "Match",
      title: "Weekly hours logged (22h)",
      when: "3 days ago",
      status: "good",
    },
  ]),
};

export const DESK_MOCK_BY_AUDIENCE: Record<DeskAudience, DeskViewProps> = {
  manager_collegiate: MANAGER_COLLEGIATE,
  manager_grassroots: MANAGER_GRASSROOTS,
  player_collegiate: PLAYER_COLLEGIATE,
  player_grassroots: PLAYER_GRASSROOTS,
};

export const DESK_AUDIENCE_LABEL: Record<DeskAudience, string> = {
  manager_collegiate: "Collegiate org",
  manager_grassroots: "Grassroots org",
  player_collegiate: "Collegiate player",
  player_grassroots: "Grassroots player",
};
