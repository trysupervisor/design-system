import type { AIElementSlug } from "@/lib/ai-elements-catalog";

export type AIElementExampleInstall = {
  elements: readonly string[];
  ui: readonly string[];
  packages: readonly string[];
};

export const AI_ELEMENT_EXAMPLE_INSTALL = {
  "agent": { elements: ["agent"], ui: [], packages: ["zod"] },
  "artifact": { elements: ["artifact","code-block"], ui: [], packages: ["sonner"] },
  "attachments": { elements: ["attachments"], ui: [], packages: ["nanoid"] },
  "audio-player": { elements: ["audio-player"], ui: [], packages: [] },
  "canvas": { elements: ["canvas","connection","controls","edge","node","panel","toolbar"], ui: ["button"], packages: ["@xyflow/react"] },
  "chain-of-thought": { elements: ["chain-of-thought","image"], ui: [], packages: [] },
  "checkpoint": { elements: ["checkpoint","conversation","message"], ui: [], packages: ["nanoid"] },
  "code-block": { elements: ["code-block"], ui: [], packages: ["shiki","sonner"] },
  "commit": { elements: ["commit"], ui: [], packages: ["sonner"] },
  "confirmation": { elements: ["confirmation"], ui: [], packages: [] },
  "connection": { elements: ["canvas","connection","controls","edge","node","panel","toolbar"], ui: ["button"], packages: ["@xyflow/react"] },
  "context": { elements: ["context"], ui: [], packages: [] },
  "controls": { elements: ["canvas","connection","controls","edge","node","panel","toolbar"], ui: ["button"], packages: ["@xyflow/react"] },
  "conversation": { elements: ["conversation","message"], ui: [], packages: ["nanoid"] },
  "edge": { elements: ["canvas","connection","controls","edge","node","panel","toolbar"], ui: ["button"], packages: ["@xyflow/react"] },
  "environment-variables": { elements: ["environment-variables"], ui: [], packages: ["sonner"] },
  "file-tree": { elements: ["file-tree"], ui: [], packages: [] },
  "image": { elements: ["image"], ui: [], packages: [] },
  "inline-citation": { elements: ["inline-citation"], ui: [], packages: [] },
  "jsx-preview": { elements: ["jsx-preview"], ui: ["button"], packages: [] },
  "message": { elements: ["attachments","message"], ui: [], packages: ["sonner"] },
  "mic-selector": { elements: ["mic-selector"], ui: [], packages: [] },
  "model-selector": { elements: ["model-selector"], ui: ["button"], packages: [] },
  "node": { elements: ["canvas","connection","controls","edge","node","panel","toolbar"], ui: ["button"], packages: ["@xyflow/react"] },
  "open-in-chat": { elements: ["open-in-chat"], ui: [], packages: [] },
  "package-info": { elements: ["package-info"], ui: [], packages: [] },
  "panel": { elements: ["canvas","connection","controls","edge","node","panel","toolbar"], ui: ["button"], packages: ["@xyflow/react"] },
  "persona": { elements: ["persona"], ui: ["button","button-group","tooltip"], packages: [] },
  "plan": { elements: ["plan"], ui: ["button"], packages: [] },
  "prompt-input": { elements: ["attachments","model-selector","prompt-input"], ui: [], packages: ["sonner"] },
  "queue": { elements: ["queue"], ui: [], packages: ["sonner"] },
  "reasoning": { elements: ["reasoning"], ui: [], packages: [] },
  "sandbox": { elements: ["code-block","sandbox","stack-trace"], ui: ["button"], packages: [] },
  "schema-display": { elements: ["schema-display"], ui: [], packages: [] },
  "shimmer": { elements: ["shimmer"], ui: [], packages: [] },
  "snippet": { elements: ["snippet"], ui: [], packages: [] },
  "sources": { elements: ["sources"], ui: [], packages: [] },
  "speech-input": { elements: ["speech-input"], ui: ["button"], packages: [] },
  "stack-trace": { elements: ["stack-trace"], ui: [], packages: ["sonner"] },
  "suggestion": { elements: ["suggestion"], ui: [], packages: ["sonner"] },
  "task": { elements: ["task"], ui: [], packages: ["nanoid"] },
  "terminal": { elements: ["terminal"], ui: [], packages: ["sonner"] },
  "test-results": { elements: ["test-results"], ui: [], packages: [] },
  "tool": { elements: ["confirmation","tool"], ui: [], packages: [] },
  "toolbar": { elements: ["canvas","connection","controls","edge","node","panel","toolbar"], ui: ["button"], packages: ["@xyflow/react"] },
  "transcription": { elements: ["transcription"], ui: [], packages: [] },
  "voice-selector": { elements: ["voice-selector"], ui: ["button"], packages: [] },
  "web-preview": { elements: ["web-preview"], ui: [], packages: [] },
} as const satisfies Record<AIElementSlug, AIElementExampleInstall>;

const packageVersions: Record<string, string> = {
  "@xyflow/react": "^12.10.0",
  nanoid: "^5.1.6",
  shiki: "3.22.0",
  sonner: "^2.0.8",
  zod: "^4.6.1",
};

export function getAIElementExampleCommands(slug: AIElementSlug) {
  const dependencies: AIElementExampleInstall = AI_ELEMENT_EXAMPLE_INSTALL[slug];
  const registryItems = dependencies.elements.map((element) => "https://ui.trysupervisor.com/r/ai-elements-" + element + ".json");
  const componentCommand = "bunx shadcn@latest add " + [...registryItems, ...dependencies.ui].join(" ");
  const packages = dependencies.packages.map((name) => `${name}@${packageVersions[name]}`);
  const packageCommand = packages.length > 0 ? "bun add " + packages.join(" ") : null;
  return { componentCommand, packageCommand };
}
