import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const projectRoot = join(import.meta.dir, "..");
const componentRoot = join(projectRoot, "src/components/ai-elements");
const catalogPath = join(projectRoot, "src/lib/ai-elements-catalog.ts");
const licensePath = join(projectRoot, "licenses/ai-elements.txt");
const registryBaseUrl = "https://elements.ai-sdk.dev/api/registry";
const upstreamRevision = "6a9d5b1822ffb10bba4bd97175f01edd7d8651cd";
const upstreamRawUrl = `https://raw.githubusercontent.com/vercel/ai-elements/${upstreamRevision}`;
const metadataOnly = process.argv.includes("--metadata-only");

const categorySlugs = {
  chatbot: [
    "attachments",
    "chain-of-thought",
    "checkpoint",
    "confirmation",
    "context",
    "conversation",
    "inline-citation",
    "message",
    "model-selector",
    "plan",
    "prompt-input",
    "queue",
    "reasoning",
    "shimmer",
    "sources",
    "suggestion",
    "task",
    "tool",
  ],
  code: [
    "agent",
    "artifact",
    "code-block",
    "commit",
    "environment-variables",
    "file-tree",
    "jsx-preview",
    "package-info",
    "sandbox",
    "schema-display",
    "snippet",
    "stack-trace",
    "terminal",
    "test-results",
    "web-preview",
  ],
  utilities: ["image", "open-in-chat"],
  voice: [
    "audio-player",
    "mic-selector",
    "persona",
    "speech-input",
    "transcription",
    "voice-selector",
  ],
  workflow: ["canvas", "connection", "controls", "edge", "node", "panel", "toolbar"],
} as const;

const descriptions = {
  agent: "Shows an agent model, instructions, tools, and output schema.",
  artifact: "Frames generated code or documents with header actions.",
  attachments: "Renders file, image, video, audio, and source attachments.",
  "audio-player": "Plays audio through media-chrome controls.",
  canvas: "Hosts an interactive React Flow canvas.",
  "chain-of-thought": "Groups reasoning steps, search results, and images in a collapsible timeline.",
  checkpoint: "Marks a point that a conversation can restore.",
  "code-block": "Highlights code with optional line numbers and copy action.",
  commit: "Shows a commit hash, message, author, and file changes.",
  confirmation: "Collects approval or rejection for a tool call.",
  connection: "Draws an animated connection while linking React Flow nodes.",
  context: "Reports model context usage, token counts, and estimated cost.",
  controls: "Adds zoom and fit controls to a React Flow canvas.",
  conversation: "Keeps a message stream scrolled and offers a return button.",
  edge: "Draws persistent or temporary React Flow edges.",
  "environment-variables": "Masks, reveals, and copies environment variables.",
  "file-tree": "Displays an expandable file and folder tree.",
  image: "Displays images returned by the AI SDK.",
  "inline-citation": "Links response text to source details and quoted evidence.",
  "jsx-preview": "Renders a streamed JSX string as React content.",
  message: "Renders chat messages, branches, actions, and Markdown responses.",
  "mic-selector": "Selects an audio input and tracks permission or device changes.",
  "model-selector": "Searches and selects an AI model.",
  node: "Builds a card shaped node for React Flow.",
  "open-in-chat": "Opens a query in ChatGPT, Claude, T3, Scira, or v0.",
  "package-info": "Shows a package version and dependency changes.",
  panel: "Positions custom controls over a React Flow canvas.",
  persona: "Animates a Rive persona for listening, thinking, and speaking states.",
  plan: "Shows a streamed execution plan in a collapsible panel.",
  "prompt-input": "Collects a prompt, attachments, and model selection for submission.",
  queue: "Displays queued messages, tasks, and todo items.",
  reasoning: "Shows streamed reasoning in an automatically managed disclosure.",
  sandbox: "Pairs generated code with its execution output.",
  "schema-display": "Documents REST parameters and request or response bodies.",
  shimmer: "Animates text during loading or progressive reveal.",
  snippet: "Displays a terminal command or short code reference inline.",
  sources: "Lists the citations used to produce a response.",
  "speech-input": "Captures speech and returns transcribed text.",
  "stack-trace": "Formats JavaScript and Node.js stack frames with syntax highlighting.",
  suggestion: "Presents a horizontal list of selectable prompt suggestions.",
  task: "Shows workflow tasks with status and optional detail.",
  terminal: "Renders streamed console output with ANSI colors.",
  "test-results": "Reports test suites, outcomes, and failure details.",
  tool: "Shows tool input, execution state, and output.",
  toolbar: "Positions actions around a React Flow node.",
  transcription: "Synchronizes transcript segments with audio seeking.",
  "voice-selector": "Searches and selects an AI voice in a dialog.",
  "web-preview": "Previews generated web output beside its source code.",
} as const;

type Category = keyof typeof categorySlugs;

type RegistryIndex = {
  items: Array<{
    description: string;
    name: string;
    title: string;
    type: string;
  }>;
};

type RegistryItem = {
  dependencies?: string[];
  name: string;
  registryDependencies?: string[];
};

