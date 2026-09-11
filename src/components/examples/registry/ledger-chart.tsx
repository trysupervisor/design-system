"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { ledgerMotion, ledgerVariables } from "./ledger-tokens";
import "./ledger.css";

export type LedgerDatum = { label: string; value: number };
export type LedgerChartProps = { data: readonly LedgerDatum[]; label: string; formatValue?: (value: number) => string; className?: string };

export const ledgerChartGeometry = {
  width: Number(ledgerVariables["--ledger-chart-width"]),
  height: Number(ledgerVariables["--ledger-chart-height"]),
  inset: Number(ledgerVariables["--ledger-chart-inset"]),
  samples: Number(ledgerVariables["--ledger-chart-samples"]),
};

export function ledgerChartIndex(progress: number, length: number) {
  if (length < 1) return -1;
  const clamped = Number.isNaN(progress) ? 0 : Math.max(0, Math.min(1, progress));
  return Math.round(clamped * (length - 1));
}

export function ledgerResample(values: readonly number[], count = ledgerChartGeometry.samples): number[] {
  if (!Number.isInteger(count) || count < 2) throw new RangeError("Sample count must be an integer of at least two.");
  if (values.length === 0) return [];
  if (values.some((value) => !Number.isFinite(value))) throw new RangeError("Chart values must be finite.");
  return Array.from({ length: count }, (_, index) => {
    const position = index / (count - 1) * (values.length - 1);
    const lower = Math.floor(position);
    const upper = Math.min(values.length - 1, lower + 1);
    const fraction = position - lower;
    return values[lower] * (1 - fraction) + values[upper] * fraction;
  });
}

export function ledgerChartPoint(values: readonly number[], index: number) {
  const { width, height, inset } = ledgerChartGeometry;
  if (values.length === 0) return { x: width / 2, y: height / 2 };
  const safeIndex = Math.max(0, Math.min(values.length - 1, Number.isFinite(index) ? Math.round(index) : 0));
  let min = Infinity;
  let max = -Infinity;
  for (const value of values) { min = Math.min(min, value); max = Math.max(max, value); }
  const scale = Math.max(Math.abs(min), Math.abs(max)) || 1;
  const span = max / scale - min / scale;
  const progress = span === 0 ? 0.5 : (values[safeIndex] / scale - min / scale) / span;
  return { x: values.length === 1 ? width / 2 : safeIndex / (values.length - 1) * width, y: height - inset - progress * (height - inset * 2) };
}

export function ledgerChartPaths(values: readonly number[]) {
  if (values.length === 0) return { line: "", area: "" };
  if (values.some((value) => !Number.isFinite(value))) throw new RangeError("Chart values must be finite.");
  let min = Infinity;
  let max = -Infinity;
  for (const value of values) { min = Math.min(min, value); max = Math.max(max, value); }
  const { width, height, inset } = ledgerChartGeometry;
  const scale = Math.max(Math.abs(min), Math.abs(max)) || 1;
  const span = max / scale - min / scale;
  const ordinates = values.map((value) => height - inset - (span === 0 ? 0.5 : (value / scale - min / scale) / span) * (height - inset * 2));
  const sampled = ledgerResample(ordinates);
  const line = sampled.map((y, index) => `${index === 0 ? "M" : "L"}${(index / (sampled.length - 1) * width).toFixed(3)},${y.toFixed(3)}`).join(" ");
  return { line, area: `${line} L${ledgerChartGeometry.width},${ledgerChartGeometry.height} L0,${ledgerChartGeometry.height} Z` };
}

const defaultFormat = (value: number) => value.toLocaleString();

