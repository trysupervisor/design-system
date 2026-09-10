# Supervisor design system

Reusable shadcn components, charts, and a Next.js preview at [ui.trysupervisor.com](https://ui.trysupervisor.com). The default theme follows Geist's visual conventions through original styles. It does not include Vercel's private component library or extracted stylesheets.

## Run locally

```sh
bun install --frozen-lockfile
bun run dev --port 3101
```

Open [localhost:3101](http://localhost:3101). Use Bun 1.4.2, which is also pinned in the project.

## Install components

Start with a Next.js project that has a src directory, the shadcn Radix base, and Tailwind 4, then install a component:

```sh
bunx shadcn@latest init --base radix --preset radix-nova
bunx shadcn@latest add https://ui.trysupervisor.com/r/button.json
```

Follow the [installation guide](https://ui.trysupervisor.com/installation) to import the foundation stylesheet and configure Geist fonts. The registry includes local component source and its dependencies. You can edit the installed code in your own project.

## Themes

Theme Studio includes brand inspired presets and controls for both color modes, fonts, corners, borders, spacing, type size, control height, and shadows. Changes apply across the preview and persist in the browser. Saved themes stay on that device. Export CSS for an existing shadcn project or JSON to import into Theme Studio.

The twelve bundled font families have open licenses and are served by this application. Theme files accept only approved font identifiers, hexadecimal colors, and bounded numeric values. They cannot contain CSS expressions, external assets, or executable code.

Natural language generation calls a model through Vercel AI Gateway. It returns the same validated theme format used by manual editing and imports. Generation errors appear in the interface, and manual editing remains available.

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
bun run build
```

Registry JSON is generated from the source in `src/components/ui` and the theme foundation. GitHub Actions runs these checks. Vercel builds the Next.js application from the `main` branch in `trysupervisor/design-system`.

## Licenses

Supervisor source is MIT licensed. Third party notices and font licenses are in `NOTICE.md` and `licenses`. Brand references describe theme inspiration and do not imply endorsement. Supervisor names and logos remain brand assets.
