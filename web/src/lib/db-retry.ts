const TRANSIENT_DB_PATTERNS = [
  "can't reach database",
  "connection",
  "timeout",
  "timed out",
  "econnreset",
  "econnrefused",
  "etimedout",
  "pool",
  "p1001",
  "p1002",
  "p1008",
  "p1017",
  "57p01",
  "53300",
];

export function isTransientDbError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? `${error.name} ${error.message}`.toLowerCase()
      : String(error).toLowerCase();
  return TRANSIENT_DB_PATTERNS.some((pattern) => message.includes(pattern));
}

/** Retry transient database failures (common during Supabase incidents). */
export async function withDbRetry<T>(
  fn: () => Promise<T>,
  options?: { attempts?: number; delayMs?: number },
): Promise<T> {
  const attempts = options?.attempts ?? 3;
  const delayMs = options?.delayMs ?? 400;
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!isTransientDbError(error) || attempt === attempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }

  throw lastError;
}
