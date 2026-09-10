"use client";

import { CodeDisclosure } from "@/components/code-disclosure";

const code = "// Modified for Supervisor previews. License: Apache 2.0.\n\"use client\";\n\nimport { Shimmer } from \"@/components/ai-elements/shimmer\";\n\nconst Example = () => (\n  <div className=\"flex flex-col items-center justify-center gap-4 p-8\">\n    <Shimmer>This text has a shimmer effect</Shimmer>\n    <Shimmer as=\"h1\" className=\"font-bold text-4xl\">\n      Large Heading\n    </Shimmer>\n    <Shimmer duration={3} spread={3}>\n      Slower shimmer with wider spread\n    </Shimmer>\n  </div>\n);\n\nexport default Example;";

export default function AIElementSnippet({ title }: { title: string }) {
  return <CodeDisclosure title={title} code={code} />;
}
