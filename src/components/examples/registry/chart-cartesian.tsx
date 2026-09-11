"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  ChartFrame,
  ChartInspectionTooltip,
  LEDGER_CHART_COLORS,
  chartMotionTransition,
  formatChartCategoryLabel,
  formatChartValue,
  useChartInspection,
  useChartMotion,
  useChartRange,
} from "./chart-frame";
import type { ChartCatalogProps, ChartDatum, InspectableChartCatalogProps } from "./chart-types";

type RenderState<T extends ChartDatum> = {
  animationDuration: number;
  isAnimationActive: boolean;
  rows: T[];
};

function ChartShell<T extends ChartDatum>({
  children,
  defaultLabel,
  defaultSummary,
  defaultValue,
  fallbackData,
  fallbackExpandedData,
  props,
}: {
  children: (state: RenderState<T>) => React.ReactNode;
  defaultLabel: string;
  defaultSummary: string;
  defaultValue: (rows: readonly T[]) => string;
  fallbackData: readonly T[];
  fallbackExpandedData: readonly T[];
  props: ChartCatalogProps<T>;
}) {
  const { rows, range, changeRange, hasRange } = useChartRange(
    props.data,
    props.expandedData,
    fallbackData,
    fallbackExpandedData,
    props.onRangeChange,
  );
  const motion = useChartMotion();

  return (
    <ChartFrame
      className={props.className}
      data={rows}
      label={props.label ?? defaultLabel}
      onRangeChange={hasRange ? changeRange : undefined}
      range={hasRange ? range : undefined}
      summary={props.summary ?? defaultSummary}
      value={props.value ?? defaultValue(rows)}
    >
      {children({ rows, ...motion })}
    </ChartFrame>
  );
}

const axis = { tickLine: false, axisLine: false, tickMargin: 9 } as const;
const categoryAxis = { ...axis, minTickGap: 18, tickFormatter: formatChartCategoryLabel } as const;
const grid = { vertical: false } as const;
const tooltip = <ChartTooltipContent indicator="line" />;
const legend = <ChartLegendContent />;
const rangeTooltip = <ChartTooltipContent formatter={(value, name) => <div className="flex flex-1 items-center justify-between gap-4"><span className="text-muted-foreground">{String(name)}</span><span className="font-mono font-medium tabular-nums">{formatChartValue(value)}</span></div>} />;

type ComparisonRow = ChartDatum & { current: number; prior: number };
const comparisonShort: ComparisonRow[] = [
  { label: "Mon", current: 42, prior: 37 },
  { label: "Tue", current: 47, prior: 41 },
  { label: "Wed", current: 45, prior: 44 },
  { label: "Thu", current: 54, prior: 46 },
  { label: "Fri", current: 58, prior: 51 },
  { label: "Sat", current: 55, prior: 49 },
  { label: "Sun", current: 63, prior: 54 },
];
const comparisonLong: ComparisonRow[] = [
  { label: "Days 1 to 5", current: 191, prior: 174 },
  { label: "Days 6 to 10", current: 218, prior: 196 },
  { label: "Days 11 to 15", current: 209, prior: 201 },
  { label: "Days 16 to 20", current: 247, prior: 216 },
  { label: "Days 21 to 25", current: 261, prior: 229 },
  { label: "Days 26 to 30", current: 278, prior: 241 },
];
const comparisonConfig = {
  current: { label: "Current", color: LEDGER_CHART_COLORS.primary },
  prior: { label: "Prior", color: LEDGER_CHART_COLORS.secondary },
} satisfies ChartConfig;

