import { IllustrationFrame } from "./shared";

/**
 * VOD Review illustration: a horizontal film strip with perforations and
 * frame dividers, sitting above a timeline track. A single cyan pin marks
 * a "key moment" on the timeline, with a small callout above to suggest
 * the AI flagged something noteworthy.
 */
export function VodReviewArt() {
  const stripY = 38;
  const stripH = 40;
  const stripX1 = 26;
  const stripX2 = 214;
  const perfRowYTop = stripY + 4;
  const perfRowYBot = stripY + stripH - 8;

  const frames = [40, 72, 104, 136, 168];
  const pinX = 152;

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
          x={stripX1}
          y={stripY}
          width={stripX2 - stripX1}
          height={stripH}
          rx="3"
          className="stroke-zinc-600"
          strokeWidth="1.25"
        />

        {frames.map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={stripY}
            x2={x}
            y2={stripY + stripH}
            className="stroke-zinc-700"
            strokeWidth="1"
          />
        ))}

        {Array.from({ length: 9 }).map((_, i) => {
          const x = stripX1 + 8 + i * 22;
          return (
            <g key={i}>
              <rect
                x={x}
                y={perfRowYTop}
                width="4"
                height="3"
                className="stroke-zinc-700"
                strokeWidth="0.75"
              />
              <rect
                x={x}
                y={perfRowYBot}
                width="4"
                height="3"
                className="stroke-zinc-700"
                strokeWidth="0.75"
              />
            </g>
          );
        })}

        <line
          x1={stripX1}
          y1="100"
          x2={stripX2}
          y2="100"
          className="stroke-zinc-700"
          strokeWidth="1"
        />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <line
            key={i}
            x1={stripX1 + i * 24}
            y1="98"
            x2={stripX1 + i * 24}
            y2="104"
            className="stroke-zinc-700"
            strokeWidth="1"
          />
        ))}

        <line
          x1={pinX}
          y1={stripY + stripH}
          x2={pinX}
          y2="106"
          className="stroke-cyan-400"
          strokeWidth="1.25"
        />
        <circle
          cx={pinX}
          cy="106"
          r="3"
          className="fill-cyan-300"
          stroke="none"
        />

        <rect
          x={pinX - 28}
          y="14"
          width="56"
          height="18"
          rx="4"
          className="stroke-cyan-400 fill-cyan-400/10"
          strokeWidth="1.25"
        />
        <line
          x1={pinX - 18}
          y1="23"
          x2={pinX + 14}
          y2="23"
          className="stroke-cyan-300"
          strokeWidth="1.25"
        />
        <line
          x1={pinX}
          y1="32"
          x2={pinX}
          y2={stripY}
          className="stroke-cyan-400/60"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      </svg>
    </IllustrationFrame>
  );
}
