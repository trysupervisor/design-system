# Design system implementation

Build a reusable shadcn component registry and a Next.js documentation site. Default styling recreates Geist visual conventions with original definitions and properly licensed fonts and components. Deploy the public preview to ui.trysupervisor.com under the trysupervisor Vercel team. Repository visibility defaults to private until the user chooses otherwise.

## Task 1: Theme system

Own the theme schema, at least 30 presets, original color generation, validated import and export, persistent provider, and the Theme Studio page. Include light and dark modes, typography, density, border width, corner radius, and shadows. Use only approved Google Fonts families. Prompt generation returns validated theme data, never executable CSS or code.

## Task 2: Component catalog

Own shadcn component inventory, individual interactive examples, code disclosure, chart examples, and reusable registry generation. Include every current official shadcn component, including items that Geist lacks. Preserve animated code expansion and omit an inner code frame.

## Task 3: Infrastructure discovery

Read current GitHub, Vercel team, domain, and model service state. Prepare precise deployment and provider instructions. Do not change unrelated services.

## Task 4: Integration and delivery

Root owns the new repository, dependencies, application layout, overview, original styles, model endpoint, licenses, CI, installation docs, and deployment. Review each implementation track, run a final independent review, verify all presets and representative interactions, push logical commits, deploy, and check the public domain.

## Interfaces

Theme provider applies semantic shadcn CSS variables to the document. Root styles consume font, spacing, radius, and border variables. Catalog uses shared UI components and no app specific theme API. Root controls package changes. The model endpoint consumes and returns the shared theme schema. No agent edits another track's files without coordination.
