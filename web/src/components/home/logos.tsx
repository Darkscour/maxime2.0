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
    <section className="border-y border-white/5 bg-[var(--background-elevated)]/30 py-10">
      <Container>
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
          Built for every collegiate title
        </p>
        <div className="fade-x mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
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
