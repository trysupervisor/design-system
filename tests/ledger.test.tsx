import { describe, expect, test } from "bun:test";
import React, { type CSSProperties } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import postcss from "postcss";
import { LedgerButton, LedgerPresence, LedgerProvider, LedgerRangeSelector, LedgerSearch, LedgerSurface, LedgerTable, ledgerMotion, ledgerCornerStyleKey } from "../src/components/examples/registry/ledger";
import { LedgerChart, ledgerChartGeometry, ledgerChartIndex, ledgerChartPaths, ledgerChartPoint, ledgerResample } from "../src/components/examples/registry/ledger-chart";

const markup = renderToStaticMarkup;

describe("Ledger chart geometry", () => {
  test("resampling preserves endpoints and piecewise interpolation across lengths", () => {
    expect(ledgerResample([10, 30], 5)).toEqual([10, 15, 20, 25, 30]);
    expect(ledgerResample([10, 30, 10], 5)).toEqual([10, 20, 30, 20, 10]);
    expect(ledgerResample([7], 3)).toEqual([7, 7, 7]);
    expect(ledgerResample([], 3)).toEqual([]);
    expect(() => ledgerResample([1, 2], 1)).toThrow(RangeError);
    expect(() => ledgerResample([1, Number.NaN])).toThrow(RangeError);
  });

  test("different series lengths retain compatible path commands for continuous morphs", () => {
    const inputs = [[1], [0, 10], [10, 2, 14, 7, 30]];
    for (const values of inputs) {
      const paths = ledgerChartPaths(values);
      expect(paths.line.match(/[ML]/g)).toHaveLength(ledgerChartGeometry.samples);
      expect(paths.area.match(/[ML]/g)).toHaveLength(ledgerChartGeometry.samples + 2);
      expect(paths.area.endsWith(" Z")).toBe(true);
      expect(paths.line).not.toMatch(/NaN|Infinity/);
    }
    const ascending = ledgerChartPaths([0, 100]).line.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    const descending = ledgerChartPaths([100, 0]).line.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    for (let index = 1; index < ascending.length; index += 2) {
      expect((ascending[index] + descending[index]) / 2).toBeCloseTo(ledgerChartGeometry.height / 2, 3);
    }
  });

  test("pointer mapping clamps both edges and resolves original data indices", () => {
    expect(ledgerChartIndex(-0.1, 5)).toBe(0);
    expect(ledgerChartIndex(0, 5)).toBe(0);
    expect(ledgerChartIndex(0.49, 5)).toBe(2);
    expect(ledgerChartIndex(1, 5)).toBe(4);
    expect(ledgerChartIndex(1.2, 5)).toBe(4);
    expect(ledgerChartIndex(Number.NaN, 5)).toBe(0);
    expect(ledgerChartIndex(0.5, 0)).toBe(-1);
    expect(ledgerChartIndex(1, 1)).toBe(0);
  });

  test("empty, single, constant and extreme finite values remain defined", () => {
    const { width, height, inset } = ledgerChartGeometry;
    expect(ledgerChartPaths([])).toEqual({ line: "", area: "" });
    expect(ledgerChartPoint([], 0)).toEqual({ x: width / 2, y: height / 2 });
    expect(ledgerChartPoint([10], 5)).toEqual({ x: width / 2, y: height / 2 });
    expect(ledgerChartPoint([10, 10], 1)).toEqual({ x: width, y: height / 2 });
    expect(ledgerChartPoint([0, 10], -2)).toEqual({ x: 0, y: height - inset });
    expect(ledgerChartPoint([0, 10], 10)).toEqual({ x: width, y: inset });
    expect(ledgerChartPaths([-Number.MAX_VALUE, Number.MAX_VALUE]).line).not.toMatch(/NaN|Infinity/);
  });

  test("normalization keeps the original domain even when samples miss its peak", () => {
    const path = ledgerChartPaths([0, 100, 0]).line;
    const coordinates = path.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    const middleY = coordinates[2 * 63 + 1];
    expect(middleY).toBeGreaterThan(ledgerChartGeometry.inset);
    expect(ledgerChartPoint([0, 100, 0], 1).y).toBe(ledgerChartGeometry.inset);
  });
});

