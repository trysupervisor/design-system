import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join, relative } from "node:path";
import { COMPONENTS, getComponent } from "../src/lib/component-catalog";

const projectRoot = join(import.meta.dir, "..");
const uiRoot = join(projectRoot, "src/components/ui");
const outputRoot = join(projectRoot, "public/r");
const schema = "https://ui.shadcn.com/schema/registry-item.json";
const registryBaseUrl = (process.env.REGISTRY_BASE_URL ?? "https://ui.trysupervisor.com/r").replace(/\/$/, "");
if (!/^https?:\/\//.test(registryBaseUrl)) {
  throw new Error("REGISTRY_BASE_URL must use HTTP or HTTPS");
}
const registryUrl = (name: string) => `${registryBaseUrl}/${name}.json`;

type RegistryFile = {
  path: string;
  type: "registry:ui" | "registry:style" | "registry:file" | "registry:hook";
  target: string;
  content?: string;
};

type RegistryItem = {
  name: string;
  type: "registry:ui" | "registry:style" | "registry:component";
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
};

const compositionDependencies: Record<string, string[]> = {
  combobox: ["command", "popover"],
  "data-table": ["table"],
  "date-picker": ["button", "calendar", "popover"],
  toast: ["sonner"],
  typography: ["supervisor-foundation"],
};

function unique(values: string[]) {
  return [...new Set(values)].sort();
}

function importedModules(source: string) {
  return [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
}

function dependencyData(source: string) {
  const dependencies: string[] = [];
  const registryDependencies = ["supervisor-foundation"];

  for (const specifier of importedModules(source)) {
    if (specifier.startsWith("@/components/ui/")) {
      registryDependencies.push(specifier.split("/").at(-1) as string);
      continue;
    }
    if (specifier.startsWith("@/") || specifier.startsWith(".") || specifier === "react") {
      continue;
    }
    const packageName = specifier.startsWith("@")
      ? specifier.split("/").slice(0, 2).join("/")
      : specifier.split("/")[0];
    dependencies.push(packageName);
  }

  return {
    dependencies: unique(dependencies),
    registryDependencies: unique(registryDependencies).map(registryUrl),
  };
}

async function sourceFile(path: string, type: RegistryFile["type"], target: string): Promise<RegistryFile> {
  return {
    path: relative(projectRoot, path),
    type,
    target,
    content: await readFile(path, "utf8"),
  };
}

async function buildFoundation(): Promise<RegistryItem> {
  const foundationPath = join(projectRoot, "src/styles/foundation.css");
  const files = [
    await sourceFile(foundationPath, "registry:style", "src/styles/supervisor.css"),
    await sourceFile(join(projectRoot, "licenses/shadcn-ui.txt"), "registry:file", "licenses/shadcn-ui.txt"),
    await sourceFile(join(projectRoot, "LICENSE"), "registry:file", "licenses/supervisor-ui.txt"),
  ];

  return {
    name: "supervisor-foundation",
    type: "registry:style",
    title: "Supervisor foundation",
    description: "Theme tokens, type rules, motion, and shared component details.",
    dependencies: ["geist", "tw-animate-css"],
    files,
  };
}

async function buildSourceItem(fileName: string): Promise<RegistryItem> {
  const name = basename(fileName, ".tsx");
  const filePath = join(uiRoot, fileName);
  const source = await readFile(filePath, "utf8");
  const catalogItem = getComponent(name);
  const files = [await sourceFile(filePath, "registry:ui", `components/ui/${fileName}`)];
  const dependencyInfo = dependencyData(source);

  if (name === "sidebar") {
    const hookPath = join(projectRoot, "src/hooks/use-mobile.ts");
    files.push(await sourceFile(hookPath, "registry:hook", "hooks/use-mobile.ts"));
  }

  return {
    name,
    type: "registry:ui",
    title: catalogItem?.name ?? name,
    description: catalogItem?.description ?? `Supervisor ${name} component.`,
    dependencies: dependencyInfo.dependencies,
    registryDependencies: dependencyInfo.registryDependencies,
    files,
  };
}

async function buildCompositionItem(name: string, dependencies: string[]): Promise<RegistryItem> {
  const catalogItem = getComponent(name);
  if (!catalogItem) {
    throw new Error(`Missing catalog entry for ${name}`);
  }
  const filePath = join(projectRoot, "src/components/examples/registry", `${name}.tsx`);
  const source = await readFile(filePath, "utf8");
  const dependencyInfo = dependencyData(source);
  return {
    name,
    type: "registry:component",
    title: catalogItem.name,
    description: catalogItem.description,
    dependencies: dependencyInfo.dependencies,
    registryDependencies: unique([
      ...dependencyInfo.registryDependencies,
      ...dependencies.map(registryUrl),
    ]),
    files: [await sourceFile(filePath, "registry:ui", `components/ui/${name}.tsx`)],
  };
}

function outputItem(item: RegistryItem) {
  return {
    $schema: schema,
    ...item,
  };
}

async function main() {
  const uiFiles = (await readdir(uiRoot)).filter((file) => file.endsWith(".tsx")).sort();
  const sourceItems = await Promise.all(uiFiles.map(buildSourceItem));
  const sourceNames = new Set(sourceItems.map((item) => item.name));

  for (const component of COMPONENTS) {
    if (!sourceNames.has(component.slug) && !compositionDependencies[component.slug]) {
      throw new Error(`No registry source or composition for ${component.slug}`);
    }
  }

  const foundation = await buildFoundation();
  const compositionItems = await Promise.all(
    Object.entries(compositionDependencies).map(([name, dependencies]) =>
      buildCompositionItem(name, dependencies),
    ),
  );
  const items = [foundation, ...sourceItems, ...compositionItems].sort((left, right) =>
    left.name.localeCompare(right.name),
  );

  const authoringManifest = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "supervisor",
    homepage: "https://ui.trysupervisor.com",
    items: items.map((item) => ({
      ...item,
      files: item.files?.map((file) => ({ path: file.path, type: file.type, target: file.target })),
    })),
  };

  await mkdir(outputRoot, { recursive: true });
  await writeFile(join(projectRoot, "registry.json"), `${JSON.stringify(authoringManifest, null, 2)}\n`);
  await writeFile(
    join(outputRoot, "index.json"),
    `${JSON.stringify({ ...authoringManifest, items: items.map(outputItem) }, null, 2)}\n`,
  );

  await Promise.all(
    items.map(async (item) => {
      const destination = join(outputRoot, `${item.name}.json`);
      if (dirname(destination) !== outputRoot) {
        throw new Error(`Unsafe registry item name: ${item.name}`);
      }
      await writeFile(destination, `${JSON.stringify(outputItem(item), null, 2)}\n`);
    }),
  );

  console.log(`Built ${items.length} registry items in ${relative(projectRoot, outputRoot)}`);
}

await main();
