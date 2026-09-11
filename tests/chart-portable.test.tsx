import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { calculateWaterfall, ComparisonLineChart, medianChartValue, normalizeChartShares } from "../src/components/examples/registry/chart-cartesian";
import { ChartInspectionTooltip, chartMotionTransition, formatChartCategoryLabel, formatChartValue, resolveChartRangeData, resolveSelectedInspection } from "../src/components/examples/registry/chart-frame";
import { DonutChart, FunnelChart, GaugeChart, TreemapChart, gaugeChartAngle, layoutChartTreemap } from "../src/components/examples/registry/chart-specialty";

describe("portable chart helpers", () => {
  test("normalizes each share row without hiding empty input", () => {
    const rows = normalizeChartShares([
      { label: "Mixed", automated: 3, assisted: 1, manual: 1 },
      { label: "Empty", automated: 0, assisted: 0, manual: 0 },
    ]);
    expect(rows[0].automated + rows[0].assisted + rows[0].manual).toBe(100);
    expect(rows[1]).toMatchObject({ automated: 0, assisted: 0, manual: 0 });
  });

  test("calculates a running waterfall with signed changes", () => {
    expect(calculateWaterfall([
      { label: "Opening", value: 100 },
      { label: "Growth", value: 25 },
      { label: "Loss", value: -10 },
    ])).toEqual([
      { label: "Opening", value: 100, delta: 100, range: [0, 100] },
      { label: "Growth", value: 25, delta: 25, range: [100, 125] },
      { label: "Loss", value: -10, delta: -10, range: [115, 125] },
    ]);
  });

  test("keeps a custom short data set when no expanded set exists", () => {
    const custom = [{ label: "Custom", current: 9, prior: 7 }];
    const fallback = [{ label: "Fallback", current: 1, prior: 1 }];
    const expanded = [{ label: "Expanded", current: 2, prior: 2 }];
    const resolved = resolveChartRangeData(custom, undefined, fallback, expanded);
    expect(resolved.shortRows).toBe(custom);
    expect(resolved.longRows).toBe(custom);
    expect(resolved.hasRange).toBe(false);

    const markup = renderToStaticMarkup(<ComparisonLineChart data={custom} />);
    expect(markup).toContain("Custom");
    expect(markup).not.toContain('aria-label="Chart range"');
  });

  test("clamps gauge angles and preserves keyboard inspection", () => {
    expect(gaugeChartAngle(-10, 0, 100)).toBe(180);
    expect(gaugeChartAngle(50, 0, 100)).toBe(270);
    expect(gaugeChartAngle(120, 0, 100)).toBe(360);
    const markup = renderToStaticMarkup(<GaugeChart />);
    expect(markup).toContain('role="button"');
    expect(markup).toContain('tabindex="0"');
    expect(markup).toContain("target of 80 percent");
  });

  test("uses the chart curve and removes duration for reduced motion", () => {
    expect(chartMotionTransition(false)).toEqual({ duration: 0.48, ease: [0.22, 1, 0.36, 1] });
    expect(chartMotionTransition(null)).toEqual({ duration: 0.48, ease: [0.22, 1, 0.36, 1] });
    expect(chartMotionTransition(true)).toEqual({ duration: 0 });
  });

  test("invalidates persistent inspection when chart data changes", () => {
    const selected = { inspection: { label: "Monday", value: "42" }, resetKey: "short" };
    expect(resolveSelectedInspection(selected, "short")).toEqual(selected.inspection);
    expect(resolveSelectedInspection(selected, "long")).toBeNull();
  });

  test("keeps derived metrics accurate for consumer data", () => {
    expect(medianChartValue([1, 100, 5, 9])).toBe(7);
    expect(formatChartValue([38, 51])).toBe("38 to 51");
    expect(formatChartValue(undefined)).toBe("None");
    expect(renderToStaticMarkup(<DonutChart data={[{ label: "One", value: 40 }, { label: "Two", value: 20 }]} />)).toContain(">60%</strong>");
    expect(renderToStaticMarkup(<GaugeChart data={[{ label: "Readiness", value: 44, minimum: 0, maximum: 100, target: 55 }]} />)).toContain("target 55%");
    expect(renderToStaticMarkup(<FunnelChart data={[{ label: "Empty", value: 0 }, { label: "Won", value: 0 }]} />)).toContain(">0%</strong>");
  });

  test("keeps full category data while shortening axis labels", () => {
    expect(formatChartCategoryLabel("Days 1 to 5")).toBe("1 to 5");
    expect(formatChartCategoryLabel("Enterprise onboarding queue")).toBe("Enterprise o…");
    expect(formatChartCategoryLabel("Tuesday")).toBe("Tuesday");

    const markup = renderToStaticMarkup(<ComparisonLineChart data={[{ label: "Enterprise onboarding queue", current: 12, prior: 10 }]} />);
    expect(markup).toContain("Enterprise onboarding queue");
    expect(renderToStaticMarkup(<ChartInspectionTooltip inspection={{ label: "One", value: "12" }} id="tip" />)).toContain('data-slot="chart-tooltip"');
  });

  test("animates heat values and disables their transition for reduced motion", async () => {
    const css = await Bun.file(new URL("../src/components/examples/registry/chart.css", import.meta.url)).text();
    expect(css).toContain("background-color 480ms cubic-bezier(0.22, 1, 0.36, 1)");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain(".catalog-chart-calendar button");
    expect(css).toContain("aspect-ratio: 1");
    expect(css).toContain("grid-auto-rows: minmax(18px, 32px)");
  });

  test("lays out a treemap without losing area", () => {
    const cells = layoutChartTreemap([
      { label: "One", group: "A", value: 60 },
      { label: "Two", group: "A", value: 40 },
      { label: "Three", group: "B", value: 100 },
    ], 500, 200);
    const area = cells.reduce((sum, cell) => sum + cell.width * cell.height, 0);
    expect(cells).toHaveLength(3);
    expect(area).toBeCloseTo(100000, 4);
    const markup = renderToStaticMarkup(<TreemapChart />);
    expect(markup).toContain("catalog-chart-label-plate");
    expect(markup).toContain("catalog-chart-plate-value");
  });
});
