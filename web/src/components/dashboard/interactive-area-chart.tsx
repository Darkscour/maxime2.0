"use client";

import { useCallback, useRef, useState } from "react";

type Point = { x: number; y: number };

export type InteractiveChartPoint = {
  /** Short x-axis label */
  label: string;
  /** Full date range for hover tooltip */
  date: string;
  value: number;
};

function yMax(values: number[]): number {
  const peak = Math.max(...values, 0);
  return peak === 0 ? 1 : peak;
}

function buildPoints(
  values: number[],
  width: number,
  height: number,
  padding: number,
): Point[] {
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const max = yMax(values);
  const step = innerW / Math.max(values.length - 1, 1);

  return values.map((value, i) => ({
    x: padding + i * step,
    y: padding + innerH * (1 - value / max),
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

function areaPath(points: Point[], height: number): string {
  if (points.length === 0) return "";
  const line = smoothPath(points);
  const last = points[points.length - 1]!;
  const first = points[0]!;
  return `${line} L ${last.x} ${height} L ${first.x} ${height} Z`;
}

function normalizePointsForLine(points: Point[], rightEdge: number): Point[] {
  if (points.length !== 1) return points;
  const only = points[0]!;
  return [only, { x: rightEdge, y: only.y }];
}

function shouldShowLabel(index: number, total: number): boolean {
  if (total <= 8) return true;
  if (index === 0 || index === total - 1) return true;
  const step = Math.ceil(total / 7);
  return index % step === 0;
}

/** Player-style glowing area chart with hoverable data points. */
export function InteractiveAreaChart({
  points,
  gradientId,
  stroke,
  fill,
  valueLabel,
  emptyHint,
  height = 112,
}: {
  points: InteractiveChartPoint[];
  gradientId: string;
  stroke: string;
  fill: string;
  valueLabel: (value: number) => string;
  emptyHint?: string;
  height?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const width = 320;
  const padding = 12;
  const values = points.map((p) => p.value);
  const hasActivity = values.some((v) => v > 0);
  const linePoints = buildPoints(values, width, height, padding);
  const chartLinePoints = normalizePointsForLine(linePoints, width - padding);
  const line = smoothPath(chartLinePoints);
  const area = areaPath(chartLinePoints, height);

  const onPointerMove = useCallback(
    (clientX: number) => {
      const svg = svgRef.current;
      if (!svg || points.length === 0) return;

      const rect = svg.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * width;
      const innerW = width - padding * 2;
      const step = innerW / Math.max(points.length - 1, 1);
      const index = Math.round((x - padding) / step);
      setHoverIndex(Math.max(0, Math.min(points.length - 1, index)));
    },
    [points.length, width],
  );

  if (points.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-zinc-500">
        {emptyHint ?? "No data yet."}
      </p>
    );
  }

  const active = hoverIndex != null ? points[hoverIndex] : null;
  const activePoint = hoverIndex != null ? linePoints[hoverIndex] : null;

  return (
    <div className="relative">
      <div className="mb-2 flex min-h-10 items-center justify-center px-1">
        {active ? (
          <div className="flex flex-col items-center rounded-lg border border-white/10 bg-[#161a24] px-4 py-2 text-center shadow-xl">
            <p className="text-[10px] leading-tight text-zinc-500">{active.date}</p>
            <p className="mt-0.5 text-sm font-semibold text-white">
              {valueLabel(active.value)}
            </p>
          </div>
        ) : (
          <p className="text-[10px] text-zinc-600">Hover a point for details</p>
        )}
      </div>

      <div className="h-28">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full touch-none"
          preserveAspectRatio="none"
          onMouseMove={(e) => onPointerMove(e.clientX)}
          onMouseLeave={() => setHoverIndex(null)}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            if (touch) onPointerMove(touch.clientX);
          }}
          onTouchEnd={() => setHoverIndex(null)}
          role="img"
          aria-label="Analytics chart"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fill} stopOpacity="0.45" />
              <stop offset="100%" stopColor={fill} stopOpacity="0" />
            </linearGradient>
            <filter
              id={`${gradientId}-glow`}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
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

          {activePoint && (
            <line
              x1={activePoint.x}
              x2={activePoint.x}
              y1={padding}
              y2={height}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
          )}

          {linePoints.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={hoverIndex === i ? 5 : 3}
              fill={stroke}
              opacity={hoverIndex === i ? 1 : values[i]! > 0 ? 0.75 : 0.3}
              className="transition-all duration-150"
            />
          ))}
        </svg>
      </div>

      <div className="mt-2 flex justify-between gap-1 px-1">
        {points.map((point, i) =>
          shouldShowLabel(i, points.length) ? (
            <span
              key={`${gradientId}-${point.label}-${i}`}
              className={`flex-1 truncate text-center text-[9px] ${
                hoverIndex === i ? "text-zinc-400" : "text-zinc-700"
              }`}
            >
              {point.label}
            </span>
          ) : (
            <span key={`${gradientId}-spacer-${i}`} className="flex-1" aria-hidden />
          ),
        )}
      </div>

      {emptyHint && (
        <p
          className={`mt-2 min-h-8 text-center text-[11px] leading-4 ${
            hasActivity ? "invisible" : "text-zinc-600"
          }`}
          aria-hidden={hasActivity}
        >
          {emptyHint}
        </p>
      )}
    </div>
  );
}
