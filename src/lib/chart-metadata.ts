export const CHART_CATEGORIES = ["Trends", "Comparison", "Composition", "Targets", "Relationships", "Specialty"] as const;
export type ChartCategory = typeof CHART_CATEGORIES[number];

export type ChartDefinition = {
  category: ChartCategory;
  description: string;
  exportName: string;
  module: "cartesian" | "specialty";
  name: string;
  slug: string;
};

export const CHART_DEFINITIONS = [
  { slug: "area", name: "Area chart", category: "Composition", description: "Visit volume split by source, with each source adding to the total.", exportName: "StackedAreaChart", module: "cartesian" },
  { slug: "bar", name: "Bar chart", category: "Comparison", description: "New and returning accounts placed together for direct comparison.", exportName: "GroupedBarChart", module: "cartesian" },
  { slug: "line", name: "Line chart", category: "Trends", description: "Current results compared with the prior period across the same intervals.", exportName: "ComparisonLineChart", module: "cartesian" },
  { slug: "donut", name: "Donut chart", category: "Composition", description: "Acquisition share with the total shown at the center.", exportName: "DonutChart", module: "specialty" },
  { slug: "radar", name: "Radar chart", category: "Comparison", description: "Current and previous capability scores across common measures.", exportName: "RadarProfileChart", module: "specialty" },
  { slug: "radial", name: "Radial chart", category: "Targets", description: "One completion value shown against its remaining track.", exportName: "RadialProgressChart", module: "specialty" },
  { slug: "normalized-stacked-bar", name: "Normalized stacked bar", category: "Composition", description: "Work distribution converted to a consistent one hundred percent scale.", exportName: "NormalizedStackedBarChart", module: "cartesian" },
  { slug: "diverging-bar", name: "Diverging bar", category: "Comparison", description: "Account gains and losses measured from one shared baseline.", exportName: "DivergingBarChart", module: "cartesian" },
  { slug: "range-area", name: "Range area", category: "Trends", description: "Observed bounds shown behind the median handling time.", exportName: "RangeAreaChart", module: "cartesian" },
  { slug: "target-line", name: "Target line", category: "Targets", description: "Service level measured against a labeled operating target.", exportName: "TargetLineChart", module: "cartesian" },
  { slug: "threshold", name: "Threshold chart", category: "Targets", description: "Queue saturation shown across healthy, watch, and critical zones.", exportName: "ThresholdChart", module: "cartesian" },
  { slug: "scatter", name: "Scatter plot", category: "Relationships", description: "Response time plotted against satisfaction for each topic.", exportName: "ScatterPlotChart", module: "cartesian" },
  { slug: "bubble", name: "Bubble chart", category: "Relationships", description: "Response and satisfaction with issue volume encoded by area.", exportName: "BubbleChart", module: "cartesian" },
  { slug: "lollipop", name: "Lollipop chart", category: "Comparison", description: "Workflow health ranked with compact inspectable markers.", exportName: "LollipopChart", module: "cartesian" },
  { slug: "waterfall", name: "Waterfall chart", category: "Trends", description: "Revenue additions and deductions connected through a running balance.", exportName: "WaterfallChart", module: "cartesian" },
  { slug: "gauge", name: "Gauge chart", category: "Targets", description: "Renewal readiness placed between explicit bounds with a target marker.", exportName: "GaugeChart", module: "specialty" },
  { slug: "multi-ring", name: "Progress rings", category: "Targets", description: "Three journey measures shown on complete concentric tracks.", exportName: "MultiRingChart", module: "specialty" },
  { slug: "heatmap", name: "Heatmap", category: "Specialty", description: "Queue intensity by weekday and hour in an inspectable grid.", exportName: "HeatmapChart", module: "specialty" },
  { slug: "calendar-heatmap", name: "Calendar heatmap", category: "Specialty", description: "Daily activity arranged by week with every date available to inspect.", exportName: "CalendarHeatmapChart", module: "specialty" },
  { slug: "funnel", name: "Funnel chart", category: "Composition", description: "Account volume through each measured sales stage.", exportName: "FunnelChart", module: "specialty" },
  { slug: "treemap", name: "Treemap", category: "Specialty", description: "Issue volume sized by value and grouped by operating area.", exportName: "TreemapChart", module: "specialty" },
] as const satisfies readonly ChartDefinition[];

export type ChartSlug = typeof CHART_DEFINITIONS[number]["slug"];
export const CHART_COUNT = CHART_DEFINITIONS.length;
