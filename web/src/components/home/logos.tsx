import { Container } from "@/components/ui/container";

const games = [
  "League of Legends",
  "VALORANT",
  "Counter-Strike 2",
  "Rocket League",
  "Overwatch 2",
  "Apex Legends",
  "Dota 2",
  "Super Smash Bros.",
];

export function Logos() {
  return (
    <section
      id="logos"
      className="border-b border-[color-mix(in_srgb,var(--border)_50%,transparent)] bg-[color-mix(in_srgb,var(--background-elevated)_30%,transparent)] py-6 sm:py-8"
    >
      <Container>
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-[var(--foreground-subtle)]">
          Built for every major competitive title
        </p>
        <div className="fade-x mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {games.map((g) => (
            <span
              key={g}
              className="text-sm font-medium text-[var(--foreground-subtle)] transition-colors hover:text-[var(--foreground-muted)]"
            >
              {g}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
