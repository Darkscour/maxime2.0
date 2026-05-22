/**
 * Mock data for the Recruitment + Sponsorship portals.
 *
 * In production these objects come from your Postgres database (populated
 * from PandaScore / Riot API for players, and from your curated table for
 * sponsors). The TypeScript shapes here are the same shapes you'll later
 * define in `schema.prisma` — no rewrites needed.
 */

export type Game =
  | "League of Legends"
  | "VALORANT"
  | "Counter-Strike 2"
  | "Rocket League"
  | "Overwatch 2"
  | "Apex Legends"
  | "Dota 2";

export type Region = "NA East" | "NA West" | "EU West" | "EU Nordic" | "LATAM" | "APAC";

export type Rank =
  | "Iron"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Ascendant"
  | "Immortal"
  | "Master"
  | "Grandmaster"
  | "Challenger"
  | "Radiant";

export type Player = {
  id: string;
  handle: string;
  avatarHue: number;
  game: Game;
  role: string;
  rank: Rank;
  region: Region;
  school?: string;
  age: number;
  winRate: number;
  kda: number;
  hoursPerWeek: number;
  fitScore: number;
  tags: string[];
  status: "Available" | "Open to offers" | "Contracted";
  verified: boolean;
};

export const PLAYERS: Player[] = [
  {
    id: "p1",
    handle: "Zylith",
    avatarHue: 195,
    game: "VALORANT",
    role: "Duelist",
    rank: "Immortal",
    region: "NA East",
    school: "Penn State",
    age: 20,
    winRate: 0.64,
    kda: 1.42,
    hoursPerWeek: 28,
    fitScore: 94,
    tags: ["Aggressive entry", "Jett main", "IGL backup"],
    status: "Available",
    verified: true,
  },
  {
    id: "p2",
    handle: "Mythra",
    avatarHue: 280,
    game: "League of Legends",
    role: "Mid",
    rank: "Master",
    region: "NA West",
    school: "UCLA",
    age: 21,
    winRate: 0.58,
    kda: 4.1,
    hoursPerWeek: 32,
    fitScore: 91,
    tags: ["Control mages", "Mechanical", "Vocal"],
    status: "Open to offers",
    verified: true,
  },
  {
    id: "p3",
    handle: "Echo07",
    avatarHue: 30,
    game: "Counter-Strike 2",
    role: "AWPer",
    rank: "Master",
    region: "EU West",
    school: "TU Delft",
    age: 19,
    winRate: 0.61,
    kda: 1.28,
    hoursPerWeek: 25,
    fitScore: 89,
    tags: ["Sub‑1s flicks", "Anti‑eco", "Cool head"],
    status: "Available",
    verified: true,
  },
  {
    id: "p4",
    handle: "NovaPrime",
    avatarHue: 320,
    game: "Rocket League",
    role: "Striker",
    rank: "Grandmaster",
    region: "NA East",
    school: "Drexel",
    age: 22,
    winRate: 0.69,
    kda: 1.0,
    hoursPerWeek: 22,
    fitScore: 88,
    tags: ["Aerial specialist", "GC2"],
    status: "Open to offers",
    verified: false,
  },
  {
    id: "p5",
    handle: "Vexor",
    avatarHue: 0,
    game: "VALORANT",
    role: "Controller",
    rank: "Ascendant",
    region: "NA West",
    school: "Cal Poly",
    age: 20,
    winRate: 0.55,
    kda: 1.05,
    hoursPerWeek: 30,
    fitScore: 86,
    tags: ["Smokes master", "Calm in clutches"],
    status: "Available",
    verified: true,
  },
  {
    id: "p6",
    handle: "Kyoto",
    avatarHue: 160,
    game: "League of Legends",
    role: "Jungle",
    rank: "Diamond",
    region: "APAC",
    school: "Yonsei Univ.",
    age: 19,
    winRate: 0.62,
    kda: 3.6,
    hoursPerWeek: 35,
    fitScore: 85,
    tags: ["Early aggression", "Krug pathing"],
    status: "Available",
    verified: true,
  },
  {
    id: "p7",
    handle: "Phantom_R",
    avatarHue: 220,
    game: "Apex Legends",
    role: "Fragger",
    rank: "Master",
    region: "NA East",
    school: "Northeastern",
    age: 21,
    winRate: 0.49,
    kda: 2.8,
    hoursPerWeek: 26,
    fitScore: 84,
    tags: ["Wraith main", "Tournament exp."],
    status: "Open to offers",
    verified: false,
  },
  {
    id: "p8",
    handle: "Lumi",
    avatarHue: 50,
    game: "Overwatch 2",
    role: "Support",
    rank: "Grandmaster",
    region: "EU Nordic",
    school: "KTH",
    age: 22,
    winRate: 0.6,
    kda: 5.2,
    hoursPerWeek: 24,
    fitScore: 83,
    tags: ["Ana surgeon", "Shotcaller"],
    status: "Available",
    verified: true,
  },
  {
    id: "p9",
    handle: "BlitzKai",
    avatarHue: 100,
    game: "League of Legends",
    role: "ADC",
    rank: "Master",
    region: "NA East",
    school: "Maryland",
    age: 20,
    winRate: 0.57,
    kda: 3.9,
    hoursPerWeek: 28,
    fitScore: 82,
    tags: ["Lethality builds", "Lane priority"],
    status: "Open to offers",
    verified: true,
  },
  {
    id: "p10",
    handle: "Sable.",
    avatarHue: 260,
    game: "VALORANT",
    role: "Sentinel",
    rank: "Immortal",
    region: "EU West",
    school: "Imperial",
    age: 21,
    winRate: 0.6,
    kda: 1.18,
    hoursPerWeek: 27,
    fitScore: 80,
    tags: ["Cypher mind games", "Site anchor"],
    status: "Available",
    verified: true,
  },
  {
    id: "p11",
    handle: "Bytewalker",
    avatarHue: 200,
    game: "Counter-Strike 2",
    role: "Rifler",
    rank: "Diamond",
    region: "EU Nordic",
    school: "Aalto",
    age: 19,
    winRate: 0.54,
    kda: 1.12,
    hoursPerWeek: 22,
    fitScore: 78,
    tags: ["Lurker", "Util crafty"],
    status: "Available",
    verified: false,
  },
  {
    id: "p12",
    handle: "Crucial",
    avatarHue: 350,
    game: "Dota 2",
    role: "Carry",
    rank: "Immortal",
    region: "LATAM",
    school: "Tec de Monterrey",
    age: 23,
    winRate: 0.52,
    kda: 4.4,
    hoursPerWeek: 30,
    fitScore: 77,
    tags: ["Late‑game scaler", "Bilingual EN/ES"],
    status: "Open to offers",
    verified: true,
  },
];

