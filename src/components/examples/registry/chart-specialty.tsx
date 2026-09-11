"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Cell,
  Funnel,
  FunnelChart as RechartsFunnelChart,
  Label,
  LabelList,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  Tooltip,
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
  useChartInspection,
  useChartMotion,
  useChartRange,
} from "./chart-frame";
import type { ChartCatalogProps, ChartDatum, InspectableChartCatalogProps } from "./chart-types";

type SpecialtyState<T extends ChartDatum> = {
  animationDuration: number;
  isAnimationActive: boolean;
  rows: T[];
};

function SpecialtyShell<T extends ChartDatum>({
  children,
  defaultLabel,
  defaultSummary,
  defaultValue,
  fallbackData,
  fallbackExpandedData,
  props,
}: {
  children: (state: SpecialtyState<T>) => React.ReactNode;
  defaultLabel: string;
  defaultSummary: string | ((rows: readonly T[]) => string);
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
  const summary = typeof defaultSummary === "function" ? defaultSummary(rows) : defaultSummary;
  return <ChartFrame className={props.className} data={rows} label={props.label ?? defaultLabel} onRangeChange={hasRange ? changeRange : undefined} range={hasRange ? range : undefined} summary={props.summary ?? summary} value={props.value ?? defaultValue(rows)}>
    {children({ rows, ...motion })}
  </ChartFrame>;
}

type SegmentRow = ChartDatum & { value: number };
const segmentShort: SegmentRow[] = [
  { label: "Direct", value: 38 }, { label: "Search", value: 29 }, { label: "Referral", value: 21 }, { label: "Social", value: 12 },
];
const segmentLong: SegmentRow[] = [
  { label: "Direct", value: 42 }, { label: "Search", value: 31 }, { label: "Referral", value: 18 }, { label: "Social", value: 9 },
];
const segmentConfig = {
  value: { label: "Share" },
  Direct: { label: "Direct", color: LEDGER_CHART_COLORS.primary },
  Search: { label: "Search", color: LEDGER_CHART_COLORS.secondary },
  Referral: { label: "Referral", color: LEDGER_CHART_COLORS.tertiary },
  Social: { label: "Social", color: LEDGER_CHART_COLORS.quaternary },
} satisfies ChartConfig;
const segmentColors = ["var(--color-Direct)", "var(--color-Search)", "var(--color-Referral)", "var(--color-Social)"];

export function DonutChart(props: ChartCatalogProps<SegmentRow>) {
  return <SpecialtyShell props={props} fallbackData={segmentShort} fallbackExpandedData={segmentLong} defaultLabel="Acquisition mix" defaultSummary="total share" defaultValue={(rows) => `${rows.reduce((sum, row) => sum + row.value, 0)}%`}>
    {({ rows, ...motion }) => <ChartContainer config={segmentConfig} className="h-full w-full">
      <PieChart accessibilityLayer>
        <Tooltip content={<ChartTooltipContent hideLabel nameKey="label" />} />
        <Pie data={rows} dataKey="value" nameKey="label" innerRadius={58} outerRadius={86} paddingAngle={2} stroke="var(--background)" strokeWidth={2} {...motion}>
          {rows.map((row, index) => <Cell key={row.label} fill={segmentColors[index % segmentColors.length]} />)}
          <Label value={`${rows.reduce((sum, row) => sum + row.value, 0)}%`} position="center" className="fill-foreground font-mono text-lg font-medium" />
        </Pie>
        <Legend content={<ChartLegendContent nameKey="label" />} />
      </PieChart>
    </ChartContainer>}
  </SpecialtyShell>;
}

type RadarRow = ChartDatum & { current: number; previous: number };
const radarShort: RadarRow[] = [
  { label: "Speed", current: 82, previous: 67 }, { label: "Quality", current: 74, previous: 78 },
  { label: "Clarity", current: 91, previous: 71 }, { label: "Reach", current: 63, previous: 58 }, { label: "Trust", current: 87, previous: 79 },
];
const radarLong: RadarRow[] = [
  { label: "Speed", current: 86, previous: 70 }, { label: "Quality", current: 81, previous: 76 },
  { label: "Clarity", current: 93, previous: 74 }, { label: "Reach", current: 72, previous: 61 }, { label: "Trust", current: 89, previous: 80 },
];
const radarConfig = {
  current: { label: "Current", color: LEDGER_CHART_COLORS.primary },
  previous: { label: "Previous", color: LEDGER_CHART_COLORS.secondary },
} satisfies ChartConfig;

export function RadarProfileChart(props: ChartCatalogProps<RadarRow>) {
  return <SpecialtyShell props={props} fallbackData={radarShort} fallbackExpandedData={radarLong} defaultLabel="Capability profile" defaultSummary="current average" defaultValue={(rows) => `${Math.round(rows.reduce((sum, row) => sum + row.current, 0) / Math.max(1, rows.length))}%`}>
    {({ rows, ...motion }) => <ChartContainer config={radarConfig} className="h-full w-full">
      <RadarChart accessibilityLayer data={rows} outerRadius="68%">
        <PolarGrid /><PolarAngleAxis dataKey="label" /><PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
        <Tooltip content={<ChartTooltipContent />} /><Legend content={<ChartLegendContent />} />
        <Radar dataKey="previous" fill="var(--color-previous)" fillOpacity={0.07} stroke="var(--color-previous)" {...motion} />
        <Radar dataKey="current" fill="var(--color-current)" fillOpacity={0.18} stroke="var(--color-current)" strokeWidth={2} {...motion} />
      </RadarChart>
    </ChartContainer>}
  </SpecialtyShell>;
}

const radialShort: SegmentRow[] = [{ label: "Complete", value: 73 }];
const radialLong: SegmentRow[] = [{ label: "Complete", value: 81 }];
const radialConfig = { value: { label: "Complete", color: LEDGER_CHART_COLORS.primary } } satisfies ChartConfig;

export function RadialProgressChart(props: ChartCatalogProps<SegmentRow>) {
  return <SpecialtyShell props={props} fallbackData={radialShort} fallbackExpandedData={radialLong} defaultLabel="Plan completion" defaultSummary="of annual plan" defaultValue={(rows) => `${rows[0]?.value ?? 0}%`}>
    {({ rows, ...motion }) => <ChartContainer config={radialConfig} className="h-full w-full">
      <RadialBarChart accessibilityLayer data={rows} innerRadius={68} outerRadius={96} startAngle={90} endAngle={450}>
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} /><Tooltip content={<ChartTooltipContent hideLabel />} />
        <RadialBar dataKey="value" background={{ fill: "var(--catalog-chart-track)" }} cornerRadius={10} {...motion} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label value={`${rows[0]?.value ?? 0}%`} position="center" className="fill-foreground font-mono text-lg font-medium" />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>}
  </SpecialtyShell>;
}

