"use client";

import { CodeDisclosure } from "@/components/code-disclosure";

const code = "// Modified for Supervisor previews. License: Apache 2.0.\n\"use client\";\n\nimport {\n  Snippet,\n  SnippetAddon,\n  SnippetCopyButton,\n  SnippetInput,\n  SnippetText,\n} from \"@/components/ai-elements/snippet\";\n\nconst Example = () => (\n  <div className=\"flex size-full items-center justify-center p-4\">\n    <Snippet className=\"max-w-sm\" code=\"npx ai-elements add snippet\">\n      <SnippetAddon className=\"pl-1\">\n        <SnippetText>$</SnippetText>\n      </SnippetAddon>\n      <SnippetInput />\n      <SnippetAddon align=\"inline-end\" className=\"pr-2\">\n        <SnippetCopyButton />\n      </SnippetAddon>\n    </Snippet>\n  </div>\n);\n\nexport default Example;";

export default function AIElementSnippet({ title }: { title: string }) {
  return <CodeDisclosure title={title} code={code} />;
}
