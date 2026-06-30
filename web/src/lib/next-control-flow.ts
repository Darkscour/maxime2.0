/** True for Next.js redirect()/notFound() control-flow throws, which must propagate. */
export function isNextControlFlowError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;

  const digest = (error as { digest?: unknown }).digest;
  if (
    typeof digest === "string" &&
    (digest.startsWith("NEXT_REDIRECT") ||
      digest === "NEXT_NOT_FOUND" ||
      digest.startsWith("NEXT_HTTP_ERROR_FALLBACK"))
  ) {
    return true;
  }

  const message = (error as { message?: unknown }).message;
  return (
    typeof message === "string" &&
    (message === "NEXT_REDIRECT" ||
      message === "NEXT_NOT_FOUND" ||
      message.startsWith("NEXT_HTTP_ERROR_FALLBACK"))
  );
}
