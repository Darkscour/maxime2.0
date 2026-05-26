import { IllustrationFrame } from "./shared";

/**
 * AI Coach illustration: a stylized chat-composer frame anchored at the
 * bottom, with a floating cluster of geometric "thought" nodes hovering
 * above it connected by faint lines. One node sits on the composer caret
 * to suggest "AI is replying right now."
 */
export function AiCoachArt() {
  const nodes: { x: number; y: number; shape: "hex" | "circle" | "triangle"; bright?: boolean }[] = [
    { x: 92, y: 52, shape: "hex" },
    { x: 162, y: 30, shape: "circle" },
    { x: 232, y: 60, shape: "triangle", bright: true },
    { x: 300, y: 38, shape: "hex" },
    { x: 124, y: 96, shape: "circle" },
    { x: 268, y: 108, shape: "circle" },
    { x: 200, y: 122, shape: "hex", bright: true },
  ];

  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
    [4, 6],
    [2, 6],
    [3, 5],
    [5, 6],
  ];

  return (
    <IllustrationFrame accent="cyan" className="aspect-[16/10]">
      <svg
        viewBox="0 0 400 240"
        className="h-full w-full"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <radialGradient id="coach-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgb(34,211,238)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="rgb(34,211,238)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            className={
              nodes[a].bright || nodes[b].bright
                ? "stroke-cyan-400/60"
                : "stroke-zinc-700"
            }
            strokeWidth="1"
            strokeDasharray={
              nodes[a].bright || nodes[b].bright ? undefined : "2 3"
            }
          />
        ))}

        {nodes.map((n, i) => {
          const cls = n.bright ? "stroke-cyan-300" : "stroke-zinc-600";
          if (n.shape === "hex") {
            const r = 9;
            const pts = Array.from({ length: 6 }).map((_, k) => {
              const a = (Math.PI / 3) * k - Math.PI / 2;
              return `${(n.x + r * Math.cos(a)).toFixed(2)},${(n.y + r * Math.sin(a)).toFixed(2)}`;
            }).join(" ");
            return (
              <polygon
                key={i}
                points={pts}
                className={cls}
                strokeWidth="1.25"
              />
            );
          }
          if (n.shape === "triangle") {
            return (
              <polygon
                key={i}
                points={`${n.x},${n.y - 9} ${n.x + 8},${n.y + 5} ${n.x - 8},${n.y + 5}`}
                className={cls}
                strokeWidth="1.25"
              />
            );
          }
          return (
            <circle
              key={i}
              cx={n.x}
              cy={n.y}
              r="6.5"
              className={cls}
              strokeWidth="1.25"
            />
          );
        })}

        <circle
          cx={200}
          cy={122}
          r="32"
          fill="url(#coach-glow)"
          stroke="none"
        />

        <rect
          x="60"
          y="166"
          width="280"
          height="46"
          rx="10"
          className="stroke-zinc-600 fill-zinc-950/60"
          strokeWidth="1.25"
        />
        <line
          x1="78"
          y1="183"
          x2="206"
          y2="183"
          className="stroke-zinc-600"
          strokeWidth="1.25"
        />
        <line
          x1="78"
          y1="195"
          x2="176"
          y2="195"
          className="stroke-zinc-700"
          strokeWidth="1.25"
        />

        <rect
          x="296"
          y="178"
          width="30"
          height="22"
          rx="6"
          className="stroke-cyan-400 fill-cyan-400/10"
          strokeWidth="1.25"
        />
        <polygon
          points="306,184 318,189 306,194"
          className="fill-cyan-300"
          stroke="none"
        />
      </svg>
    </IllustrationFrame>
  );
}
