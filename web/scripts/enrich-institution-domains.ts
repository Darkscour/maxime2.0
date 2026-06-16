/**
 * Re-enrich institution domains from Hipolabs web_pages + domain aliases.
 * Run after bootstrap or when logos are missing: npm run db:institutions-enrich
 */

import { PrismaClient } from "@prisma/client";
import {
  domainFromUrl,
  mergeInstitutionDomains,
} from "../src/lib/institution-domains";

const db = new PrismaClient();

const HIPOLABS_URL =
  "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json";

type HipolabsUniversity = {
  name: string;
  domains: string[];
  web_pages?: string[];
  alpha_two_code: string;
};

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hipolabsDomains(uni: HipolabsUniversity): {
  primaryDomain: string | null;
  domains: string[];
} {
  const pageDomains = (uni.web_pages ?? [])
    .map((page) => domainFromUrl(page))
    .filter((d): d is string => !!d);
  const domains = mergeInstitutionDomains(...uni.domains, ...pageDomains);
  const primaryDomain = pageDomains[0] ?? domains[0] ?? null;
  return { primaryDomain, domains };
}

async function fetchHipolabsUs(): Promise<HipolabsUniversity[]> {
  const res = await fetch(HIPOLABS_URL);
  if (!res.ok) throw new Error(`Hipolabs fetch failed: ${res.status}`);
  const data = (await res.json()) as HipolabsUniversity[];
  return data.filter((u) => u.alpha_two_code === "US");
}

async function main() {
  console.log("Loading Hipolabs U.S. list…");
  const hipolabs = await fetchHipolabsUs();
  const byNorm = new Map<string, HipolabsUniversity>();
  for (const uni of hipolabs) {
    byNorm.set(normalizeName(uni.name), uni);
  }
  console.log(`  ${hipolabs.length} entries`);

  const institutions = await db.institution.findMany({
    select: { id: true, name: true, primaryDomain: true, domains: true },
  });

  let updated = 0;

  for (const inst of institutions) {
    const norm = normalizeName(inst.name);
    let match = byNorm.get(norm);

    if (!match) {
      for (const [key, uni] of byNorm) {
        if (key.includes(norm) || norm.includes(key)) {
          match = uni;
          break;
        }
      }
    }

    if (!match) continue;

    const { primaryDomain, domains } = hipolabsDomains(match);
    const samePrimary = inst.primaryDomain === primaryDomain;
    const sameDomains =
      inst.domains.length === domains.length &&
      inst.domains.every((d, i) => d === domains[i]);

    if (samePrimary && sameDomains) continue;

    await db.institution.update({
      where: { id: inst.id },
      data: { primaryDomain, domains },
    });
    updated += 1;
  }

  console.log(`Updated ${updated} of ${institutions.length} institutions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
