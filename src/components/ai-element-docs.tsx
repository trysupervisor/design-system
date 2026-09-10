"use client";

import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, ExternalLinkIcon } from "lucide-react";
import { AIElementCode } from "@/components/ai-elements-examples/code";
import { getAIElementExampleCommands } from "@/components/ai-elements-examples/example-install";
import { AIElementPreview } from "@/components/ai-elements-examples/preview";
import { Badge } from "@/components/ui/badge";
import { AI_ELEMENTS, getAIElement } from "@/lib/ai-elements-catalog";

export function AIElementDocs({ slug }: { slug: string }) {
  const item = getAIElement(slug);
  if (!item) return null;
  const index = AI_ELEMENTS.findIndex((entry) => entry.slug === slug);
  const previous = AI_ELEMENTS[index - 1];
  const next = AI_ELEMENTS[index + 1];
  const exampleCommands = getAIElementExampleCommands(item.slug);

  return (
    <article className="component-docs">
      <header className="page-intro component-docs-intro">
        <div className="component-docs-meta"><Badge variant="outline">{item.category}</Badge><span>Vercel AI Elements</span></div>
        <h1>{item.name}</h1>
        <p>{item.description}</p>
      </header>

      <section className="component-docs-section">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="m-0">Preview</h2>
          <Badge variant="secondary">{slug === "mic-selector" || slug === "speech-input" ? "Local preview" : "Sample data"}</Badge>
        </div>
        <div className="component-frame">
          <div className="component-preview min-h-[360px] w-full overflow-hidden"><div className="w-full"><AIElementPreview slug={slug} /></div></div>
          <AIElementCode slug={item.slug} title={item.name} />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">This example does not call a model or report live usage.</p>
        {slug === "mic-selector" ? <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Your browser asks for microphone access only after you open the selector. This preview does not upload audio.</p> : null}
        {slug === "speech-input" ? <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Recording begins only after you activate the control. The preview keeps the recording in this page, reports its size, and does not transcribe or upload it.</p> : null}
      </section>

      <section className="component-docs-section">
        <h2>Install</h2>
        <p>AI Elements targets React 19 and Tailwind CSS 4. Add this component to a shadcn project with the Supervisor registry.</p>
        <pre className="install-command"><code>{`bunx shadcn@latest add https://ui.trysupervisor.com/r/ai-elements-${slug}.json`}</code></pre>
        <h3 className="mt-8 text-sm font-medium">Install this example</h3>
        <p>The preview code can use related AI Elements, shadcn components, and direct packages. These commands install its complete set of imports.</p>
        <pre className="install-command"><code>{exampleCommands.componentCommand}</code></pre>
        {exampleCommands.packageCommand ? <pre className="install-command mt-2"><code>{exampleCommands.packageCommand}</code></pre> : null}
        <Link href={item.registryUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">View the official registry source <ExternalLinkIcon className="size-3" /></Link>
      </section>

      <nav className="component-pagination" aria-label="AI Element pages">
        {previous ? <Link href={`/ai-elements/${previous.slug}`}><ArrowLeftIcon /><span><small>Previous</small>{previous.name}</span></Link> : <span />}
        {next ? <Link href={`/ai-elements/${next.slug}`}><span><small>Next</small>{next.name}</span><ArrowRightIcon /></Link> : <span />}
      </nav>
    </article>
  );
}
