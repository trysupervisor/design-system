import { describe, expect, test } from "bun:test";
import { compile } from "@tailwindcss/node";
import { join } from "node:path";
import postcss from "postcss";
import { registryItemSchema } from "shadcn/schema";
import { registryCssRules, type CssRules } from "../scripts/registry-css";
import { defaultTheme } from "../src/lib/theme-presets";
import { themeToRegistry } from "../src/lib/theme-registry";

const projectRoot = join(import.meta.dir, "..");
const excludedVariables = new Set(Object.keys(themeToRegistry(defaultTheme).cssVars.light).filter((key) => key !== "radius"));

function stylesheet(rules: CssRules): string {
  return Object.entries(rules).map(([key, value]) => typeof value === "string" ? `${key}: ${value};` : `${key} { ${stylesheet(value)} }`).join("\n");
}

describe("registry CSS conversion", () => {
  test("merges repeated selectors while preserving the final declaration", () => {
    const rules = registryCssRules(`
      .control { font-size: .8125rem; border-radius: 6px; transition-duration: 100ms; }
      .control { transition-duration: 150ms; transition-property: color; }
    `, excludedVariables);
    expect(rules[".control"]).toEqual({ "font-size": ".8125rem", "border-radius": "6px", "transition-duration": "150ms", "transition-property": "color" });
  });

  test("merges repeated media blocks and nested selectors without losing reduced motion", () => {
    const rules = registryCssRules(`
      @media (prefers-reduced-motion: reduce) { .control { animation-duration: .01ms !important; } }
      @media (prefers-reduced-motion: reduce) { .control { transition-duration: .01ms !important; } .panel { scroll-behavior: auto; } }
    `, excludedVariables);
    expect(rules["@media (prefers-reduced-motion: reduce)"]).toEqual({
      ".control": { "animation-duration": ".01ms !important", "transition-duration": ".01ms !important" },
      ".panel": { "scroll-behavior": "auto" },
    });
  });

  test("keeps theme values out of the foundation while retaining geometry and color transitions", () => {
    const rules = registryCssRules(`
      :root { --primary: red; }
      .dark { --primary: blue; }
      @theme inline { --color-primary: var(--primary); }
      .control { color: var(--primary); background: var(--background); border-radius: var(--radius); transition: background-color 150ms; }
    `, excludedVariables);
    expect(rules).toEqual({ ".control": { "border-radius": "var(--radius)", transition: "background-color 150ms" } });
  });

  test("compiles exported foundation motion and accessibility rules", async () => {
    const source = await Bun.file(join(projectRoot, "src/styles/foundation.css")).text();
    const rules = registryCssRules(source, excludedVariables);
    expect(registryItemSchema.safeParse({ name: "motion-foundation", type: "registry:style", css: rules }).success).toBe(true);
    const compiler = await compile(`@import "tailwindcss" source(none);\n${stylesheet(rules)}`, { base: projectRoot, onDependency() {} });
    const output = postcss.parse(compiler.build([]));
    const keyframes = new Set<string>();
    output.walkAtRules("keyframes", (rule) => { keyframes.add(rule.params); });
    for (const name of ["supervisor-dialog-in", "supervisor-dialog-out", "supervisor-accordion-down", "supervisor-collapsible-up", "supervisor-skeleton-shimmer", "supervisor-spinner-opacity"]) {
      expect(keyframes.has(name)).toBe(true);
    }
    const preferences: string[] = [];
    output.walkAtRules("media", (rule) => {
      if (rule.params.includes("prefers-reduced-motion")) preferences.push(rule.toString());
    });
    expect(preferences.join("\n")).toContain("animation-duration: .01ms !important");
    expect(preferences.join("\n")).toContain("transition-duration: .01ms !important");
    expect(preferences.join("\n")).toContain("animation-iteration-count: 1 !important");
    expect(output.toString()).toContain("--motion-overlay-duration: 300ms");
    expect(output.toString()).toContain("data-starting-style");
    expect(output.toString()).toContain("--accordion-panel-height");
    expect(output.toString()).toContain("--radix-accordion-content-height");
  });
});
