import { IllustrationFrame } from "./shared";

/**
 * Sponsorships illustration: a constellation of small "brand tiles" floating
 * around a central team node. Violet match-lines connect a subset of tiles
 * to the center — one connection is thicker and brighter to suggest "best
 * match found." Each tile has a tiny abstract glyph standing in for a logo.
 */
export function SponsorshipsArt() {
  const cx = 200;
  const cy = 120;

  const tiles: { x: number; y: number; glyph: "square" | "triangle" | "circle" | "diamond"; matched?: boolean }[] = [
    { x: 58, y: 56, glyph: "square" },
    { x: 86, y: 168, glyph: "triangle", matched: true },
    { x: 168, y: 36, glyph: "circle" },
    { x: 224, y: 188, glyph: "diamond" },
    { x: 304, y: 60, glyph: "triangle" },
    { x: 332, y: 152, glyph: "square", matched: true },
  ];

  const TILE = 36;

  return (
    <IllustrationFrame accent="violet" className="aspect-[16/10]">
      <svg
        viewBox="0 0 400 240"
        className="h-full w-full"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <radialGradient id="sponsor-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgb(167,139,250)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="rgb(167,139,250)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {tiles.map((t, i) => {
          const tcx = t.x + TILE / 2;
          const tcy = t.y + TILE / 2;
          return (
            <line
              key={`l-${i}`}
              x1={tcx}
              y1={tcy}
              x2={cx}
              y2={cy}
              className={
                t.matched ? "stroke-violet-400/80" : "stroke-zinc-700/70"
              }
              strokeWidth={t.matched ? "1.5" : "1"}
              strokeDasharray={t.matched ? undefined : "2 4"}
            />
          );
        })}

        {tiles.map((t, i) => {
          const tcx = t.x + TILE / 2;
          const tcy = t.y + TILE / 2;
          const strokeClass = t.matched
            ? "stroke-violet-400/80"
            : "stroke-zinc-600";
          return (
            <g key={`t-${i}`}>
              <rect
                x={t.x}
                y={t.y}
                width={TILE}
                height={TILE}
                rx="4"
                className={strokeClass}
                strokeWidth="1.25"
              />
              {t.glyph === "square" && (
                <rect
                  x={tcx - 6}
                  y={tcy - 6}
                  width="12"
                  height="12"
                  className={strokeClass}
                  strokeWidth="1.25"
                />
              )}
              {t.glyph === "circle" && (
                <circle
                  cx={tcx}
                  cy={tcy}
                  r="6"
                  className={strokeClass}
                  strokeWidth="1.25"
                />
              )}
              {t.glyph === "triangle" && (
                <polygon
                  points={`${tcx},${tcy - 7} ${tcx + 7},${tcy + 5} ${tcx - 7},${tcy + 5}`}
                  className={strokeClass}
                  strokeWidth="1.25"
                />
              )}
              {t.glyph === "diamond" && (
                <polygon
                  points={`${tcx},${tcy - 7} ${tcx + 7},${tcy} ${tcx},${tcy + 7} ${tcx - 7},${tcy}`}
                  className={strokeClass}
                  strokeWidth="1.25"
                />
              )}
            </g>
          );
        })}

        <circle
          cx={cx}
          cy={cy}
          r="42"
          fill="url(#sponsor-glow)"
          stroke="none"
        />
        <circle
          cx={cx}
          cy={cy}
          r="22"
          className="stroke-violet-400 fill-violet-400/10"
          strokeWidth="1.5"
        />
        <circle
          cx={cx}
          cy={cy}
          r="32"
          className="stroke-violet-400/40"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          className="fill-violet-200 font-mono"
          fontSize="10"
          letterSpacing="1.5"
        >
          M
        </text>
      </svg>
    </IllustrationFrame>
  );
}
