/**
 * Bootstrap U.S. institutions from College Scorecard + Hipolabs domain enrichment.
 *
 * Requires COLLEGE_SCORECARD_API_KEY (free at https://api.data.gov/signup/)
 *
 * Run: npm run db:institutions
 */

import { PrismaClient } from "@prisma/client";
import {
  domainFromUrl,
  mergeInstitutionDomains,
} from "../src/lib/institution-domains";

const db = new PrismaClient();

const SCORECARD_BASE =
  "https://api.data.gov/ed/collegescorecard/v1/schools";

const HIPOLABS_URL =
  "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json";

const FIELDS = [
  "id",
  "school.name",
  "school.state",
  "school.city",
  "school.alias",
  "school.school_url",
].join(",");

type ScorecardSchool = {
  id: number;
  "school.name": string;
  "school.state"?: string;
  "school.city"?: string;
  "school.alias"?: string | null;
  "school.school_url"?: string | null;
};

type HipolabsUniversity = {
  name: string;
  domains: string[];
  web_pages?: string[];
  "state-province"?: string | null;
  alpha_two_code: string;
};

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mergeDomains(...groups: (string | null | undefined)[]): string[] {
  return mergeInstitutionDomains(...groups);
}

function parseAliases(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split("|")
    .map((a) => a.trim())
    .filter((a) => a.length > 1);
}

function findHipolabsMatch(
  school: ScorecardSchool,
  hipolabsByNorm: Map<string, HipolabsUniversity>,
  hipolabsByDomain: Map<string, HipolabsUniversity>,
): HipolabsUniversity | null {
  const urlDomain = domainFromUrl(school["school.school_url"]);
  if (urlDomain && hipolabsByDomain.has(urlDomain)) {
    return hipolabsByDomain.get(urlDomain)!;
  }

  const norm = normalizeName(school["school.name"]);
  if (hipolabsByNorm.has(norm)) return hipolabsByNorm.get(norm)!;

  for (const [key, uni] of hipolabsByNorm) {
    if (key.includes(norm) || norm.includes(key)) return uni;
  }

  return null;
}

