import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join, relative } from "node:path";
import postcss, { type Container, type Rule, type AtRule } from "postcss";
import { registryItemSchema } from "shadcn/schema";
import { COMPONENTS, getComponent } from "../src/lib/component-catalog";
import { defaultTheme, themePresets } from "../src/lib/theme-presets";
import { REGISTRY_URL, themeToRegistry } from "../src/lib/theme-registry";
import { AI_ELEMENTS } from "../src/lib/ai-elements-catalog";
import ts from "typescript";
import { streamdownRegistryCss } from "./streamdown-css";

const projectRoot = join(import.meta.dir, "..");
const outputRoot = join(projectRoot, "public/r");
const schema = "https://ui.shadcn.com/schema/registry-item.json";
const packageManifest = JSON.parse(await readFile(join(projectRoot, "package.json"), "utf8")) as { dependencies: Record<string, string> };
const registryBaseUrl = (process.env.REGISTRY_BASE_URL ?? REGISTRY_URL).replace(/\/$/, "");
if (!/^https?:\/\//.test(registryBaseUrl)) throw new Error("REGISTRY_BASE_URL must use HTTP or HTTPS");
const semanticColors = new Set(Object.keys(themeToRegistry(defaultTheme).cssVars.light).filter((key) => key !== "radius"));
const aiElementSupport = [{ slug: "hover-card-timing", name: "Hover card timing", description: "Shared hover timing for either shadcn component base." }];
const streamdownCss = await streamdownRegistryCss();

type RegistryFile = { path: string; type: "registry:ui" | "registry:file"; target: string; content: string };
type CssRules = { [key: string]: string | CssRules };
type RegistryItem = {
  name: string;
  type: "registry:ui" | "registry:style" | "registry:component" | "registry:theme";
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
  css?: CssRules;
};

function cssRules(container: Container): CssRules {
  const rules: CssRules = {};
  for (const node of container.nodes ?? []) {
    if (node.type === "decl") {
      const variables = [...node.value.matchAll(/var\(--([a-z0-9-]+)/g)];
      if (variables.some((match) => semanticColors.has(match[1]))) continue;
      rules[node.prop] = node.value + (node.important ? " !important" : "");
    } else if (node.type === "rule" || node.type === "atrule") {
      const child = node as Rule | AtRule;
      if (child.type === "atrule" && ["theme", "custom-variant"].includes(child.name)) continue;
      if (child.type === "rule" && [":root", ".dark"].includes(child.selector)) continue;
      const key = child.type === "rule" ? child.selector : `@${child.name}${child.params ? ` ${child.params}` : ""}`;
      const contents = cssRules(child);
      if (Object.keys(contents).length) rules[key] = contents;
    }
  }
  return rules;
}

async function sourceFile(path: string, type: RegistryFile["type"], target: string): Promise<RegistryFile> {
  return { path: relative(projectRoot, path), type, target, content: await readFile(path, "utf8") };
}

async function buildFoundation(): Promise<RegistryItem> {
  return {
    name: "supervisor-foundation",
    type: "registry:style",
    title: "Supervisor foundation",
    description: "Shared component rules for Supervisor themes.",
    css: cssRules(postcss.parse(await readFile(join(projectRoot, "src/styles/foundation.css"), "utf8"))),
    files: [
      await sourceFile(join(projectRoot, "licenses/shadcn-ui.txt"), "registry:file", "~/licenses/shadcn-ui.txt"),
      await sourceFile(join(projectRoot, "LICENSE"), "registry:file", "~/licenses/supervisor-ui.txt"),
    ],
  };
}

async function buildComposition(name: string): Promise<RegistryItem> {
  const component = getComponent(name)!;
  const filePath = join(projectRoot, "src/components/examples/registry", `${name}.tsx`);
  const source = await readFile(filePath, "utf8");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  const registryDependencies = [...new Set(imports.filter((path) => path.startsWith("@/components/ui/")).map((path) => basename(path)))].sort();
  const dependencies = [...new Set(imports.filter((path) => !path.startsWith(".") && !path.startsWith("@/") && path !== "react").map((path) => path.startsWith("@") ? path.split("/").slice(0, 2).join("/") : path.split("/")[0]))].sort();
  return {
    name,
    type: "registry:component",
    title: component.name,
    description: component.description,
    registryDependencies,
    dependencies,
    files: [await sourceFile(filePath, "registry:ui", `@ui/${name}.tsx`)],
  };
}

async function buildAIElement(element: { slug: string; name: string; description: string }): Promise<RegistryItem> {
  const path = join(projectRoot, "src/components/ai-elements", `${element.slug}.tsx`);
  const source = await readFile(path, "utf8");
  const imports: string[] = [];
  const syntax = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function visit(node: ts.Node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      imports.push(node.moduleSpecifier.text);
    } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
      imports.push(node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  }
  visit(syntax);
  const registryDependencies = new Set([`${registryBaseUrl}/ai-elements-license.json`]);
  const dependencies = new Set<string>();
  for (const specifier of imports) {
    if (specifier.startsWith("@/components/ui/")) {
      registryDependencies.add(basename(specifier));
    } else if (specifier.startsWith("@/components/ai-elements/") || specifier.startsWith("./")) {
      const name = basename(specifier).replace(/\.tsx?$/, "");
      if (![...AI_ELEMENTS, ...aiElementSupport].some((item) => item.slug === name)) throw new Error(`Unknown AI Element dependency ${specifier}`);
      registryDependencies.add(`${registryBaseUrl}/ai-elements-${name}.json`);
    } else if (!specifier.startsWith("@/")) {
      const name = specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];
      if (["react", "react-dom", "next"].includes(name)) continue;
      const version = packageManifest.dependencies[name];
      if (!version) throw new Error(`Unlisted AI Element package ${name}`);
      dependencies.add(`${name}@${version}`);
    }
  }
  return {
    name: `ai-elements-${element.slug}`,
    type: "registry:component",
    title: element.name,
    description: element.description,
    registryDependencies: [...registryDependencies].sort(),
    dependencies: [...dependencies].sort(),
    ...(["message", "reasoning"].includes(element.slug) ? { css: streamdownCss } : {}),
    files: [await sourceFile(path, "registry:ui", `@components/ai-elements/${element.slug}.tsx`)],
  };
}

async function main() {
  const compositions = ["combobox", "data-table", "date-picker", "toast", "typography"];
  const uiFiles = (await readdir(join(projectRoot, "src/components/ui"))).filter((file) => file.endsWith(".tsx")).sort();
  const nativeItems: RegistryItem[] = uiFiles.map((file) => {
    const name = basename(file, ".tsx");
    const component = getComponent(name);
    return { name, type: "registry:ui", title: component?.name ?? name, description: component?.description ?? `The shadcn ${name} component.`, registryDependencies: [name] };
  });
  const items: RegistryItem[] = [
    await buildFoundation(),
    themeToRegistry(defaultTheme, registryBaseUrl, "supervisor"),
    ...themePresets.map((theme) => themeToRegistry(theme, registryBaseUrl)),
    ...nativeItems,
    ...await Promise.all(compositions.map(buildComposition)),
    {
      name: "device",
      type: "registry:component" as const,
      title: "Device",
      description: "Photographic PNG frames for iPhone, iPad, MacBook, and Android.",
      files: [
        await sourceFile(join(projectRoot, "src/components/examples/registry/device.tsx"), "registry:ui", "@ui/device.tsx"),
        await sourceFile(join(projectRoot, "src/components/examples/registry/device-frames.ts"), "registry:ui", "@ui/device-frames.ts"),
        await sourceFile(join(projectRoot, "src/components/examples/registry/device.css"), "registry:ui", "@ui/device.css"),
        await sourceFile(join(projectRoot, "licenses/device-frames.txt"), "registry:file", "~/licenses/device-frames.txt"),
        await sourceFile(join(projectRoot, "LICENSE"), "registry:file", "~/licenses/supervisor-ui.txt"),
      ],
    },
    {
      name: "supervisor-brand-button",
      type: "registry:component" as const,
      title: "Supervisor brand button",
      description: "The orange Supervisor action with layered hover and press shadows.",
      registryDependencies: ["button"],
      dependencies: ["@fontsource-variable/geist-mono"],
      css: { '@import "@fontsource-variable/geist-mono"': {} },
      files: [
        await sourceFile(join(projectRoot, "src/components/examples/registry/supervisor-brand-button.tsx"), "registry:ui", "@ui/supervisor-brand-button.tsx"),
        await sourceFile(join(projectRoot, "src/components/examples/registry/supervisor-brand-button.css"), "registry:ui", "@ui/supervisor-brand-button.css"),
        await sourceFile(join(projectRoot, "LICENSE"), "registry:file", "~/licenses/supervisor-ui.txt"),
      ],
    },
    {
      name: "ai-elements-license",
      type: "registry:style" as const,
      title: "AI Elements license",
      description: "License notice for the Vercel AI Elements components.",
      files: [await sourceFile(join(projectRoot, "licenses/ai-elements.txt"), "registry:file", "~/licenses/ai-elements.txt")],
    },
    ...await Promise.all([...AI_ELEMENTS, ...aiElementSupport].map(buildAIElement)),
    {
      name: "ai-elements",
      type: "registry:component" as const,
      title: "Vercel AI Elements",
      description: "The complete Vercel AI Elements component catalog for shadcn.",
      registryDependencies: AI_ELEMENTS.map((element) => `${registryBaseUrl}/ai-elements-${element.slug}.json`),
    },
  ].sort((left, right) => left.name.localeCompare(right.name));
  for (const component of COMPONENTS) {
    if (!items.some((item) => item.name === component.slug)) throw new Error(`Missing registry item ${component.slug}`);
  }
  for (const item of items) registryItemSchema.parse(item);
  const registry = { $schema: "https://ui.shadcn.com/schema/registry.json", name: "supervisor", homepage: "https://ui.trysupervisor.com", items };
  await mkdir(outputRoot, { recursive: true });
  await writeFile(join(projectRoot, "registry.json"), `${JSON.stringify(registry, null, 2)}\n`);
  await writeFile(join(outputRoot, "index.json"), `${JSON.stringify(registry, null, 2)}\n`);
  await Promise.all(items.map(async (item) => {
    const destination = join(outputRoot, `${item.name}.json`);
    if (dirname(destination) !== outputRoot) throw new Error(`Unsafe registry item name: ${item.name}`);
    await writeFile(destination, `${JSON.stringify({ $schema: schema, ...item }, null, 2)}\n`);
  }));
  console.log(`Built ${items.length} registry items in ${relative(projectRoot, outputRoot)}`);
}

await main();
