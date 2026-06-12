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
      className={`mt-1.5 text-right text-xs ${nearLimit ? "text-amber-400/90" : "text-zinc-500"}`}
      aria-live="polite"
    >
      {length}/{max}
    </p>
  );
}
