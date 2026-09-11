import { describe, expect, test } from "bun:test";
import { COMPONENTS, COMPONENT_CATEGORIES, COMPONENT_GROUPS } from "../src/lib/component-catalog";
import { COMPONENT_SNIPPETS } from "../src/components/examples/component-snippets";

describe("component catalog", () => {
  test("contains the shadcn catalog and Supervisor components", () => {
    expect(COMPONENTS).toHaveLength(65);
    expect(new Set(COMPONENTS.map((component) => component.slug)).size).toBe(65);
    expect(COMPONENTS.map((component) => component.slug)).toContain("device");
    expect(COMPONENTS.map((component) => component.slug)).toContain("attachment");
    expect(COMPONENTS.map((component) => component.slug)).toContain("questionnaire");
    expect(COMPONENTS.map((component) => component.slug)).toContain("typography");
  });

  test("groups every component once", () => {
    expect(COMPONENT_GROUPS.map((group) => group.category)).toEqual([...COMPONENT_CATEGORIES]);
    expect(COMPONENT_GROUPS.flatMap((group) => group.components)).toHaveLength(COMPONENTS.length);
  });

  test("has complete examples with source", () => {
    expect(Object.keys(COMPONENT_SNIPPETS).sort()).toEqual(COMPONENTS.map((component) => component.slug).sort());
    for (const component of COMPONENTS) {
      const code = COMPONENT_SNIPPETS[component.slug];
      expect(code).toContain("export default function Example");
      expect(code).not.toContain("TODO");
      expect(code).not.toContain("...");
    }
  });
});
