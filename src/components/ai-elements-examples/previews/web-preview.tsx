// Modified for Supervisor previews. License: Apache 2.0.
"use client";

import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, Maximize2Icon, Minimize2Icon, RefreshCcwIcon } from "lucide-react";
import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview";

const localDocument = `<!doctype html><html><body style="margin:0;background:#fafafa;color:#171717;font-family:system-ui"><main style="padding:40px"><p style="font:12px ui-monospace;color:#666">LOCAL PREVIEW</p><h1 style="font-size:28px;letter-spacing:-.04em">Quarterly research notes</h1><p style="max-width:42ch;line-height:1.6;color:#525252">This iframe renders a fixed srcDoc string. It makes no network request.</p></main></body></html>`;

export default function WebPreviewExample() {
  const [revision, setRevision] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const logs = [{ level: "log" as const, message: `Local document loaded, revision ${revision}`, timestamp: new Date("2026-09-10T09:30:00Z") }];
  return (
    <WebPreview defaultUrl="about:srcdoc" className={expanded ? "h-[520px]" : "h-[400px]"}>
      <WebPreviewNavigation>
        <WebPreviewNavigationButton disabled tooltip="No earlier local page" aria-label="Go back"><ArrowLeftIcon className="size-4" /></WebPreviewNavigationButton>
        <WebPreviewNavigationButton disabled tooltip="No later local page" aria-label="Go forward"><ArrowRightIcon className="size-4" /></WebPreviewNavigationButton>
        <WebPreviewNavigationButton onClick={() => setRevision((value) => value + 1)} tooltip="Reload local document" aria-label="Reload local document"><RefreshCcwIcon className="size-4" /></WebPreviewNavigationButton>
        <WebPreviewUrl aria-label="Preview address" readOnly value="about:srcdoc" />
        <WebPreviewNavigationButton aria-pressed={expanded} onClick={() => setExpanded((value) => !value)} tooltip={expanded ? "Reduce preview" : "Expand preview"} aria-label={expanded ? "Reduce preview" : "Expand preview"}>{expanded ? <Minimize2Icon className="size-4" /> : <Maximize2Icon className="size-4" />}</WebPreviewNavigationButton>
      </WebPreviewNavigation>
      <WebPreviewBody key={revision} srcDoc={localDocument} />
      <WebPreviewConsole logs={logs} />
    </WebPreview>
  );
}
