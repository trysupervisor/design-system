"use client";

import { CodeDisclosure } from "@/components/code-disclosure";

const code = "// Modified for Supervisor previews. License: Apache 2.0.\n\"use client\";\n\nimport {\n  Context,\n  ContextCacheUsage,\n  ContextContent,\n  ContextContentBody,\n  ContextContentFooter,\n  ContextContentHeader,\n  ContextInputUsage,\n  ContextOutputUsage,\n  ContextReasoningUsage,\n  ContextTrigger,\n} from \"@/components/ai-elements/context\";\n\nconst Example = () => (\n  <div className=\"flex items-center justify-center p-8\">\n    <Context\n      maxTokens={128_000}\n      modelId=\"openai:gpt-5\"\n      usage={{\n        inputTokens: 32_000,\n        inputTokenDetails: { noCacheTokens: 32_000, cacheReadTokens: 0, cacheWriteTokens: 0 },\n        outputTokens: 8000,\n        outputTokenDetails: { textTokens: 8000, reasoningTokens: 0 },\n        totalTokens: 40_000,\n      }}\n      usedTokens={40_000}\n    >\n      <ContextTrigger />\n      <ContextContent>\n        <ContextContentHeader />\n        <ContextContentBody>\n          <ContextInputUsage />\n          <ContextOutputUsage />\n          <ContextReasoningUsage />\n          <ContextCacheUsage />\n        </ContextContentBody>\n        <ContextContentFooter />\n      </ContextContent>\n    </Context>\n  </div>\n);\n\nexport default Example;";

export default function AIElementSnippet({ title }: { title: string }) {
  return <CodeDisclosure title={title} code={code} />;
}
