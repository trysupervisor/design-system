"use client";

import { CodeDisclosure } from "@/components/code-disclosure";

const code = "// Modified for Supervisor previews. License: Apache 2.0.\n\"use client\";\n\nimport {\n  Source,\n  Sources,\n  SourcesContent,\n  SourcesTrigger,\n} from \"@/components/ai-elements/sources\";\n\nconst sources = [\n  { href: \"https://stripe.com/docs/api\", title: \"Stripe API Documentation\" },\n  { href: \"https://docs.github.com/en/rest\", title: \"GitHub REST API\" },\n  {\n    href: \"https://docs.aws.amazon.com/sdk-for-javascript/\",\n    title: \"AWS SDK for JavaScript\",\n  },\n];\n\nconst Example = () => (\n  <div style={{ height: \"110px\" }}>\n    <Sources>\n      <SourcesTrigger count={sources.length} />\n      <SourcesContent>\n        {sources.map((source) => (\n          <Source href={source.href} key={source.href} title={source.title} />\n        ))}\n      </SourcesContent>\n    </Sources>\n  </div>\n);\n\nexport default Example;";

export default function AIElementSnippet({ title }: { title: string }) {
  return <CodeDisclosure title={title} code={code} />;
}
