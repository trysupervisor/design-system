import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CHART_CATALOG, CHART_CATEGORIES, getChartCatalogEntry } from "../src/lib/chart-catalog";
import { CHART_COUNT, CHART_DEFINITIONS } from "../src/lib/chart-metadata";

describe("chart catalog", () => {
  test("contains twenty one distinct chart families", () => {
    expect(CHART_CATALOG).toHaveLength(21);
    expect(CHART_COUNT).toBe(21);
    expect(CHART_DEFINITIONS).toHaveLength(CHART_COUNT);
    expect(new Set(CHART_CATALOG.map((chart) => chart.slug)).size).toBe(21);
    expect(CHART_CATALOG.slice(0, 6).map((chart) => chart.slug)).toEqual(["area", "bar", "line", "donut", "radar", "radial"]);
    expect(new Set(CHART_CATALOG.map((chart) => chart.category))).toEqual(new Set(CHART_CATEGORIES));
  });

  test("keeps countable metadata free of chart runtime imports", async () => {
    const source = await Bun.file(new URL("../src/lib/chart-metadata.ts", import.meta.url)).text();
    expect(source).not.toContain("recharts");
    expect(source).not.toContain("chart-cartesian");
    expect(source).not.toContain("chart-specialty");
    expect(source).not.toContain(".css");
  });

  test("provides complete source for every preview", () => {
    for (const chart of CHART_CATALOG) {
      expect(chart.source).toContain(`import { ${chart.exportName} }`);
      expect(chart.source).toContain(`<${chart.exportName} />`);
      expect(chart.source).toContain("export default function Example");
      expect(chart.source).not.toContain("TODO");
      expect(chart.source).not.toContain("...");
      expect(getChartCatalogEntry(chart.slug)).toBe(chart);
    }
  });

  test("every preview includes a range control and data table fallback", () => {
    for (const chart of CHART_CATALOG) {
      const markup = renderToStaticMarkup(createElement(chart.component));
      expect(markup).toContain('aria-label="Chart range"');
      expect(markup).toContain("View data");
      expect(markup).toContain("7 days");
      expect(markup).toContain("30 days");
    }
  });
});
