import { describe, expect, test } from "bun:test";
import { registryItemSchema } from "shadcn/schema";
import { defaultTheme, themePresets } from "../src/lib/theme-presets";
import { hexToHslChannels, themeToRegistry } from "../src/lib/theme-registry";
import { AI_ELEMENTS } from "../src/lib/ai-elements-catalog";
import { ledgerVariables } from "../src/components/examples/registry/ledger-tokens";

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
    expect(manifest.items).toHaveLength(105 + AI_ELEMENTS.length + 5);
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

  test("publishes the brand button with portable styles and native props", async () => {
    const item = await jsonFile<RegistryItem>("public/r/supervisor-brand-button.json");
    expect(item.registryDependencies).toEqual(["button"]);
    expect(item.dependencies).toContain("@fontsource-variable/geist-mono");
    expect(item.files?.map((file) => file.target)).toEqual(["@ui/supervisor-brand-button.tsx", "@ui/supervisor-brand-button.css", "~/licenses/supervisor-ui.txt"]);
    expect(item.files?.[0].content).toContain('import "./supervisor-brand-button.css"');
    expect(item.files?.[1].content).toContain("[data-supervisor-brand]");
    expect(item.files?.[2].content).toContain("MIT License");
  });

  test("installs Device source and image notices without redistributing PNGs", async () => {
    const item = registryItemSchema.parse(await jsonFile<unknown>("public/r/device.json"));
    expect(item.type).toBe("registry:component");
    expect(item.registryDependencies ?? []).not.toContain("device");
    expect(item.files?.map((file) => file.target)).toEqual(["@ui/device.tsx", "@ui/device-frames.ts", "@ui/device.css", "~/licenses/device-frames.txt", "~/licenses/supervisor-ui.txt"]);
    expect(item.files?.[0].content).toContain('from "./device-frames"');
    expect(item.files?.[0].content).toContain('import "./device.css"');
    expect(item.files?.[0].content).toContain("unoptimized");
    expect(item.files?.[3].content).toContain("not included in this package");
    expect(JSON.stringify(item)).not.toContain("data:image/png;base64");
    expect(item.files?.some((file) => file.target?.endsWith(".png"))).toBe(false);
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

  test("publishes the complete AI Elements catalog with the verified source", async () => {
    expect(AI_ELEMENTS).toHaveLength(48);
    const all = await jsonFile<RegistryItem>("public/r/ai-elements.json");
    expect(all.registryDependencies).toHaveLength(AI_ELEMENTS.length);
    for (const element of AI_ELEMENTS) {
      const url = `https://ui.trysupervisor.com/r/ai-elements-${element.slug}.json`;
      expect(all.registryDependencies).toContain(url);
      const item = await jsonFile<RegistryItem>(`public/r/ai-elements-${element.slug}.json`);
      expect(item.registryDependencies).toContain("https://ui.trysupervisor.com/r/ai-elements-license.json");
      expect(item.files?.[0].target).toBe(`@components/ai-elements/${element.slug}.tsx`);
      const source = await Bun.file(new URL(`src/components/ai-elements/${element.slug}.tsx`, projectRoot)).text();
      expect(item.files?.[0].content).toBe(source);
      expect(item.cssVars).toBeUndefined();
    }
    const license = await jsonFile<RegistryItem>("public/r/ai-elements-license.json");
    expect(license.files?.[0].target).toBe("~/licenses/ai-elements.txt");
    expect(license.files?.[0].content).toContain("Apache License");
    expect(license.files?.[0].content).toContain("Copyright 2023 Vercel, Inc.");
    expect(license.files?.[0].content).toContain("END OF TERMS AND CONDITIONS");
    const timing = await jsonFile<RegistryItem>("public/r/ai-elements-hover-card-timing.json");
    expect(timing.files?.[0].target).toBe("@components/ai-elements/hover-card-timing.tsx");
    for (const slug of ["attachments", "context", "inline-citation", "prompt-input"]) {
      const item = await jsonFile<RegistryItem>(`public/r/ai-elements-${slug}.json`);
      expect(item.registryDependencies).toContain("https://ui.trysupervisor.com/r/ai-elements-hover-card-timing.json");
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
      if (preset.recipe === "ledger") {
        expect(item.registryDependencies).toEqual([
          "https://ui.trysupervisor.com/r/ledger-runtime.json",
          "https://ui.trysupervisor.com/r/supervisor-foundation.json",
        ]);
        expect(item.dependencies).toEqual([]);
        expect(Object.keys(item.css).filter((key) => key.startsWith("@import"))).toHaveLength(0);
        for (const [name, value] of Object.entries(ledgerVariables)) {
          expect(item.css[":root"][name]).toBe(value);
        }
      } else {
        expect(item.dependencies.length).toBe(2);
        expect(Object.keys(item.css).filter((key) => key.startsWith("@import"))).toHaveLength(2);
      }
    }
  });

  test("publishes the complete portable Ledger runtime", async () => {
    const item = registryItemSchema.parse(await jsonFile<unknown>("public/r/ledger-runtime.json"));
    expect(item.type).toBe("registry:component");
    expect(item.files?.map((file) => file.target)).toEqual([
      "@ui/ledger.tsx",
      "@ui/ledger-chart.tsx",
      "@ui/ledger-tokens.ts",
      "@ui/ledger.css",
      "~/licenses/supervisor-ui.txt",
    ]);
    expect(item.dependencies).toContain("figma-squircle@1.1.0");
    expect(item.dependencies).toContain("motion@^12.26.2");
    expect(item.files?.[4].content).toContain("MIT License");

    const sourceFiles = item.files?.filter((file) => file.target?.startsWith("@ui/")) ?? [];
    const targetStems = new Set(sourceFiles.map((file) => file.target!.replace(/^@ui\//, "").replace(/\.(?:tsx?|css)$/, "")));
    const installedPackages = new Set((item.dependencies ?? []).map((dependency) => {
      if (dependency.startsWith("@")) return dependency.slice(0, dependency.indexOf("@", 1));
      return dependency.split("@")[0];
    }));

    for (const file of sourceFiles.filter((file) => file.target?.endsWith(".ts") || file.target?.endsWith(".tsx"))) {
      const imports = [...(file.content ?? "").matchAll(/(?:from\s+|import\s*)["']([^"']+)["']/g)].map((match) => match[1]);
      for (const specifier of imports) {
        if (specifier.startsWith("./")) {
          expect(targetStems).toContain(specifier.slice(2).replace(/\.(?:tsx?|css)$/, ""));
        } else if (specifier.startsWith("@/components/ui/")) {
          expect(item.registryDependencies).toContain(specifier.split("/").at(-1));
        } else if (specifier.startsWith("@/")) {
          throw new Error(`Application import escaped the Ledger runtime: ${specifier}`);
        } else {
          const packageName = specifier.startsWith("@")
            ? specifier.split("/").slice(0, 2).join("/")
            : specifier.split("/")[0];
          if (!["react", "react-dom"].includes(packageName)) expect(installedPackages).toContain(packageName);
        }
      }
      expect(file.content).not.toContain('from "next/');
      expect(file.content).not.toContain('from "@/lib/theme');
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
