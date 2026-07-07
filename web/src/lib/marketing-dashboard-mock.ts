import type { ManagerOrgAnalytics } from "@/lib/manager-analytics";
import type { RosterMember } from "@/lib/team-roster";

function weekPoints(values: number[]) {
  const start = new Date("2026-01-06T00:00:00.000Z");
  const labels = ["Jan 6", "Jan 13", "Jan 20", "Jan 27", "Feb 3", "Feb 10", "Feb 17", "Now"];

  return values.map((value, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index * 7);
    return {
      date: date.toISOString(),
      label: labels[index] ?? `W${index + 1}`,
      value,
    };
  });
}

/** Stable portrait URL per player — used across marketing demo cards. */
export function marketingAvatarUrl(seed: string) {
  return `https://i.pravatar.cc/128?u=maxime-${encodeURIComponent(seed)}`;
}

export const MOCK_MANAGER_ANALYTICS: ManagerOrgAnalytics = {
  teamJoinedAt: "2026-01-15T00:00:00.000Z",
  rosterCount: 14,
  playerCount: 12,
  pendingJoinRequests: 2,
  pendingInvites: 3,
  watchlistCount: 27,
  rosterSize: {
    weekly: weekPoints([9, 8, 10, 9, 11, 10, 12, 14]),
    allTime: weekPoints([3, 5, 4, 6, 6, 7, 10, 14]),
  },
  scoutViews: {
    weekly: weekPoints([22, 17, 26, 19, 24, 21, 33, 48]),
    allTime: weekPoints([30, 48, 40, 62, 55, 92, 150, 248]),
  },
  rosterSummary: {
    weekly: { newJoins: 2 },
    allTime: { newJoins: 14 },
  },
  scoutSummary: {
    weekly: {
      profileViews: 48,
      joinRequests: 2,
      invitesSent: 5,
      invitesAccepted: 3,
    },
    allTime: {
      profileViews: 248,
      joinRequests: 11,
      invitesSent: 34,
      invitesAccepted: 21,
    },
  },
};

export const MOCK_TEAM_NAME = "Maxime Titans";

export type MarketingScoutPlayer = {
  id: string;
  handle: string;
  game: string;
  role: string;
  rank: string;
  region: string;
  imageUrl: string;
};

/** Open scouting pool — unique names/images not reused in other demo sections. */
export const MOCK_SCOUT_PLAYERS: MarketingScoutPlayer[] = [
  {
    id: "scout-1",
    handle: "RogueNova",
    game: "VALORANT",
    role: "Duelist",
    rank: "Immortal",
    region: "NA East",
    imageUrl: marketingAvatarUrl("scout-rogue-nova"),
  },
  {
    id: "scout-2",
    handle: "PixelReign",
    game: "League of Legends",
    role: "Mid",
    rank: "Master",
    region: "NA West",
    imageUrl: marketingAvatarUrl("scout-pixel-reign"),
  },
  {
    id: "scout-3",
    handle: "HexStrike",
    game: "Counter-Strike 2",
    role: "AWPer",
    rank: "Master",
    region: "EU West",
    imageUrl: marketingAvatarUrl("scout-hex-strike"),
  },
  {
    id: "scout-4",
    handle: "AstraDrive",
    game: "Rocket League",
    role: "Striker",
    rank: "Grandmaster",
    region: "NA East",
    imageUrl: marketingAvatarUrl("scout-astra-drive"),
  },
  {
    id: "scout-5",
    handle: "TitanFlux",
    game: "VALORANT",
    role: "Controller",
    rank: "Ascendant",
    region: "NA West",
    imageUrl: marketingAvatarUrl("scout-titan-flux"),
  },
  {
    id: "scout-6",
    handle: "LunaTactic",
    game: "Overwatch 2",
    role: "Support",
    rank: "Grandmaster",
    region: "APAC",
    imageUrl: marketingAvatarUrl("scout-luna-tactic"),
  },
];

export type MarketingWatchlistPlayer = {
  id: string;
  handle: string;
  game: string;
  role: string;
  rank: string;
  region: string;
  invitePending: boolean;
  imageUrl: string;
};

