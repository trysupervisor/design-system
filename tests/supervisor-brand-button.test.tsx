import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import postcss from "postcss";
import { SupervisorBrandButton } from "../src/components/examples/registry/supervisor-brand-button";

describe("Supervisor brand button", () => {
  test("preserves native button props and renders one control", () => {
    const html = renderToStaticMarkup(createElement(SupervisorBrandButton, { type: "submit", name: "action", value: "save", disabled: true, "aria-label": "Save workspace", className: "custom-button" }, "Save"));
    expect(html.match(/<button\b/g)).toHaveLength(1);
    expect(html).toContain('type="submit"');
    expect(html).toContain('name="action"');
    expect(html).toContain('value="save"');
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-label="Save workspace"');
    expect(html).toContain("custom-button");
    expect(html).toContain('data-supervisor-brand=""');
    expect(html).toContain('data-supervisor-brand-size="default"');
  });

  test("retains the supplied button size", () => {
    const html = renderToStaticMarkup(createElement(SupervisorBrandButton, { size: "sm" }, "Save"));
    expect(html).toContain('data-supervisor-brand-size="sm"');
  });

  test("defines isolated brand states and reduced motion styles", async () => {
    const css = postcss.parse(await Bun.file(new URL("../src/components/examples/registry/supervisor-brand-button.css", import.meta.url)).text());
    const backgrounds: string[] = [];
    let foreground = "";
    css.walkRules((rule) => {
      expect(rule.selector).toContain("[data-supervisor-brand]");
      rule.walkDecls("background", (declaration) => { backgrounds.push(declaration.value); });
      if (rule.selector === '[data-slot="button"][data-supervisor-brand]') {
        rule.walkDecls("color", (declaration) => { foreground = declaration.value; });
      }
    });
    expect(backgrounds).toEqual(["#ff5125", "#f0441b", "#e8441c", "var(--muted, #f4f4f4)"]);
    expect(foreground).toBe("#ffffff");
    expect(css.toString()).toContain("prefers-reduced-motion: reduce");
    expect(css.toString()).toContain("border-radius: 5px");
  });
});
