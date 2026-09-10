# Supervisor design system

Reusable shadcn components, charts, and a Next.js preview at [ui.trysupervisor.com](https://ui.trysupervisor.com). The default theme follows Geist's visual conventions through original styles. It does not include Vercel's private component library or extracted stylesheets.

## Run locally

```sh
bun install --frozen-lockfile
bun run dev --port 3101
```

Open [localhost:3101](http://localhost:3101). Use Bun 1.4.2, which is also pinned in the project.

## Install in an existing app

Run this from a Next.js app that already has shadcn configured:

```sh
bunx shadcn@latest add https://ui.trysupervisor.com/r/supervisor.json
```

Use shadcn's default `tailwind.cssVariables: true` setting. Components created with literal color classes cannot be recolored by a CSS variable theme; those apps must first migrate their components to shadcn's variable based theming.

This is a native shadcn registry theme. The CLI merges the theme into the stylesheet selected by `components.json` and installs the free fonts. It does not replace your existing component files, require a provider, or rewrite your layout. Keep your existing dark mode switch.

Radix and Base UI both work. The installer follows the app's configured aliases and supports root or `src` layouts, TypeScript or JavaScript, and Tailwind 3 or 4. Semantic colors use the HSL representation that shadcn converts for the detected Tailwind version. Older components retain their APIs; controls that predate shadcn's `data-slot` attributes receive token changes but do not use the modern slot sizing rules.

Add components with the normal CLI, or use the Supervisor registry:

```sh
bunx shadcn@latest add button dialog chart
bunx shadcn@latest add https://ui.trysupervisor.com/r/chart.json
```

Component entries resolve the official implementation for your configured shadcn style. Adding one does not reset the selected theme. If a dependency already exists and you have edited it, keep it when the CLI asks about overwriting. Supervisor compositions install into the configured UI alias.

Component availability follows shadcn itself. New catalog additions such as Attachment and Questionnaire require a current shadcn style; they are not published for the legacy Tailwind 3 registry. Theme installation works independently of those components.

For a new app, run `bunx shadcn@latest init` first. There is no required primitive base or preset. See the [installation guide](https://ui.trysupervisor.com/installation).

To use a namespace, merge this into `components.json`:

```json
{
  "registries": {
    "@supervisor": "https://ui.trysupervisor.com/r/{name}.json"
  }
}
```

Then run `bunx shadcn@latest add @supervisor/supervisor`.

## Themes

Theme Studio includes brand inspired presets and controls for both color modes, fonts, corners, borders, spacing, type size, control height, and shadows. Changes apply across the preview and persist in the browser. Saved themes stay on that device. Choose Download for shadcn to export an installable registry file, including fonts and both color modes. Move the download into your app and run the command shown in Theme Studio, such as `bunx shadcn@latest add ./my-theme.registry.json`. Export JSON saves a Theme Studio document. Copy CSS provides a manual export for Tailwind 4.

The twelve bundled font families have open licenses and are served by this application. Theme files accept only approved font identifiers, hexadecimal colors, and bounded numeric values. They cannot contain CSS expressions, external assets, or executable code.

Natural language generation calls a model through Vercel AI Gateway. It returns the same validated theme format used by manual editing and imports. Generation errors appear in the interface, and manual editing remains available.

## Vercel AI Elements

The [AI Elements catalog](https://ui.trysupervisor.com/ai-elements) includes all 48 components in Vercel's current installable registry, with previews and usage examples for chat, code, voice, workflows, and utilities. The existing Theme Studio generator uses Vercel AI SDK for structured theme output.

Install the full collection or a single component:

```sh
bunx shadcn@latest add https://ui.trysupervisor.com/r/ai-elements.json
bunx shadcn@latest add https://ui.trysupervisor.com/r/ai-elements-message.json
```

AI Elements requires React 19, Tailwind 4, and shadcn configured with CSS variables. This requirement applies to the AI Elements collection; Supervisor themes still support Tailwind 3. Install the Supervisor theme first if you want the default styles. See the [official setup guide](https://elements.ai-sdk.dev/docs/setup) and [AI SDK documentation](https://ai-sdk.dev/docs/introduction) to connect your components to a model.

The registry installs Streamdown styles through native Tailwind directives, without assuming a stylesheet location. Its package versions are pinned to match those styles. Hover cards keep the native timing of the selected shadcn base; Radix root delay options do not change Base UI trigger timing.

The catalog previews use sample data. Voice input requires an explicit interaction before requesting microphone access. Model credentials belong on your server.

Component source is pinned to the upstream revision recorded in `src/lib/ai-elements-catalog.ts`. Local corrections support the installed SDK and both shadcn component bases. `bun scripts/import-ai-elements.ts --metadata-only` refreshes catalog metadata without replacing reviewed source. Source updates require reviewing the upstream changes and retaining local corrections before rebuilding the registry.

## Generation configuration

Copy `.env.example` to `.env.local` for local configuration. Generation is disabled locally until configured. Vercel deployments use the project OIDC identity. Local generation can use a scoped `AI_GATEWAY_API_KEY` in the ignored environment file.

Production uses `openai/gpt-5.4-mini`. The endpoint runs in `iad1` and requires both Vercel WAF rules before it calls the model:

| SDK rule | Limit |
| :--- | :--- |
| `theme-generation-ip` | 5 requests per minute per IP |
| `theme-generation-global` | 100 requests per hour with the shared key `design-system` |

The project Gateway budget is five US dollars monthly. Vercel treats it as a soft cap, so a request that crosses the cap can complete. No team top up setting is changed by this application. Set `THEME_GENERATION_ENABLED=false` to disable generation without affecting the rest of the site.

## Validate and build

```sh
bun run registry:build
bun run lint
bun run typecheck
bun run test
bun run test:installation
bun run build
```

Registry JSON is generated from validated theme presets, the original foundation styles, and reusable compositions. Standard component entries delegate to the official shadcn registry so consumer configuration controls their implementation. All 36 presets are available as `theme-{preset.id}.json`. GitHub Actions runs registry generation, lint, type checks, unit tests, and the production build. Run the installation matrix locally before a registry release; it creates temporary consumer apps and retains their logs for inspection. Vercel builds the Next.js application from the `main` branch in `trysupervisor/design-system`.

## Licenses

Original Supervisor source is MIT licensed. Vercel AI Elements source retains its Apache License 2.0 notice. Third party notices and font licenses are in `NOTICE.md` and `licenses`. Brand references describe theme inspiration and do not imply endorsement. Supervisor names and logos remain brand assets.
