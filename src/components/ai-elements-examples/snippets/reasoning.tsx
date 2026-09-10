"use client";

import { CodeDisclosure } from "@/components/code-disclosure";

const code = "\"use client\";\n\nimport { useEffect, useState } from \"react\";\nimport { Reasoning, ReasoningContent, ReasoningTrigger } from \"@/components/ai-elements/reasoning\";\n\nconst reasoningText = \"I will compare the request with the available project files. Then I will check each source claim and draft the smallest complete answer.\";\nconst tokens = reasoningText.match(/.{1,4}/g) ?? [];\n\nexport default function ReasoningPreview() {\n  const [content, setContent] = useState(\"\");\n  const [index, setIndex] = useState(0);\n  const isStreaming = index < tokens.length;\n  useEffect(() => {\n    if (!isStreaming) return;\n    const timer = window.setTimeout(() => {\n      setContent((current) => current + tokens[index]);\n      setIndex((current) => current + 1);\n    }, 35);\n    return () => window.clearTimeout(timer);\n  }, [index, isStreaming]);\n  return (\n    <div className=\"mx-auto min-h-52 w-full max-w-xl p-4\">\n      <Reasoning className=\"w-full\" isStreaming={isStreaming}>\n        <ReasoningTrigger />\n        <ReasoningContent>{content}</ReasoningContent>\n      </Reasoning>\n    </div>\n  );\n}";

export default function AIElementSnippet({ title }: { title: string }) {
  return <CodeDisclosure title={title} code={code} />;
}
