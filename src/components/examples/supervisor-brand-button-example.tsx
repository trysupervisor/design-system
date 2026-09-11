"use client";

import { useState } from "react";
import { ArrowUpRightIcon } from "lucide-react";
import { CodeDisclosure } from "@/components/code-disclosure";
import { SupervisorBrandButton } from "./registry/supervisor-brand-button";

const code = `"use client"

import { useState } from "react"
import { ArrowUpRightIcon } from "lucide-react"
import { SupervisorBrandButton } from "@/components/ui/supervisor-brand-button"

export default function Example() {
  const [saved, setSaved] = useState(false)

  return (
    <SupervisorBrandButton disabled={saved} onClick={() => setSaved(true)}>
      <span data-supervisor-brand-label="">
        <span data-supervisor-brand-state="active" aria-hidden={saved}>Save changes</span>
        <span data-supervisor-brand-state="selected" aria-hidden={!saved}>Saved</span>
      </span>
      <ArrowUpRightIcon aria-hidden="true" data-supervisor-brand-arrow="" />
    </SupervisorBrandButton>
  )
}`;

export function SupervisorBrandButtonExample() {
  const [activated, setActivated] = useState(false);
  return (
    <section className="component-docs-section">
      <h2>Supervisor brand button</h2>
      <p>The orange action from trysupervisor.com, with white text and arrow, layered press shadows, and a muted gray disabled state. This version uses Geist Mono in place of VCR OSD Mono.</p>
      <div className="component-frame">
        <div className="component-preview flex-col gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <SupervisorBrandButton disabled={activated} onClick={() => setActivated(true)}>
              <span data-supervisor-brand-label="">
                <span data-supervisor-brand-state="active" aria-hidden={activated}>Get started</span>
                <span data-supervisor-brand-state="selected" aria-hidden={!activated}>Selected</span>
              </span>
              <ArrowUpRightIcon aria-hidden="true" data-supervisor-brand-arrow="" />
            </SupervisorBrandButton>
            <SupervisorBrandButton disabled>Unavailable<ArrowUpRightIcon aria-hidden="true" data-supervisor-brand-arrow="" /></SupervisorBrandButton>
          </div>
          <div className="flex min-h-5 items-center gap-2 text-xs text-muted-foreground"><p role="status">{activated ? "The selected action now uses the disabled state." : "Try the hover, focus, and pressed states."}</p>{activated ? <button type="button" className="underline underline-offset-4" onClick={() => setActivated(false)}>Reset</button> : null}</div>
        </div>
        <CodeDisclosure title="Supervisor brand button" code={code} />
      </div>
      <p className="mt-4">Install the button and its styles in your existing shadcn project. The command also installs Geist Mono.</p>
      <pre className="install-command"><code>bunx shadcn@latest add https://ui.trysupervisor.com/r/supervisor-brand-button.json</code></pre>
    </section>
  );
}
