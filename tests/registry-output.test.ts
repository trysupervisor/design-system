import { describe, expect, test } from "bun:test";

const projectRoot = new URL("../", import.meta.url);
const customDependencyPrefix = "https://ui.trysupervisor.com/r/";

type RegistryFile = { path: string; target: string; content?: string };
type RegistryItem = {
  name: string;
  type: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
};

async function jsonFile<T>(path: string): Promise<T> {
  return Bun.file(new URL(path, projectRoot)).json() as Promise<T>;
}

describe("registry output", () => {
  test("publishes a valid item for each manifest entry", async () => {
    const manifest = await jsonFile<{ items: RegistryItem[] }>("registry.json");
    expect(manifest.items.length).toBeGreaterThanOrEqual(66);
    for (const item of manifest.items) {
      const output = await jsonFile<RegistryItem & { $schema: string }>(`public/r/${item.name}.json`);
      expect(output.$schema).toBe("https://ui.shadcn.com/schema/registry-item.json");
      expect(output.name).toBe(item.name);
    }
  });

  test("uses public URLs for local dependencies", async () => {
    const manifest = await jsonFile<{ items: RegistryItem[] }>("registry.json");
    for (const item of manifest.items) {
      for (const dependency of item.registryDependencies ?? []) {
        expect(dependency.startsWith(customDependencyPrefix)).toBe(true);
        expect(dependency.endsWith(".json")).toBe(true);
      }
    }
  });

  test("includes source and install targets for every component item", async () => {
    const manifest = await jsonFile<{ items: RegistryItem[] }>("registry.json");
    const compositionNames = ["combobox", "data-table", "date-picker", "toast", "typography"];
    for (const name of compositionNames) {
      const item = manifest.items.find((candidate) => candidate.name === name);
      expect(item?.files).toHaveLength(1);
      expect(item?.files?.[0].target).toBe(`components/ui/${name}.tsx`);
      const output = await jsonFile<RegistryItem>(`public/r/${name}.json`);
      expect(output.files?.[0].content?.length).toBeGreaterThan(40);
    }
  });

  test("installs the theme and license through the foundation", async () => {
    const foundation = await jsonFile<RegistryItem>("public/r/supervisor-foundation.json");
    expect(foundation.type).toBe("registry:style");
    expect(foundation.files?.map((file) => file.target)).toEqual([
      "src/styles/supervisor.css",
      "licenses/shadcn-ui.txt",
      "licenses/supervisor-ui.txt",
    ]);
  });

  test("keeps registry source independent from proprietary systems", async () => {
    const index = await Bun.file(new URL("public/r/index.json", projectRoot)).text();
    expect(index).not.toMatch(/geist\.vercel\.app|vercel-stock-dashboard|proprietary/i);
    expect(index).not.toMatch(/api[_-]?key|secret[_-]?key|password\s*[:=]/i);
  });
});
