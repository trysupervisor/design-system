import { mkdtemp, readFile, readdir, stat, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import postcss from "postcss";
import { defaultTheme } from "../src/lib/theme-presets";
import { themeToRegistry } from "../src/lib/theme-registry";

type ConsumerCase = {
  name: string;
  sourceDirectory: boolean;
  language: "ts" | "js";
  base: "radix" | "base";
  preset: "nova";
  customAliases?: boolean;
  tailwindVersion?: 3 | 4;
};

type CaseResult = {
  name: string;
  directory: string;
  buttonPath: string;
  cssPath: string;
  buttonHash: string;
  configHash: string;
  buildPassed: boolean;
};

const expectedDefaultTheme = {
  light: {
    "--background": "0 0% 98.03922%",
    "--foreground": "0 0% 9.01961%",
    "--primary": "0 0% 9.01961%",
    "--chart-1": "212.34568 100% 47.64706%",
    "--radius": "0.375rem",
    "--spacing": "0.25rem",
    "--text-scale": "1",
    "--app-font": '"Geist Variable", ui-sans-serif, system-ui, sans-serif',
  },
  dark: {
    "--background": "0 0% 0%",
    "--foreground": "0 0% 92.94118%",
    "--primary": "0 0% 92.94118%",
    "--chart-1": "212.34568 100% 47.64706%",
  },
};

const expectedCustomTheme = {
  light: {
    "--background": "0 0% 98.03922%",
    "--primary": "153.40206 66.89655% 28.43137%",
    "--radius": "0.9rem",
    "--spacing": "0.3rem",
    "--text-scale": "1.1",
    "--app-font": '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
    "--heading-font": '"Source Serif 4 Variable", "Source Serif 4", Georgia, serif',
    "--button-font": '"Geist Mono Variable", ui-monospace, monospace',
    "--input-radius": "1.5rem",
    "--panel-border-width": "0px",
  },
  dark: {
    "--background": "0 0% 0%",
    "--primary": "150.98039 65.10638% 53.92157%",
    "--radius": "0.9rem",
    "--spacing": "0.3rem",
    "--text-scale": "1.1",
    "--app-font": '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
    "--heading-font": '"Source Serif 4 Variable", "Source Serif 4", Georgia, serif',
    "--button-font": '"Geist Mono Variable", ui-monospace, monospace',
    "--input-radius": "1.5rem",
    "--panel-border-width": "0px",
  },
};

const cases: ConsumerCase[] = [
  { name: "root-radix-nova-ts", sourceDirectory: false, language: "ts", base: "radix", preset: "nova" },
  { name: "src-base-nova-ts", sourceDirectory: true, language: "ts", base: "base", preset: "nova" },
  { name: "src-custom-new-york-ts", sourceDirectory: true, language: "ts", base: "radix", preset: "nova", customAliases: true },
  { name: "src-radix-nova-js", sourceDirectory: true, language: "js", base: "radix", preset: "nova" },
  { name: "src-tailwind3-radix-ts", sourceDirectory: true, language: "ts", base: "radix", preset: "nova", tailwindVersion: 3 },
];

const projectRoot = join(import.meta.dir, "..");
const shadcnCli = join(projectRoot, "node_modules/shadcn/dist/index.js");
const canonicalRegistryBase = "https://ui.trysupervisor.com/r";
const requestedCase = Bun.argv.find((argument) => argument.startsWith("--case="))?.split("=")[1];
const selectedCases = requestedCase ? cases.filter((entry) => entry.name === requestedCase) : cases;

if (!selectedCases.length) {
  throw new Error(`Unknown installation case: ${requestedCase}`);
}

const runRoot = await mkdtemp(join(tmpdir(), "supervisor-installation-"));
const logPath = join(runRoot, "run.log");
await writeFile(logPath, `Installation smoke matrix\nRoot: ${runRoot}\n\n`);

async function appendLog(value: string) {
  await Bun.write(logPath, `${await Bun.file(logPath).text()}${value}`);
}

async function run(command: string[], cwd: string, timeoutMs = 120_000, input?: string) {
  await appendLog(`Directory: ${cwd}\nCommand: ${command.join(" ")}\n`);
  const childProcess = Bun.spawn(command, { cwd, stdout: "pipe", stderr: "pipe", stdin: input ? "pipe" : "ignore", env: process.env });
  if (input && childProcess.stdin) {
    childProcess.stdin.write(input);
    childProcess.stdin.end();
  }
  const timer = setTimeout(() => childProcess.kill(), timeoutMs);
  const [exitCode, stdout, stderr] = await Promise.all([
    childProcess.exited,
    new Response(childProcess.stdout).text(),
    new Response(childProcess.stderr).text(),
  ]);
  clearTimeout(timer);
  const output = `${stdout}${stderr}`;
  await appendLog(`${output}\nExit code: ${exitCode}\n\n`);
  if (exitCode !== 0) {
    throw new Error(`Command failed in ${cwd}: ${command.join(" ")}`);
  }
  return output;
}

function digest(content: string) {
  return new Bun.CryptoHasher("sha256").update(content).digest("hex");
}

async function fileHash(path: string) {
  return digest(await readFile(path, "utf8"));
}

async function exists(path: string) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

function resolveAlias(projectDirectory: string, sourceDirectory: boolean, alias: string) {
  if (!alias.startsWith("@/")) throw new Error(`Unsupported alias: ${alias}`);
  return join(projectDirectory, sourceDirectory ? "src" : "", alias.slice(2));
}

async function configureCustomAliases(projectDirectory: string) {
  const configPath = join(projectDirectory, "components.json");
  const config = await Bun.file(configPath).json();
  config.style = "new-york";
  config.aliases = {
    components: "@/design",
    utils: "@/support/utils",
    ui: "@/design/ui",
    lib: "@/support",
    hooks: "@/support/hooks",
  };
  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`);
}

async function configureTailwindThree(projectDirectory: string, sourceDirectory: boolean) {
  await run(["bun", "remove", "@tailwindcss/postcss"], projectDirectory);
  await run(["bun", "add", "--dev", "tailwindcss@3.4.17", "postcss@8.5.6", "autoprefixer@10.4.21"], projectDirectory);
  const contentRoot = sourceDirectory ? "./src" : ".";
  await writeFile(join(projectDirectory, "tailwind.config.ts"), `import type { Config } from "tailwindcss"\n\nexport default {\n  darkMode: ["class"],\n  content: ["${contentRoot}/**/*.{js,ts,jsx,tsx,mdx}"],\n  theme: {\n    extend: {\n      colors: {\n        border: "hsl(var(--border))", input: "hsl(var(--input))", ring: "hsl(var(--ring))",\n        background: "hsl(var(--background))", foreground: "hsl(var(--foreground))",\n        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },\n        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },\n        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },\n        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },\n        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },\n        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },\n        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },\n        chart: { 1: "hsl(var(--chart-1))", 2: "hsl(var(--chart-2))", 3: "hsl(var(--chart-3))", 4: "hsl(var(--chart-4))", 5: "hsl(var(--chart-5))" },\n      },\n      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },\n    },\n  },\n  plugins: [],\n} satisfies Config\n`);
  await writeFile(join(projectDirectory, "postcss.config.mjs"), "export default { plugins: { tailwindcss: {}, autoprefixer: {} } }\n");
  const cssPath = join(projectDirectory, sourceDirectory ? "src/app/globals.css" : "app/globals.css");
  await writeFile(cssPath, "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n");
}

async function configureLegacyNewYork(projectDirectory: string, sourceDirectory: boolean) {
  const configPath = join(projectDirectory, "components.json");
  const config = await Bun.file(configPath).json();
  config.style = "new-york";
  config.tailwind.cssVariables = true;
  config.tailwind.config = "tailwind.config.ts";
  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`);
  const uiRoot = resolveAlias(projectDirectory, sourceDirectory, config.aliases.ui);
  const buttonPath = join(uiRoot, "button.tsx");
  if (await exists(buttonPath)) await unlink(buttonPath);
  const cssPath = join(projectDirectory, sourceDirectory ? "src/app/globals.css" : "app/globals.css");
  const css = (await readFile(cssPath, "utf8"))
    .replace('@import "tw-animate-css";\n', "")
    .replace('@import "shadcn/tailwind.css";\n', "");
  await writeFile(cssPath, css);
  await run(["bun", shadcnCli, "add", "button", "--yes"], projectDirectory);
}