type GaugeRow = ChartDatum & { maximum: number; minimum: number; target: number; value: number };
const gaugeShort: GaugeRow[] = [{ label: "Renewal readiness", value: 72, minimum: 0, maximum: 100, target: 80 }];
const gaugeLong: GaugeRow[] = [{ label: "Renewal readiness", value: 78, minimum: 0, maximum: 100, target: 80 }];

function polarPoint(cx: number, cy: number, radius: number, angle: number) {
  const radians = angle * Math.PI / 180;
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
}

export function describeChartArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarPoint(cx, cy, radius, startAngle);
  const end = polarPoint(cx, cy, radius, endAngle);
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${endAngle - startAngle > 180 ? 1 : 0} 1 ${end.x} ${end.y}`;
}

export function gaugeChartAngle(value: number, minimum: number, maximum: number) {
  if (maximum <= minimum) return 180;
  const ratio = Math.max(0, Math.min(1, (value - minimum) / (maximum - minimum)));
  return 180 + ratio * 180;
}

export function GaugeChart(props: InspectableChartCatalogProps<GaugeRow>) {
  return <SpecialtyShell props={props} fallbackData={gaugeShort} fallbackExpandedData={gaugeLong} defaultLabel="Renewal readiness" defaultSummary={(rows) => `target ${rows[0]?.target ?? 0}%`} defaultValue={(rows) => `${rows[0]?.value ?? 0}%`}>
    {({ rows }) => <GaugePlot row={rows[0]} onInspect={props.onInspect} />}
  </SpecialtyShell>;
}

function GaugePlot({ row, onInspect }: { row?: GaugeRow; onInspect?: InspectableChartCatalogProps["onInspect"] }) {
  const inspection = useChartInspection(onInspect, row ? `${row.label}:${row.value}:${row.target}` : "empty");
  const reduced = useReducedMotion();
  const transition = chartMotionTransition(reduced);
  if (!row) return null;
  const angle = gaugeChartAngle(row.value, row.minimum, row.maximum);
  const target = polarPoint(180, 178, 105, gaugeChartAngle(row.target, row.minimum, row.maximum));
  const detail = { label: row.label, value: `${row.value}% with target ${row.target}%` };
  return <>
    <svg className="catalog-chart-svg" viewBox="0 0 360 220" role="group" aria-label={`${row.label} is ${row.value} percent with a target of ${row.target} percent`}>
      <path className="catalog-chart-track" d={describeChartArc(180, 178, 105, 180, 360)} strokeWidth="18" />
      <motion.path className="catalog-chart-inspectable" initial={false} animate={{ d: describeChartArc(180, 178, 105, 180, angle) }} transition={transition} fill="none" stroke="var(--chart-1)" strokeWidth="18" strokeLinecap="round" role="button" aria-label={`${row.label}: ${row.value} percent`} {...inspection.inspectProps(detail)} />
      <motion.line initial={false} animate={{ x1: target.x, y1: target.y, x2: 180 + (target.x - 180) * 1.15, y2: 178 + (target.y - 178) * 1.15 }} transition={transition} stroke="var(--foreground)" strokeWidth="2" />
      <text className="catalog-chart-big-value" x="180" y="160" textAnchor="middle">{row.value}%</text>
      <text x="180" y="180" textAnchor="middle">target {row.target}%</text><text x="65" y="207">{row.minimum}%</text><text x="295" y="207" textAnchor="end">{row.maximum}%</text>
    </svg>
    <ChartInspectionTooltip inspection={inspection.active} id={inspection.id} />
  </>;
}

const ringShort: SegmentRow[] = [{ label: "Onboarding", value: 84 }, { label: "Activation", value: 67 }, { label: "Retention", value: 76 }];
const ringLong: SegmentRow[] = [{ label: "Onboarding", value: 91 }, { label: "Activation", value: 74 }, { label: "Retention", value: 81 }];

export function MultiRingChart(props: InspectableChartCatalogProps<SegmentRow>) {
  return <SpecialtyShell props={props} fallbackData={ringShort} fallbackExpandedData={ringLong} defaultLabel="Journey completion" defaultSummary="average completion" defaultValue={(rows) => `${Math.round(rows.reduce((sum, row) => sum + row.value, 0) / Math.max(1, rows.length))}%`}>
    {({ rows }) => <MultiRingPlot rows={rows} onInspect={props.onInspect} />}
  </SpecialtyShell>;
}

function MultiRingPlot({ rows, onInspect }: { rows: SegmentRow[]; onInspect?: InspectableChartCatalogProps["onInspect"] }) {
  const inspection = useChartInspection(onInspect, rows.map((row) => `${row.label}:${row.value}`).join("|"));
  const reduced = useReducedMotion();
  const transition = chartMotionTransition(reduced);
  const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];
  const radii = [82, 61, 40];
  const average = Math.round(rows.reduce((sum, row) => sum + row.value, 0) / Math.max(1, rows.length));
  return <>
    <svg className="catalog-chart-svg" viewBox="0 0 410 230" role="group" aria-label={`Journey completion average is ${average} percent`}>
      <g transform="translate(120 115) rotate(-90)">{rows.slice(0, 3).map((row, index) => {
        const radius = radii[index];
        const circumference = 2 * Math.PI * radius;
        return <g key={row.label} className="catalog-chart-inspectable" role="button" aria-label={`${row.label}: ${row.value} percent`} {...inspection.inspectProps({ label: row.label, value: `${row.value}% complete` })}>
          <circle className="catalog-chart-track" r={radius} strokeWidth="10" />
          <motion.circle initial={false} animate={{ strokeDasharray: `${circumference * row.value / 100} ${circumference}` }} transition={transition} r={radius} fill="none" stroke={colors[index]} strokeWidth="10" strokeLinecap="round" />
        </g>;
      })}</g>
      <text className="catalog-chart-big-value" x="120" y="119" textAnchor="middle">{average}%</text>
      {rows.slice(0, 3).map((row, index) => <g key={row.label} transform={`translate(245 ${78 + index * 40})`}><circle r="4" fill={colors[index]} /><text x="12" y="4">{row.label}</text><text x="142" y="4" textAnchor="end">{row.value}%</text></g>)}
    </svg>
    <ChartInspectionTooltip inspection={inspection.active} id={inspection.id} />
  </>;
}

type HeatmapRow = ChartDatum & { period: string; value: number };
const heatmapPeriods = ["08", "10", "12", "14", "16", "18"];
const heatmapShort: HeatmapRow[] = ["Mon", "Tue", "Wed", "Thu", "Fri"].flatMap((day, dayIndex) => heatmapPeriods.map((period, periodIndex) => ({ label: day, period, value: 12 + ((dayIndex * 17 + periodIndex * 13) % 78) })));
const heatmapLong: HeatmapRow[] = heatmapShort.map((row, index) => ({ ...row, value: Math.min(100, row.value + index % 4 * 4) }));

export function HeatmapChart(props: InspectableChartCatalogProps<HeatmapRow>) {
  return <SpecialtyShell props={props} fallbackData={heatmapShort} fallbackExpandedData={heatmapLong} defaultLabel="Queue intensity" defaultSummary="peak interval" defaultValue={(rows) => String(Math.max(0, ...rows.map((row) => row.value)))}>
    {({ rows }) => <HeatmapPlot rows={rows} onInspect={props.onInspect} />}
  </SpecialtyShell>;
}

function HeatmapPlot({ rows, onInspect }: { rows: HeatmapRow[]; onInspect?: InspectableChartCatalogProps["onInspect"] }) {
  const inspection = useChartInspection(onInspect, rows.map((row) => `${row.label}:${row.period}:${row.value}`).join("|"));
  const days = Array.from(new Set(rows.map((row) => row.label)));
  const periods = Array.from(new Set(rows.map((row) => row.period)));
  return <>
    <div className="catalog-chart-heatmap" role="group" aria-label="Queue intensity by weekday and hour" style={{ gridTemplateColumns: `58px repeat(${periods.length}, minmax(18px, 1fr))` }}>
      <span />{periods.map((period) => <span className="catalog-chart-heatmap-label" key={period}>{period}:00</span>)}
      {days.flatMap((day) => [
        <span className="catalog-chart-heatmap-label" key={`${day}-label`}>{day}</span>,
        ...periods.map((period) => {
          const row = rows.find((entry) => entry.label === day && entry.period === period);
          const value = row?.value ?? 0;
          return <button key={`${day}-${period}`} type="button" style={{ "--chart-intensity": value } as React.CSSProperties} aria-label={`${day} at ${period}:00, intensity ${value}`} {...inspection.inspectProps({ label: `${day} at ${period}:00`, value: `${value} intensity` })} />;
        }),
      ])}
    </div>
    <ChartInspectionTooltip inspection={inspection.active} id={inspection.id} />
  </>;
}

type CalendarRow = ChartDatum & { day: number; value: number; week: number };
const calendarFormatter = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
function calendarRows(length: number): CalendarRow[] {
  const start = new Date(Date.UTC(2026, 8, 1));
  const startDay = start.getUTCDay();
  return Array.from({ length }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    return { label: calendarFormatter.format(date), day: date.getUTCDay(), week: Math.floor((startDay + index) / 7), value: 8 + (index * 19) % 86 };
  });
}
const calendarShort = calendarRows(7);
const calendarLong = calendarRows(30);

export function CalendarHeatmapChart(props: InspectableChartCatalogProps<CalendarRow>) {
  return <SpecialtyShell props={props} fallbackData={calendarShort} fallbackExpandedData={calendarLong} defaultLabel="Daily activity" defaultSummary="active days" defaultValue={(rows) => String(rows.filter((row) => row.value > 0).length)}>
    {({ rows }) => <CalendarPlot rows={rows} onInspect={props.onInspect} />}
  </SpecialtyShell>;
}

function CalendarPlot({ rows, onInspect }: { rows: CalendarRow[]; onInspect?: InspectableChartCatalogProps["onInspect"] }) {
  const inspection = useChartInspection(onInspect, rows.map((row) => `${row.label}:${row.value}`).join("|"));
  return <>
    <div className="catalog-chart-calendar" role="group" aria-label="Daily activity calendar">
      {rows.map((row) => <button key={row.label} type="button" style={{ gridColumn: row.day + 1, gridRow: row.week + 1, "--chart-intensity": row.value } as React.CSSProperties} aria-label={`${row.label}: ${row.value} events`} {...inspection.inspectProps({ label: row.label, value: `${row.value} events` })} />)}
    </div>
    <ChartInspectionTooltip inspection={inspection.active} id={inspection.id} />
  </>;
}

type FunnelRow = ChartDatum & { value: number };
const funnelShort: FunnelRow[] = [{ label: "Visited", value: 1240 }, { label: "Qualified", value: 820 }, { label: "Trial", value: 470 }, { label: "Proposal", value: 260 }, { label: "Won", value: 148 }];
const funnelLong: FunnelRow[] = [{ label: "Visited", value: 4820 }, { label: "Qualified", value: 3170 }, { label: "Trial", value: 1910 }, { label: "Proposal", value: 1070 }, { label: "Won", value: 612 }];
const funnelConfig = { value: { label: "Accounts", color: LEDGER_CHART_COLORS.primary } } satisfies ChartConfig;

export function FunnelChart(props: ChartCatalogProps<FunnelRow>) {
  return <SpecialtyShell props={props} fallbackData={funnelShort} fallbackExpandedData={funnelLong} defaultLabel="Sales conversion" defaultSummary="visit to win rate" defaultValue={(rows) => `${rows.length && rows[0].value > 0 ? Math.round((rows.at(-1)?.value ?? 0) / rows[0].value * 100) : 0}%`}>
    {({ rows, ...motion }) => <ChartContainer config={funnelConfig} className="h-full w-full">
      <RechartsFunnelChart accessibilityLayer>
        <Tooltip content={<ChartTooltipContent hideLabel nameKey="label" />} />
        <Funnel dataKey="value" data={rows} isAnimationActive={motion.isAnimationActive} animationDuration={motion.animationDuration} stroke="var(--background)">
          {rows.map((row, index) => <Cell key={row.label} fill="var(--color-value)" fillOpacity={1 - index * 0.12} />)}
          <LabelList position="right" dataKey="label" fill="var(--muted-foreground)" fontSize={10} />
        </Funnel>
      </RechartsFunnelChart>
    </ChartContainer>}
  </SpecialtyShell>;
}

type TreemapRow = ChartDatum & { group: string; value: number };
type TreemapCell = TreemapRow & { height: number; width: number; x: number; y: number };
const treemapShort: TreemapRow[] = [
  { label: "Billing", group: "Revenue", value: 184 }, { label: "Renewals", group: "Revenue", value: 132 },
  { label: "Setup", group: "Product", value: 121 }, { label: "Access", group: "Product", value: 83 },
  { label: "Reports", group: "Insights", value: 67 }, { label: "Exports", group: "Insights", value: 43 },
];
const treemapLong: TreemapRow[] = [
  { label: "Billing", group: "Revenue", value: 731 }, { label: "Renewals", group: "Revenue", value: 568 },
  { label: "Setup", group: "Product", value: 492 }, { label: "Access", group: "Product", value: 347 },
  { label: "Reports", group: "Insights", value: 281 }, { label: "Exports", group: "Insights", value: 196 },
];

export function layoutChartTreemap(data: readonly TreemapRow[], width: number, height: number): TreemapCell[] {
  const total = data.reduce((sum, row) => sum + Math.max(0, row.value), 0);
  if (!total) return [];
  const groups = Array.from(new Set(data.map((row) => row.group)));
  let x = 0;
  return groups.flatMap((group) => {
    const rows = data.filter((row) => row.group === group);
    const groupTotal = rows.reduce((sum, row) => sum + Math.max(0, row.value), 0);
    const groupWidth = width * groupTotal / total;
    let y = 0;
    const cells = rows.map((row) => {
      const cellHeight = groupTotal ? height * Math.max(0, row.value) / groupTotal : 0;
      const cell = { ...row, x, y, width: groupWidth, height: cellHeight };
      y += cellHeight;
      return cell;
    });
    x += groupWidth;
    return cells;
  });
}

export function TreemapChart(props: InspectableChartCatalogProps<TreemapRow>) {
  const [group, setGroup] = useState<string | null>(null);
  const { rows, range, changeRange, hasRange } = useChartRange(props.data, props.expandedData, treemapShort, treemapLong, props.onRangeChange);
  const groups = Array.from(new Set(rows.map((row) => row.group)));
  const selectedGroup = group && groups.includes(group) ? group : null;
  const visibleRows = selectedGroup ? rows.filter((row) => row.group === selectedGroup) : rows;
  return <ChartFrame className={props.className} data={visibleRows} label={props.label ?? "Issue volume"} onRangeChange={hasRange ? changeRange : undefined} range={hasRange ? range : undefined} summary={props.summary ?? selectedGroup ?? "all groups"} value={props.value ?? String(visibleRows.reduce((sum, row) => sum + row.value, 0))}>
    <TreemapPlot rows={visibleRows} groups={groups} selectedGroup={selectedGroup} onSelectGroup={setGroup} onInspect={props.onInspect} />
  </ChartFrame>;
}

function TreemapPlot({ rows, groups, selectedGroup, onSelectGroup, onInspect }: { rows: TreemapRow[]; groups: string[]; selectedGroup: string | null; onSelectGroup: (group: string | null) => void; onInspect?: InspectableChartCatalogProps["onInspect"] }) {
  const inspection = useChartInspection(onInspect, rows.map((row) => `${row.label}:${row.value}`).join("|"));
  const reduced = useReducedMotion();
  const transition = chartMotionTransition(reduced);
  const cells = layoutChartTreemap(rows, 520, 190);
  const colors: Record<string, string> = { Revenue: "var(--chart-1)", Product: "var(--chart-2)", Insights: "var(--chart-3)" };
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  return <>
    <div className="catalog-chart-filter" role="group" aria-label="Issue group">
      <button type="button" aria-pressed={selectedGroup === null} onClick={() => onSelectGroup(null)}>All groups</button>
      {groups.map((group) => <button type="button" key={group} aria-pressed={selectedGroup === group} onClick={() => onSelectGroup(group)}>{group}</button>)}
    </div>
    <svg className="catalog-chart-svg catalog-chart-treemap" viewBox="0 0 520 190" role="group" aria-label="Issue volume with area proportional to count">
      {cells.map((cell) => {
        const share = total ? Math.round(cell.value / total * 100) : 0;
        const displayLabel = cell.label.length > 16 ? `${cell.label.slice(0, 16).trimEnd()}…` : cell.label;
        const plateWidth = Math.min(Math.max(72, displayLabel.length * 6 + 16), Math.max(0, cell.width - 16));
        return <g key={cell.label} className="catalog-chart-inspectable" role="button" aria-label={`${cell.label}: ${cell.value} issues, ${share} percent`} {...inspection.inspectProps({ label: cell.label, value: `${cell.value} issues, ${share}%` })}>
          <motion.rect initial={false} animate={{ x: cell.x + 1, y: cell.y + 1, width: Math.max(0, cell.width - 2), height: Math.max(0, cell.height - 2) }} transition={transition} rx="8" fill={colors[cell.group] ?? "var(--chart-4)"} fillOpacity="0.78" />
          {cell.width > 88 && cell.height > 64 ? <>
            <motion.rect className="catalog-chart-label-plate" initial={false} animate={{ x: cell.x + 8, y: cell.y + 8, width: plateWidth, height: 50 }} transition={transition} rx="5" />
            <motion.text initial={false} animate={{ x: cell.x + 16, y: cell.y + 25 }} transition={transition} className="catalog-chart-plate-label">{displayLabel}</motion.text>
            <motion.text initial={false} animate={{ x: cell.x + 16, y: cell.y + 48 }} transition={transition} className="catalog-chart-big-value catalog-chart-plate-value">{cell.value}</motion.text>
          </> : null}
        </g>;
      })}
    </svg>
    <ChartInspectionTooltip inspection={inspection.active} id={inspection.id} />
  </>;
}
