/** True when a fetch/response read failed because navigation aborted the stream. */
export function isBenignFetchError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === "AbortError") return true;

  if (error instanceof TypeError) {
    const message = error.message.toLowerCase();
    return (
      message.includes("input stream") ||
      message.includes("networkerror") ||
      message.includes("failed to fetch") ||
      message.includes("load failed") ||
      message.includes("network request failed")
    );
  }

  if (typeof error === "string") {
    const message = error.toLowerCase();
    return message.includes("input stream") || message.includes("aborted");
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("input stream") ||
      message.includes("aborted") ||
      message.includes("failed to fetch")
    );
  }

  return false;
}