export function ComparisonLineChart(props: ChartCatalogProps<ComparisonRow>) {
  return <ChartShell props={props} fallbackData={comparisonShort} fallbackExpandedData={comparisonLong} defaultLabel="Resolved conversations" defaultSummary="latest interval" defaultValue={(rows) => String(rows.at(-1)?.current ?? 0)}>
    {({ rows, ...motion }) => <ChartContainer config={comparisonConfig} className="h-full w-full">
      <LineChart accessibilityLayer data={rows} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid {...grid} />
        <XAxis dataKey="label" {...categoryAxis} />
        <YAxis width={32} {...axis} />
        <Tooltip content={tooltip} />
        <Legend content={legend} />
        <Line dataKey="prior" type="linear" stroke="var(--color-prior)" strokeWidth={1.25} dot={false} {...motion} />
        <Line dataKey="current" type="linear" stroke="var(--color-current)" strokeWidth={2} dot={{ r: 2 }} {...motion} />
      </LineChart>
    </ChartContainer>}
  </ChartShell>;
}

type GroupedRow = ChartDatum & { newAccounts: number; returning: number };
const groupedShort: GroupedRow[] = [
  { label: "Mon", newAccounts: 18, returning: 26 }, { label: "Tue", newAccounts: 22, returning: 29 },
  { label: "Wed", newAccounts: 17, returning: 31 }, { label: "Thu", newAccounts: 25, returning: 34 },
  { label: "Fri", newAccounts: 28, returning: 33 }, { label: "Sat", newAccounts: 15, returning: 24 },
  { label: "Sun", newAccounts: 19, returning: 27 },
];
const groupedLong: GroupedRow[] = [
  { label: "Days 1 to 5", newAccounts: 83, returning: 132 }, { label: "Days 6 to 10", newAccounts: 97, returning: 146 },
  { label: "Days 11 to 15", newAccounts: 91, returning: 151 }, { label: "Days 16 to 20", newAccounts: 112, returning: 164 },
  { label: "Days 21 to 25", newAccounts: 119, returning: 172 }, { label: "Days 26 to 30", newAccounts: 127, returning: 181 },
];
const groupedConfig = {
  newAccounts: { label: "New", color: LEDGER_CHART_COLORS.primary },
  returning: { label: "Returning", color: LEDGER_CHART_COLORS.secondary },
} satisfies ChartConfig;

export function GroupedBarChart(props: ChartCatalogProps<GroupedRow>) {
  return <ChartShell props={props} fallbackData={groupedShort} fallbackExpandedData={groupedLong} defaultLabel="Active accounts" defaultSummary="total accounts" defaultValue={(rows) => String(rows.reduce((sum, row) => sum + row.newAccounts + row.returning, 0))}>
    {({ rows, ...motion }) => <ChartContainer config={groupedConfig} className="h-full w-full">
      <BarChart accessibilityLayer data={rows} barGap={3} barCategoryGap="22%" margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid {...grid} /><XAxis dataKey="label" {...categoryAxis} /><YAxis width={32} {...axis} />
        <Tooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} /><Legend content={legend} />
        <Bar dataKey="newAccounts" fill="var(--color-newAccounts)" radius={[5, 5, 1, 1]} {...motion} />
        <Bar dataKey="returning" fill="var(--color-returning)" radius={[5, 5, 1, 1]} {...motion} />
      </BarChart>
    </ChartContainer>}
  </ChartShell>;
}

type AreaRow = ChartDatum & { organic: number; paid: number; referral: number };
const areaShort: AreaRow[] = [
  { label: "Mon", organic: 24, paid: 11, referral: 7 }, { label: "Tue", organic: 27, paid: 13, referral: 8 },
  { label: "Wed", organic: 25, paid: 14, referral: 9 }, { label: "Thu", organic: 31, paid: 15, referral: 11 },
  { label: "Fri", organic: 34, paid: 14, referral: 12 }, { label: "Sat", organic: 29, paid: 10, referral: 9 },
  { label: "Sun", organic: 33, paid: 12, referral: 10 },
];
const areaLong: AreaRow[] = [
  { label: "Days 1 to 5", organic: 126, paid: 59, referral: 37 }, { label: "Days 6 to 10", organic: 142, paid: 64, referral: 43 },
  { label: "Days 11 to 15", organic: 137, paid: 68, referral: 46 }, { label: "Days 16 to 20", organic: 158, paid: 72, referral: 51 },
  { label: "Days 21 to 25", organic: 169, paid: 70, referral: 55 }, { label: "Days 26 to 30", organic: 181, paid: 74, referral: 58 },
];
const areaConfig = {
  organic: { label: "Organic", color: LEDGER_CHART_COLORS.primary },
  paid: { label: "Paid", color: LEDGER_CHART_COLORS.secondary },
  referral: { label: "Referral", color: LEDGER_CHART_COLORS.tertiary },
} satisfies ChartConfig;

