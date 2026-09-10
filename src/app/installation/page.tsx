import type { Metadata } from "next";
import Link from "next/link";
import { CopyCommand } from "@/components/overview";
import { CodeDisclosure } from "@/components/code-disclosure";

export const metadata: Metadata = { title: "Installation" };

export default function InstallationPage() {
  return <>
    <p className="eyebrow mb-4">GET STARTED</p>
    <h1 className="page-title">Installation</h1>
    <p className="page-description">Add Supervisor to an existing Next.js app with shadcn. Keep your component APIs, aliases, and folder structure. Install themes and components with the standard shadcn CLI.</p>
    <div className="mt-10 space-y-10">
      <section>
        <h2 className="mb-3 text-lg font-semibold">1. Install the theme</h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">Run this from the app that contains your components.json. The CLI updates its configured stylesheet and installs the free fonts. Existing components stay in place. No provider or layout change is needed.</p>
        <CopyCommand command="bunx shadcn@latest add https://ui.trysupervisor.com/r/supervisor.json" />
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Use the default <code>tailwind.cssVariables: true</code> setting in components.json. Apps with literal color classes need to migrate those components to shadcn variable based theming first.</p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">The theme supports Radix and Base UI, TypeScript and JavaScript, root and src layouts, and custom aliases. It uses native shadcn color variables for Tailwind 3 and 4. Keep your existing dark mode switch.</p>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">2. Add components as you need them</h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">Continue using shadcn normally. Its CLI chooses the implementation for your configured style and primitive base. Keep an existing component when the CLI asks about overwriting it.</p>
        <CopyCommand command="bunx shadcn@latest add button dialog chart" />
        <p className="my-4 text-sm leading-relaxed text-muted-foreground">Supervisor registry URLs also work. Adding a component leaves your selected theme unchanged.</p>
        <CopyCommand command="bunx shadcn@latest add https://ui.trysupervisor.com/r/chart.json" />
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">3. Install a preset or your own theme</h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">Open <Link className="text-foreground underline underline-offset-4" href="/themes">Theme Studio</Link>, choose a preset or describe a theme, and select Download for shadcn. Move that file into your app, then run the command shown with it.</p>
        <CopyCommand command="bunx shadcn@latest add ./my-theme.registry.json" />
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">The download contains both color modes, fonts, radius, borders, spacing, control sizing, and shadows. It works through the same registry schema as the default theme. Export JSON saves a Theme Studio document; Download for shadcn creates the installable registry file.</p>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Optional registry shortcut</h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">Merge this entry into the registries object in components.json to use the Supervisor namespace.</p>
        <div className="panel overflow-hidden"><CodeDisclosure language="json" title="Registry configuration" code={'"registries": {\n  "@supervisor": "https://ui.trysupervisor.com/r/{name}.json"\n}'} /></div>
        <div className="mt-4"><CopyCommand command="bunx shadcn@latest add @supervisor/supervisor" /></div>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Vercel AI Elements</h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">Browse the complete <Link className="text-foreground underline underline-offset-4" href="/ai-elements">AI Elements catalog</Link> for chat, code, voice, and workflow interfaces. These components use Vercel AI SDK types and your shadcn theme.</p>
        <CopyCommand command="bunx shadcn@latest add https://ui.trysupervisor.com/r/ai-elements.json" />
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">AI Elements requires React 19, Tailwind 4, and CSS variable theming. Each catalog page also includes a command to install that component alone. Connect model calls on your server using the <a className="text-foreground underline underline-offset-4" href="https://ai-sdk.dev/docs/introduction">AI SDK</a>.</p>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Starting a new app</h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">If shadcn is not configured yet, initialize it first and choose either primitive base. Then install the Supervisor theme.</p>
        <CopyCommand command="bunx shadcn@latest init" />
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Keep the included license notices. Brand presets use independent styles and free font alternatives. Source is available in the <a className="text-foreground underline underline-offset-4" href="https://github.com/trysupervisor/design-system">public repository</a>.</p>
      </section>
    </div>
  </>;
}