async function fetchScorecardPage(
  apiKey: string,
  page: number,
): Promise<ScorecardSchool[]> {
  const params = new URLSearchParams({
    api_key: apiKey,
    fields: FIELDS,
    per_page: "100",
    page: String(page),
    "school.operating": "1",
    "school.degrees_awarded.predominant": "2,3,4",
  });

  const res = await fetch(`${SCORECARD_BASE}?${params.toString()}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Scorecard API error ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = (await res.json()) as { results?: ScorecardSchool[] };
  return json.results ?? [];
}

async function fetchAllScorecardSchools(apiKey: string): Promise<ScorecardSchool[]> {
  const all: ScorecardSchool[] = [];
  let page = 0;

  for (;;) {
    const batch = await fetchScorecardPage(apiKey, page);
    if (batch.length === 0) break;
    all.push(...batch);
    process.stdout.write(`\r  Fetched ${all.length} schools from Scorecard…`);
    if (batch.length < 100) break;
    page += 1;
    await new Promise((r) => setTimeout(r, 120));
  }

  console.log();
  return all;
}

async function fetchHipolabsUs(): Promise<HipolabsUniversity[]> {
  const res = await fetch(HIPOLABS_URL);
  if (!res.ok) throw new Error(`Hipolabs fetch failed: ${res.status}`);

  const data = (await res.json()) as HipolabsUniversity[];
  return data.filter((u) => u.alpha_two_code === "US");
}

async function bootstrapFromHipolabs(): Promise<number> {
  console.log("No COLLEGE_SCORECARD_API_KEY — importing U.S. schools from Hipolabs…");
  const hipolabs = await fetchHipolabsUs();
  console.log(`  ${hipolabs.length} U.S. Hipolabs entries`);

  let upserted = 0;

  for (let i = 0; i < hipolabs.length; i++) {
    const uni = hipolabs[i];
    const name = uni.name?.trim();
    if (!name) continue;

    const pageDomains = (uni.web_pages ?? [])
      .map((page) => domainFromUrl(page))
      .filter((d): d is string => !!d);
    const domains = mergeDomains(...uni.domains, ...pageDomains);
    const primaryDomain = pageDomains[0] ?? domains[0] ?? null;
    const stateRaw = uni["state-province"]?.trim();
    const state =
      stateRaw && stateRaw !== "NA" && stateRaw.length <= 32 ? stateRaw : null;

    const scorecardId = 8_000_000 + i + 1;

    await db.institution.upsert({
      where: { scorecardId },
      create: {
        scorecardId,
        name,
        nameLower: name.toLowerCase(),
        state,
        city: null,
        primaryDomain,
        domains,
        aliases: [],
      },
      update: {
        name,
        nameLower: name.toLowerCase(),
        state,
        primaryDomain,
        domains,
      },
    });

    upserted += 1;
    if (upserted % 200 === 0) {
      process.stdout.write(`\r  Upserted ${upserted}/${hipolabs.length}…`);
    }
  }

  console.log();
  return upserted;
}

async function main() {
  const apiKey = process.env.COLLEGE_SCORECARD_API_KEY?.trim();

  if (!apiKey) {
    const upserted = await bootstrapFromHipolabs();
    console.log(`Done — ${upserted} institutions in database (Hipolabs).`);
    console.log(
      "Tip: add COLLEGE_SCORECARD_API_KEY and re-run for the full federal list.",
    );
    return;
  }

  console.log("Loading Hipolabs U.S. domain list…");
  const hipolabs = await fetchHipolabsUs();
  const hipolabsByNorm = new Map<string, HipolabsUniversity>();
  const hipolabsByDomain = new Map<string, HipolabsUniversity>();

  for (const uni of hipolabs) {
    hipolabsByNorm.set(normalizeName(uni.name), uni);
    for (const d of uni.domains) {
      hipolabsByDomain.set(d.toLowerCase(), uni);
    }
    for (const page of uni.web_pages ?? []) {
      const pageDomain = domainFromUrl(page);
      if (pageDomain) hipolabsByDomain.set(pageDomain, uni);
    }
  }

  console.log(`  ${hipolabs.length} U.S. Hipolabs entries indexed`);

  console.log("Fetching College Scorecard institutions…");
  const schools = await fetchAllScorecardSchools(apiKey);
  console.log(`  ${schools.length} active U.S. institutions`);

  let upserted = 0;

  for (const school of schools) {
    const name = school["school.name"]?.trim();
    if (!name) continue;

    const hipolabsMatch = findHipolabsMatch(school, hipolabsByNorm, hipolabsByDomain);
    const urlDomain = domainFromUrl(school["school.school_url"]);
    const hipolabsPageDomains = (hipolabsMatch?.web_pages ?? [])
      .map((page) => domainFromUrl(page))
      .filter((d): d is string => !!d);
    const hipolabsDomains = hipolabsMatch?.domains ?? [];
    const domains = mergeDomains(urlDomain, ...hipolabsDomains, ...hipolabsPageDomains);
    const primaryDomain =
      urlDomain ?? hipolabsPageDomains[0] ?? hipolabsDomains[0] ?? null;
    const aliases = parseAliases(school["school.alias"]);

    await db.institution.upsert({
      where: { scorecardId: school.id },
      create: {
        scorecardId: school.id,
        name,
        nameLower: name.toLowerCase(),
        state: school["school.state"]?.trim() || null,
        city: school["school.city"]?.trim() || null,
        primaryDomain,
        domains,
        aliases,
      },
      update: {
        name,
        nameLower: name.toLowerCase(),
        state: school["school.state"]?.trim() || null,
        city: school["school.city"]?.trim() || null,
        primaryDomain,
        domains,
        aliases,
      },
    });

    upserted += 1;
    if (upserted % 250 === 0) {
      process.stdout.write(`\r  Upserted ${upserted}/${schools.length}…`);
    }
  }

  console.log(`\nDone — ${upserted} institutions in database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