/** Saved candidates — disjoint from roster sample players. */
export const MOCK_WATCHLIST_PLAYERS: MarketingWatchlistPlayer[] = [
  {
    id: "watch-1",
    handle: "NeonPulse",
    game: "League of Legends",
    role: "ADC",
    rank: "Master",
    region: "NA East",
    invitePending: false,
    imageUrl: marketingAvatarUrl("watch-neon-pulse"),
  },
  {
    id: "watch-2",
    handle: "WardenX",
    game: "VALORANT",
    role: "Sentinel",
    rank: "Immortal",
    region: "EU West",
    invitePending: true,
    imageUrl: marketingAvatarUrl("watch-warden-x"),
  },
  {
    id: "watch-3",
    handle: "VoltFrame",
    game: "Apex Legends",
    role: "Fragger",
    rank: "Master",
    region: "NA West",
    invitePending: false,
    imageUrl: marketingAvatarUrl("watch-volt-frame"),
  },
  {
    id: "watch-4",
    handle: "EchoLane",
    game: "League of Legends",
    role: "Jungle",
    rank: "Diamond",
    region: "EU Nordic",
    invitePending: false,
    imageUrl: marketingAvatarUrl("watch-echo-lane"),
  },
  {
    id: "watch-5",
    handle: "RiftPilot",
    game: "Rocket League",
    role: "All-rounder",
    rank: "Grandmaster",
    region: "LATAM",
    invitePending: false,
    imageUrl: marketingAvatarUrl("watch-rift-pilot"),
  },
  {
    id: "watch-6",
    handle: "NightOrbit",
    game: "Counter-Strike 2",
    role: "Rifler",
    rank: "Diamond",
    region: "APAC",
    invitePending: false,
    imageUrl: marketingAvatarUrl("watch-night-orbit"),
  },
];

export const MOCK_ROSTER_TOTAL = 247;

const ROSTER_LEADERSHIP: RosterMember[] = [
  {
    membershipId: "m-manager",
    userId: "u-manager",
    role: "manager",
    joinedAt: new Date("2025-08-01"),
    email: "coach@maxime.edu",
    displayName: "Coach Max",
    handle: "CoachMax",
    game: null,
    roleInGame: null,
    rank: null,
    school: null,
    hoursPerWeek: null,
    playerProfileId: null,
    clerkId: "clerk-manager",
    imageUrl: marketingAvatarUrl("roster-coach-max"),
  },
  {
    membershipId: "m-captain",
    userId: "u-captain",
    role: "captain",
    joinedAt: new Date("2025-09-15"),
    email: null,
    displayName: null,
    handle: "Vortex",
    game: "VALORANT",
    roleInGame: "IGL",
    rank: "Radiant",
    school: "UC Berkeley",
    hoursPerWeek: 32,
    playerProfileId: "p13",
    clerkId: "clerk-captain",
    imageUrl: marketingAvatarUrl("roster-captain-vortex"),
  },
];

const ROSTER_PLAYER_TEMPLATES = [
  {
    id: "roster-p1",
    handle: "SkyForge",
    game: "VALORANT",
    roleInGame: "Initiator",
    rank: "Immortal",
    region: "NA East",
    hoursPerWeek: 26,
  },
  {
    id: "roster-p2",
    handle: "Quanta",
    game: "League of Legends",
    roleInGame: "Top",
    rank: "Master",
    region: "NA West",
    hoursPerWeek: 30,
  },
  {
    id: "roster-p3",
    handle: "CipherRay",
    game: "Counter-Strike 2",
    roleInGame: "Support",
    rank: "Diamond",
    region: "EU West",
    hoursPerWeek: 22,
  },
  {
    id: "roster-p4",
    handle: "FrostByte",
    game: "Overwatch 2",
    roleInGame: "DPS",
    rank: "Grandmaster",
    region: "NA East",
    hoursPerWeek: 24,
  },
  {
    id: "roster-p5",
    handle: "KairoZen",
    game: "Apex Legends",
    roleInGame: "IGL",
    rank: "Master",
    region: "APAC",
    hoursPerWeek: 27,
  },
  {
    id: "roster-p6",
    handle: "PulseGrid",
    game: "Rocket League",
    roleInGame: "Support",
    rank: "Grandmaster",
    region: "LATAM",
    hoursPerWeek: 20,
  },
] as const;

export const MOCK_ROSTER_MEMBERS: RosterMember[] = [
  ...ROSTER_LEADERSHIP,
  ...ROSTER_PLAYER_TEMPLATES.map((p, i) => ({
    membershipId: `m-player-${i}`,
    userId: `u-player-${i}`,
    role: "player",
    joinedAt: new Date("2025-10-01"),
    email: null,
    displayName: null,
    handle: p.handle,
    game: p.game,
    roleInGame: p.roleInGame,
    rank: p.rank,
    school: p.region,
    hoursPerWeek: p.hoursPerWeek,
    playerProfileId: p.id,
    clerkId: `clerk-player-${i}`,
    imageUrl: marketingAvatarUrl(`roster-${p.id}-${p.handle}`),
  })),
];
