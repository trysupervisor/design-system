"use client";

import { CodeDisclosure } from "@/components/code-disclosure";

const code = "// Modified for Supervisor previews. License: Apache 2.0.\n\"use client\";\n\nimport {\n  PackageInfo,\n  PackageInfoChangeType,\n  PackageInfoContent,\n  PackageInfoDependencies,\n  PackageInfoDependency,\n  PackageInfoDescription,\n  PackageInfoHeader,\n  PackageInfoName,\n  PackageInfoVersion,\n} from \"@/components/ai-elements/package-info\";\n\nconst Example = () => (\n  <div className=\"flex flex-col gap-4\">\n    <PackageInfo\n      changeType=\"major\"\n      currentVersion=\"18.2.0\"\n      name=\"react\"\n      newVersion=\"19.0.0\"\n    >\n      <PackageInfoHeader>\n        <PackageInfoName />\n        <PackageInfoChangeType />\n      </PackageInfoHeader>\n      <PackageInfoVersion />\n      <PackageInfoDescription>\n        A JavaScript library for building user interfaces.\n      </PackageInfoDescription>\n      <PackageInfoContent>\n        <PackageInfoDependencies>\n          <PackageInfoDependency name=\"react-dom\" version=\"^19.0.0\" />\n          <PackageInfoDependency name=\"scheduler\" version=\"^0.24.0\" />\n        </PackageInfoDependencies>\n      </PackageInfoContent>\n    </PackageInfo>\n\n    <PackageInfo changeType=\"added\" name=\"lodash\">\n      <PackageInfoHeader>\n        <PackageInfoName />\n        <PackageInfoChangeType />\n      </PackageInfoHeader>\n      <PackageInfoVersion />\n    </PackageInfo>\n\n    <PackageInfo changeType=\"removed\" currentVersion=\"2.29.4\" name=\"moment\" />\n  </div>\n);\n\nexport default Example;";

export default function AIElementSnippet({ title }: { title: string }) {
  return <CodeDisclosure title={title} code={code} />;
}
