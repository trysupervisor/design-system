"use client";

import { useState } from "react";
import {
  MicSelector,
  MicSelectorContent,
  MicSelectorEmpty,
  MicSelectorInput,
  MicSelectorItem,
  MicSelectorLabel,
  MicSelectorList,
  MicSelectorTrigger,
  MicSelectorValue,
} from "@/components/ai-elements/mic-selector";

export default function MicSelectorPreview() {
  const [selected, setSelected] = useState<string>();
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-4">
      <MicSelector value={selected} onValueChange={setSelected}>
        <MicSelectorTrigger className="w-full"><MicSelectorValue /></MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorInput />
          <MicSelectorEmpty />
          <MicSelectorList>{(devices) => devices.map((device) => <MicSelectorItem key={device.deviceId} value={device.deviceId}><MicSelectorLabel device={device} /></MicSelectorItem>)}</MicSelectorList>
        </MicSelectorContent>
      </MicSelector>
      <p className="text-center text-xs leading-relaxed text-muted-foreground">Open the selector to grant microphone access and list available inputs. Audio stays on your device.</p>
    </div>
  );
}
