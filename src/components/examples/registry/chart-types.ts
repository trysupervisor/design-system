import type { ComponentType } from "react";

export type ChartRange = "7 days" | "30 days";

export type ChartValue = string | number | readonly number[] | null;

export type ChartDatum = {
  label: string;
  [key: string]: ChartValue;
};

export type ChartInspection = {
  label: string;
  value: string;
};

export type ChartCatalogProps<T extends ChartDatum = ChartDatum> = {
  className?: string;
  data?: readonly T[];
  expandedData?: readonly T[];
  label?: string;
  onRangeChange?: (range: ChartRange) => void;
  summary?: string;
  value?: string;
};

export type InspectableChartCatalogProps<T extends ChartDatum = ChartDatum> = ChartCatalogProps<T> & {
  onInspect?: (inspection: ChartInspection) => void;
};

export type PortableChartComponent = ComponentType<ChartCatalogProps>;
