"use client";

import { useState } from "react";
import { ArrowUpRightIcon } from "lucide-react";
import { CodeDisclosure } from "@/components/code-disclosure";
import { SupervisorBrandButton } from "./registry/supervisor-brand-button";

const code = `"use client"

import { useState } from "react"
import { SupervisorBrandButton } from "@/components/ui/supervisor-brand-button"

export default function Example() {
  const [saved, setSaved] = useState(false)

  return (
    <SupervisorBrandButton onClick={() => setSaved(true)}>
      {saved ? "Saved" : "Save changes"}
    </SupervisorBrandButton>
  )
}`;

export function SupervisorBrandButtonExample() {
  const [activated, setActivated] = useState(false);
  return (
    <section className="component-docs-section">
      <h2>Supervisor brand button</h2>
      <p>The orange action from trysupervisor.com, with its border and layered press shadows. This version uses Geist Mono in place of VCR OSD Mono and black labels for contrast.</p>
      <div className="component-frame">
        <div className="component-preview flex-col gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <SupervisorBrandButton onClick={() => setActivated((value) => !value)}>{activated ? "Ready to go" : "Get started"}<ArrowUpRightIcon aria-hidden="true" /></SupervisorBrandButton>
            <SupervisorBrandButton disabled>Unavailable</SupervisorBrandButton>
          </div>
          <p className="min-h-5 text-xs text-muted-foreground" role="status">{activated ? "Brand action selected." : "Try the hover, focus, and pressed states."}</p>
        </div>
        <CodeDisclosure title="Supervisor brand button" code={code} />
      </div>
      <p className="mt-4">Install the button and its styles in your existing shadcn project. The command also installs Geist Mono.</p>
      <pre className="install-command"><code>bunx shadcn@latest add https://ui.trysupervisor.com/r/supervisor-brand-button.json</code></pre>
    </section>
  );
}
