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
    <section id="logos" className="border-b border-white/5 bg-[var(--background-elevated)]/30 py-6 sm:py-8">
      <Container>
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
          Built for every major competitive title
        </p>
        <div className="fade-x mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {games.map((g) => (
            <span
              key={g}
              className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-300"
            >
              {g}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
