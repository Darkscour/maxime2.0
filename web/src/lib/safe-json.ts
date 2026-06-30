import { isBenignFetchError } from "@/lib/benign-fetch-error";

/** Parse a fetch response body as JSON without throwing on empty, aborted, or malformed streams. */
export async function parseJsonResponse<T>(res: Response): Promise<T | null> {
  try {
    const text = await res.text();
    if (!text.trim()) return null;
    return JSON.parse(text) as T;
  } catch (error) {
    if (isBenignFetchError(error)) return null;
    return null;
  }
}

/** Fetch JSON from an API route without throwing on network or parse errors. */
export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; data: T | null }> {
  try {
    const res = await fetch(input, init);
    const data = await parseJsonResponse<T>(res);
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    if (isBenignFetchError(error)) {
      return { ok: false, status: 0, data: null };
    }
    return { ok: false, status: 0, data: null };
  }
}
