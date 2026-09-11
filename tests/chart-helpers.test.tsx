import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "../src/components/ui/chart";

describe("shared chart presentation", () => {
  test("legend retains series names without a configured label", () => {
    const markup = renderToStaticMarkup(<ChartContainer config={{ visitors: { color: "var(--chart-1)" } }}><ChartLegendContent payload={[{ value: "Direct", dataKey: "visitors", color: "var(--chart-1)" }]} /></ChartContainer>);
    expect(markup).toContain("Direct");
    expect(markup).toContain('data-slot="chart-legend"');
  });

  test("tooltip keeps zero values and supplied number formatting", () => {
    const markup = renderToStaticMarkup(<ChartContainer config={{ visits: { label: "Visits", color: "var(--chart-1)" } }}><ChartTooltipContent active label="Monday" payload={[{ name: "visits", graphicalItemId: "visits", dataKey: "visits", value: 0, color: "var(--chart-1)" }]} /></ChartContainer>);
    expect(markup).toContain("Monday");
    expect(markup).toContain("Visits");
    expect(markup).toContain('data-slot="chart-tooltip-value"');
    expect(markup).toContain(">0</span>");
  });
});