export function StackedAreaChart(props: ChartCatalogProps<AreaRow>) {
  return <ChartShell props={props} fallbackData={areaShort} fallbackExpandedData={areaLong} defaultLabel="Qualified visits" defaultSummary="all sources" defaultValue={(rows) => String(rows.reduce((sum, row) => sum + row.organic + row.paid + row.referral, 0))}>
    {({ rows, ...motion }) => <ChartContainer config={areaConfig} className="h-full w-full">
      <AreaChart accessibilityLayer data={rows} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid {...grid} /><XAxis dataKey="label" {...categoryAxis} /><YAxis width={32} {...axis} />
        <Tooltip content={tooltip} /><Legend content={legend} />
        <Area dataKey="organic" type="linear" stackId="visits" stroke="var(--color-organic)" fill="var(--color-organic)" fillOpacity={0.38} {...motion} />
        <Area dataKey="paid" type="linear" stackId="visits" stroke="var(--color-paid)" fill="var(--color-paid)" fillOpacity={0.3} {...motion} />
        <Area dataKey="referral" type="linear" stackId="visits" stroke="var(--color-referral)" fill="var(--color-referral)" fillOpacity={0.24} {...motion} />
      </AreaChart>
    </ChartContainer>}
  </ChartShell>;
}

type ShareRow = ChartDatum & { automated: number; assisted: number; manual: number };
const shareShort: ShareRow[] = [
  { label: "Mon", automated: 61, assisted: 27, manual: 12 }, { label: "Tue", automated: 64, assisted: 23, manual: 13 },
  { label: "Wed", automated: 55, assisted: 30, manual: 15 }, { label: "Thu", automated: 67, assisted: 22, manual: 11 },
  { label: "Fri", automated: 69, assisted: 21, manual: 10 }, { label: "Sat", automated: 56, assisted: 28, manual: 16 },
  { label: "Sun", automated: 58, assisted: 27, manual: 15 },
];
const shareLong: ShareRow[] = [
  { label: "Days 1 to 5", automated: 60, assisted: 27, manual: 13 }, { label: "Days 6 to 10", automated: 63, assisted: 25, manual: 12 },
  { label: "Days 11 to 15", automated: 59, assisted: 28, manual: 13 }, { label: "Days 16 to 20", automated: 65, assisted: 24, manual: 11 },
  { label: "Days 21 to 25", automated: 67, assisted: 23, manual: 10 }, { label: "Days 26 to 30", automated: 68, assisted: 22, manual: 10 },
];
const shareConfig = {
  automated: { label: "Automated", color: LEDGER_CHART_COLORS.primary },
  assisted: { label: "Assisted", color: LEDGER_CHART_COLORS.secondary },
  manual: { label: "Manual", color: LEDGER_CHART_COLORS.tertiary },
} satisfies ChartConfig;

export function normalizeChartShares<T extends ShareRow>(rows: readonly T[]): ShareRow[] {
  return rows.map((row) => {
    const total = row.automated + row.assisted + row.manual;
    if (!Number.isFinite(total) || total <= 0) return { ...row, automated: 0, assisted: 0, manual: 0 };
    const automated = Number((row.automated / total * 100).toFixed(1));
    const assisted = Number((row.assisted / total * 100).toFixed(1));
    return { ...row, automated, assisted, manual: Number((100 - automated - assisted).toFixed(1)) };
  });
}

