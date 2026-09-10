"use client";

import { CodeDisclosure } from "@/components/code-disclosure";

const code = "// Modified for Supervisor previews. License: Apache 2.0.\n\"use client\";\n\nimport {\n  OpenIn,\n  OpenInChatGPT,\n  OpenInClaude,\n  OpenInContent,\n  OpenInCursor,\n  OpenInScira,\n  OpenInT3,\n  OpenInTrigger,\n  OpenInv0,\n} from \"@/components/ai-elements/open-in-chat\";\n\nconst Example = () => {\n  const sampleQuery = \"How can I implement authentication in Next.js?\";\n\n  return (\n    <OpenIn query={sampleQuery}>\n      <OpenInTrigger />\n      <OpenInContent>\n        <OpenInChatGPT />\n        <OpenInClaude />\n        <OpenInCursor />\n        <OpenInT3 />\n        <OpenInScira />\n        <OpenInv0 />\n      </OpenInContent>\n    </OpenIn>\n  );\n};\n\nexport default Example;";

export default function AIElementSnippet({ title }: { title: string }) {
  return <CodeDisclosure title={title} code={code} />;
}