// ──────────────────────────────────────────────────────────────────────────

export type Sponsor = {
  id: string;
  name: string;
  industry:
    | "Energy Drinks"
    | "Peripherals"
    | "Apparel"
    | "Gaming Chairs"
    | "PC Hardware"
    | "Fintech"
    | "Food & QSR"
    | "ISP / Telecom"
    | "Insurance"
    | "Local Business";
  tier: "Starter" | "Growth" | "Established";
  checkSize: string;
  regions: Region[];
  games: (Game | "All")[];
  audience: string;
  applicationUrl: string;
  contact?: string;
  description: string;
  brandHue: number;
  active: boolean;
};

export const SPONSORS: Sponsor[] = [
  {
    id: "s1",
    name: "VoltStrike Energy",
    industry: "Energy Drinks",
    tier: "Growth",
    checkSize: "$2k – $10k / season",
    regions: ["NA East", "NA West"],
    games: ["All"],
    audience: "College Gen Z, 18–24",
    applicationUrl: "https://voltstrike.example.com/apply",
    contact: "partnerships@voltstrike.example.com",
    description:
      "Mid‑market energy drink actively expanding into collegiate esports. Provides product + cash, simple application.",
    brandHue: 28,
    active: true,
  },
  {
    id: "s2",
    name: "Lumen Peripherals",
    industry: "Peripherals",
    tier: "Established",
    checkSize: "Gear bundles + $5k+",
    regions: ["NA East", "NA West", "EU West"],
    games: ["VALORANT", "Counter-Strike 2", "League of Legends"],
    audience: "Competitive FPS players",
    applicationUrl: "https://lumen-peripherals.example.com/team-program",
    description:
      "Established mouse + keyboard brand with a dedicated collegiate program. Fast turnaround on applications.",
    brandHue: 200,
    active: true,
  },
  {
    id: "s3",
    name: "Hexa Apparel",
    industry: "Apparel",
    tier: "Starter",
    checkSize: "Co‑branded jerseys",
    regions: ["NA East", "NA West"],
    games: ["All"],
    audience: "Streetwear‑adjacent gamers",
    applicationUrl: "https://hexaapparel.example.com/team-up",
    contact: "team-up@hexaapparel.example.com",
    description:
      "Custom jerseys + hoodies at cost in exchange for social tags. Ideal for new clubs needing brand identity.",
    brandHue: 320,
    active: true,
  },
  {
    id: "s4",
    name: "Throne Seating",
    industry: "Gaming Chairs",
    tier: "Growth",
    checkSize: "Chairs + $1k cash",
    regions: ["NA East", "NA West", "EU West", "EU Nordic"],
    games: ["All"],
    audience: "Visible streaming setups",
    applicationUrl: "https://throneseating.example.com/clubs",
    description:
      "Chair drops to college clubs with a streaming presence. Low bar for entry, high social ROI.",
    brandHue: 0,
    active: true,
  },
  {
    id: "s5",
    name: "Vector Microelectronics",
    industry: "PC Hardware",
    tier: "Established",
    checkSize: "$10k+ + builds",
    regions: ["NA East", "NA West"],
    games: ["All"],
    audience: "Performance‑focused teams",
    applicationUrl: "https://vectormicro.example.com/esports",
    contact: "esports@vectormicro.example.com",
    description:
      "Pre‑built rigs and component drops for collegiate orgs with 5k+ social reach.",
    brandHue: 150,
    active: true,
  },
  {
    id: "s6",
    name: "Drift Banking",
    industry: "Fintech",
    tier: "Growth",
    checkSize: "$5k – $25k / year",
    regions: ["NA East", "NA West"],
    games: ["All"],
    audience: "College‑age students",
    applicationUrl: "https://driftbank.example.com/partnerships",
    description:
      "Gen‑Z neobank running first‑time campus partnership programs. Strong fit for orgs with finance majors involved.",
    brandHue: 270,
    active: true,
  },
  {
    id: "s7",
    name: "Late Night Ramen",
    industry: "Food & QSR",
    tier: "Starter",
    checkSize: "Catered events + $500",
    regions: ["NA East"],
    games: ["All"],
    audience: "Campus communities",
    applicationUrl: "https://latenightramen.example.com/community",
    description:
      "Regional ramen chain with college sponsorships in 14 cities. Best for orgs hosting in‑person watch parties.",
    brandHue: 18,
    active: true,
  },
  {
    id: "s8",
    name: "Tachyon Fiber",
    industry: "ISP / Telecom",
    tier: "Established",
    checkSize: "Service + $3k",
    regions: ["NA East", "NA West"],
    games: ["All"],
    audience: "Competitive streamers",
    applicationUrl: "https://tachyonfiber.example.com/teams",
    description:
      "Regional fiber ISP offering free gigabit service to club facilities in exchange for stream mentions.",
    brandHue: 195,
    active: true,
  },
  {
    id: "s9",
    name: "Glyph Insurance",
    industry: "Insurance",
    tier: "Growth",
    checkSize: "$4k – $15k",
    regions: ["NA East", "NA West"],
    games: ["All"],
    audience: "Older student‑athletes",
    applicationUrl: "https://glyph.example.com/young-pros",
    contact: "youngpros@glyph.example.com",
    description:
      "Renters + gear insurance product targeted at student esports athletes. Brand‑safe, long sponsorship cycles.",
    brandHue: 230,
    active: true,
  },
  {
    id: "s10",
    name: "Forge Studios",
    industry: "Local Business",
    tier: "Starter",
    checkSize: "Studio time + $250",
    regions: ["NA East"],
    games: ["All"],
    audience: "Content‑producing teams",
    applicationUrl: "https://forgestudios.example.com",
    description:
      "Local podcast/streaming studios that swap rentable hours for sponsorship recognition. Untapped category.",
    brandHue: 45,
    active: true,
  },
  {
    id: "s11",
    name: "PixelGrind Coffee",
    industry: "Food & QSR",
    tier: "Growth",
    checkSize: "$1k + product",
    regions: ["NA West", "NA East", "EU West"],
    games: ["All"],
    audience: "Late‑night practice sessions",
    applicationUrl: "https://pixelgrind.example.com/orgs",
    description:
      "DTC coffee brand active in collegiate esports. Quick application, fast approvals.",
    brandHue: 35,
    active: true,
  },
  {
    id: "s12",
    name: "Nexus Telecom Labs",
    industry: "ISP / Telecom",
    tier: "Established",
    checkSize: "$15k – $50k / year",
    regions: ["EU West", "EU Nordic"],
    games: ["All"],
    audience: "European collegiate orgs",
    applicationUrl: "https://nexustl.example.com/esports",
    description:
      "Established European telecom investing heavily in university‑level esports. Requires proof of competitive results.",
    brandHue: 260,
    active: true,
  },
];

export const GAMES: Game[] = [
  "League of Legends",
  "VALORANT",
  "Counter-Strike 2",
  "Rocket League",
  "Overwatch 2",
  "Apex Legends",
  "Dota 2",
];

export const REGIONS: Region[] = [
  "NA East",
  "NA West",
  "EU West",
  "EU Nordic",
  "LATAM",
  "APAC",
];

export const RANKS: Rank[] = [
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Ascendant",
  "Immortal",
  "Master",
  "Grandmaster",
  "Challenger",
  "Radiant",
];

export const INDUSTRIES: Sponsor["industry"][] = [
  "Energy Drinks",
  "Peripherals",
  "Apparel",
  "Gaming Chairs",
  "PC Hardware",
  "Fintech",
  "Food & QSR",
  "ISP / Telecom",
  "Insurance",
  "Local Business",
];

export const SPONSOR_TIERS: Sponsor["tier"][] = [
  "Starter",
  "Growth",
  "Established",
];
