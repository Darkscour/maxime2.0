import { IllustrationFrame } from "./shared";

/**
 * Roster Hub illustration: a vertical stack of 4 player rows, each with an
 * avatar dot, a name bar, and a small role chip. The second row is the
 * "selected" player, drawn with a cyan stroke and faint cyan fill.
 */
export function RosterArt() {
  const rows = [0, 1, 2, 3];
  const rowH = 20;
  const startY = 22;
  const selectedIndex = 1;

  return (
    <IllustrationFrame accent="cyan" className="aspect-[16/10]">
      <svg
        viewBox="0 0 240 140"
        className="h-full w-full"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {rows.map((i) => {
          const y = startY + i * (rowH + 6);
          const selected = i === selectedIndex;
          return (
            <g key={i}>
              <rect
                x="22"
                y={y}
                width="196"
                height={rowH}
                rx="4"
                className={
                  selected
                    ? "stroke-cyan-400 fill-cyan-400/10"
                    : "stroke-zinc-700"
                }
                strokeWidth="1.25"
              />
              <circle
                cx="34"
                cy={y + rowH / 2}
                r="5"
                className={selected ? "stroke-cyan-300" : "stroke-zinc-600"}
                strokeWidth="1.25"
              />
              <line
                x1="46"
                y1={y + rowH / 2 - 2}
                x2="120"
                y2={y + rowH / 2 - 2}
                className={selected ? "stroke-cyan-300" : "stroke-zinc-600"}
                strokeWidth="1.25"
              />
              <line
                x1="46"
                y1={y + rowH / 2 + 4}
                x2="96"
                y2={y + rowH / 2 + 4}
                className={selected ? "stroke-cyan-300/60" : "stroke-zinc-700"}
                strokeWidth="1.25"
              />
              <rect
                x="178"
                y={y + 5}
                width="28"
                height="10"
                rx="3"
                className={
                  selected ? "stroke-cyan-400/80" : "stroke-zinc-700"
                }
                strokeWidth="1"
              />
            </g>
          );
        })}
      </svg>
    </IllustrationFrame>
  );
}
