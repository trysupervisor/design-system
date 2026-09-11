import { describe, expect, test } from "bun:test";
import postcss from "postcss";
import { ledgerPortalTarget, ledgerSharedCornerMask, ledgerThemeOwner } from "../src/components/examples/registry/ledger-runtime";

function svg(mask: string) {
  return decodeURIComponent(mask.slice('url("data:image/svg+xml,'.length, -2));
}

describe("Shared Ledger corners", () => {
  test("a resized surface receives an exact SVG view box and continuous path", () => {
    const small = ledgerSharedCornerMask(120, 34, [14, 14, 14, 14]);
    const large = ledgerSharedCornerMask(320, 180, [22, 22, 22, 22]);
    expect(svg(small)).toContain('viewBox="0 0 120 34"');
    expect(svg(large)).toContain('viewBox="0 0 320 180"');
    expect(svg(small)).toMatch(/ [Cc] /);
    expect(small).not.toEqual(large);
    expect(svg(small)).not.toMatch(/NaN|Infinity/);
  });

  test("continuous corners preserve square joined edges and reject invalid geometry", () => {
    const joined = ledgerSharedCornerMask(140, 34, [14, 0, 0, 14]);
    expect(joined).not.toEqual(ledgerSharedCornerMask(140, 34, [14, 14, 14, 14]));
    expect(ledgerSharedCornerMask(0, 34, [14, 14, 14, 14])).toBe("");
    expect(ledgerSharedCornerMask(140, 34, [0, 0, 0, 0])).toBe("");
    expect(ledgerSharedCornerMask(Number.NaN, 34, [14, 14, 14, 14])).toBe("");
    expect(ledgerSharedCornerMask(140, 34, [14, 14, 14, 14], 0)).not.toEqual(joined);
  });

  test("the painted background has valid pseudo syntax and never clips interactive descendants", async () => {
    const source = await Bun.file(new URL("../src/components/examples/registry/ledger.css", import.meta.url)).text();
    const css = postcss.parse(source);
    const backgrounds: postcss.Rule[] = [];
    css.walkRules((rule) => {
      if (rule.selector.includes("[data-ledger-shared-corners]::before")) backgrounds.push(rule);
      expect(rule.selector).not.toContain(":is([data-ledger-shared-corners]::before)");
      if (rule.selector.includes("[data-ledger-shared-corners]") && !rule.selector.includes("::before")) {
        rule.walkDecls((declaration) => expect(["clip-path", "mask", "overflow"]).not.toContain(declaration.prop));
      }
    });
    expect(backgrounds).toHaveLength(1);
    expect(backgrounds[0].toString()).toContain("pointer-events: none");
    expect(backgrounds[0].toString()).toContain("--ledger-shared-corner-mask");
    const boundaries: string[] = [];
    css.walkAtRules("scope", (rule) => { boundaries.push(rule.params); });
    expect(boundaries[0]).toContain('to ([data-theme-recipe]:not([data-theme-recipe="ledger"])');
  });
});

function scopeNode(attributes: Record<string, string> = {}, parentElement: HTMLElement | null = null): HTMLElement {
  const element = {
    parentElement,
    getAttribute: (name: string) => attributes[name] ?? null,
    hasAttribute: (name: string) => Object.hasOwn(attributes, name),
    contains(node: Element | null) {
      for (let current = node; current; current = current.parentElement) if (current === element) return true;
      return false;
    },
  };
  return element as HTMLElement;
}

describe("Ledger portal ownership", () => {
  test("a nearer ordinary theme blocks the enclosing portal owner", () => {
    const root = scopeNode({ "data-theme-recipe": "ledger" });
    const portal = scopeNode({ "data-slot": "dialog-content" });
    const ordinary = scopeNode({ "data-theme-recipe": "none" }, portal);
    const trigger = scopeNode({}, ordinary);
    expect(ledgerThemeOwner(trigger, [root], new Map([[portal, root]]))).toBeUndefined();
  });

  test("a nested provider owns its contents inside another provider's portal", () => {
    const outer = scopeNode({ "data-ledger-theme": "" });
    const portal = scopeNode({ "data-slot": "dialog-content" });
    const inner = scopeNode({ "data-ledger-theme": "" }, portal);
    const trigger = scopeNode({}, inner);
    const portals = new Map([[portal, outer]]);
    expect(ledgerThemeOwner(trigger, [outer, inner], portals)).toBe(inner);
    expect(ledgerThemeOwner(portal, [outer, inner], portals)).toBe(outer);
  });

  test("a nested context menu has a different owner until its portal is associated", () => {
    const root = scopeNode({ "data-theme-recipe": "ledger" });
    const body = scopeNode({}, root);
    const inner = scopeNode({ "data-ledger-theme": "" }, body);
    const trigger = scopeNode({ "data-slot": "context-menu-trigger" }, inner);
    const content = scopeNode({ "data-slot": "context-menu-content" }, body);
    const scopes = [root, inner];
    const portals = new Map<HTMLElement, HTMLElement>();
    expect(ledgerThemeOwner(content, scopes, portals)).toBe(root);
    const triggerOwner = ledgerThemeOwner(trigger, scopes, portals)!;
    expect(triggerOwner).toBe(inner);
    expect(ledgerThemeOwner(content, scopes, portals)).not.toBe(triggerOwner);
    portals.set(content, triggerOwner);
    expect(ledgerThemeOwner(content, scopes, portals)).toBe(inner);
  });

  test("ARIA targets only resolve to content or overlay ancestors", () => {
    const body = scopeNode();
    const help = scopeNode({ id: "shared-help" }, body);
    const tooltip = scopeNode({ "data-slot": "tooltip-content" }, body);
    const accessibleText = scopeNode({ role: "tooltip" }, tooltip);
    expect(ledgerPortalTarget(help)).toBeUndefined();
    expect(ledgerPortalTarget(accessibleText)).toBe(tooltip);
    expect(ledgerPortalTarget(tooltip)).toBe(tooltip);
    expect(ledgerPortalTarget(null)).toBeUndefined();
  });
});
