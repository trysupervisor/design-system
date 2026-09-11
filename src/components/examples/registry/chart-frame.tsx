"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "cn";
import { useReducedMotion } from "motion/react";
import type { ChartDatum, ChartInspection, ChartRange } from "./chart-types";
import "./chart.css";

export const LEDGER_CHART_COLORS = {
  primary: "var(--chart-1)",
  secondary: "var(--chart-2)",
  tertiary: "var(--chart-3)",
  quaternary: "var(--chart-4)",
  quinary: "var(--chart-5)",
} as const;

const CHART_EASE = [0.22, 1, 0.36, 1] as const;

export function chartMotionTransition(reduced: boolean | null) {
  return reduced ? { duration: 0 } : { duration: 0.48, ease: CHART_EASE };
}

export function useChartMotion() {
  const reduced = useReducedMotion();

  return {
    animationDuration: reduced ? 0 : 480,
    isAnimationActive: !reduced,
  };
}

export function useChartRange<T extends ChartDatum>(
  data: readonly T[] | undefined,
  expandedData: readonly T[] | undefined,
  fallbackData: readonly T[],
  fallbackExpandedData: readonly T[],
  onRangeChange?: (range: ChartRange) => void,
) {
  const [range, setRange] = useState<ChartRange>("7 days");
  const resolved = resolveChartRangeData(data, expandedData, fallbackData, fallbackExpandedData);
  const rows = range === "7 days" ? resolved.shortRows : resolved.longRows;

  function changeRange(next: ChartRange) {
    setRange(next);
    onRangeChange?.(next);
  }

  return { range, rows: [...rows], changeRange, hasRange: resolved.hasRange };
}

export function resolveChartRangeData<T extends ChartDatum>(
  data: readonly T[] | undefined,
  expandedData: readonly T[] | undefined,
  fallbackData: readonly T[],
  fallbackExpandedData: readonly T[],
) {
  const usesFallback = data === undefined;
  const shortRows = usesFallback ? fallbackData : data;
  const longRows = expandedData ?? (usesFallback ? fallbackExpandedData : shortRows);
  const hasRange = usesFallback || expandedData !== undefined;
  return { shortRows, longRows, hasRange };
}

export function formatChartValue(value: unknown) {
  if (value === null || value === undefined) return "None";
  if (Array.isArray(value)) return value.join(" to ");
  if (typeof value === "number") return value.toLocaleString("en");
  return String(value);
}

export function formatChartCategoryLabel(value: unknown) {
  const label = String(value ?? "").replace(/^Days\s+(?=\d)/i, "");
  return label.length > 12 ? `${label.slice(0, 12).trimEnd()}…` : label;
}

export function ChartDataTable({ data, label }: { data: readonly ChartDatum[]; label: string }) {
  const columns = useMemo(
    () => Array.from(new Set(data.flatMap((row) => Object.keys(row)))),
    [data],
  );

  return (
    <details className="catalog-chart-data">
      <summary>View data</summary>
      <div className="catalog-chart-data-scroll" tabIndex={0} role="region" aria-label={`${label} data`}>
        <table>
          <caption>{label}</caption>
          <thead>
            <tr>{columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={`${row.label}-${index}`}>
                {columns.map((column) => <td key={column}>{formatChartValue(row[column])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export function ChartFrame({
  children,
  className,
  data,
  label,
  onRangeChange,
  range,
  summary,
  value,
}: {
  children: React.ReactNode;
  className?: string;
  data: readonly ChartDatum[];
  label: string;
  onRangeChange?: (range: ChartRange) => void;
  range?: ChartRange;
  summary: string;
  value: string;
}) {
  return (
    <section className={cn("catalog-chart-frame", className)} aria-label={label}>
      <header className="catalog-chart-toolbar">
        <div>
          <h3>{label}</h3>
          <div className="catalog-chart-metric">
            <strong>{value}</strong>
            <span>{summary}</span>
          </div>
        </div>
        {range && onRangeChange ? (
          <div className="catalog-chart-ranges" role="group" aria-label="Chart range">
            {(["7 days", "30 days"] as const).map((option) => (
              <button
                type="button"
                key={option}
                aria-pressed={range === option}
                onClick={() => onRangeChange(option)}
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}
      </header>
      <div className="catalog-chart-stage">
        {data.length ? children : <div className="catalog-chart-empty" role="status">No data</div>}
      </div>
      <ChartDataTable data={data} label={`${label}, ${range ?? "current"}`} />
    </section>
  );
}

type SelectedInspection = { inspection: ChartInspection; resetKey: string } | null;

export function resolveSelectedInspection(selected: SelectedInspection, resetKey: string) {
  return selected?.resetKey === resetKey ? selected.inspection : null;
}

export function useChartInspection(onInspect?: (inspection: ChartInspection) => void, resetKey = "") {
  const id = useId();
  const [hovered, setHovered] = useState<ChartInspection | null>(null);
  const [focused, setFocused] = useState<ChartInspection | null>(null);
  const [selected, setSelected] = useState<SelectedInspection>(null);
  const active = hovered ?? focused ?? resolveSelectedInspection(selected, resetKey);

  function clear() {
    setHovered(null);
    setFocused(null);
    setSelected(null);
  }

  function inspectProps(inspection: ChartInspection) {
    return {
      tabIndex: 0,
      "aria-describedby": active?.label === inspection.label ? id : undefined,
      onMouseEnter: () => setHovered(inspection),
      onMouseLeave: () => setHovered(null),
      onFocus: () => setFocused(inspection),
      onBlur: () => setFocused(null),
      onClick: () => {
        setSelected({ inspection, resetKey });
        onInspect?.(inspection);
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setSelected({ inspection, resetKey });
          onInspect?.(inspection);
        }
        if (event.key === "Escape") clear();
      },
    };
  }

  return { active, clear, id, inspectProps };
}

export function ChartInspectionTooltip({ inspection, id }: { inspection: ChartInspection | null; id: string }) {
  return inspection ? <div className="catalog-chart-inspection" data-slot="chart-tooltip" role="tooltip" id={id}><span>{inspection.label}</span><strong>{inspection.value}</strong></div> : null;
}
