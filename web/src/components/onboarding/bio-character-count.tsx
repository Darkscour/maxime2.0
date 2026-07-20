export function BioCharacterCount({
  length,
  max,
}: {
  length: number;
  max: number;
}) {
  const nearLimit = length >= max - 20;

  return (
    <p
      className={`mt-1.5 text-right text-xs ${nearLimit ? "text-[var(--warning)]" : "text-[var(--foreground-muted)]"}`}
      aria-live="polite"
    >
      {length}/{max}
    </p>
  );
}
