"use client";

import { useCallback, useRef, useState } from "react";
import type { ManagerAnalyticsPoint } from "@/lib/manager-analytics";

type Point = { x: number; y: number };

const WIDTH = 400;
const HEIGHT = 132;
const PADDING = { top: 8, right: 8, bottom: 28, left: 8 };

function yMax(values: number[]): number {
  const peak = Math.max(...values, 0);
  if (peak === 0) return 1;
  return peak;
}

function buildLinePoints(values: number[]): Point[] {
  if (values.length === 0) return [];

  const innerW = WIDTH - PADDING.left - PADDING.right;
  const innerH = HEIGHT - PADDING.top - PADDING.bottom;
  const max = yMax(values);
  const step = innerW / Math.max(values.length - 1, 1);

  return values.map((value, i) => ({
    x: PADDING.left + i * step,
    y: PADDING.top + innerH * (1 - value / max),
  }));
}

function polylinePath(points: Point[]): string {
  if (points.length === 0) return "";
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

function shouldShowAxisLabel(index: number, total: number): boolean {
  if (total <= 8) return true;
  if (index === 0 || index === total - 1) return true;
  const step = Math.ceil(total / 7);
  return index % step === 0;
}

export function ManagerAnalyticsLineChart({
  points,
  stroke,
  chartId,
  valueLabel,
  emptyHint,
}: {
  points: ManagerAnalyticsPoint[];
  stroke: string;
  chartId: string;
  valueLabel: (value: number) => string;
  emptyHint: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const values = points.map((p) => p.value);
  const hasActivity = values.some((v) => v > 0);
  const linePoints = buildLinePoints(values);

  const onPointerMove = useCallback(
    (clientX: number) => {
      const svg = svgRef.current;
      if (!svg || points.length === 0) return;

      const rect = svg.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * WIDTH;
      const innerW = WIDTH - PADDING.left - PADDING.right;
      const step = innerW / Math.max(points.length - 1, 1);
      const index = Math.round((x - PADDING.left) / step);
      setHoverIndex(Math.max(0, Math.min(points.length - 1, index)));
    },
    [points.length],
  );

  if (points.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-zinc-500">{emptyHint}</p>
    );
  }

  const active = hoverIndex != null ? points[hoverIndex] : null;
  const activePoint = hoverIndex != null ? linePoints[hoverIndex] : null;
  const baselineY = HEIGHT - PADDING.bottom;

  return (
    <div className="relative">
      <div className="mb-2 flex min-h-11 items-center justify-center px-1">
        {active ? (
          <div className="flex flex-col items-center rounded-lg border border-white/10 bg-[#161a24] px-4 py-2 text-center shadow-xl">
            <p className="text-[10px] leading-tight text-zinc-500">{active.date}</p>
            <p className="mt-0.5 text-sm font-semibold text-white">
              {valueLabel(active.value)}
            </p>
          </div>
        ) : (
          <p className="text-[10px] text-zinc-600">Hover the chart for week details</p>
        )}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-[8.25rem] w-full touch-none"
        onMouseMove={(e) => onPointerMove(e.clientX)}
        onMouseLeave={() => setHoverIndex(null)}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          if (touch) onPointerMove(touch.clientX);
        }}
        onTouchEnd={() => setHoverIndex(null)}
        role="img"
        aria-label="Analytics line chart"
      >
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={PADDING.left}
            x2={WIDTH - PADDING.right}
            y1={PADDING.top + (baselineY - PADDING.top) * ratio}
            y2={PADDING.top + (baselineY - PADDING.top) * ratio}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
        ))}

        <line
          x1={PADDING.left}
          x2={WIDTH - PADDING.right}
          y1={baselineY}
          y2={baselineY}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />

        <path
          d={polylinePath(linePoints)}
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {linePoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hoverIndex === i ? 5 : 3}
            fill={stroke}
            opacity={hoverIndex === i ? 1 : values[i]! > 0 ? 0.75 : 0.35}
            className="transition-all duration-150"
          />
        ))}

        {activePoint && (
          <line
            x1={activePoint.x}
            x2={activePoint.x}
            y1={PADDING.top}
            y2={baselineY}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        )}

        {points.map((point, i) => {
          if (!shouldShowAxisLabel(i, points.length)) return null;
          const x = linePoints[i]?.x ?? PADDING.left;
          const fill = hoverIndex === i ? "#a1a1aa" : "#52525b";
          const anchor =
            i === 0 ? "start" : i === points.length - 1 ? "end" : "middle";
          return (
            <text
              key={`${chartId}-axis-${point.label}-${i}`}
              x={x}
              y={HEIGHT - 6}
              textAnchor={anchor}
              fill={fill}
              fontSize="9"
            >
              {point.label}
            </text>
          );
        })}
      </svg>

      {!hasActivity && (
        <p className="mt-1 text-center text-[11px] leading-4 text-zinc-600">
          {emptyHint}
        </p>
      )}
    </div>
  );
}