export function NormalizedStackedBarChart(props: ChartCatalogProps<ShareRow>) {
  const [compact, setCompact] = useState(false);
  const normalizedProps = {
    ...props,
    data: props.data ? normalizeChartShares(props.data) : undefined,
    expandedData: props.expandedData ? normalizeChartShares(props.expandedData) : undefined,
  };
  return <ChartShell props={normalizedProps} fallbackData={shareShort} fallbackExpandedData={shareLong} defaultLabel="Work distribution" defaultSummary="average automated share" defaultValue={(rows) => `${(rows.reduce((sum, row) => sum + row.automated, 0) / Math.max(1, rows.length)).toFixed(1)}%`}>
    {({ rows, ...motion }) => <>
      <button className="catalog-chart-compact" type="button" aria-pressed={compact} onClick={() => setCompact((current) => !current)}>Compact axis</button>
      <ChartContainer config={shareConfig} className="h-full w-full">
        <BarChart accessibilityLayer data={rows} barCategoryGap={compact ? "8%" : "20%"} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid {...grid} /><XAxis dataKey="label" {...categoryAxis} />{compact ? null : <YAxis width={36} domain={[0, 100]} tickFormatter={(value) => `${value}%`} {...axis} />}
          <Tooltip content={<ChartTooltipContent />} /><Legend content={legend} />
          <Bar dataKey="automated" stackId="share" fill="var(--color-automated)" {...motion} />
          <Bar dataKey="assisted" stackId="share" fill="var(--color-assisted)" {...motion} />
          <Bar dataKey="manual" stackId="share" fill="var(--color-manual)" radius={[5, 5, 0, 0]} {...motion} />
        </BarChart>
      </ChartContainer>
    </>}
  </ChartShell>;
}

type ValueRow = ChartDatum & { value: number };
const divergingShort: ValueRow[] = [
  { label: "Activation", value: 18 }, { label: "Expansion", value: 13 }, { label: "Renewal", value: 9 },
  { label: "Churn", value: -11 }, { label: "Downgrade", value: -7 }, { label: "Credits", value: -4 },
];
const divergingLong: ValueRow[] = [
  { label: "Activation", value: 72 }, { label: "Expansion", value: 48 }, { label: "Renewal", value: 39 },
  { label: "Churn", value: -46 }, { label: "Downgrade", value: -31 }, { label: "Credits", value: -18 },
];
const valueConfig = {
  value: { label: "Value", color: LEDGER_CHART_COLORS.primary },
  positive: { label: "Gain", color: LEDGER_CHART_COLORS.primary },
  negative: { label: "Loss", color: LEDGER_CHART_COLORS.secondary },
} satisfies ChartConfig;

export function DivergingBarChart(props: ChartCatalogProps<ValueRow>) {
  return <ChartShell props={props} fallbackData={divergingShort} fallbackExpandedData={divergingLong} defaultLabel="Account movement" defaultSummary="net accounts" defaultValue={(rows) => String(rows.reduce((sum, row) => sum + row.value, 0))}>
    {({ rows, ...motion }) => <ChartContainer config={valueConfig} className="h-full w-full">
      <BarChart accessibilityLayer data={rows} layout="vertical" margin={{ top: 8, right: 18, left: 12, bottom: 4 }}>
        <CartesianGrid horizontal={false} /><XAxis type="number" {...axis} /><YAxis type="category" dataKey="label" width={68} {...axis} />
        <ReferenceLine x={0} stroke="var(--border)" /><Tooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="value" radius={[4, 4, 4, 4]} {...motion}>{rows.map((row) => <Cell key={row.label} fill={row.value >= 0 ? "var(--color-positive)" : "var(--color-negative)"} />)}</Bar>
      </BarChart>
    </ChartContainer>}
  </ChartShell>;
}

