/** Curated industry buckets shown in filters (not every raw DB value). */
export const CURATED_SPONSOR_INDUSTRIES = [
  "Hardware / Peripherals",
  "Peripherals",
  "Gaming Accessories",
  "Energy Drinks",
  "Apparel",
  "Software",
] as const;

export function curatedIndustriesFromData(industries: string[]): string[] {
  const set = new Set(industries);
  const matched = CURATED_SPONSOR_INDUSTRIES.filter((i) => set.has(i));
  if (matched.length > 0) return [...matched];
  return industries.slice(0, 5);
}
