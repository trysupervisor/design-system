"use client";

import { CodeDisclosure } from "@/components/code-disclosure";

const code = "\"use client\";\n\nimport { useState } from \"react\";\nimport {\n  MicSelector,\n  MicSelectorContent,\n  MicSelectorEmpty,\n  MicSelectorInput,\n  MicSelectorItem,\n  MicSelectorLabel,\n  MicSelectorList,\n  MicSelectorTrigger,\n  MicSelectorValue,\n} from \"@/components/ai-elements/mic-selector\";\n\nexport default function MicSelectorPreview() {\n  const [selected, setSelected] = useState<string>();\n  return (\n    <div className=\"mx-auto flex max-w-sm flex-col items-center gap-4\">\n      <MicSelector value={selected} onValueChange={setSelected}>\n        <MicSelectorTrigger className=\"w-full\"><MicSelectorValue /></MicSelectorTrigger>\n        <MicSelectorContent>\n          <MicSelectorInput />\n          <MicSelectorEmpty />\n          <MicSelectorList>{(devices) => devices.map((device) => <MicSelectorItem key={device.deviceId} value={device.deviceId}><MicSelectorLabel device={device} /></MicSelectorItem>)}</MicSelectorList>\n        </MicSelectorContent>\n      </MicSelector>\n      <p className=\"text-center text-xs leading-relaxed text-muted-foreground\">Open the selector to grant microphone access and list available inputs. Audio stays on your device.</p>\n    </div>\n  );\n}";

export default function AIElementSnippet({ title }: { title: string }) {
  return <CodeDisclosure title={title} code={code} />;
}