type RangeRow = ChartDatum & { lower: number; middle: number; upper: number };
const rangeShort: RangeRow[] = [
  { label: "Mon", lower: 38, middle: 44, upper: 51 }, { label: "Tue", lower: 41, middle: 48, upper: 56 },
  { label: "Wed", lower: 40, middle: 46, upper: 53 }, { label: "Thu", lower: 46, middle: 53, upper: 61 },
  { label: "Fri", lower: 49, middle: 57, upper: 65 }, { label: "Sat", lower: 47, middle: 54, upper: 62 },
  { label: "Sun", lower: 52, middle: 60, upper: 69 },
];
const rangeLong: RangeRow[] = [
  { label: "Days 1 to 5", lower: 36, middle: 43, upper: 50 }, { label: "Days 6 to 10", lower: 40, middle: 47, upper: 55 },
  { label: "Days 11 to 15", lower: 42, middle: 49, upper: 57 }, { label: "Days 16 to 20", lower: 46, middle: 54, upper: 63 },
  { label: "Days 21 to 25", lower: 49, middle: 58, upper: 67 }, { label: "Days 26 to 30", lower: 53, middle: 62, upper: 71 },
];
const rangeConfig = {
  observed: { label: "Observed range", color: LEDGER_CHART_COLORS.secondary },
  middle: { label: "Median", color: LEDGER_CHART_COLORS.primary },
} satisfies ChartConfig;

export function RangeAreaChart(props: ChartCatalogProps<RangeRow>) {
  return <ChartShell props={props} fallbackData={rangeShort} fallbackExpandedData={rangeLong} defaultLabel="Handling time" defaultSummary="latest median" defaultValue={(rows) => `${rows.at(-1)?.middle ?? 0} min`}>
    {({ rows, ...motion }) => {
      const plotted = rows.map((row) => ({ ...row, observed: [row.lower, row.upper] }));
      return <ChartContainer config={rangeConfig} className="h-full w-full">
        <ComposedChart accessibilityLayer data={plotted} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid {...grid} /><XAxis dataKey="label" {...categoryAxis} /><YAxis width={32} {...axis} /><Tooltip content={rangeTooltip} /><Legend content={legend} />
          <Area dataKey="observed" type="linear" stroke="var(--color-observed)" fill="var(--color-observed)" fillOpacity={0.14} {...motion} />
          <Line dataKey="middle" type="linear" stroke="var(--color-middle)" strokeWidth={2} dot={{ r: 2 }} {...motion} />
        </ComposedChart>
      </ChartContainer>;
    }}
  </ChartShell>;
}

type TargetRow = ChartDatum & { target: number; value: number };
const targetShort: TargetRow[] = [
  { label: "Mon", value: 84, target: 90 }, { label: "Tue", value: 88, target: 90 }, { label: "Wed", value: 91, target: 90 },
  { label: "Thu", value: 89, target: 90 }, { label: "Fri", value: 94, target: 90 }, { label: "Sat", value: 92, target: 90 }, { label: "Sun", value: 96, target: 90 },
];
const targetLong: TargetRow[] = [
  { label: "Days 1 to 5", value: 82, target: 90 }, { label: "Days 6 to 10", value: 86, target: 90 },
  { label: "Days 11 to 15", value: 89, target: 90 }, { label: "Days 16 to 20", value: 91, target: 90 },
  { label: "Days 21 to 25", value: 93, target: 90 }, { label: "Days 26 to 30", value: 95, target: 90 },
];
const targetConfig = {
  value: { label: "Service level", color: LEDGER_CHART_COLORS.primary },
  target: { label: "Target", color: LEDGER_CHART_COLORS.secondary },
} satisfies ChartConfig;

