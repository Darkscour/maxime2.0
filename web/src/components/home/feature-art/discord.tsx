import { IllustrationFrame } from "./shared";

/**
 * Discord integration illustration: a stylized channel tree on the left
 * (categories + #channels) with a cyan "Maxime" node tapping in from the
 * right side via a glowing connection line. Suggests "your bot lives where
 * your players already are."
 */
export function DiscordArt() {
  const channels = [
    { y: 30, name: "general", indent: 0 },
    { y: 46, name: "rosters", indent: 6, active: true },
    { y: 62, name: "scrims", indent: 6 },
    { y: 78, name: "sponsors", indent: 6 },
    { y: 100, name: "coaching", indent: 0 },
    { y: 116, name: "vod-review", indent: 6 },
  ];

  const tapX = 200;
  const tapY = 46;

  return (
    <IllustrationFrame accent="cyan" className="aspect-[16/10]">
      <svg
        viewBox="0 0 240 140"
        className="h-full w-full"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          x="20"
          y="16"
          width="120"
          height="112"
          rx="6"
          className="stroke-zinc-700"
          strokeWidth="1.25"
        />

        {channels.map((c, i) => {
          const x = 32 + c.indent;
          return (
            <g key={i}>
              <text
                x={x}
                y={c.y}
                className={
                  c.active ? "fill-cyan-300" : "fill-zinc-500"
                }
                fontSize="8"
                fontFamily="monospace"
              >
                {c.indent === 0 ? c.name.toUpperCase() : `# ${c.name}`}
              </text>
              {c.active && (
                <rect
                  x="28"
                  y={c.y - 8}
                  width="100"
                  height="11"
                  rx="2"
                  className="stroke-cyan-400/50 fill-cyan-400/10"
                  strokeWidth="1"
                />
              )}
            </g>
          );
        })}

        <line
          x1="140"
          y1={tapY - 4}
          x2={tapX - 12}
          y2={tapY - 4}
          className="stroke-cyan-400/70"
          strokeWidth="1.25"
          strokeDasharray="2 3"
        />

        <circle
          cx={tapX}
          cy={tapY - 4}
          r="14"
          className="stroke-cyan-400 fill-cyan-400/10"
          strokeWidth="1.5"
        />
        <text
          x={tapX}
          y={tapY - 1}
          textAnchor="middle"
          className="fill-cyan-200 font-mono"
          fontSize="9"
          letterSpacing="1"
        >
          M
        </text>

        <circle
          cx={tapX}
          cy={tapY - 4}
          r="20"
          className="stroke-cyan-400/30"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
      </svg>
    </IllustrationFrame>
  );
}
