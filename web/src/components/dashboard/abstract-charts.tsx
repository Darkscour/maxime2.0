type Point = { x: number; y: number };

function normalizeSeries(values: number[]): number[] {
  const max = Math.max(...values, 1);
  return values.map((v) => v / max);
}

function buildPoints(
  values: number[],
  width: number,
  height: number,
  padding: number,
): Point[] {
  const normalized = normalizeSeries(values);
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const step = innerW / Math.max(values.length - 1, 1);

  return normalized.map((v, i) => ({
    x: padding + i * step,
    y: padding + innerH * (1 - v),
  }));
}

function smoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const p = points[0]!;
    return `M ${p.x} ${p.y}`;
  }

  let d = `M ${points[0]!.x} ${points[0]!.y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]!;
    const p1 = points[i + 1]!;
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

function areaPath(points: Point[], width: number, height: number): string {
  if (points.length === 0) return "";
  const line = smoothPath(points);
  const last = points[points.length - 1]!;
  const first = points[0]!;
  return `${line} L ${last.x} ${height} L ${first.x} ${height} Z`;
}

export function AbstractAreaChart({
  values,
  gradientId,
  stroke,
  fill,
  height = 112,
  className,
}: {
  values: number[];
  gradientId: string;
  stroke: string;
  fill: string;
  height?: number;
  className?: string;
}) {
  const width = 320;
  const padding = 12;
  const points = buildPoints(values, width, height, padding);
  const line = smoothPath(points);
  const area = areaPath(points, width, height);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className ?? "h-full w-full"}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.45" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
        <filter id={`${gradientId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {[0.25, 0.5, 0.75].map((ratio) => (
        <line
          key={ratio}
          x1={padding}
          x2={width - padding}
          y1={padding + (height - padding * 2) * ratio}
          y2={padding + (height - padding * 2) * ratio}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
      ))}

      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        filter={`url(#${gradientId}-glow)`}
        opacity="0.9"
      />

      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="2.5"
          fill={stroke}
          opacity={values[i]! > 0 ? 0.7 : 0.15}
        />
      ))}
    </svg>
  );
}

export function AbstractWaveChart({
  values,
  gradientId,
  stroke,
  height = 72,
  className,
}: {
  values: number[];
  gradientId: string;
  stroke: string;
  height?: number;
  className?: string;
}) {
  const width = 320;
  const padding = 8;
  const points = buildPoints(values, width, height, padding);
  const line = smoothPath(points);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className ?? "h-full w-full"}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${gradientId}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.2" />
          <stop offset="50%" stopColor={stroke} stopOpacity="1" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <path
        d={line}
        fill="none"
        stroke={`url(#${gradientId}-line)`}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />

      {points.map((p, i) =>
        values[i]! > 0 ? (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={stroke} opacity="0.5" />
        ) : null,
      )}
    </svg>
  );
}
