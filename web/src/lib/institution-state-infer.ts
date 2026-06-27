import { normalizeUsStateCode, US_STATE_NAMES } from "@/lib/us-states";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Best-effort state code from a U.S. institution name when DB state is missing. */
export function inferStateFromInstitutionName(
  name: string | null | undefined,
): string | null {
  if (!name?.trim()) return null;

  const upper = name.toUpperCase().replace(/[^A-Z0-9\s,&.-]/g, " ");

  for (const [stateName, code] of Object.entries(US_STATE_NAMES)) {
    const state = escapeRegex(stateName);
    const patterns = [
      new RegExp(`\\bUNIVERSITY OF ${state}\\b`),
      new RegExp(`\\b${state} STATE UNIVERSITY\\b`),
      new RegExp(`\\b${state} INSTITUTE OF TECHNOLOGY\\b`),
      new RegExp(`\\bCOLLEGE OF ${state}\\b`),
      new RegExp(`\\b${state} COLLEGE\\b`),
    ];

    if (patterns.some((pattern) => pattern.test(upper))) {
      return code;
    }
  }

  const tailCode = upper.match(/,\s*([A-Z]{2})\s*$/);
  if (tailCode) {
    return normalizeUsStateCode(tailCode[1]);
  }

  return null;
}
