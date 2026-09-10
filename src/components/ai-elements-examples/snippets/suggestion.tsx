"use client";

import { CodeDisclosure } from "@/components/code-disclosure";

const code = "// Modified for Supervisor previews. License: Apache 2.0.\n\"use client\";\n\nimport { toast } from \"sonner\";\nimport { Suggestion, Suggestions } from \"@/components/ai-elements/suggestion\";\n\nconst suggestions = [\n  \"What are the latest trends in AI?\",\n  \"How does machine learning work?\",\n  \"Explain quantum computing\",\n  \"Best practices for React development\",\n  \"Tell me about TypeScript benefits\",\n  \"How to optimize database queries?\",\n  \"What is the difference between SQL and NoSQL?\",\n  \"Explain cloud computing basics\",\n];\n\nconst handleSuggestionClick = (suggestion: string) => {\n  toast(\"Suggestion selected\", { description: suggestion });\n};\n\nconst Example = () => (\n  <Suggestions>\n    {suggestions.map((suggestion) => (\n      <Suggestion\n        key={suggestion}\n        onClick={handleSuggestionClick}\n        suggestion={suggestion}\n      />\n    ))}\n  </Suggestions>\n);\n\nexport default Example;";

export default function AIElementSnippet({ title }: { title: string }) {
  return <CodeDisclosure title={title} code={code} />;
}