export function TargetLineChart(props: ChartCatalogProps<TargetRow>) {
  return <ChartShell props={props} fallbackData={targetShort} fallbackExpandedData={targetLong} defaultLabel="Service level" defaultSummary="latest interval" defaultValue={(rows) => `${rows.at(-1)?.value ?? 0}%`}>
    {({ rows, ...motion }) => <ChartContainer config={targetConfig} className="h-full w-full">
      <LineChart accessibilityLayer data={rows} margin={{ top: 20, right: 20, left: 0, bottom: 4 }}>
        <CartesianGrid {...grid} /><XAxis dataKey="label" {...categoryAxis} /><YAxis width={38} domain={[75, 100]} tickFormatter={(value) => `${value}%`} {...axis} />
        <ReferenceLine y={rows[0]?.target ?? 90} stroke="var(--color-target)" strokeDasharray="4 4" label={{ value: `Target ${rows[0]?.target ?? 90}%`, position: "insideTopRight", fill: "var(--muted-foreground)", fontSize: 10 }} />
        <Tooltip content={tooltip} /><Line dataKey="value" type="linear" stroke="var(--color-value)" strokeWidth={2} dot={{ r: 2 }} {...motion} />
      </LineChart>
    </ChartContainer>}
  </ChartShell>;
}

const thresholdShort: ValueRow[] = [
  { label: "Mon", value: 42 }, { label: "Tue", value: 57 }, { label: "Wed", value: 64 }, { label: "Thu", value: 76 },
  { label: "Fri", value: 69 }, { label: "Sat", value: 48 }, { label: "Sun", value: 82 },
];
const thresholdLong: ValueRow[] = [
  { label: "Days 1 to 5", value: 39 }, { label: "Days 6 to 10", value: 52 }, { label: "Days 11 to 15", value: 61 },
  { label: "Days 16 to 20", value: 73 }, { label: "Days 21 to 25", value: 67 }, { label: "Days 26 to 30", value: 79 },
];

export function ThresholdChart(props: ChartCatalogProps<ValueRow>) {
  return <ChartShell props={props} fallbackData={thresholdShort} fallbackExpandedData={thresholdLong} defaultLabel="Queue saturation" defaultSummary="peak saturation" defaultValue={(rows) => `${Math.max(0, ...rows.map((row) => row.value))}%`}>
    {({ rows, ...motion }) => <ChartContainer config={valueConfig} className="h-full w-full">
      <LineChart accessibilityLayer data={rows} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid {...grid} /><XAxis dataKey="label" {...categoryAxis} /><YAxis width={38} domain={[0, 100]} tickFormatter={(value) => `${value}%`} {...axis} />
        <ReferenceArea y1={0} y2={55} fill="var(--chart-3)" fillOpacity={0.08} /><ReferenceArea y1={55} y2={75} fill="var(--chart-4)" fillOpacity={0.08} /><ReferenceArea y1={75} y2={100} fill="var(--chart-5)" fillOpacity={0.08} />
        <ReferenceLine y={55} stroke="var(--border)" /><ReferenceLine y={75} stroke="var(--border)" />
        <Tooltip content={tooltip} /><Line dataKey="value" type="linear" stroke="var(--color-value)" strokeWidth={2} dot={{ r: 2 }} {...motion} />
      </LineChart>
    </ChartContainer>}
  </ChartShell>;
}

type ScatterRow = ChartDatum & { response: number; satisfaction: number; volume?: number };
const scatterShort: ScatterRow[] = [
  { label: "Billing", response: 18, satisfaction: 72 }, { label: "Setup", response: 31, satisfaction: 58 },
  { label: "Access", response: 11, satisfaction: 84 }, { label: "Reports", response: 26, satisfaction: 67 },
  { label: "Sync", response: 38, satisfaction: 54 }, { label: "Exports", response: 15, satisfaction: 79 },
];
const scatterLong: ScatterRow[] = scatterShort.map((row, index) => ({ ...row, response: row.response + index % 2, satisfaction: row.satisfaction + 3 }));
const scatterConfig = { response: { label: "Response", color: LEDGER_CHART_COLORS.primary } } satisfies ChartConfig;