async function fetchText(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed with ${response.status}: ${url}`);
  return response.text();
}

async function fetchJson<T>(url: string) {
  return JSON.parse(await fetchText(url)) as T;
}

function categoryFor(slug: string): Category {
  for (const [category, slugs] of Object.entries(categorySlugs)) {
    if ((slugs as readonly string[]).includes(slug)) return category as Category;
  }
  throw new Error(`Missing official category for ${slug}`);
}

function descriptionFor(slug: string) {
  const description = descriptions[slug as keyof typeof descriptions];
  if (!description) throw new Error(`Missing description for ${slug}`);
  return description;
}

function frontmatterValue(source: string, key: string) {
  const match = source.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim().replace(/^(["'])(.*)\1$/, "$2");
}

function cleanDescription(description: string) {
  return description
    .replaceAll("media-chrome", "MEDIA_CHROME_PACKAGE")
    .replace(/[-‐‑‒–—―−]/g, " ")
    .replaceAll("MEDIA_CHROME_PACKAGE", "media-chrome");
}

function localizeSource(source: string) {
  const localized = source
    .replaceAll("@repo/shadcn-ui/components/ui/", "@/components/ui/")
    .replaceAll('from "@repo/shadcn-ui/lib/utils"', 'from "cn"')
    .replace(/^\s*\/\/ oxlint-disable-next-line[^\n]*\n/gm, "");
  return `// Modified for Supervisor compatibility. License: Apache 2.0.\n${localized}`;
}

function catalogSource(
  elements: Array<{
    category: Category;
    dependencies: string[];
    description: string;
    name: string;
    registryDependencies: string[];
    registryUrl: string;
    slug: string;
  }>
) {
  const entries = elements
    .map(
      (element) =>
        `  ${JSON.stringify(
          {
            category: element.category,
            dependencies: element.dependencies,
            description: element.description,
            name: element.name,
            registryDependencies: element.registryDependencies,
            registryUrl: element.registryUrl,
            slug: element.slug,
          },
          null,
          2
        ).replaceAll("\n", "\n  ")}`
    )
    .join(",\n");
  return `export const AI_ELEMENTS_UPSTREAM_REVISION = ${JSON.stringify(upstreamRevision)};
export const AI_ELEMENTS_SOURCE_URL = ${JSON.stringify(`https://github.com/vercel/ai-elements/tree/${upstreamRevision}/packages/elements/src`)};

export const AI_ELEMENT_CATEGORIES = ${JSON.stringify(Object.keys(categorySlugs))} as const;

export type AIElementCategory = (typeof AI_ELEMENT_CATEGORIES)[number];

export type AIElementMetadata = {
  slug: string;
  name: string;
  description: string;
  category: AIElementCategory;
  registryUrl: string;
  dependencies: readonly string[];
  registryDependencies: readonly string[];
};

export const AI_ELEMENTS = [
${entries}
] as const satisfies readonly AIElementMetadata[];

export type AIElementSlug = (typeof AI_ELEMENTS)[number]["slug"];

export function getAIElement(slug: string) {
  return AI_ELEMENTS.find((element) => element.slug === slug);
}
`;
}

async function main() {
  if (!metadataOnly) {
    const existingFiles = await readdir(componentRoot).catch(() => []);
    if (existingFiles.some((file) => file.endsWith(".tsx"))) {
      throw new Error(
        "Refusing to overwrite reviewed AI Element source. Use --metadata-only, then review upstream source changes manually."
      );
    }
  }
  const index = await fetchJson<RegistryIndex>(`${registryBaseUrl}/registry.json`);
  const componentItems = index.items.filter((item) => item.type === "registry:component");
  const officialSlugs = new Set(Object.values(categorySlugs).flat());
  if (componentItems.length !== officialSlugs.size) {
    throw new Error(`Catalog count changed from ${officialSlugs.size} to ${componentItems.length}`);
  }
  for (const item of componentItems) {
    if (!officialSlugs.has(item.name as never)) throw new Error(`Uncategorized official component ${item.name}`);
  }

  const imported = await Promise.all(
    componentItems.map(async (indexItem) => {
      const category = categoryFor(indexItem.name);
      const registryUrl = `${registryBaseUrl}/${indexItem.name}.json`;
      const docsUrl = `${upstreamRawUrl}/apps/docs/content/components/(${category})/${indexItem.name}.mdx`;
      const [item, docs, source] = await Promise.all([
        fetchJson<RegistryItem>(registryUrl),
        fetchText(docsUrl),
        metadataOnly
          ? Promise.resolve("")
          : fetchText(`${upstreamRawUrl}/packages/elements/src/${indexItem.name}.tsx`),
      ]);
      return {
        category,
        dependencies: [...(item.dependencies ?? [])].sort(),
        description: cleanDescription(descriptionFor(indexItem.name)),
        name: frontmatterValue(docs, "title") ?? indexItem.title,
        registryDependencies: [...(item.registryDependencies ?? [])].sort(),
        registryUrl,
        slug: indexItem.name,
        source: localizeSource(source),
      };
    })
  );

  if (!metadataOnly) {
    await mkdir(componentRoot, { recursive: true });
    await Promise.all(
      imported.map((element) =>
        writeFile(join(componentRoot, `${element.slug}.tsx`), element.source)
      )
    );
  }
  await writeFile(catalogPath, catalogSource(imported));
  const [notice, license] = await Promise.all([
    fetchText(`${upstreamRawUrl}/LICENSE`),
    fetchText("https://www.apache.org/licenses/LICENSE-2.0.txt"),
  ]);
  if (!license.includes("END OF TERMS AND CONDITIONS")) throw new Error("Incomplete Apache license text");
  await writeFile(licensePath, `${notice.trimEnd()}\n\n${license.trimEnd()}\n`);
  console.log(`${metadataOnly ? "Updated metadata for" : "Imported"} ${imported.length} official AI Elements`);
}

await main();
