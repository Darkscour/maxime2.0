import { IllustrationFrame } from "./shared";

/**
 * Recruitment illustration: an isometric-ish grid of stylized "player cards"
 * with a cyan scouting reticle locked on the central card. The focus card
 * gets corner brackets and a few "data" tick marks extending from it to
 * suggest "we see every stat behind every player."
 */
export function RecruitmentArt() {
  const cards = [
    { x: 30, y: 50 },
    { x: 155, y: 50 },
    { x: 280, y: 50 },
    { x: 30, y: 140 },
    { x: 155, y: 140 },
    { x: 280, y: 140 },
  ];
  const focused = cards[1];
  const cardW = 90;
  const cardH = 56;
  const fx = focused.x + cardW / 2;
  const fy = focused.y + cardH / 2;

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
          <radialGradient id="recruit-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {cards.map((c, i) => {
          const isFocused = i === 1;
          return (
            <g key={i} opacity={isFocused ? 1 : 0.55}>
              <rect
                x={c.x}
                y={c.y}
                width={cardW}
                height={cardH}
                rx="5"
                className={
                  isFocused ? "stroke-[color-mix(in_srgb,var(--accent)_70%,transparent)]" : "stroke-[var(--border-strong)]"
                }
                strokeWidth="1.25"
              />
              <circle
                cx={c.x + 14}
                cy={c.y + cardH / 2}
                r="6"
                className={
                  isFocused ? "stroke-[color-mix(in_srgb,var(--accent)_85%,white)]" : "stroke-[var(--foreground-subtle)]"
                }
                strokeWidth="1.25"
              />
              <line
                x1={c.x + 26}
                y1={c.y + cardH / 2 - 5}
                x2={c.x + cardW - 8}
                y2={c.y + cardH / 2 - 5}
                className={
                  isFocused ? "stroke-[color-mix(in_srgb,var(--accent)_70%,transparent)]" : "stroke-[var(--border-strong)]"
                }
                strokeWidth="1.25"
              />
              <line
                x1={c.x + 26}
                y1={c.y + cardH / 2 + 5}
                x2={c.x + cardW - 24}
                y2={c.y + cardH / 2 + 5}
                className={
                  isFocused ? "stroke-[color-mix(in_srgb,var(--accent)_40%,transparent)]" : "stroke-[var(--border)]"
                }
                strokeWidth="1.25"
              />
            </g>
          );
        })}

        <circle
          cx={fx}
          cy={fy}
          r="54"
          fill="url(#recruit-glow)"
          stroke="none"
        />

        <circle
          cx={fx}
          cy={fy}
          r="46"
          className="stroke-[color-mix(in_srgb,var(--accent)_60%,transparent)]"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <circle
          cx={fx}
          cy={fy}
          r="28"
          className="stroke-[color-mix(in_srgb,var(--accent)_80%,transparent)]"
          strokeWidth="1.25"
        />
        <circle
          cx={fx}
          cy={fy}
          r="2.5"
          className="fill-[color-mix(in_srgb,var(--accent)_85%,white)]"
          stroke="none"
        />

        <line
          x1={fx - 60}
          y1={fy}
          x2={fx - 32}
          y2={fy}
          className="stroke-[var(--accent)]"
          strokeWidth="1.25"
        />
        <line
          x1={fx + 32}
          y1={fy}
          x2={fx + 60}
          y2={fy}
          className="stroke-[var(--accent)]"
          strokeWidth="1.25"
        />
        <line
          x1={fx}
          y1={fy - 60}
          x2={fx}
          y2={fy - 32}
          className="stroke-[var(--accent)]"
          strokeWidth="1.25"
        />
        <line
          x1={fx}
          y1={fy + 32}
          x2={fx}
          y2={fy + 60}
          className="stroke-[var(--accent)]"
          strokeWidth="1.25"
        />

        {(() => {
          const r = 64;
          const len = 10;
          return (
            <g className="stroke-[var(--accent)]" strokeWidth="1.5">
              <polyline points={`${fx - r},${fy - r + len} ${fx - r},${fy - r} ${fx - r + len},${fy - r}`} />
              <polyline points={`${fx + r - len},${fy - r} ${fx + r},${fy - r} ${fx + r},${fy - r + len}`} />
              <polyline points={`${fx - r},${fy + r - len} ${fx - r},${fy + r} ${fx - r + len},${fy + r}`} />
              <polyline points={`${fx + r - len},${fy + r} ${fx + r},${fy + r} ${fx + r},${fy + r - len}`} />
            </g>
          );
        })()}

        <g className="stroke-[color-mix(in_srgb,var(--accent)_50%,transparent)]" strokeWidth="1" strokeDasharray="2 3">
          <line x1={fx + 70} y1={fy - 30} x2={fx + 130} y2={fy - 30} />
          <line x1={fx + 70} y1={fy} x2={fx + 115} y2={fy} />
          <line x1={fx + 70} y1={fy + 30} x2={fx + 120} y2={fy + 30} />
        </g>
        <g className="fill-[color-mix(in_srgb,var(--accent)_60%,transparent)]" stroke="none">
          <circle cx={fx + 132} cy={fy - 30} r="1.5" />
          <circle cx={fx + 117} cy={fy} r="1.5" />
          <circle cx={fx + 122} cy={fy + 30} r="1.5" />
        </g>
      </svg>
    </IllustrationFrame>
  );
}