export function LedgerChart({ data, label, formatValue = defaultFormat, className }: LedgerChartProps) {
  const series = useMemo(() => data.filter((datum) => Number.isFinite(datum.value)), [data]);
  const values = useMemo(() => series.map((datum) => datum.value), [series]);
  const paths = useMemo(() => ledgerChartPaths(values), [values]);
  const [hovered, setHovered] = useState<{ series: readonly LedgerDatum[]; index: number } | null>(null);
  const active = hovered?.series === series ? hovered.index : null;
  const index = active ?? series.length - 1;
  const point = ledgerChartPoint(values, index);
  const svg = useRef<SVGSVGElement>(null);
  const gradient = useId();
  const instructions = useId();
  const tooltip = useId();
  const reduced = useReducedMotion();
  const { width, height, inset } = ledgerChartGeometry;
  const transition = reduced ? { duration: 0 } : ledgerMotion.chart;
  const move = (clientX: number) => {
    const bounds = svg.current?.getBoundingClientRect();
    if (!bounds || bounds.width <= 0 || series.length === 0) return;
    setHovered({ series, index: ledgerChartIndex((clientX - bounds.left) / bounds.width, series.length) });
  };
  const select = (next: number) => setHovered({ series, index: Math.max(0, Math.min(series.length - 1, next)) });
  const labels = [...new Set([0, Math.floor((series.length - 1) / 2), series.length - 1])].filter((position) => position >= 0);

  return <div className={["ledger-chart", className].filter(Boolean).join(" ")} data-slot="ledger-chart">
    <div className="ledger-chart-readout"><span>{label}</span><span>{series[index] ? formatValue(series[index].value) : ""}</span></div>
    {series.length === 0 ? <div className="ledger-chart-empty" role="status">No data</div> : <>
      <div className="ledger-chart-plot">
        <svg ref={svg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" tabIndex={0} aria-label={label} aria-describedby={active === null ? instructions : `${instructions} ${tooltip}`} onPointerMove={(event) => move(event.clientX)} onPointerLeave={() => setHovered(null)} onPointerCancel={() => setHovered(null)} onBlur={() => setHovered(null)} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); move(event.clientX); }} onKeyDown={(event) => {
          if (event.key === "Escape") { event.preventDefault(); setHovered(null); }
          else if (event.key === "ArrowLeft") { event.preventDefault(); select((active ?? series.length - 1) - 1); }
          else if (event.key === "ArrowRight") { event.preventDefault(); select((active ?? series.length - 1) + 1); }
          else if (event.key === "Home") { event.preventDefault(); select(0); }
          else if (event.key === "End") { event.preventDefault(); select(series.length - 1); }
        }}>
          <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--ledger-chart-fill, var(--ledger-default-chart-fill))" stopOpacity="0.1" /><stop offset="100%" stopColor="var(--ledger-chart-fill, var(--ledger-default-chart-fill))" stopOpacity="0" /></linearGradient></defs>
          <path d={`M0 ${height - inset} H${width}`} fill="none" stroke="var(--ledger-chart-baseline, var(--ledger-default-chart-baseline))" strokeDasharray="2 5" />
          <motion.path data-slot="ledger-chart-area" initial={false} animate={{ d: paths.area }} transition={transition} fill={`url(#${gradient})`} />
          <motion.path data-slot="ledger-chart-line" initial={false} animate={{ d: paths.line }} transition={transition} fill="none" stroke="var(--ledger-chart-line, var(--ledger-default-chart-line))" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          {active !== null && <path d={`M${point.x} 0 V${height}`} fill="none" stroke="var(--ledger-chart-rule, var(--ledger-default-chart-rule))" strokeDasharray="2 4" />}
          <motion.circle initial={false} animate={{ cx: point.x, cy: point.y, r: active === null ? 2 : 3 }} transition={active === null ? transition : { duration: 0 }} fill="var(--ledger-accent, var(--ledger-default-accent))" />
        </svg>
        <AnimatePresence>{active !== null && <div key="tooltip" className="ledger-chart-tooltip-anchor" style={{ left: `clamp(0px, calc(${point.x / width * 100}% - var(--ledger-chart-tooltip-width, var(--ledger-default-chart-tooltip-width)) / 2), max(0px, calc(100% - var(--ledger-chart-tooltip-width, var(--ledger-default-chart-tooltip-width)))))` } as CSSProperties}>
          <motion.div id={tooltip} data-ledger-corner="" className="ledger-chart-tooltip" role="status" initial={reduced ? false : { opacity: 0, scale: 0.96, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 4 }} transition={reduced ? { duration: 0 } : ledgerMotion.tooltip}><span>{series[index].label}</span><strong>{formatValue(series[index].value)}</strong></motion.div>
        </div>}</AnimatePresence>
        <span id={instructions} className="ledger-visually-hidden">Use left and right arrow keys to inspect values. Press Home or End for the first or last value. Press Escape to clear the selection.</span>
      </div>
      <div className="ledger-chart-labels">{labels.map((position) => <span key={position}>{series[position].label}</span>)}</div>
    </>}
  </div>;
}
