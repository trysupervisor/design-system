import { describe, expect, test } from "bun:test";
import { registryItemSchema } from "shadcn/schema";
import { defaultTheme, themePresets } from "../src/lib/theme-presets";
import { hexToHslChannels, themeToRegistry } from "../src/lib/theme-registry";

const projectRoot = new URL("../", import.meta.url);
const compositions = ["combobox", "data-table", "date-picker", "toast", "typography"];
type RegistryFile = { path: string; target: string; content?: string };
type RegistryItem = ReturnType<typeof themeToRegistry> & { files?: RegistryFile[] };
async function jsonFile<T>(path: string): Promise<T> {
  return Bun.file(new URL(path, projectRoot)).json() as Promise<T>;
}

describe("registry output", () => {
  test("publishes schema valid items for every manifest entry", async () => {
    const manifest = await jsonFile<{ items: RegistryItem[] }>("registry.json");
    expect(manifest.items).toHaveLength(103);
    for (const item of manifest.items) {
      const output = await jsonFile<RegistryItem>(`public/r/${item.name}.json`);
      expect(registryItemSchema.safeParse(output).success).toBe(true);
      expect(output.name).toBe(item.name);
    }
  });

  test("resolves primitives using the consumer shadcn configuration", async () => {
    for (const name of ["button", "chart", "dialog", "sidebar", "input", "select", "calendar"]) {
      const item = await jsonFile<RegistryItem>(`public/r/${name}.json`);
      expect(item.registryDependencies).toEqual([name]);
      expect(item.files).toBeUndefined();
      expect(item.cssVars).toBeUndefined();
    }
  });

  test("honors configured aliases for compositions", async () => {
    for (const name of compositions) {
      const item = await jsonFile<RegistryItem>(`public/r/${name}.json`);
      expect(item.files?.[0].target).toBe(`@ui/${name}.tsx`);
      expect(item.files?.[0].content?.length).toBeGreaterThan(40);
      expect(item.files?.[0].content).not.toContain("asChild");
      expect(item.registryDependencies.every((dependency) => !dependency.includes("http"))).toBe(true);
    }
  });

  test("installs CSS natively without a stylesheet target or component replacement", async () => {
    const foundation = await jsonFile<RegistryItem>("public/r/supervisor-foundation.json");
    expect(foundation.css).toBeDefined();
    expect(foundation.cssVars).toBeUndefined();
    expect(foundation.files?.map((file) => file.target)).toEqual(["~/licenses/shadcn-ui.txt", "~/licenses/supervisor-ui.txt"]);
    const theme = await jsonFile<RegistryItem>("public/r/supervisor.json");
    expect(theme.type).toBe("registry:theme");
    expect(theme.files).toBeUndefined();
    expect(theme.registryDependencies).toEqual(["https://ui.trysupervisor.com/r/supervisor-foundation.json"]);
    expect(theme.cssVars.light.background).toBe(hexToHslChannels(defaultTheme.light.background));
    expect(theme.cssVars.dark.background).toBe(hexToHslChannels(defaultTheme.dark.background));
    expect(JSON.stringify(foundation.css)).not.toContain("--supervisor-");
    expect(JSON.stringify(foundation.css)).not.toContain("background");
    for (const token of Object.keys(theme.cssVars.light).filter((key) => key !== "radius")) {
      expect(JSON.stringify(foundation.css)).not.toContain(`var(--${token})`);
    }
    expect(theme.dependencies).toContain("@fontsource-variable/geist");
  });

  test("publishes every preset through the native theme schema", async () => {
    for (const preset of themePresets) {
      const item = await jsonFile<RegistryItem>(`public/r/theme-${preset.id}.json`);
      expect(item.cssVars.light.radius).toBe(`${preset.radius}rem`);
      expect(item.css[":root"]["--border-width"]).toBe(`${preset.borderWidth}px`);
      expect(item.cssVars.dark.primary).toBe(hexToHslChannels(preset.dark.primary));
      expect(item.dependencies.length).toBe(2);
      expect(Object.keys(item.css).filter((key) => key.startsWith("@import"))).toHaveLength(2);
    }
  });

  test("exports installable custom themes without executable input", () => {
    const custom = { ...defaultTheme, id: "custom-mint", name: "Mint", font: "inter" as const, radius: 0.9, spacing: 1.2 };
    const item = themeToRegistry(custom);
    expect(registryItemSchema.safeParse(item).success).toBe(true);
    expect(item.dependencies).toContain("@fontsource-variable/inter");
    expect(item.css[":root"]["--app-font"]).toContain("Inter Variable");
    expect(item.cssVars.light.radius).toBe("0.9rem");
    expect(item.css[":root"]["--spacing"]).toBe("0.3rem");
    expect(() => themeToRegistry({ ...custom, font: "url(evil)" as typeof custom.font })).toThrow();
  });

  test("uses adaptive HSL channels for legacy and current Tailwind", () => {
    expect(hexToHslChannels("#FFFFFF")).toBe("0 0% 100%");
    expect(hexToHslChannels("#000000")).toBe("0 0% 0%");
    expect(hexToHslChannels("#FF0000")).toBe("0 100% 50%");
    expect(hexToHslChannels("#00FF00")).toBe("120 100% 50%");
    expect(hexToHslChannels("#0000FF")).toBe("240 100% 50%");
    const item = themeToRegistry(defaultTheme);
    expect(item.cssVars.light["sidebar-background"]).toBe(item.cssVars.light.sidebar);
  });

  test("keeps registry source independent from proprietary systems", async () => {
    const index = await Bun.file(new URL("public/r/index.json", projectRoot)).text();
    expect(index).not.toMatch(/geist\.vercel\.app|vercel-stock-dashboard|proprietary/i);
    expect(index).not.toMatch(/api[_-]?key|secret[_-]?key|password\s*[:=]/i);
  });
});