describe("Ledger corner updates", () => {
  test("style keys ignore animation and generated masks while preserving geometry and recipe changes", () => {
    const base = [["border-radius", "14px"], ["--ledger-corner-smoothing", "0.6"]] as const;
    expect(ledgerCornerStyleKey([...base, ["transform", "translateX(5px)"], ["opacity", "0.2"], ["--ledger-corner-mask", 'url("generated.svg")']])).toBe(ledgerCornerStyleKey(base));
    expect(ledgerCornerStyleKey([...base].reverse())).toBe(ledgerCornerStyleKey(base));
    expect(ledgerCornerStyleKey([["border-radius", "22px"], base[1]])).not.toBe(ledgerCornerStyleKey(base));
    expect(ledgerCornerStyleKey([base[0], ["--ledger-corner-smoothing", "0.3"]])).not.toBe(ledgerCornerStyleKey(base));
    expect(ledgerCornerStyleKey([...base, ["width", "240px"]])).not.toBe(ledgerCornerStyleKey(base));
    expect(ledgerCornerStyleKey([...base, ["--ledger-radius-panel", "40px"]])).not.toBe(ledgerCornerStyleKey(base));
  });
});

describe("Ledger semantic components", () => {
  test("provider defaults and custom properties stay on its own wrapper", () => {
    const html = markup(<LedgerProvider className="custom" style={{ "--ledger-accent": "red" } as CSSProperties}><span>Inside</span></LedgerProvider>);
    expect(html).toContain('data-ledger-theme=""');
    expect(html).toContain('class="custom"');
    expect(html).toContain("--ledger-accent:red");
    expect(html).toContain("--ledger-default-radius-shell:46px");
    expect(html).not.toContain("--ledger-radius-shell:");
    expect(html).not.toContain("--ledger-font-heading:");
    expect(html).not.toContain("--ledger-paper:");
    expect(html).not.toContain("<style");
  });

  test("public recipe variables remain inheritable while standalone defaults are available", () => {
    const html = markup(<div style={{ "--ledger-paper": "pink", "--ledger-font-heading": "Example Font" } as CSSProperties}><LedgerProvider><LedgerSurface>Recipe</LedgerSurface></LedgerProvider></div>);
    expect(html.match(/--ledger-paper:/g)).toHaveLength(1);
    expect(html.match(/--ledger-font-heading:/g)).toHaveLength(1);
    expect(html).toContain("--ledger-default-paper:#ffffff");
    expect(html).toContain("--ledger-default-font-heading:");
  });

  test("surface and button forward native props and preserve semantics", () => {
    const html = markup(<LedgerSurface tone="ink" radius="card" elevation="panel" id="detail" style={{ padding: 7 }}><LedgerButton variant="primary" disabled name="submit" type="submit" aria-label="Save">Save</LedgerButton></LedgerSurface>);
    expect(html).toContain('data-ledger-tone="ink"');
    expect(html).toContain('data-ledger-radius="card"');
    expect(html).toContain('id="detail"');
    expect(html).toContain('style="padding:7px"');
    expect(html).toContain('type="submit"');
    expect(html).toContain('name="submit"');
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-label="Save"');
  });

  test("table preserves caption, header and selected row inside a keyboard scroller", () => {
    const html = markup(<LedgerTable aria-label="Invoices"><caption>Open invoices</caption><thead><tr><th scope="col">Name</th></tr></thead><tbody><tr data-selected="true"><td>Example</td></tr></tbody></LedgerTable>);
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('role="region"');
    expect(html).toContain('<caption>Open invoices</caption>');
    expect(html).toContain('<th scope="col">Name</th>');
    expect(html).toContain('<tr data-selected="true"><td>Example</td></tr>');
    expect(html).toContain('class="ledger-table-mask"');
  });

  test("search and ranges expose native keyboard controls", () => {
    const search = markup(<LedgerSearch value="" onValueChange={() => {}} summary="12 items" />);
    expect(search).toContain('aria-label="Search"');
    expect(search).toContain("12 items");
    const ranges = markup(<LedgerRangeSelector value="Month" options={["Week", "Month"]} onValueChange={() => {}} />);
    expect(ranges).toContain('role="group"');
    expect(ranges.match(/type="button"/g)).toHaveLength(2);
    expect(ranges.match(/aria-pressed="true"/g)).toHaveLength(1);
  });

  test("presence renders only requested content with accepted timings", () => {
    expect(markup(<LedgerPresence show={false}><button>Hidden</button></LedgerPresence>)).toBe("");
    const shown = markup(<LedgerPresence show><button>Visible</button></LedgerPresence>);
    expect(shown).toContain("Visible");
    expect(shown).not.toContain('inert=""');
    expect(ledgerMotion.enter.duration).toBe(0.22);
    expect(ledgerMotion.exit.duration).toBe(0.26);
    expect(ledgerMotion.chart.duration).toBe(0.48);
  });

  test("chart renders accessible original labels, formatter output and empty state", () => {
    const html = markup(<LedgerChart label="Visitors" data={[{ label: "Monday", value: 20 }, { label: "Friday", value: 45 }]} formatValue={(value) => `${value} visitors`} />);
    expect(html).toContain('aria-label="Visitors"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain("Monday");
    expect(html).toContain("Friday");
    expect(html).toContain("45 visitors");
    expect(html).toContain("Press Escape");
    expect(markup(<LedgerChart label="Empty" data={[{ label: "Invalid", value: Number.NaN }]} />)).toContain("No data");
  });

  test("masks, focus and reduced motion remain scoped and preserve table inset", async () => {
    const css = postcss.parse(await Bun.file(new URL("../src/components/examples/registry/ledger.css", import.meta.url)).text());
    const rules = new Map<string, Map<string, string>>();
    css.walkRules((rule) => { const values = new Map<string, string>(); rule.walkDecls((declaration) => { values.set(declaration.prop, declaration.value); }); rules.set(rule.selector, values); expect(rule.selector).toContain("[data-ledger-theme]"); });
    expect(rules.get('[data-ledger-theme] .ledger-table :where(th, td):last-child')?.get("padding-right")).toBe("var(--ledger-table-trailing-width, var(--ledger-default-table-trailing-width))");
    expect(rules.get('[data-ledger-theme] .ledger-table-mask[data-ledger-corners]')?.has("mask")).toBe(true);
    expect(rules.get('[data-ledger-theme] :where(button, input, a, [tabindex]):focus-visible')?.get("outline")).toContain("2px solid");
    expect(rules.get('[data-ledger-theme] [data-ledger-elevation="panel"]')?.get("filter")).toBe("var(--ledger-shadow-panel, var(--ledger-default-shadow-panel))");
    expect(rules.get('[data-ledger-theme] .ledger-search-field[data-ledger-corners]')?.get("background")).toBe("transparent");
    expect(rules.get('[data-ledger-theme] .ledger-range-selection[data-ledger-corners]')?.get("background")).toBe("transparent");
    expect(rules.get('[data-ledger-theme] .ledger-chart-tooltip[data-ledger-corners]')?.get("background")).toBe("transparent");
    expect(rules.get('[data-ledger-theme] .ledger-chart-tooltip[data-ledger-corners]')?.get("border-color")).toBe("transparent");
    expect(rules.get('[data-ledger-theme] .ledger-chart-tooltip[data-ledger-corners]::before')?.get("box-shadow")).toContain("inset");
    const media: string[] = [];
    css.walkAtRules("media", (rule) => { media.push(rule.params); });
    expect(media).toContain("(prefers-reduced-motion: reduce)");
  });
});
