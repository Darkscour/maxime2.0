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
    editProfileHref: "/dashboard/settings/team",
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
    changeAnnotation: null,
    trendPct: null,
    splitA: { label: "Joined", value: "3" },
    splitB: { label: "Open slots", value: "3" },
    breakdown: [],
    ctaLabel: "Manage roster",
    ctaHref: "/dashboard/roster",
    variant: "roster",
    fillPct: 80,
    fillCaption: "3 slots open",
    stats: [
      { label: "Joined this week", value: "2" },
      { label: "Pending invites", value: "4" },
      { label: "Join requests", value: "8", href: "/dashboard/join-requests" },
      { label: "Players", value: "12" },
    ],
  },
  overview: {
    title: "Analytics",
    labels: [
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
    ],
    series: {
      label: "Roster size",
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
    editProfileHref: "/dashboard/settings/team",
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
    changeAnnotation: null,
    trendPct: null,
    splitA: { label: "Joined", value: "1" },
    splitB: { label: "Open slots", value: "1" },
    breakdown: [],
    ctaLabel: "Manage roster",
    ctaHref: "/dashboard/roster",
    variant: "roster",
    fillPct: 88,
    fillCaption: "1 slot open",
    stats: [
      { label: "Joined this week", value: "1" },
      { label: "Pending invites", value: "2" },
      { label: "Join requests", value: "5", href: "/dashboard/join-requests" },
      { label: "Players", value: "6" },
    ],
  },
  overview: {
    title: "Analytics",
    labels: ["W-11","W-10","W-9","W-8","W-7","W-6","W-5","W-4","W-3","W-2","W-1","Now"],
    series: {
      label: "Roster size",
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
    balanceLabel: "Status",
    balanceValue: "Free agent",
    chainLabel: "Region",
    chainValue: "NA East",
    primaryCta: { label: "Browse teams", href: "/dashboard/teams" },
    secondaryCta: { label: "Edit profile", href: "/dashboard/settings/profile" },
    editProfileHref: "/dashboard/settings/profile",
  },
  compliance: {
    title: "Scout status",
    subtitle: "Your recruitment visibility",
    items: [
      { label: "Scout card 100% complete", status: "good" },
      { label: "2 team invites waiting on you", status: "warn" },
      { label: "11 scout teams watching", status: "good" },
    ],
  },
  signals: [
    { label: "Profile views", value: "84", trendPct: 42, caption: "This week" },
    { label: "Invites", value: "2", trendPct: null, caption: "Awaiting reply" },
    { label: "Scouts watching", value: "11", trendPct: 18, caption: "Unique teams" },
  ],
  movement: {
    title: "Scout visibility",
    monthLabel: CURRENT_MONTH,
    primaryLabel: "Profile views",
    primaryValue: "84",
    changeAnnotation: "+16 vs last week",
    trendPct: 24,
    splitA: { label: "Scouts watching", value: "11" },
    splitB: { label: "Invites", value: "2" },
    breakdown: [
      { label: "Game", value: "Valorant" },
      { label: "Role", value: "Duelist" },
      { label: "Rank", value: "Immortal 2" },
    ],
    ctaLabel: "Edit scout profile",
    ctaHref: "/dashboard/settings/profile",
  },
  overview: {
    title: "Analytics",
    labels: ["W-5","W-4","W-3","W-2","W-1","Now"],
    series: {
      label: "Profile views",
      values: [22, 34, 40, 52, 68, 84],
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
      type: "View",
      title: "Profile views up 24% this week",
      when: "Yesterday",
      status: "good",
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
    code: "handle · shadowlark · NA · Roster · Blackline VLR",
    balanceLabel: "Team",
    balanceValue: "Blackline VLR",
    chainLabel: "Region",
    chainValue: "NA West",
    primaryCta: { label: "Leave team", action: "leave-team" },
    secondaryCta: { label: "Edit profile", href: "/dashboard/settings/profile" },
    editProfileHref: "/dashboard/settings/profile",
  },
  compliance: {
    title: "Scout status",
    subtitle: "Your recruitment visibility",
    items: [
      { label: "Scout card 100% complete", status: "good" },
      { label: "3 grassroots orgs viewing this week", status: "good" },
      { label: "6 scout teams watching", status: "good" },
    ],
  },
  signals: [
    { label: "Profile views", value: "63", trendPct: 28, caption: "This week" },
    { label: "Invites", value: "1", trendPct: null, caption: "Awaiting reply" },
    { label: "Scouts watching", value: "6", trendPct: 12, caption: "Unique teams" },
  ],
  movement: {
    title: "Scout visibility",
    monthLabel: CURRENT_MONTH,
    primaryLabel: "Profile views",
    primaryValue: "63",
    changeAnnotation: "+8 vs last week",
    trendPct: 15,
    splitA: { label: "Scouts watching", value: "6" },
    splitB: { label: "Invites", value: "1" },
    breakdown: [
      { label: "Game", value: "League of Legends" },
      { label: "Role", value: "Jungler" },
      { label: "Rank", value: "Diamond IV" },
    ],
    ctaLabel: "Edit scout profile",
    ctaHref: "/dashboard/settings/profile",
  },
  overview: {
    title: "Analytics",
    labels: ["W-5","W-4","W-3","W-2","W-1","Now"],
    series: {
      label: "Profile views",
      values: [18, 24, 32, 44, 55, 63],
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
      type: "View",
      title: "Profile views up 15% this week",
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