export function ScatterPlotChart(props: ChartCatalogProps<ScatterRow>) {
  return <ChartShell props={props} fallbackData={scatterShort} fallbackExpandedData={scatterLong} defaultLabel="Response and satisfaction" defaultSummary="median response" defaultValue={(rows) => `${medianChartValue(rows.map((row) => row.response))} min`}>
    {({ rows, ...motion }) => <ChartContainer config={scatterConfig} className="h-full w-full">
      <ScatterChart accessibilityLayer margin={{ top: 12, right: 18, left: 0, bottom: 12 }}>
        <CartesianGrid /><XAxis type="number" dataKey="response" name="Response" unit=" min" {...axis} /><YAxis type="number" dataKey="satisfaction" name="Satisfaction" unit="%" width={38} domain={[45, 90]} {...axis} />
        <Tooltip cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }} content={<ChartTooltipContent />} />
        <Scatter name="Teams" data={rows} fill="var(--color-response)" {...motion} />
      </ScatterChart>
    </ChartContainer>}
  </ChartShell>;
}

export function medianChartValue(values: readonly number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

const bubbleShort: ScatterRow[] = [
  { label: "Billing", response: 18, satisfaction: 72, volume: 190 }, { label: "Setup", response: 31, satisfaction: 58, volume: 310 },
  { label: "Access", response: 11, satisfaction: 84, volume: 130 }, { label: "Reports", response: 26, satisfaction: 67, volume: 240 },
  { label: "Sync", response: 38, satisfaction: 54, volume: 360 }, { label: "Exports", response: 15, satisfaction: 79, volume: 165 },
];
const bubbleLong: ScatterRow[] = bubbleShort.map((row) => ({ ...row, volume: (row.volume ?? 0) * 4 }));

export function BubbleChart(props: ChartCatalogProps<ScatterRow>) {
  return <ChartShell props={props} fallbackData={bubbleShort} fallbackExpandedData={bubbleLong} defaultLabel="Issue volume" defaultSummary="across six topics" defaultValue={(rows) => String(rows.reduce((sum, row) => sum + (row.volume ?? 0), 0))}>
    {({ rows, ...motion }) => <ChartContainer config={scatterConfig} className="h-full w-full">
      <ScatterChart accessibilityLayer margin={{ top: 12, right: 18, left: 0, bottom: 12 }}>
        <CartesianGrid /><XAxis type="number" dataKey="response" name="Response" unit=" min" {...axis} /><YAxis type="number" dataKey="satisfaction" name="Satisfaction" unit="%" width={38} domain={[45, 90]} {...axis} /><ZAxis type="number" dataKey="volume" range={[80, 620]} name="Volume" />
        <Tooltip cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }} content={<ChartTooltipContent />} />
        <Scatter name="Topics" data={rows} fill="var(--color-response)" fillOpacity={0.72} {...motion} />
      </ScatterChart>
    </ChartContainer>}
  </ChartShell>;
}

const lollipopShort: ValueRow[] = [
  { label: "Billing", value: 94 }, { label: "Access", value: 87 }, { label: "Setup", value: 81 },
  { label: "Reports", value: 74 }, { label: "Sync", value: 68 },
];
const lollipopLong: ValueRow[] = [
  { label: "Billing", value: 96 }, { label: "Access", value: 91 }, { label: "Setup", value: 86 },
  { label: "Reports", value: 79 }, { label: "Sync", value: 73 },
];

export function LollipopChart(props: InspectableChartCatalogProps<ValueRow>) {
  return <ChartShell props={props} fallbackData={lollipopShort} fallbackExpandedData={lollipopLong} defaultLabel="Workflow health" defaultSummary="highest score" defaultValue={(rows) => String(Math.max(0, ...rows.map((row) => row.value)))}>
    {({ rows }) => <LollipopPlot rows={rows} onInspect={props.onInspect} />}
  </ChartShell>;
}