async function customizeButton(buttonPath: string) {
  const source = await readFile(buttonPath, "utf8");
  const customized = source.includes('data-slot="button"')
    ? source.replace('data-slot="button"', 'data-consumer-customization="preserved"\n      data-slot="button"')
    : source.replace("<Comp\n", '<Comp\n      data-consumer-customization="preserved"\n');
  if (customized === source) throw new Error(`Button marker missing in ${buttonPath}`);
  await writeFile(buttonPath, customized);
}

async function walkFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && ["node_modules", ".next"].includes(entry.name)) return [];
    return entry.isDirectory() ? walkFiles(path) : [path];
  }));
  return files.flat();
}

async function configuredCssPath(projectDirectory: string, sourceDirectory: boolean) {
  const config = await Bun.file(join(projectDirectory, "components.json")).json();
  return join(projectDirectory, config.tailwind.css.replace(/^@\//, sourceDirectory ? "src/" : ""));
}

async function resolvedVariables(cssPath: string, selector: ":root" | ".dark") {
  const root = postcss.parse(await readFile(cssPath, "utf8"));
  const variables = new Map<string, string>();
  root.walkRules((rule) => {
    if (!rule.selectors?.map((value) => value.trim()).includes(selector)) return;
    rule.walkDecls(/^--/, (declaration) => {
      variables.set(declaration.prop, declaration.value);
    });
  });
  return { root, variables };
}

function assertVariables(actual: Map<string, string>, expected: Record<string, string>, selector: string) {
  for (const [property, value] of Object.entries(expected)) {
    const received = actual.get(property);
    const normalized = received?.match(/^hsl\((.*)\)$/)?.[1] ?? received;
    if (normalized !== value) {
      throw new Error(`Expected ${selector} ${property} to equal ${value}, received ${received ?? "missing"}`);
    }
  }
}

async function assertThemeIntegrity(cssPath: string) {
  const { root } = await resolvedVariables(cssPath, ":root");
  root.walkDecls(/^--/, (declaration) => {
    if (declaration.prop.startsWith("--supervisor-")) {
      throw new Error(`Installed theme contains disconnected private color ${declaration.prop}`);
    }
    if (declaration.value.trim() === `var(${declaration.prop})`) {
      throw new Error(`Installed theme contains self reference ${declaration.prop}: ${declaration.value}`);
    }
  });
}

async function assertDefaultTheme(cssPath: string) {
  const light = (await resolvedVariables(cssPath, ":root")).variables;
  const dark = (await resolvedVariables(cssPath, ".dark")).variables;
  assertVariables(light, expectedDefaultTheme.light, ":root");
  assertVariables(dark, expectedDefaultTheme.dark, ".dark");
  await assertThemeIntegrity(cssPath);
}

async function assertCustomTheme(cssPath: string) {
  const light = (await resolvedVariables(cssPath, ":root")).variables;
  const dark = (await resolvedVariables(cssPath, ".dark")).variables;
  assertVariables(light, expectedCustomTheme.light, ":root");
  assertVariables(dark, expectedCustomTheme.dark, ".dark");
  await assertThemeIntegrity(cssPath);
}

async function assertInstalledCssExists(projectDirectory: string) {
  const cssFiles = (await walkFiles(projectDirectory)).filter((path) => path.endsWith(".css"));
  if (!cssFiles.length) {
    throw new Error(`No installed CSS found in ${projectDirectory}`);
  }
}

function applicationSource(uiAlias: string, includeCompositions: boolean, tailwindVersion: 3 | 4) {
  const compositionImports = includeCompositions ? `import { Combobox } from "${uiAlias}/combobox"\nimport { DatePicker } from "${uiAlias}/date-picker"\n` : "";
  const compositionMarkup = includeCompositions ? `      <div className="flex flex-wrap gap-3">\n        <DatePicker />\n        <Combobox options={[{ value: "aperture", label: "Aperture Labs" }]} />\n      </div>\n` : "";
  const chartColor = tailwindVersion === 3 ? "hsl(var(--chart-1))" : "var(--chart-1)";
  return `"use client"

import { Bar, BarChart, XAxis } from "recharts"
import { Button } from "${uiAlias}/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "${uiAlias}/chart"
${compositionImports}

const data = [
  { month: "Jan", runs: 18 },
  { month: "Feb", runs: 27 },
  { month: "Mar", runs: 23 },
]
const config = { runs: { label: "Runs", color: "${chartColor}" } }

export default function Home() {
  return (
    <main className="mx-auto grid min-h-dvh max-w-2xl content-center gap-8 p-8">
      <Button data-testid="preserved-button">Run report</Button>
${compositionMarkup}      <ChartContainer config={config} className="min-h-[260px] w-full">
        <BarChart accessibilityLayer data={data}>
          <XAxis dataKey="month" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="runs" fill="var(--color-runs)" radius={4} />
        </BarChart>
      </ChartContainer>
    </main>
  )
}
`;
}

const server: ReturnType<typeof Bun.serve> = Bun.serve({
  port: 0,
  async fetch(request): Promise<Response> {
    const requestUrl = new URL(request.url);
    const { pathname } = requestUrl;
    if (!/^\/r\/[a-z0-9-]+\.json$/.test(pathname)) return new Response("Not found", { status: 404 });
    const localRegistryBase = `${requestUrl.origin}/r`;
    if (pathname === "/r/smoke-custom.json") {
      const customTheme = {
        ...defaultTheme,
        id: "smoke-custom",
        name: "Smoke custom",
        font: "inter" as const,
        headingFont: "source-serif-4" as const,
        buttonFont: "mono" as const,
        inputRadius: 1.5,
        panelBorderWidth: 0,
        radius: 0.9,
        spacing: 1.2,
        textScale: 1.1,
        light: { ...defaultTheme.light, primary: "#18794E", primaryForeground: "#FFFFFF" },
        dark: { ...defaultTheme.dark, primary: "#3DD68C", primaryForeground: "#052E1C" },
      };
      return Response.json(themeToRegistry(customTheme, localRegistryBase, "smoke-custom"));
    }
    const sourcePath = join(projectRoot, "public", pathname);
    if (!(await exists(sourcePath))) return new Response("Not found", { status: 404 });
    const content = (await readFile(sourcePath, "utf8")).replaceAll(canonicalRegistryBase, localRegistryBase);
    return new Response(content, { headers: { "content-type": "application/json" } });
  },
});

const localRegistryBase = `http://127.0.0.1:${server.port}/r`;
const registryBase = process.env.REGISTRY_BASE_URL?.replace(/\/$/, "") ?? localRegistryBase;
const customThemeUrl = `${localRegistryBase}/smoke-custom.json`;
const results: CaseResult[] = [];

try {
  for (const entry of selectedCases) {
    const directory = join(runRoot, entry.name);
    const createArguments = [
      "bunx", "--bun", "create-next-app@16.3.4", directory,
      entry.language === "ts" ? "--ts" : "--js",
      "--tailwind", "--eslint", "--app",
      entry.sourceDirectory ? "--src-dir" : "--no-src-dir",
      "--import-alias", "@/*", "--use-bun", "--yes", "--skip-install",
    ];
    await run(createArguments, runRoot);
    if (entry.tailwindVersion === 3) await configureTailwindThree(directory, entry.sourceDirectory);
    await run(["bun", shadcnCli, "init", "--template", "next", "--base", entry.base, "--preset", entry.preset, "--no-monorepo", "--yes"], directory);
    if (entry.tailwindVersion === 3) await configureLegacyNewYork(directory, entry.sourceDirectory);

    if (entry.customAliases) await configureCustomAliases(directory);
    const config = await Bun.file(join(directory, "components.json")).json();
    const uiAlias = config.aliases.ui as string;
    const cssPath = await configuredCssPath(directory, entry.sourceDirectory);
    const uiRoot = resolveAlias(directory, entry.sourceDirectory, uiAlias);
    const componentExtension = entry.language === "ts" ? "tsx" : "jsx";
    const buttonPath = `${uiRoot}/button.${componentExtension}`;
    if (!(await exists(buttonPath))) {
      await run(["bun", shadcnCli, "add", "button", "--yes"], directory);
    }
    if (entry.tailwindVersion !== 3) {
      await run(["bun", shadcnCli, "add", `${registryBase}/date-picker.json`, `${registryBase}/combobox.json`, "--yes"], directory);
    }
    const compositionPaths = ["date-picker", "combobox"].map((name) => `${uiRoot}/${name}.${componentExtension}`);
    if (entry.tailwindVersion !== 3 && !(await Promise.all(compositionPaths.map(exists))).every(Boolean)) {
      throw new Error(`Composition files were not installed in ${entry.name}`);
    }
    await customizeButton(buttonPath);
    const buttonHash = await fileHash(buttonPath);
    const configHash = await fileHash(join(directory, "components.json"));
    const compositionHashes = entry.tailwindVersion === 3 ? [] : await Promise.all(compositionPaths.map(fileHash));

    await run(["bun", shadcnCli, "add", `${registryBase}/supervisor.json`, "--yes"], directory);
    if (await fileHash(buttonPath) !== buttonHash) throw new Error(`Theme install changed the existing button in ${entry.name}`);
    if (await fileHash(join(directory, "components.json")) !== configHash) throw new Error(`Theme install changed components.json in ${entry.name}`);
    await assertInstalledCssExists(directory);
    await assertDefaultTheme(cssPath);

    await run(["bun", shadcnCli, "add", customThemeUrl, "--yes"], directory);
    if (await fileHash(buttonPath) !== buttonHash) throw new Error(`Custom theme changed the existing button in ${entry.name}`);
    if (await fileHash(join(directory, "components.json")) !== configHash) throw new Error(`Custom theme changed components.json in ${entry.name}`);
    await assertCustomTheme(cssPath);

    await run(["bun", shadcnCli, "add", `${registryBase}/chart.json`, "--yes"], directory);
    if (entry.tailwindVersion !== 3) {
      const compositionOutput = await run(["bun", shadcnCli, "add", `${registryBase}/date-picker.json`, `${registryBase}/combobox.json`, "--yes"], directory, 120_000, "n\n".repeat(12));
      for (const marker of ["Would you like to overwrite?", "Updating files", "Skipped"]) {
        if (!compositionOutput.includes(marker)) {
          throw new Error(`Composition reinstall did not complete the expected ${marker} step in ${entry.name}`);
        }
      }
      const reinstalledHashes = await Promise.all(compositionPaths.map(fileHash));
      if (reinstalledHashes.some((hash, index) => hash !== compositionHashes[index])) {
        throw new Error(`Composition reinstall changed existing source in ${entry.name}`);
      }
    }
    if (await fileHash(buttonPath) !== buttonHash) throw new Error(`Chart install changed the existing button in ${entry.name}`);
    await assertCustomTheme(cssPath);

    const pageRoot = join(directory, entry.sourceDirectory ? "src/app" : "app");
    const pagePath = join(pageRoot, `page.${entry.language === "ts" ? "tsx" : "js"}`);
    await writeFile(pagePath, applicationSource(uiAlias, entry.tailwindVersion !== 3, entry.tailwindVersion ?? 4));
    await run(["bun", "run", "build"], directory);

    results.push({ name: entry.name, directory, buttonPath, cssPath, buttonHash, configHash, buildPassed: true });
  }
} finally {
  server.stop(true);
}

await writeFile(join(runRoot, "report.json"), `${JSON.stringify({ registryBase, expectedDefaultTheme, expectedCustomTheme, results }, null, 2)}\n`);
console.log(`Installation matrix passed ${results.length} cases`);
console.log(`Artifacts: ${runRoot}`);
