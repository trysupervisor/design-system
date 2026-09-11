import type { ElementType } from "react";
import {
  BubbleChart,
  ComparisonLineChart,
  DivergingBarChart,
  GroupedBarChart,
  LollipopChart,
  NormalizedStackedBarChart,
  RangeAreaChart,
  ScatterPlotChart,
  StackedAreaChart,
  TargetLineChart,
  ThresholdChart,
  WaterfallChart,
} from "@/components/examples/registry/chart-cartesian";
import {
  CalendarHeatmapChart,
  DonutChart,
  FunnelChart,
  GaugeChart,
  HeatmapChart,
  MultiRingChart,
  RadarProfileChart,
  RadialProgressChart,
  TreemapChart,
} from "@/components/examples/registry/chart-specialty";
import {
  CHART_DEFINITIONS,
  type ChartDefinition,
  type ChartSlug,
} from "@/lib/chart-metadata";

export { CHART_CATEGORIES, CHART_COUNT, CHART_DEFINITIONS } from "@/lib/chart-metadata";
export type { ChartCategory, ChartDefinition, ChartSlug } from "@/lib/chart-metadata";

export type ChartCatalogEntry = ChartDefinition & {
  component: ElementType;
  source: string;
};

const chartComponents = {
  area: StackedAreaChart,
  bar: GroupedBarChart,
  line: ComparisonLineChart,
  donut: DonutChart,
  radar: RadarProfileChart,
  radial: RadialProgressChart,
  "normalized-stacked-bar": NormalizedStackedBarChart,
  "diverging-bar": DivergingBarChart,
  "range-area": RangeAreaChart,
  "target-line": TargetLineChart,
  threshold: ThresholdChart,
  scatter: ScatterPlotChart,
  bubble: BubbleChart,
  lollipop: LollipopChart,
  waterfall: WaterfallChart,
  gauge: GaugeChart,
  "multi-ring": MultiRingChart,
  heatmap: HeatmapChart,
  "calendar-heatmap": CalendarHeatmapChart,
  funnel: FunnelChart,
  treemap: TreemapChart,
} satisfies Record<ChartSlug, ElementType>;

function chartSource(definition: ChartDefinition) {
  return `import { ${definition.exportName} } from "@/components/ui/chart-${definition.module}"

export default function Example() {
  return <${definition.exportName} />
}`;
}

export const CHART_CATALOG: readonly ChartCatalogEntry[] = CHART_DEFINITIONS.map((definition) => ({
  ...definition,
  component: chartComponents[definition.slug],
  source: chartSource(definition),
}));

export function getChartCatalogEntry(slug: string) {
  return CHART_CATALOG.find((chart) => chart.slug === slug);
}