function LollipopPlot({ rows, onInspect }: { rows: ValueRow[]; onInspect?: InspectableChartCatalogProps["onInspect"] }) {
  const inspection = useChartInspection(onInspect, rows.map((row) => `${row.label}:${row.value}`).join("|"));
  const reduced = useReducedMotion();
  const transition = chartMotionTransition(reduced);
  const maximum = Math.max(100, ...rows.map((row) => row.value));
  return <>
    <svg className="catalog-chart-svg" viewBox="0 0 520 230" role="group" aria-label="Workflow health ranking">
      {rows.map((row, index) => {
        const y = 28 + index * 42;
        const x = 116 + row.value / maximum * 360;
        const detail = { label: row.label, value: `${row.value} points` };
        return <g key={row.label} className="catalog-chart-inspectable" role="button" aria-label={`${row.label}: ${row.value} points`} {...inspection.inspectProps(detail)}>
          <text x="4" y={y + 4}>{row.label}</text><motion.line initial={false} animate={{ x2: x }} transition={transition} x1="116" y1={y} y2={y} stroke="var(--border)" strokeWidth="2" /><motion.circle initial={false} animate={{ cx: x }} transition={transition} cy={y} r="7" fill="var(--chart-1)" /><motion.text initial={false} animate={{ x: x - 12 }} transition={transition} y={y + 4} textAnchor="end">{row.value}</motion.text>
        </g>;
      })}
    </svg>
    <ChartInspectionTooltip inspection={inspection.active} id={inspection.id} />
  </>;
}

export type WaterfallRow = ChartDatum & { value: number };
export type WaterfallStep = WaterfallRow & { delta: number; range: readonly [number, number] };

export function calculateWaterfall(rows: readonly WaterfallRow[]): WaterfallStep[] {
  let running = 0;
  return rows.map((row) => {
    const start = running;
    running += row.value;
    return { ...row, delta: row.value, range: [Math.min(start, running), Math.max(start, running)] as const };
  });
}

const waterfallShort: WaterfallRow[] = [
  { label: "Opening", value: 124 }, { label: "New", value: 31 }, { label: "Expansion", value: 18 },
  { label: "Churn", value: -14 }, { label: "Credits", value: -6 },
];
const waterfallLong: WaterfallRow[] = [
  { label: "Opening", value: 482 }, { label: "New", value: 127 }, { label: "Expansion", value: 76 },
  { label: "Churn", value: -58 }, { label: "Credits", value: -24 },
];
const waterfallConfig = {
  range: { label: "Balance", color: LEDGER_CHART_COLORS.primary },
  gain: { label: "Gain", color: LEDGER_CHART_COLORS.primary },
  loss: { label: "Loss", color: LEDGER_CHART_COLORS.secondary },
} satisfies ChartConfig;

export function WaterfallChart(props: ChartCatalogProps<WaterfallRow>) {
  return <ChartShell props={props} fallbackData={waterfallShort} fallbackExpandedData={waterfallLong} defaultLabel="Revenue bridge" defaultSummary="closing balance" defaultValue={(rows) => `$${rows.reduce((sum, row) => sum + row.value, 0)}k`}>
    {({ rows, ...motion }) => {
      const steps = calculateWaterfall(rows);
      return <ChartContainer config={waterfallConfig} className="h-full w-full">
        <BarChart accessibilityLayer data={steps} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid {...grid} /><XAxis dataKey="label" {...categoryAxis} /><YAxis width={42} tickFormatter={(value) => `$${value}k`} {...axis} /><Tooltip content={rangeTooltip} />
          <Bar dataKey="range" radius={[4, 4, 4, 4]} {...motion}>{steps.map((row, index) => <Cell key={row.label} fill={index === 0 || row.delta >= 0 ? "var(--color-gain)" : "var(--color-loss)"} />)}</Bar>
        </BarChart>
      </ChartContainer>;
    }}
  </ChartShell>;
}
