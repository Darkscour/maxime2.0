import { IllustrationFrame } from "./shared";

/**
 * Scrim Finder illustration: two team boxes facing each other across a
 * central "match" diamond. A violet beam between the two teams suggests
 * "we found you a worthy opponent." Small bracket lines flank the diamond
 * to hint at the broader tournament-tree metaphor.
 */
export function ScrimFinderArt() {
  return (
    <IllustrationFrame accent="violet" className="aspect-[16/10]">
      <svg
        viewBox="0 0 240 140"
        className="h-full w-full"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          x="22"
          y="46"
          width="56"
          height="48"
          rx="6"
          className="stroke-zinc-600"
          strokeWidth="1.25"
        />
        <circle cx="38" cy="70" r="6" className="stroke-zinc-500" strokeWidth="1.25" />
        <line x1="48" y1="68" x2="70" y2="68" className="stroke-zinc-600" strokeWidth="1.25" />
        <line x1="48" y1="76" x2="64" y2="76" className="stroke-zinc-700" strokeWidth="1.25" />

        <rect
          x="162"
          y="46"
          width="56"
          height="48"
          rx="6"
          className="stroke-zinc-600"
          strokeWidth="1.25"
        />
        <circle cx="178" cy="70" r="6" className="stroke-zinc-500" strokeWidth="1.25" />
        <line x1="188" y1="68" x2="210" y2="68" className="stroke-zinc-600" strokeWidth="1.25" />
        <line x1="188" y1="76" x2="204" y2="76" className="stroke-zinc-700" strokeWidth="1.25" />

        <line
          x1="78"
          y1="70"
          x2="162"
          y2="70"
          className="stroke-violet-400/70"
          strokeWidth="1.5"
        />

        <polygon
          points="120,58 134,70 120,82 106,70"
          className="stroke-violet-400 fill-violet-400/15"
          strokeWidth="1.5"
        />
        <text
          x="120"
          y="74"
          textAnchor="middle"
          className="fill-violet-200 font-mono"
          fontSize="9"
          letterSpacing="1.5"
        >
          VS
        </text>

        <polyline
          points="14,46 8,46 8,94 14,94"
          className="stroke-zinc-700"
          strokeWidth="1.25"
        />
        <polyline
          points="226,46 232,46 232,94 226,94"
          className="stroke-zinc-700"
          strokeWidth="1.25"
        />
      </svg>
    </IllustrationFrame>
  );
}
